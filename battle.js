var player_attack = $('.player__action--attack');
var player_rest = $('.player__action--rest');
var p_name = $('#player_name');
var p_health = $('#player_health_bar');
var p_stamina = $('#player_stamina_bar');
var p_mstamina = $('#player_max_stamina');
var e_health = $('#enemy_health_bar');
var e_stamina = $('#enemy_stamina_bar');
var e_mstamina = $('#enemy_max_stamina');
var e_name = $('#enemy_name');

var player = {
	name: 'player',
	title: default_title,
	health: init_health,
	stamina: init_stamina,
	strength: init_strength,
	agility: init_agility,
	stance: 0,
	instance: false,
	aspd: 10,
	attack: 10,
	action: function(type){
		if(!type){
			player_attack.attr('disabled', true);
			player_rest.attr('disabled', true);
		}else{
			player_rest.attr('disabled', false);
			if(type!="rest-only"){
				player_attack.attr('disabled', false);
			}
		}
	},
	reset: function(e){
		this.stance = 0;
		this.health = init_health;
		this.stamina = init_stamina;
	}
};

var enemy = {
	name: 'enemy',
	health: 0,
	stamina: 0,
	stance: 0,
	instance: false,
	aspd: 0,
	attack: 0,
	Attack: function(){
		// console.log('enemy attack!')
		player.health -= this.attack;
		enemy.stamina -= 10;
		battle.check('e');
		// restart('e');
	},
	rest: function(){
		enemy.stamina += 10;
		battle.check('e');
	},
	reset: function(enemy){
		this.stance = 0;
		this.health = enemy.health;
		this.stamina = enemy.stamina;
		this.name = enemy.name;
		this.aspd = enemy.aspd;
		this.attack = enemy.attack;
	}
}

var battle = {
	handUsed: [],
	start: function(target){
		console.log('battle start vs: '+target.name)
		player.reset();
		enemy.reset(target);

		// fill stance bar
		this.fillStance('p');
		if(target.id!='1'){
			this.fillStance('e');
		}

		// render maximum health and stamina
		p_mstamina.html(player.stamina);
		e_mstamina.html(enemy.stamina);

		// render health and stamina
		this.render();

		// disable player's action
		player.action(false);
	},
	check: function(target){
		// console.log('battle check')
		// console.log('player health: '+player.health)
		// console.log('enemy health: '+enemy.health)
		if(enemy.health==0 && player.health>0){
			console.log('WIN')
			console.log(battle.handUsed)
			$('.player button').attr('disabled', true);
			battle.render();
			Alert('YOU WIN! <button onclick="battle.end()">ok</button>', 0);
			function battleEnd(){
				battle.end();
			}
		}
		else if(enemy.health>0 && player.health==0){
			Alert('YOU KNOCKED OUT BY '+enemy.name+'!', 2000);
			setTimeout(function(e){
				battle.end();
			}, 2000);
		}
		else{
			restart(target);
		}
	},
	fillStance: function(target){

		if(target=='p'){
			// get initial stance
			var p_stance = player.stance;
			// fill player stance based on aspd
			var p_filling = setInterval(function(e){
				if(p_stance<100){
					p_stance+=player.aspd;

				}else{
					clearInterval(p_filling);
					ready('p');
				}

				// render stance to html
				battle.renderStance('p', p_stance);
			}, 1000/60);
		}else{
			var e_stance = enemy.stance;
			// fill enemy stance based on aspd
			var e_filling = setInterval(function(e){
				if(e_stance<100){
					e_stance+=enemy.aspd;

				}else{
					clearInterval(e_filling);
					ready('e');
				}

				// render stance to html
				battle.renderStance('e', e_stance);
			}, 1000/60);
		}

		function ready(target){
			if(target=='p'){
				// console.log("Player stamina: "+player.stamina)
				player.instance = true;
				player.stance = 100;
				if(player.stamina>0){
					// console.log('ready to attack')
					player.action(true);
				}else{
					console.log('too tired')
					player.action('rest-only');
				}
			}else{
				console.log("Enemy stamina: "+enemy.stamina)
				enemy.instance = true;
				enemy.stance = 100;
				if(enemy.stamina>0){
					// console.log('enemy ready to attack')
					enemy.Attack();
				}else{
					console.log('enemy too tired')
					enemy.rest();
				}
			}
		}
	},
	renderStance: function(target, num){
		var p_stance_bar = $("#player_stance_bar");
		var e_stance_bar = $("#enemy_stance_bar");

		if(target=='p'){
			p_stance_bar.html(num);
		}else{
			e_stance_bar.html(num);
		}
	},
	render: function(){
		p_health.html(player.health);
		p_stamina.html(player.stamina);
		p_name.html(player.name);

		e_health.html(enemy.health);
		e_stamina.html(enemy.stamina);
		e_name.html(enemy.name);
	},
	end: function(){
		console.log('battle end')
		$('.alert').hide('fast');
		show('main-town__training-yard');

    $('.home-menu').removeClass('disabled');
    $('#skip_tutorial').hide();
    $('#fight_drunken_brawler').attr('disabled', false);

    var data = localStorage.getItem(STORAGE_KEY);
    var parsed = JSON.parse(data);
    parsed.tutorial = false;
    save(parsed);
	}
};

$(document).ready(function(e){
	// start battle scene
	// battle.start();

	actionController();
});

function actionController(){
	$('#attack_left').click(function(e){
		attack('l');
	});
	$('#attack_right').click(function(e){
		attack('r');
	});
	$('#player_rest').click(function(e){
		rest();
	});

	function attack(type){

		// console.log("Attack!!! "+type)
		// decrease stamina by 10
		player.stamina -= 10;

		enemy.health -= player.attack;

		battle.handUsed.push(type);
		console.log(battle.handUsed)
		battle.check('p');
	}

	function rest(){
		console.log('resting')
		player.stamina += 10;
		restart('p');
	}

}

function restart(target){
	if(target=='p'){
		// drain player stance
		player.stance = 0;
		player.instance = false;

		// fill stance bar
		battle.fillStance('p');

		// render health and stamina
		battle.render();

		// disable player's action
		player.action(false);
	}else{
		// drain enemy stance
		enemy.stance = 0;
		enemy.instance = false;

		// fill stance bar
		battle.fillStance('e');

		// render health and stamina
		battle.render();
	}
}

$(window).on('load', function(){
	// dev only
	$('#delete_data').on('click', function(){
		deleteData();
	});
	$('.main-menu').show();
	// ==========================

	checkAuth();
	checkTutorial();
	mainMenuController();
	charMakingScene();
	townMenuController();
	trainingMenuController();
	barMenuController();
});

function checkAuth(){
	if(localStorage.getItem(STORAGE_KEY)){
		localStorage.setItem(AUTH_KEY, true)

		var savedPlayer = JSON.parse(localStorage.getItem(STORAGE_KEY));
		console.log(savedPlayer)

		player.name = savedPlayer.name;

		profileRender();
		show('main-town');

	}else{

	}
}

function mainMenuController(){
	$('#play_game').click(function(e){
		console.log('start')
		var savedData = localStorage.getItem(STORAGE_KEY);
		if(savedData){
			show('main-town');
		}else{
			show('character-build');
		}
	});
	$('#show_credits').click(function(e){
		show('credits');
	});
	$('.back-to-main').click(function(e){
		show('main-menu');
	});
}

function charMakingScene(){
	$('#create_char').click(function(e){
		var name = $("#char_name").val();
		if(name && name !== " "){
			console.log("inputed name: "+name);

			var playerToSave = {
				name: name,
				title: default_title,
				health: init_health,
				stamina: init_stamina,
				strength: init_strength,
				agility: init_agility,
				tutorial: true
			}

			// save user to local
			save(playerToSave);

			// set auth
			localStorage.setItem(AUTH_KEY, true);

			checkAuth();
			checkTutorial();

			show('main-town');
		}else{
			Alert("Name required.", 3000);
		}
	});
}

function townMenuController(){
	$('#trig__training-yard').click(function(e){
		show('main-town__training-yard');
	});
	$('#trig__brawler-hall').click(function(e){
		show('main-town__brawler-hall');
	});
	$('#trig__bar').click(function(e){
		show('main-town__bar');
	});
	$('#trig__shop').click(function(e){
		show('main-town__shop');
	});
	$('.back-to-town').click(function(e){
		show('main-town');
	});

	$('#skip_tutorial').click(function(e){
		var c = confirm('Are you sure?');
		if(c){
			$('.home-menu').removeClass('disabled');
			$(this).hide();
		}
	});
	$('#delete_char').click(function(e){
		var c = confirm("Are you sure to delete this character?");
		if(c){
			localStorage.removeItem(STORAGE_KEY);
			localStorage.removeItem(AUTH_KEY);

			player.name = 'player';
			profileRender();

			$('#skip_tutorial').hide();
			show('main-menu');
		}
	});
}

function trainingMenuController(){
	$('#fight_barrel').click(function(e){
		battle.start(enemy_database[0]);
		show('battle-scene');
	});
	$('#fight_drunken_brawler').click(function(e){
		battle.start(enemy_database[1]);
		show('battle-scene');
	});
}

function barMenuController(){
	$('#fight_random').click(function(e){
		battle.start(enemy_database[1]);
		show('battle-scene');
	});
}

function profileRender(){
	$('#p_name').html(player.name);
	$('#p_title').html(player.title);
	$('#p_health').html(player.health);
	$('#p_stamina').html(player.stamina);
	$('#p_strength').html(player.strength);
	$('#p_agility').html(player.agility);
}

function save(data){
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	console.log("saved");
}

function deleteData(data){
	localStorage.removeItem(STORAGE_KEY);
}

function Alert(msg, t){
	$('.alert').html(msg);
	$('.alert').show('fast');
	if(t!=0){
		setTimeout(function(e){
			$('.alert').hide();
		}, t);
	}
}

function show(sectionClass){
	$('.section').hide();
	$('.'+sectionClass).show();
}

function showAll(){
	$('.section').show();
}
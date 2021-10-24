function checkTutorial(){
	if(localStorage.getItem(STORAGE_KEY)){
		var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
		console.log(data.tutorial)

		if(data.tutorial){
			$('.home-menu').addClass('disabled');
			$('#trig__training-yard').removeClass('disabled');
			$('#skip_tutorial').show();
      $('#fight_drunken_brawler').attr('disabled', true);
		}
	}
}
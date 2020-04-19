function checkTutorial(){
	if(localStorage.getItem("bbData")){
		var data = JSON.parse(localStorage.getItem("bbData"));
		console.log(data.tutorial)
		if(data.tutorial){
			$('.home-menu').addClass('disabled');
			$('#trig__training-yard').removeClass('disabled');
			$('#skip_tutorial').show();
		}

	}else{

	}
}
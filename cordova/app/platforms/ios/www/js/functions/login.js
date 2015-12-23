// Register New User
function register(){

	var firstname = document.getElementById('firstname').value;
	var lastname = document.getElementById('lastname').value;
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	var password2 = document.getElementById('password2').value;

	if(password === password2) {

		var registerData = {

			"firstname" : firstname,
			"lastname"  : lastname,
			"username"  : username,
			"password"  : password,

		};


		$.ajax({
			type: "POST",
			url: "http://localhost:8888/postboard/NewUserRegistration.php",
			data: registerData,
			success: function ( data, textStatus, jqXHR ) {
					
					console.log(jqXHR.responseText);
					login(username,password,true);


			}, error: function ( xhr, ajaxOptions, thrownError ) {
					console.log(thrownError);


			}
		});
	} else {

		console.log("passwords do no match");


	}


}//end of register


//Check to see if username and password are available locally & Login if they are
function checkLogin() {


	if(localStorage.getItem("username") === null || localStorage.getItem("password") === null) {

		$.mobile.changePage( "#login-page", { transition: "slide" });

	} else {

		login(localStorage.getItem("username"),localStorage.getItem("password"), false);

	}

}

//Get Username and Password from Login Screen
function newLogin(){

	//get login info from text boxes
	var username = document.getElementById("login-username-input").value;
	var password = document.getElementById("login-password-input").value

	//send textbox info to login function
	login(username, password, true);


}


//Login User
function login (username, password, firstLogin) {

	//create record of login information and store it locally
	localStorage.setItem("username", username);
	localStorage.setItem("password", password);

	//check username and password against database using ajax
	var loginData = {

	"username" : username,
	"password" : password,

	};

 $.ajax({
        type: "POST",
        url: "http://localhost:8888/postboard/login.php",
        data: loginData, 
        dataType: 'text',
        success: function (data, textStatus, jqXHR) {

				loginResponse = jqXHR.responseText;

				
				if(loginResponse == 1) {
					
					$.mobile.changePage( "#app", { transition: "slideup"});
					$( "#panel" ).panel( "open" );
					$( "#panel" ).panel( "close" );
					navigator.geolocation.getCurrentPosition(onSuccess, onError);

				} else{
					console.log(loginResponse);
				}
			
	}
    });
}//end of login

//Logout User

function logout(){

		//set local variable to null
		localStorage.removeItem("username");
		localStorage.removeItem("password");
		//navigate to login page
		$.mobile.changePage( "#login-page", { transition: "slidedown" });




}





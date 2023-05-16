//appointment.html, doctors.html, profile.html

let currentUser = "";
let currentIndex = "";
let userlist = [];

$(document).ready(function() {
	currentUser = JSON.parse(localStorage.getItem("currentUser"));
	currentIndex = localStorage.getItem("currentIndex");
	userlist = JSON.parse(localStorage.getItem("userlist"));

	if (currentUser == null) {
		window.location.href = "login.html";
	}

	//profile.html
	$("#txtFullName").text(currentUser.firstName + '\n' + currentUser.lastName);
	$("#txtEmail").text(currentUser.email);
	$("#appointCount b").text(currentUser.appointCount);
	$("#dateJoined b").text(currentUser.joined.substring(0,10));
	$("#lastAppoint b").text("undefined");
	$("#doctor b").text("undefined");

	$("#pfp").click(baseSixtyFour);

	//appointment.html
	if (currentUser.appointments.length != 0) {
		$(".appointment-box a").remove();

		for (let item of currentUser.appointments) {
			$(".appointment-box a").remove();

			if (new Date(item.date) >= new Date()) {
				$(".appointment-box").append("<div class='appoint-tab' style='background-color:#0062ff;'>"
									+ "<img src='" + item.image + "'class='img-temp'></img>"
									+ "<div align=left>"
										+ "<p>" + item.date + "</p>"
										+ "<p>" + item.reason + "</p>"
									+ "</div></div>");
			} else {
				$(".appointment-box").append("<div class='appoint-tab' style='background-color:rgba(20,20,20,0.4);'>"
									+ "<img src='" + item.image + "'class='img-temp'></img>"
									+ "<div align=left>"
										+ "<p>" + item.date + "</p>"
										+ "<p>" + item.reason + "</p>"
									+ "</div></div>");				
			}
		}
	}

	console.log(localStorage.getItem("userlist"));
});

class Appointment {
	constructor (image, date, reason) {w
		this.image = image;
		this.date = date;
		this.reason = reason;
	}
}

function showProfileForm(edit) {
	$("#editForms").css("display", "block");

	$("#editForms").animate({
		height : "320px",
		paddingTop : "30px",
		paddingBottom : "30px"	
	},1000);

	if (edit == "profile") {
		$("#lblFirst").text("Change First Name: ");
		$("#txtFirst").attr("type", "text");
		$("#txtFirst").val(currentUser.firstName);

		$("#lblSecond").text("Change Last Name: ");
		$("#txtSecond").attr("type", "text");
		$("#txtSecond").val(currentUser.lastName);

		$("#lblThird").text("Change Email Address: ");
		$("#txtThird").attr("type", "text");
		$("#txtThird").val(currentUser.email);

		$(".btn-save").off("click");
		$(".btn-save").click(editProfile);

	} else if (edit == "password") {
		$("#lblFirst").text("Old Password: ");
		$("#txtFirst").attr("type", "password");

		$("#lblSecond").text("New Password: ");
		$("#txtSecond").attr("type", "password");

		$("#lblThird").text("Confirm New Password: ");
		$("#txtThird").attr("type", "password");

		$("#editForms input").val("");

		$(".btn-save").off("click");
		$(".btn-save").click(changePassword);
	}
}

function editProfile () {
	let inputs = document.querySelectorAll("input");
	let isBlank = false;

	for (let element of inputs) {
		if (element.value == "") {
			element.style = "border: 2px solid red";
			isBlank = true;

		} else {
			element.style = "border: 1px solid black";		
		}
	}

	if (isBlank) {
		alert("You left a blank input.");
		return;
	}

	currentUser.firstName = $("#txtFirst").val();
	currentUser.lastName = $("#txtSecond").val();
	currentUser.email = $("#txtThird").val();

	doSaveReload();
}

function changePassword () {
	let inputs = document.querySelectorAll("input");
	let isBlank = false;

	for (let element of inputs) {
		if (element.value == "") {
			element.style = "border: 2px solid red";
			isBlank = true;

		} else {
			element.style = "border: 1px solid black";		
		}
	}

	if (isBlank) {
		alert("You left a blank input.");
		return;
	}

	if ($("#txtFirst").val() == currentUser.password) {

		if ($("#txtSecond").val() == $("#txtThird").val()) {
			currentUser.password = $("#txtSecond").val();

			doSaveReload();
	
		} else {
			alert("New Password and Confirm New Password doesn't match.");
		}
	} else {
		alert("Old Password doesn't match with the current password.");
	}
}

function clearEdit () {	

	$("#editForms").animate({
		height : "0px",
		paddingTop : "0px",
		paddingBottom : "0px"	
	},1000, function () {
		$("#editForms").css("display","none");
	});
}

function logoutAccount() {
	localStorage.removeItem("currentUser");
	window.location.href = "login.html";	
}

function showFillUp(edit) {	
	if ($('body').find(".appointment-form").length == false) {
		$("body").prepend("<div class='appointment-form'>"
						 +	"<button class='x-cancel' onclick='fillCancel()'>X</button>"
						 +	"<label>Date of your appointment.</label>"
						 +	"<input type='date' id='fillDate'></input>"
						 +	"<label>Reason. (Must be 15 characters or longer)</label>"
						 +	"<textarea id='fillReason'></textarea>"
						 +	"<button class='fill-buttons btn-save'></button>"
						 +	"<button class='fill-buttons' onclick='fillCancel()'>Cancel</button>"
						 +"</div>");
		$(".appointment-form").fadeIn("ease");
	}

	if (edit == "create") {
		$("#fillDate").val("");
		$("#fillReason").val("");
		$("#fillReason").prop("disabled", false);
		$(".btn-save").text("DONE");

		$(".btn-save").off("click");
		$(".btn-save").click(createAppoint);

	} else if (edit == "update") {
		$("#fillDate").val(currentUser.appointments[0].date);
		$("#fillReason").val(currentUser.appointments[0].reason);
		$("#fillReason").prop("disabled", true);
		$(".btn-save").text("CHANGE");
		
		$(".btn-save").off("click");
		$(".btn-save").click(updateAppoint);
	}
}

function fillCancel() {
	$(".appointment-form").fadeOut("ease", function () {$(this).remove()});
}

function createAppoint() {
	if ($("#fillDate").val() === "" || $("#fillDate").val().indexOf("-") === -1) {
		$(".appointment-form input").css("border", "red 1px solid");
		return;
	} else {
		$(".appointment-form input").css("border", "black 1px solid");
	}

	if ($("#fillReason").val().length < 15) {
		$(".appointment-form textarea").css("border", "red 1px solid");
		return;
	} else {
		$(".appointment-form textarea").css("border", "black 1px solid");
	}

	let imgRandom = Math.ceil(Math.random() * 3);
	let imgTemp = "";

	switch (imgRandom) {
		case 1: imgTemp = "https://i.imgur.com/N4XXEjI.jpg"; 
				break;  
		case 2: imgTemp = "https://i.imgur.com/ge4VbA0.jpg";
				break;
		case 3: imgTemp = "https://i.imgur.com/MYPcJ9e.jpg";
				break;
	}

	let appoint = new Appointment(imgTemp, $("#fillDate").val(), $("#fillReason").val()) 
	console.log(appoint);

	currentUser.appointments.unshift(appoint);

	doSaveReload();
}

function updateAppoint() {
	currentUser.appointments[0].date = $("#fillDate").val();
	
	doSaveReload();
}

function cancelAppoint() {
	let cancel = confirm("Do you really want to cancel your current appointment?");

	if (cancel == true) {
		currentUser.appointments.shift();
		
		doSaveReload();
	}
}

function showHistory() {
	if ($(".appointment-box").css("height") == "470px") {
		$(".appointment-box").css("height","auto");
		$('html, body').animate({
		    scrollTop: $('footer').offset().top
		}, 1000);
		$("#btnHistory").text("Hide History");
	} else {
		$(".appointment-box").css("height","470");
		$("#btnHistory").text("Show History");
	}
}

function doSaveReload() {
	userlist[currentIndex] = currentUser;

	localStorage.setItem("currentUser", JSON.stringify(currentUser));
	localStorage.setItem("userlist", JSON.stringify(userlist));
	
	location.reload();
}


//extra function for plus grade lol
function baseSixtyFour() {
	let image = new Image();
	
	try {
		image.src = prompt("Enter an valid image URL here:");

		image.crossOrigin = "anonymous";

		image.onload = function () {
			let canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
				
			let context = canvas.getContext("2d");
			context.drawImage(image, 0, 0);

			let base64 = canvas.toDataURL("pfp/jpeg");

			localStorage.setItem("pfp", dataURL.replace(/^data:image\/?[A-z]*;base64,/));

			$("#pfp").attr("src", base64);
		}

		image.onerror = function () {
			console.error("Error, invalid image URL");
			alert("Error! Invalid image URL.");
		};

//  var canvas = document.createElement("canvas");
//  canvas.width = img.width;
//  canvas.height = img.height;
//  var ctx = canvas.getContext("2d");
//  ctx.drawImage(img, 0, 0);
//  var dataURL = canvas.toDataURL("image/png");
//  return dataURL.replace(/^data:image\/?[A-z]*;base64,/);


//var base64 = getBase64Image(document.getElementById("imageid"));
	} catch (e) {
		console.error("Error, invalid image URL", e);
		alert("Error! Invalid image URL.");
	}
}
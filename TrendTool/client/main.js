import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import './main.html';

var firstnameVar;
var surnameVar;
var emailVar;
var passwordVar;
var user;

Meteor.startup(function() {
	GoogleMaps.load({
	    //key: Meteor.settings.public.googleMapsApiKey,
	    key: "AIzaSyCPExERDJVYXWgAOEDAYf7L2uKHifAgtlE",
		libraries: ['places','visualization']  // also accepts an array if you need more than one
	});
});

// Meteor.subscribe("allTags");
// Meteor.subscribe("allUsers");

$.cloudinary.config({
	//cloud_name: Meteor.settings.public.cloudinaryCloud
	cloud_name: "trendwatching"
});

Meteor.Spinner.options = {
	color: '#408AC9'
};

if (Meteor.isClient) {
	Template.header.helpers({
		getTitle: function() {
			return Session.get("pageTitle");
		},
		userImageCount: function() {
			return Images.find({owner : Meteor.userId()}).count();
		}
	});

	Template.header.events({
		'click li a.notLoggedIn': function(event){
			event.preventDefault();

			$('.registerLogin').fadeToggle("slow");
		},
		'click li a.logout': function(event){
			event.preventDefault();

			console.log('click');
			Meteor.logout(function() {
				Router.go('/');

				Bert.alert({
					message: 'Je bent uitgelogd!',
					type: 'info',
					style: 'growl-top-right',
					icon: 'fa-check'
				});
			});
		},
		'click li.notLoggedIn a': function(event){
			event.preventDefault();

			$('.registerLogin').fadeToggle("slow");
		},
	});

	Template.registerLogin.onRendered(function() {
		$('.intrests .interst').shuffle();
	});

	Template.registerLogin.events({
		'submit .login-form': function(event){
			event.preventDefault();

			var emailVar = event.target.loginEmail.value;
			var passwordVar = event.target.loginPassword.value;

			console.log("emailVar", emailVar, "passwordVar", passwordVar)

			Meteor.loginWithPassword(emailVar, passwordVar, function(err) {
				if (!err) {
					console.log("User logged in");

					Bert.alert({
						title: "Welkom: " + Meteor.user().profile.name,
						message: 'Je bent ingelogd!',
						type: 'success',
						style: 'growl-top-right',
						icon: 'fa-check'
					});				
				} else {
					console.log("Not logged in, and error occurred:", err);

					switch(err.reason) {
						case "Match failed":
							Bert.alert({
								message: 'Vul alle velden in',
								type: 'danger',
								style: 'growl-top-right',
								icon: 'fa-close'
							});
						break;

						case "User not found":
							Bert.alert({
								message: 'E-mailadres bestaat niet',
								type: 'danger',
								style: 'growl-top-right',
								icon: 'fa-close'
							});
						break;

						case "Incorrect password":
							Bert.alert({
								message: 'Wachtwoord is incorrect',
								type: 'danger',
								style: 'growl-top-right',
								icon: 'fa-close'
							});
						break;
					}
				}
			});
		},
		'click .close a': function(event){
			event.preventDefault();

			$('.registerLogin').fadeToggle("slow");
		},
		'click .message a': function(event){
			event.preventDefault();

			$('.register-form.form1').animate({height: "toggle", opacity: "toggle"}, "slow");
			$('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
		},
		'click .form1 .advance': function(event){
			event.preventDefault();

			firstnameVar = $('#registerFirstname').val();
			surnameVar = $('#registerSurname').val();
			emailVar = $('#registerEmail').val();
			passwordVar = $('#registerPassword').val();

			if (firstnameVar != '' && surnameVar != '' && emailVar != '' && passwordVar != '') {
				user = {
					'email': emailVar,
					'password': passwordVar,
					profile: {
						'name': firstnameVar + " " + surnameVar,
						'firstname': firstnameVar,
						'surname': surnameVar,
						'bsrVal': "Green",
						'bsrRedVal': 0,
						'bsrYellowVal': 0,
						'bsrGreenVal': 0,
						'bsrBlueVal': 0,
						'nfcVal': 0,
						'fashionVal': 0,
						'technologyVal': 0,
						'cultureVal': 0,
						'politicsVal': 0,
						'economicsVal': 0
					}
				};

				$(event.target).parent().animate({height: "toggle", opacity: "toggle"}, "slow");
				$(event.target).parent().next().animate({height: "toggle", opacity: "toggle"}, "slow");

				$('.form1 input').removeClass('required');
			} else {
				if (firstnameVar == '') {
					$('#registerFirstname').addClass('required');
				}
				if (surnameVar == '') {
					$('#registerSurname').addClass('required');
				}
				if (emailVar == '') {
					$('#registerEmail').addClass('required');
				}
				if (passwordVar == '') {
					$('#registerPassword').addClass('required');
				}
				Bert.alert({
					message: 'Vul alle velden in.',
					type: 'danger',
					style: 'growl-top-right',
					icon: 'fa-close'
				});
			}
		},
		'click .form2 .advance': function(event){
			event.preventDefault();

			var counting = 0;

			fashionVar = $('#registerFashion').val();
			cultureVar = $('#registerCulture').val();
			politicsVar = $('#registerPolitics').val();
			economicsVar = $('#registerEconomics').val();
			technologyVar = $('#registerTechnology').val();

			if (fashionVar == 3) {
				counting++;
			}
			if (cultureVar == 3) {
				counting++;
			}
			if (politicsVar == 3) {
				counting++;
			}
			if (economicsVar == 3) {
				counting++;
			}
			if (technologyVar == 3) {
				counting++;
			}

			if (counting <= 2) {
				user.profile.fashionVal = fashionVar;
				user.profile.technologyVal = technologyVar;
				user.profile.cultureVal = cultureVar;
				user.profile.politicsVal = politicsVar;
				user.profile.fashionVal = economicsVar;

				$(event.target).parent().animate({height: "toggle", opacity: "toggle"}, "slow");
				$(event.target).parent().next().animate({height: "toggle", opacity: "toggle"}, "slow");

				$('.form2 input').removeClass('required');
			} else {
				Bert.alert({
					message: 'Vul de velden naar eerlijkheid in',
					type: 'danger',
					style: 'growl-top-right',
					icon: 'fa-close'
				});
			}
		},
		'click .form3 .advance': function(event){
			event.preventDefault();

			$(event.target).parent().animate({height: "toggle", opacity: "toggle"}, "slow");
			$(event.target).parent().next().animate({height: "toggle", opacity: "toggle"}, "slow");

			$('.form2 input').removeClass('required');
		},
		'submit .register-form.form4': function(event){
			event.preventDefault();

			var colorArray = [
				"Rood",
				"Geel",
				"Groen",
				"Blauw"
			]

			var bsrColor = colorArray[Math.floor(Math.random()*colorArray.length)];
			var nfcValue = Math.floor(Math.random() * 60);

			$('.nfcQuestion select').each( function() {
				console.log($(this).val());
			});


			console.log(user);

			// return Meteor.call('createUserWithRole', user, 'student', function(err, userId) {
			// 	if (err) {
			// 		//Insertion Error
			// 	} else {
			// 		Meteor.loginWithPassword(userId, user.password, function(err, suc) {
			// 			if (err) {
			// 				console.log(err);

			// 				switch(err.reason) {
			// 					case "Match failed":
			// 						Bert.alert({
			// 							message: 'Vul alle velden in',
			// 							type: 'danger',
			// 							style: 'growl-top-right',
			// 							icon: 'fa-close'
			// 						});
			// 					break;

			// 					case "User not found":
			// 						Bert.alert({
			// 							message: 'E-mailadres bestaat niet',
			// 							type: 'danger',
			// 							style: 'growl-top-right',
			// 							icon: 'fa-close'
			// 						});
			// 					break;

			// 					case "Incorrect password":
			// 						Bert.alert({
			// 							message: 'Wachtwoord is incorrect',
			// 							type: 'danger',
			// 							style: 'growl-top-right',
			// 							icon: 'fa-close'
			// 						});
			// 					break;
			// 				}
			// 			} else {
			// 				var name = "Welkom: " + Meteor.user().profile.name;
			// 				console.log(name);

			// 				Router.go('/');

			// 				Bert.alert({
			// 					title: name,
			// 					message: 'Je bent ingelogd!',
			// 					type: 'success',
			// 					style: 'growl-top-right',
			// 					icon: 'fa-check'
			// 				});
			// 			}
			// 		});
			// 	}
			// });
		},
		'click .return': function(event){
			event.preventDefault();

			$(event.target)
				.parent()
				.animate(
					{
						height: "toggle",
						opacity: "toggle"
					},
					"slow"
				);

			$(event.target)
				.parent()
				.prev()
				.animate(
					{
						height: "toggle",
						opacity: "toggle"
					},
					"slow"
				);
		},
		'change .interst input': function(event){
			event.preventDefault();

			var value = $(event.target).val();

			$(event.target)
				.prev()
				.html(value);
		}
	});
}

/*
* Shuffle jQuery array of elements
*/
jQuery.fn.shuffle = function () {
	var j;
	for (var i = 0; i < this.length; i++) {
		j = Math.floor(Math.random() * this.length);
		$(this[i]).before($(this[j]));
	}
	return this;
};
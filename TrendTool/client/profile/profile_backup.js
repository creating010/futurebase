// var uploadFile = null,
// 	bheight,
// 	uheight;

// Template.topBar.events({
// 	'click .makeNew a': function(event){
// 		event.preventDefault();

// 		console.log("hier!");

// 		bheight = $('.top-bar').outerHeight();
// 		uheight = $('.topBarUpload').outerHeight() + 100;

// 		$('.top-bar').animate({
// 			height: uheight
// 		}, { duration: 500, queue: false });
// 		$('.top-bar').toggleClass("uploading", 100, "easeInOutCubic",  { queue: false });
// 		$('.topBarUpload').slideToggle({ duration: 500, animation: "easeInOutCubic", queue: false });
// 	}
// });

// Template.topBarUpload.events({
// 	'drop #dropzone': function(e, t){
// 		e.preventDefault();

// 		$(e.currentTarget).removeClass('dragover');
// 		$(e.currentTarget).addClass('dropped');
// 		$(e.currentTarget).html("<div class='dropzoneInner'><i class='fa fa-image'></i><p>Afbeelding: " + e.originalEvent.dataTransfer.files[0].name + "</p></div>");

// 		// console.log(e.originalEvent.dataTransfer.files[0]);
// 		uploadFile = e.originalEvent.dataTransfer.files[0];
// 		console.log(e.originalEvent.dataTransfer.files[0]);
// 		$('.previewImage').attr('src', e.originalEvent.dataTransfer.files[0])
// 	},
// 	'dragover #dropzone': function(e, t){
// 		$(e.currentTarget).addClass('dragover');

// 		return false;
// 	},
// 	'dragleave #dropzone': function(e, t){
// 		$(e.currentTarget).removeClass('dragover');

// 		return false;
// 	},
// 	'click .close a': function(event){
// 		event.preventDefault();

// 		$('.top-bar').animate({
// 			height: bheight
// 		}, { duration: 500, queue: false });
// 		$('.top-bar').toggleClass("uploading", 100, "easeInOutCubic",  { queue: false });
// 		$('.topBarUpload').slideToggle({ duration: 500, animation: "easeInOutCubic", queue: false });
// 	},
// 	'click .submitImage': function(e, t){
// 		e.preventDefault();

// 		if (uploadFile != null && $('#tagSelection').val() != null && $('#locationSelection').val() != null && $('#descriptionText').val() != null) {
// 			var cloudinaryFolder;
// 			var files = [];
// 			var tagId = [];
// 			var sourceURL = "";

// 			if (Meteor.absoluteUrl() == "https://shoppinglab.hr.nl/") {
// 				cloudinaryFolder = "shoppinglab-production";
// 			} else {
// 				cloudinaryFolder = "testing";
// 			}

// 			files.push(uploadFile);

// 			$(".tagsSelector .item").each(function() {
// 				tagId.push($(this).attr("data-value"));
// 			});

// 			return Cloudinary.upload(files, {
// 				folder: cloudinaryFolder,
// 				exif: "TRUE"
// 			}, function(err, res) {
// 				if (!err) {
// 					console.log("Result:", res);

// 					if ($('#locationSelection') > 0) {
// 						sourceURL = $('#locationSelection').value;
// 					}

// 					Meteor.call('addImage',
// 						res.public_id,									// id Image
// 						sourceURL,										// sourceURL
// 						tagId,											// array with ids of tags
// 						$('#formatted_address')[0].innerHTML,			// Adress
// 						$('#gps')[0].innerHTML,							// GPS location
// 						$('#descriptionText')[0].value,					// Description
// 						Meteor.user().profile.groupId,					// id Group
// 						Meteor.user().profile.bsrColor,					// bsrColor
// 						Meteor.user().profile.nfcValue,					// nfcValue
// 						Meteor.user().profile.fashionVal,				// fashionVal
// 						Meteor.user().profile.techVal,					// textVal
// 						Meteor.user().profile.cultureVal,				// cultureVal
// 						Meteor.user().profile.politicsVal,				// politicsVal
// 						Meteor.user().profile.econVal					// econVal
// 					, (err, res) => {
// 						if (!err) {
// 							uploadFile = null;
// 							$("#dropzone").html("<div class='dropzoneInner'><i class='fa fa-upload'></i><p>Sleep de afbeelding hier naartoe</p></div>");
// 							$("#dropzone").removeClass('dropped');
// 							// e.dataTransfer.clearData();
// 							$("#tagSelection").clear();
// 							tagId = [];
// 							// $('#sourceURL')[0].value = "";
// 							sourceURL = "";
// 							$('#locationSelection')[0].value = "";
// 							$('#formatted_address')[0].innerHTML = "";
// 							$('#gps')[0].innerHTML = "";
// 							$('#descriptionText')[0].value = "";
							
// 							Notifications.success('FutureBase', 'Het signaal is geüpload.');
// 						} else {
// 							console.log('DB error:', err);
// 						}
// 					});
// 				} else {
// 					console.log("Upload Error: ", err);
// 				}
// 			});
// 		}
// 	}
// });

// Template.topBarUpload.helpers({
// 	allTags: function () {
// 		return Tags.find({});
// 	}
// });

// Template.topBarUpload.onRendered(function() {
// 	var tagsId = Groups.find({
// 		_id: Meteor.user().profile.groupId
// 	}).map(function (tags) {
// 		return tags.tags
// 	});

// 	var groupTags = Tags.find({
// 		"_id": { "$in": tagsId[0] }
// 	}).fetch();

// 	if (groupTags != null) {
// 		var data = [];

// 		for (var i = 0; i < groupTags.length; i++) {
// 			data.push({
// 				id: groupTags[i]['_id'],
// 				name: groupTags[i]['name']
// 			});
// 		}

// 		$('#tagSelection').selectize({
// 			plugins: ['remove_button', 'restore_on_backspace'],
// 			delimiter: ',',
// 			persist: false,
// 			options: data,
// 			labelField: "name",
// 			valueField: "id",
// 			sortField: 'name',
// 			searchField: 'name'
// 		});
// 	} else {
// 		console.log('Geen tags gevonden!');

// 		var allTags = Tags.find().fetch();
// 		var data = [];

// 		for (var i = 0; i < allTags.length; i++) {
// 			data.push({
// 				id: allTags[i]['_id'],
// 				name: allTags[i]['name']
// 			});
// 		}

// 		$('#tagSelection').selectize({
// 			plugins: ['remove_button', 'restore_on_backspace'],
// 			delimiter: ',',
// 			persist: false,
// 			options: data,
// 			labelField: "name",
// 			valueField: "id",
// 			sortField: 'name',
// 			searchField: 'name'
// 		});
// 	}
// });

// Template.topBarUpload.rendered = function () {
// 	this.autorun(function () {
// 		// Wait for API to be loaded
// 		if (GoogleMaps.loaded()) {
// 			$('#locationSelection').geocomplete({
// 				details: ".locationSelector"
// 			});
// 		}
// 	});
// };

// Template.userListImages.helpers({
// 	userImages: function () {
// 		return Images.find({owner : Meteor.userId()});
// 	}
// });

// Template.userListImages.events({
// 	'click .image--basic': function (e) {
// 		$thisCell = $(e.target).closest('.image');

// 		$('html, body').animate({scrollTop: $thisCell.offset().top - 24}, 500);

// 		if ($thisCell.hasClass('is-collapsed')) {
// 			$('.is-expanded').removeClass('is-expanded').addClass('is-collapsed');
// 			$thisCell.removeClass('is-collapsed').addClass('is-expanded');
// 		} else {
// 			$thisCell.removeClass('is-expanded').addClass('is-collapsed');
// 		}
// 	},
// 	'click .expand__close': function (e) {
// 		$thisCell = $(e.target).closest('.image');

// 		$thisCell.removeClass('is-expanded').addClass('is-collapsed');
// 	}
// });

// Template.userListImages.rendered = function () {

// 	Session.set("pageTitle", (Session.get("pageTitle") + ' (' + Meteor.user().profile.name + ')'));
// };
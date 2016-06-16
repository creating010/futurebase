import './Grid.js';

var uploadFile = null;
var bheight;
var uheight;

Template.lessonImages.events({
	'click .makeNew a': function(event){
		event.preventDefault();

		bheight = $('.top-bar').outerHeight();
		uheight = $('.topBarUpload').outerHeight() + 100;

		$('.top-bar').animate({
			height: uheight
		}, { duration: 500, queue: false });
		$('.top-bar').toggleClass("uploading", 100, "easeInOutCubic",  { queue: false });
		$('.topBarUpload').slideToggle({ duration: 500, animation: "easeInOutCubic", queue: false });
	},
	'click .close a': function(event){
		event.preventDefault();

		$('.top-bar').animate({
			height: bheight
		}, { duration: 500, queue: false });
		$('.top-bar').toggleClass("uploading", 100, "easeInOutCubic",  { queue: false });
		$('.topBarUpload').slideToggle({ duration: 500, animation: "easeInOutCubic", queue: false });
	},
});

Template.topBarUpload.events({
	'drop #dropzone': function(e, t){
		e.preventDefault();

		$(e.currentTarget).removeClass('dragover');
		$(e.currentTarget).addClass('dropped');
		$(e.currentTarget).html("<div class='dropzoneInner'><i class='fa fa-image'></i><p>Afbeelding: " + e.originalEvent.dataTransfer.files[0].name + "</p></div>");

		// console.log(e.originalEvent.dataTransfer.files[0]);
		uploadFile = e.originalEvent.dataTransfer.files[0];
	},
	'dragover #dropzone': function(e, t){
		$(e.currentTarget).addClass('dragover');

		return false;
	},
	'dragleave #dropzone': function(e, t){
		$(e.currentTarget).removeClass('dragover');

		return false;
	},
	'click .submitImage': function(e, t){
		e.preventDefault();

		if (uploadFile != null && $('#tagSelection').val() != null && $('#locationSelection').val() != null && $('#descriptionText').val() != null) {
			var cloudinaryFolder;
			var files = [];
			var tagId = [];
			var sourceURL = "";

			if (Meteor.absoluteUrl() == "https://shoppinglab.hr.nl/") {
				cloudinaryFolder = "shoppinglab-production";
			} else {
				cloudinaryFolder = "testing";
			}

			files.push(uploadFile);

			$(".tagsSelector .item").each(function() {
				tagId.push($(this).attr("data-value"));
			});

			return Cloudinary.upload(files, {
				folder: cloudinaryFolder,
				exif: "TRUE"
			}, function(err, res) {
				console.log("Upload Error: ");
				console.log(err);
				console.log("Result: ");
				console.log(res);

				if ($('#locationSelection') > 0) {
					sourceURL = $('#locationSelection').value;
				}

				Meteor.call('addImage',
					res.public_id,									// id Image
					sourceURL,										// sourceURL
					tagId,											// array with ids of tags
					$('#formatted_address')[0].innerHTML,			// Adress
					$('#gps')[0].innerHTML,							// GPS location
					$('#descriptionText')[0].value,					// Description
					Meteor.user().profile.bsrColor,					// bsrColor
					Meteor.user().profile.nfcValue,					// nfcValue
					Meteor.user().profile.fashionVal,				// fashionVal
					Meteor.user().profile.techVal,					// textVal
					Meteor.user().profile.cultureVal,				// cultureVal
					Meteor.user().profile.politicsVal,				// politicsVal
					Meteor.user().profile.econVal					// econVal
				, (err, res) => {
					if (!err) {
						Bert.alert({
							message: 'Signaal is geüpload.',
							type: 'success',
							style: 'growl-top-right',
							icon: 'fa-check'
						});
					}
				});

				uploadFile = null;
				$("#dropzone").html("<div class='dropzoneInner'><i class='fa fa-upload'></i><p>Sleep de afbeelding hier naartoe</p></div>");
				$("#dropzone").removeClass('dropped');
				e.dataTransfer.clearData();
				// $("#tagSelection").clear();
				tagId = [];
				// $('#sourceURL')[0].value = "";
				sourceURL = "";
				$('#locationSelection')[0].value = "";
				$('#formatted_address')[0].innerHTML = "";
				$('#gps')[0].innerHTML = "";
				$('#descriptionText')[0].value = "";
			});
		}
	}
});

Template.topBarUpload.helpers({
	// allTags: function () {
	// 	return Tags.find({});
	// }
});

Template.topBarUpload.onRendered(function() {
	var allJSONTags = Tags.find().fetch();
	var data = [];

	for (var i = 0; i < allJSONTags.length; i++) {
		data.push({
			id: allJSONTags[i]['_id']["_str"],
			name: allJSONTags[i]['name']
		});
	}

	$('#tagSelection').selectize({
		plugins: ['remove_button', 'restore_on_backspace'],
		delimiter: ',',
		persist: false,
		options: data,
		labelField: "name",
		valueField: "id",
		sortField: 'name',
		searchField: 'name',
		create: function(input) {
			return {
				value: input,
				text: input
			}
		}
	});
});

Template.topBarUpload.rendered = function () {
	this.autorun(function () {
		// Wait for API to be loaded
		if (GoogleMaps.loaded()) {
			$('#locationSelection').geocomplete({
				details: ".locationSelector"
			});
		}
	});
}

Template.listImages.helpers({
	allImages: function () {
		return Images.find();
	}
});

Template.listImages.events({
	'click .image--basic': function (e) {
		$thisCell = $(e.target).closest('.image');

		$('html, body').animate({scrollTop: $thisCell.offset().top - 24}, 500);

		if ($thisCell.hasClass('is-collapsed')) {
			$('.is-expanded').removeClass('is-expanded').addClass('is-collapsed');
			$thisCell.removeClass('is-collapsed').addClass('is-expanded');
		} else {
			$thisCell.removeClass('is-expanded').addClass('is-collapsed');
		}
	},
	'click .expand__close': function (e) {
		$thisCell = $(e.target).closest('.image');

		$thisCell.removeClass('is-expanded').addClass('is-collapsed');
	}
});
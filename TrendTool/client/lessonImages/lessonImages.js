import './Grid.js';

var className = 'Geen groep';

Template.listImages.helpers({
	allImages: function () {
		var econFilter = 0,
			fashionFilter = 0,
			techFilter = 0,
			cultureFilter = 0,
			politicsFilter = 0,
			BSRFilter = { $in: [ "Red", "Yellow", "Green", "Blue" ] },
			NFCFilter = 0;

		for (var i = 0; i < Session.get('interestFilterArray').length; i++) {
			switch(Session.get('interestFilterArray')[i]) {
				case 'econVal':
					econFilter = 3;
				break;

				case 'fashionVal':
					fashionFilter = 3;
				break;

				case 'techVal':
					techFilter = 3;
				break;

				case 'cultureVal':
					cultureFilter = 3;
				break;

				case 'politicsVal':
					politicsFilter = 3;
				break;
			}
		}
		for (var i = 0; i < Session.get("NFCFilterArray").length; i++) {
			switch(Session.get("NFCFilterArray")[i]) {
				case 'high':
					NFCFilter = 57;
				break;
			}
		}
		for (var i = 0; i < Session.get("BSRFilterArray").length; i++) {
			switch(Session.get("BSRFilterArray")[i]) {
				case 'Red':
					BSRFilter = "Red";
				break;

				case 'Yellow':
					BSRFilter = "Yellow";
				break;

				case 'Green':
					BSRFilter = "Green";
				break;

				case 'Blue':
					BSRFilter = "Blue";
				break;

				case 'Empty':
					BSRFilter = { $in: [ "Red", "Yellow", "Green", "Blue" ] };
				break;
			}
		}

		return Images.find({ 
			'groupId': Meteor.user().profile.groupId,
			'tags': { $in: Session.get("tagFilterArray") },
			'econVal': { $gt: econFilter },
			'fashionVal': { $gt: fashionFilter },
			'techVal': { $gt: techFilter },
			'cultureVal': { $gt: cultureFilter },
			'politicsVal': { $gt: politicsFilter },
			'bsrColor': BSRFilter,
			'nfcValue': { $gt: NFCFilter }
		});
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

Template.listImages.rendered = function () {
	var groupId = Meteor.user().profile.groupId;
	console.log('groupId', groupId);
	console.log('group', Groups.find({ _id: groupId}).fetch());

	if (Groups.find({ _id: groupId}).fetch()[0] != undefined) {
		className = Groups.find({ _id: groupId}).fetch()[0].title;
	}
	Session.set("pageTitle", (Session.get("pageTitle") + ' (' + className + ')'));
}
Template.userListImages.helpers({
	userImages: function () {
		return Images.find({owner : Meteor.userId()});
	}
});

Template.userListImages.events({
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
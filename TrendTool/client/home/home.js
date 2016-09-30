Template.home.helpers({
	loggedIn: function () {
		if (Meteor.user()) {
			return true;
		} else {
			return false;
		}
	}
});

Template.home.events({
	'click .homeTitle a': function(event){
		event.preventDefault();

		$('.registerLogin').fadeToggle("slow");
	}
});
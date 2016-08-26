Template.home.events({
	'click .homeTitle a': function(event){
		event.preventDefault();

		$('.registerLogin').fadeToggle("slow");
	}
});
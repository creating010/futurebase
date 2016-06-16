// Meteor.publish(null, function () { 
// 	return Meteor.roles.find({})
// });

Meteor.publish("allUsers", function(){
	return Meteor.users.find({});
});

Meteor.publish("allTags", function(){
	return Tags.find({});
});

Meteor.publish("allImages", function(){
	return Images.find({});
});

Meteor.publish("allGroups", function(){
	return Groups.find({});
});

Meteor.publish("allThemes", function(){
	return Themes.find({});
});
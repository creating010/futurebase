import { Meteor } from 'meteor/meteor';

Tags = new Mongo.Collection('tags');
// Tags.TagsMixin(tagsCollection);

// tagsCollection.allowTags(function (userId) {
// 	// only allow if user is logged in
// 	return !!userId;
// });

Meteor.methods({
	addTag: function(name){
		//here is the code
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		} else {
			Tags.insert({
				'name': name,						// name of the tag
			})
		}
	},
	deleteTag: function(id){
		//here is the code
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		} else {
			Tags.remove(id);
		}
	},
	getTagName: function(id){
		return Tags.findOne({_id: id}).name;
	},
	updateTag: function(id, name){
		//here is the code
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		} else {
			Tags.update({_id: id}, {$set: {name: name}});
		}
	}
});

import { Meteor } from 'meteor/meteor';

Groups = new Meteor.Collection('groups');

Meteor.methods({
	addGroup: function(name, title, institute, token, tags){
		//here is the code
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Groups.insert({
			'name': name,						// name of the group
			'title': title,						// worktitle of the group
			'institute': institute,				// institute of the group
			'token': token,						// token of the group
			'tags': tags,						// tagsId of the group
		})
	},
	updateGroup: function(id, name, title, institute, token, tags){
		//here is the code
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Groups.update({_id: id},
			{
				$set: {
					name: name,
					title: title,
					institute: institute,
					token: token,
					tags: tags
				}
			}
		);
	}
});

Groups.helpers({
	checkGroupToken: function(id, token) {
		var groupToken = Groups.findOne({ token: token });
	},
	students: function() {
		return Meteor.users.find({ "profile.groupId": this._id })
	},
	groupName: function() {
		var groupName = Groups.findOne({ _id: this.profile.groupId }).name;
		return groupName;
	},
	tags: function() {
		return Tags.find({  });
	}
});
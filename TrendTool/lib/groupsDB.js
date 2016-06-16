import { Meteor } from 'meteor/meteor';

Groups = new Mongo.Collection("groups");

Meteor.methods({
	addGroup: function(projectName, courseCode, themeName){
		//here is the code
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Groups.insert({
			'projectName': projectName,
			'courseCode': courseCode,
			'themes': themes
		})
	}
});
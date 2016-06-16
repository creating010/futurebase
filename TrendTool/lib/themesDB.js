import { Meteor } from 'meteor/meteor';

Themes = new Mongo.Collection("themes");

Meteor.methods({
	addTheme: function(themeName){
		//here is the code
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Themes.insert({
			'themeName': themeName
		})
	}
});
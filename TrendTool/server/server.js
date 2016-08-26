import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	Cloudinary.config({
		// cloud_name: Meteor.settings.public.cloudinaryCloud,
		// api_key: Meteor.settings.cloudinaryAPIKey,
		// api_secret: Meteor.settings.cloundinaryAPISecret
		cloud_name: "trendwatching",
		api_key: "817441248939551",
		api_secret: "AuIw1Yo36qdYODBJG9moIMlGd9k"
	});

	Meteor.methods({
		addRoleToUser: function(id, role) {

			Roles.addUsersToRoles(id, role);
		},
		checkSamr: function () {

			return Meteor.http.call("GET", "http://smartweb3.smartagent.nl/ennis/surveys/bsrhr/json/data.json");
		},
		createUserWithRole: function(user, role) {
			var userId;

			Meteor.call('createUserNoRole', user, function(err, result) {
				if (err) {
					return err;
				}
				Roles.addUsersToRoles(result, role);
				return userId = result;
			});

			return userId;
		},
		createUserNoRole: function(user) {
			//Do server side validation
			return Accounts.createUser({
				email: user.email,
				password: user.password,
				profile: user.profile
			});
		},
		deleteUser: function(id){

			return Meteor.users.remove(id);
		},
		userIsInRole: function (id, role) {
			
			return Roles.userIsInRole(id, role, Roles.GLOBAL_GROUP);
		},
		removeUsersFromRoles: function(id, role) {

			Roles.removeUsersFromRoles(id, role, Roles.GLOBAL_GROUP);
		},
		returnAllGroups: function() {
			var results = [];
			var results = Groups.find().map(function (group, index, originalCursor) {
				var result = {
					_id: group._id,
					projectName: group.projectName,
					courseCode: group.courseCode,
					themes: group.themes
				};
				return result;
			});

			return results;
		},
		returnAllRoles: function() {
			var results = [];
			var results = Roles.getAllRoles().map(function (role, index, originalCursor) {
				var result = {
					name: role.name
				};
				return result;
			});

			return results;
		}
	});
});
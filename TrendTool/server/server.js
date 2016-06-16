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
		createNewUser: function (emailVar, passwordVar, firstnameVar, surnameVar, bsrColor, nfcValue, fashionVal, techVal, cultureVal, politicsVal, econVal, roles) {
			var user = {
				'email': emailVar,
				'password': passwordVar,
				profile: {
					'name': firstnameVar + " " + surnameVar,
					'firstname': firstnameVar,
					'surname': surnameVar,
					'bsrColor': bsrColor,
					'nfcValue': nfcValue,
					'fashionVal': fashionVal,
					'techVal': techVal,
					'cultureVal': cultureVal,
					'politicsVal': politicsVal,
					'econVal': econVal
				},
				roles: roles
				// ,
				// groups: []
			};

			var id = Accounts.createUser(user);

			if (user.roles.length > 0) {
				Roles.addUsersToRoles(id, user.roles);
			}
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
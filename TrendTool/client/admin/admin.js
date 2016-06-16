Meteor.subscribe("allUsers");

Template.admin.helpers({
	allUsers: function() {
		return Meteor.users.find();
	},
	listGroups: function() {
		return Session.get("listGroups");
	},
	listRoles: function() {
		return Session.get("listRoles");
	},
	listUsers: function() {
		return Session.get("listUsers");
	},
	isActive: function(role) {
		return role === Session.get("activeRole");
	},
	offset: function(index) {
		result = index + 1;
		return result;
	},
	userImageCount: function(userId) {
		return Images.find({owner: userId}).count();
	}
});

Template.admin.events({
	// "click .updatebutton": function(e) {
	// 	console.log("this._id", this._id,
	// 		"usernameinput", $('#usernameInput-'+this._id)[0].value,
	// 		"fashionVal", $('#fashionInput-'+this._id)[0].value,
	// 		"techVal", $('#techInput-'+this._id)[0].value,
	// 		"cultureVal", $('#cultureInput-'+this._id)[0].value,
	// 		"politicsVal", $('#politicsInput-'+this._id)[0].value,
	// 		"economyVal", $('#economyInput-'+this._id)[0].value,
	// 		"bsrVal", $('#bsr-'+this._id)[0].value,
	// 		"nfcVal", $('#nfc-'+this._id)[0].value
	// 	);
	// 	// Meteor.call('updateUser', 
	// 	// 	this._id,
	// 	// 	$('#usernameInput-'+this._id)[0].value,
	// 	// 	$('#emailInput-'+this._id)[0].value,
	// 	// 	$('#fashionInput-'+this._id)[0].value,
	// 	// 	$('#techInput-'+this._id)[0].value,
	// 	// 	$('#cultureInput-'+this._id)[0].value,
	// 	// 	$('#politicsInput-'+this._id)[0].value,
	// 	// 	$('#economyInput-'+this._id)[0].value,
	// 	// 	$('#bsr-'+this._id)[0].value,
	// 	// 	$('#nfc-'+this._id)[0].value
	// 	// );
	// },
	"change .usersSelection": function(e, t){
		console.log('ObjectId: ', $("[name=usersSelection]").val());
		
		Meteor.call('returnUsersByGroup', $("[name=usersSelection]").val(), function (error, result) {
			if(error){
				console.log("error from returnUsersByRole: ", error);
			} else {
				Session.set("activeGroup", $("[name=usersSelection]").val());
				Session.set("listUsers", result);
			};
		});
	}
});
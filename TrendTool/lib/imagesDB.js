import { Meteor } from 'meteor/meteor';

Images = new Mongo.Collection("images");

Meteor.methods({
	addImage: function(public_id, sourceURL, tagsIds, formatted_address, gps, description, groupId, bsrColor, nfcValue, fashionVal, techVal, cultureVal, politicsVal, econVal){
		//here is the code
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Images.insert({
			'public_id': public_id,
			'owner': this.userId,						// _id of logged in user
			'groupId': groupId,							// id of group where image belong to
			'sourceURL': sourceURL,						// *option* url from image
			'tags': tagsIds,							// array with ids of tags
			'formatted_address': formatted_address,		// name of street
			'gps': gps,									// gps coordina
			'description': description,					// description of image
			'bsrColor': bsrColor,						// bsrColor of uplader
			'nfcValue': nfcValue,						// nfcValue of uplader
			'fashionVal': fashionVal,					// fashionValue of uplader
			'techVal': techVal,							// techValue of uplader
			'cultureVal': cultureVal,					// cultureValue of uplader
			'politicsVal': politicsVal,					// politicsValue of uplader
			'econVal': econVal							// econValue of uplader
		})
	},
	updateImage: function(imageId, sourceURL, formatted_address, gps, description) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Images.update(imageId, { $set: {
			'sourceURL': sourceURL,
			'formatted_address': formatted_address,
			'gps': gps,
			'description': description
		}});
	}
});

// Meteor.methods({
// 	addImageEntry: function(public_id, sourceURL,formatted_address, gps,comment){
// 		//here is the code
// 		if (! Meteor.userId()) {
// 			throw new Meteor.Error("not-authorized");
// 		}
// 			ImageEntries.insert({
// 			public_id: public_id,
// 			owner: this.userId,           // _id of logged in user
// 			username: Meteor.user().username,  // username of logged in user
// 			sourceURL: sourceURL,
// 			formatted_address: formatted_address,
// 			gps: gps,
// 			comment: comment
// 			// tags: imgTagIds
// 		})
// 	},
// 	removeImageEntry: function(id, public_id){
// 		//here is the code
// 		if (! Meteor.userId()) {
// 			throw new Meteor.Error("not-authorized");
// 		}
// 			console.log("Removing image entry id="+id+", public_id="+public_id);
// 			ImageEntries.remove(id);
// 		}
// 	}
// });

// EditableText.registerCallbacks({
// 	showNewCommentValue : function (doc, Collection, newValue, modifier) {
// 		// console.log(newValue);
// 		return newValue;
// 	}, 
// 	showHideSave : function () {
// 		$('#savedComment_'+this.context._id).removeClass('hidden').velocity('fadeIn', { duration: 400}, 'easeOutQuart').velocity("fadeOut", { delay: 1000, duration: 400}, 'easeOutQuart');

// 	}
// });
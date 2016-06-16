Meteor.methods({
  returnUsersByGroup: function(groupId) {
    var results = [];

    var results = Meteor.users.find({'profile.groups.id': groupId})

    // var results = Roles.getUsersInRole([role]).map(function (user, index, originalCursor) {
    //   var result = {
    //     _id: user._id,
    //     profile: user.profile,
    //     roles: user.roles
    //   };
    //   return result;
    // });

    return results;
  },
  updateUser: function(userId, newUsername, newEmail, fashionVal, techVal, cultureVal, politicsVal, econVal, bsrVal, nfcVal){
    if (! Meteor.userId()) {
      throw new Meteor.error("not authorized");
    }
    email = [{
        address: newEmail,
        verified: true
    }];

    Meteor.users.update(
      userId,
      { $set: {
        "username" : newUsername,
        "profile.fashion" : fashionVal,
        "profile.technology" : techVal,
        "profile.culture" : cultureVal,
        "profile.politics" : politicsVal,
        "profile.economy" : econVal,
        "profile.bsr" : bsrVal,
        "profile.nfc" : nfcVal,
        "emails" : email
      }}
    );
  },
  updateUserGroups: function(userId, userGroup) {
    // if (! Meteor.userId()) {
    //   throw new Meteor.error("not authorized");
    // }

    // var group = [];
    // // group.push({id: new Meteor.Collection.ObjectID(userGroup)});

    // Meteor.users.update(
    //   userId,
    //   { $set: {
    //     "profile.groups" : group
    //   }}
    // );
  }
})  



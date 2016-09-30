Template.admin.helpers({
	allUsers: function() {
		var results;
		var ording = {};
		var sortding = { sort: { createdAt: -1} };

		console.log(Session.get('searchQuery'));

		if (Session.get('searchQuery') != null || Session.get('searchQuery') != undefined || Session.get('searchQuery') != '') {
			var keyword		= Session.get('searchQuery');
			var query 		= new RegExp(keyword, 'i');

			console.log('hier', keyword)

			ording			= {$or: [{'profile.name': query},{'profile.studentnumber': query}]}
		}

		if (Session.get('filter') != null || Session.get('filter') != undefined || Session.get('filter') != '') {
			switch(Session.get('filter')) {
				case 'studentNumber asc':
					sortding = { sort: { 'profile.studentNumber': -1} }
				break;

				case 'studentNumber desc':
					sortding = { sort: { 'profile.studentNumber': 1} }
				break;

				case 'studentName asc':
					sortding = { sort: { 'profile.name': -1} }
				break;

				case 'studentName desc':
					sortding = { sort: { 'profile.name': 1} }
				break;

				case 'studentPhotos asc':
					sortding = { sort: { 'profile.name': -1} }
				break;

				case 'studentPhotos desc':
					sortding = { sort: { 'profile.name': 1} }
				break;

				case 'studentGroup asc':
					sortding = { sort: { 'profile.groupId': -1} }
				break;

				case 'studentGroup desc':
					sortding = { sort: { 'profile.groupId': 1} }
				break;
			}
		}

		results	= Meteor.users.find(ording, sortding);
		return { results: results };
	},
	editing: function() {
		return Session.get('target' + this._id);
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
	isDocent: function() {
		if (Roles.userIsInRole(this._id, 'docent')) {
			return "fa-check";
		}
	},
	isDocentChecked: function() {
		if (Roles.userIsInRole(this._id, 'docent')) {
			return "checked";
		}
	},
	userGroup: function(groupId) {
		var groupName = Groups.findOne({ _id: groupId}, { name: 1 });
		if (groupName != null) {
			return groupName.name;
		} else {
			return '-';
		}
	},
	// sessionPage: function() {
	// 	return Session.get("listUsers");
	// },
	userImageCount: function(userId) {
		return Images.find({ owner: userId }).count();
	}
});

Template.admin.events({
	'click th.filter': function(e) {
		$('th').removeClass('active');

		var filter = e.target.className.replace('filter ', '');
		var filterName = filter.split(' ')[0];

		Session.set('filter', filter);
		$('.' + filterName).toggleClass('desc').toggleClass('asc');
		$(e.target).addClass('active');
	},
	'click td .delete': function(event){
		event.preventDefault();

		if(confirm('Wil je de gebruiker "' + this.profile.name + '" verwijderen?')) {
			Meteor.call('deleteUser', 
				this._id, function (error, result) {
					if (!error) {
						Notifications.success('FutureBase', 'De gebruiker is verwijderd.');
					} else {
						console.log(error);
					}
				}
			);
		}
	},
	'click td .edit': function(event){
		event.preventDefault();

		Session.set('target' + this._id, true);
	},
	'click td .check': function(event){
		event.preventDefault();

		console.log($('#newDocent').is(':checked'));
		if ($('#newDocent').is(':checked')) {
			Meteor.call('addNewRoleToUser', this._id, 'docent', function(err) {
				if (err) {
					console.log(err);
				}
			});
		} else {
			Meteor.call('removeUsersFromRoles', this._id, ['docent'], function(err) {
				if (err) {
					console.log(err);
				}
			});
		}

		Session.set("target" + this._id, false);
	},
	'keyup .searchField input': function(event) {
		Session.set('searchQuery', event.currentTarget.value);
	},
	'change .usersSelection': function(e, t){
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


/***********************************************************************************/

var $newSelect,
	$editSelect;

Template.groups.helpers({
	allGroups: function() {
		var results;
		var ording = {};
		var sortding = { sort: { createdAt: -1} };

		if (Session.get('searchQuery') != null || Session.get('searchQuery') != undefined || Session.get('searchQuery') != '') {
			var keyword		= Session.get('searchQuery');
			var query 		= new RegExp(keyword, 'i');
			ording			= {$or: [{'name': query}, {'title': query}, {'institute': query}]}
		}

		if (Session.get('filter') != null || Session.get('filter') != undefined || Session.get('filter') != '') {
			switch(Session.get('filter')) {
				case 'groupInstituut asc':
					sortding = { sort: { 'institute': -1} }
				break;

				case 'groupInstituut desc':
					sortding = { sort: { 'institute': 1} }
				break;

				case 'groupName asc':
					sortding = { sort: { 'name': -1} }
				break;

				case 'groupName desc':
					sortding = { sort: { 'name': 1} }
				break;

				case 'groupTitle asc':
					sortding = { sort: { 'title': -1} }
				break;

				case 'groupTitle desc':
					sortding = { sort: { 'title': 1} }
				break;
			}
		}

		results	= Groups.find(ording, sortding);
		return { results: results };
	},
	editing: function() {
		return Session.get('target' + this._id);
	},
	getTagNames: function(tags) {
		tagNames = [];

		if (tags != null) {
			for (var i = 0; i < tags.length; i++) {
				tagNames.push(' ' + Tags.findOne({ _id: tags[i] }).name);
			}
			return tagNames;
		} else {
			return '-';
		}
	},
	groupImageCount: function() {
		return Images.find({ groupId: this._id }).count();
	},
	selectedInstitute: function(institute) {
		return institute == this.institute ? 'selected' : '';
	},
	studentCount: function(groupId) {
		return Meteor.users.find({ 'profile.groupId': this._id }).count();
	}
});

Template.groups.events({
	'click span.makeNewGroup a': function(event){
		event.preventDefault();

		$('.registerLogin').fadeToggle("slow");
	},
	'click th.filter': function(e) {
		$('th').removeClass('active');

		var filter = e.target.className.replace('filter ', '');
		var filterName = filter.split(' ')[0];

		Session.set('filter', filter);
		$('.' + filterName).toggleClass('desc').toggleClass('asc');
		$(e.target).addClass('active');
	},
	'click td .edit': function(event){
		event.preventDefault();

		var data = [];

		// Session.set('target' + this._id, true);
		Session.set('editGroupId', this._id);
		Session.set('editGroupName', this.name);
		Session.set('editGroupTitle', this.title);
		Session.set('editGroupToken', this.token);
		Session.set('editGroupInstitute', this.institute);
		Session.set('editGroupTags', this.tags);

		var allTags = Tags.find().fetch();
		var data = [];

		for (var i = 0; i < allTags.length; i++) {
			data.push({
				id: allTags[i]['_id'],
				name: allTags[i]['name']
			});
		}

		$editSelect = $(document.getElementById('editTagSelection')).selectize({
			delimiter: ',',
			labelField: "name",
			options: data,
			persist: false,
			plugins: ['remove_button', 'restore_on_backspace'],
			searchField: 'name',
			sortField: 'name',
			valueField: "id"
		});
		var selectize = $editSelect[0].selectize;

		for (var i = 0; i < Session.get('editGroupTags').length; i++) {
			selectize.addItem(Session.get('editGroupTags')[i]);
		}

		$('.editGroup.registerLogin').fadeToggle("slow");
		window.scrollTo(0, 0);
	},
	'click td .delete': function(event){
		event.preventDefault();

		if(confirm('Wil je de groep ' + this.name + ' verwijderen?')) {
			Groups.remove(this._id);
			Notifications.success('FutureBase', 'De groep is verwijderd.');
		}
	},
	'click td .check': function(event){
		event.preventDefault();

		groupNameVar = $('#newName').val();
		groupTitleVar = $('#newTitle').val();
		groupInstituteVar = $('#newInstitute').val();
		groupTokenVar = $('#newToken').val();
		groupTagsVar = [];

		$(".newTags .item").each(function() {
			groupTagsVar.push($(this).attr("data-value"));
		});

		Meteor.call('updateGroup',
			this._id,
			groupNameVar,
			groupTitleVar,
			groupInstituteVar,
			groupTokenVar,
			groupTagsVar, (err, res) => {
				if (!err) {
					Notifications.success('FutureBase', groupNameVar + ' is geüpdated.');
					return Session.set("target" + this._id, false);
				} else {
					console.log(err);
				}
			}
		);
	},	
	'keypress td input': function(event) {
		groupNameVar = $('#newName').val();
		groupTitleVar = $('#newTitle').val();
		groupInstituteVar = $('#newInstitute').val();
		groupTokenVar = $('#newToken').val();
		groupTagsVar = [];

		$(".newTags .item").each(function() {
			groupTagsVar.push($(this).attr("data-value"));
		});

		if (event.keyCode == 13) {
			Meteor.call('updateGroup',
				this._id,
				groupNameVar,
				groupTitleVar,
				groupInstituteVar,
				groupTokenVar,
				groupTagsVar, (err, res) => {
					if (!err) {
						Notifications.success('FutureBase', groupNameVar + ' is geüpdated.');
						return Session.set("target" + this._id, false);
					} else {
						console.log(err);
					}
				}
			);
		}
	},
	'keyup .searchField input': function(event) {

		Session.set('searchQuery', event.currentTarget.value);
	}
});

Template.groups.onRendered(function() {
	var allTags = Tags.find().fetch();
	var data = [];

	for (var i = 0; i < allTags.length; i++) {
		data.push({
			id: allTags[i]['_id'],
			name: allTags[i]['name']
		});
	}

	// $('.newTags').each(function() {
	// 	newSelect = $(this).selectize({
	// 		plugins: ['remove_button', 'restore_on_backspace'],
	// 		delimiter: ',',
	// 		persist: false,
	// 		options: data,
	// 		labelField: "name",
	// 		valueField: "id",
	// 		sortField: 'name',
	// 		searchField: 'name'
	// 	})
	// });
});

Template.makeNewGroup.events({
	'click .close a': function(event){
		event.preventDefault();

		$('.registerLogin').fadeToggle("slow");
	},
	'click #groupSubmit': function(event){
		event.preventDefault();

		groupNameVar = $('#groupName').val();
		groupTitleVar = $('#groupTitle').val();
		groupInstituteVar = $('#groupInstitute').val();
		groupTokenVar = $('#groupToken').val();
		groupTagsVar = [];

		$(".tagsInGroups .item").each(function() {
			groupTagsVar.push($(this).attr("data-value"));
		});

		if (groupNameVar != '' && groupTitleVar != '' && groupInstituteVar != null && groupTokenVar != '') {
			Meteor.call('addGroup',
				groupNameVar,
				groupTitleVar,
				groupInstituteVar,
				groupTokenVar,
				groupTagsVar, function(err, res) {
					if (!err) {
						Notifications.success('FutureBase', groupNameVar + ' is aangemaakt.');
						$('.registerLogin').fadeToggle("slow");

						$('#groupName')[0].value = '';
						$('#groupTitle')[0].value = '';
						$('#groupToken')[0].value = '';
						$('#groupInstitute').prop('selectedIndex', 0);
						var newSelectize = $newSelect[0].selectize;
						newSelectize.clear();
					} else {
						console.log(err);
					}
				}
			);
		} else {
			if (groupNameVar == '') {
				$('#groupName').addClass('required');
			} else {
				$('#groupName').removeClass('required');
			}
			if (groupTitleVar == '') {
				$('#groupTitle').addClass('required');
			} else {
				$('#groupTitle').removeClass('required');
			}
			if (groupInstituteVar == null) {
				$('#groupInstitute').addClass('required');
			} else {
				$('#groupInstitute').removeClass('required');
			}
			if (groupTokenVar == '') {
				$('#groupToken').addClass('required');
			} else {
				$('#groupToken').removeClass('required');
			}
			Notifications.error('FutureBase', 'Vul de benodigde velden in.');
		}
	}
});

Template.makeNewGroup.onRendered(function() {
	var allTags = Tags.find().fetch();
	var data = [];

	for (var i = 0; i < allTags.length; i++) {
		data.push({
			id: allTags[i]['_id'],
			name: allTags[i]['name']
		});
	}

	$newSelect = $('#groupTags').selectize({
		plugins: ['remove_button', 'restore_on_backspace'],
		delimiter: ',',
		persist: false,
		options: data,
		labelField: "name",
		valueField: "id",
		sortField: 'name',
		searchField: 'name'
	});
});

Template.editGroup.helpers({
	editGroupName: function () {
		return Session.get('editGroupName');
	},
	editGroupTitle: function () {
		return Session.get('editGroupTitle');
	},
	editGroupToken: function () {
		return Session.get('editGroupToken');
	},
	editGroupInstitute: function () {
		return Session.get('editGroupInstitute');
	},
	editGroupTags: function () {
		return Session.get('editGroupTags');
	},
});

Template.editGroup.events({
	'click .close a': function(event){
		event.preventDefault();

		// Session.set('target' + this._id, false);
		$('.registerLogin.editGroup').fadeToggle("slow", function() {
			Session.set('editGroupName', false);
			Session.set('editGroupTitle', false);
			Session.set('editGroupToken', false);
			Session.set('editGroupTags', false);
			$editSelect[0].selectize.clear();
		});
	},
	'click #editGroupSubmit': function(event){
		event.preventDefault();

		if ($('#editGroupName').val() != null && $('#editGroupTitle').val() != null && $('#editGroupToken').val() != null) {
			var tagId 		= [];

			$(".editTagsSelector .item").each(function() {
				tagId.push($(this).attr("data-value"));
			});

			Meteor.call('updateGroup',
				Session.get('editGroupId'),
				$('#editGroupName').val(),
				$('#editGroupTitle').val(),
				$('#editGroupInstitute').val(),
				$('#editGroupToken').val(),
				tagId,
				function (error, result) {
					if (!error) {
						$('.registerLogin.editGroup').fadeToggle("slow", function() {
							Session.set('editGroupId', false);
							Session.set('editGroupName', false);
							Session.set('editGroupTitle', false);
							Session.set('editGroupToken', false);
							Session.set('editGroupInstitute', false);
							$editSelect[0].selectize.clear();
						});
					} else {
						console.log(error);
					}
				}
			);
		}
	}
});

/***********************************************************************************/

Template.tags.helpers({
	allTags: function() {
		var results;
		var ording = {};
		var sortding = { sort: { createdAt: -1} };

		if (Session.get('searchQuery') != null || Session.get('searchQuery') != undefined || Session.get('searchQuery') != '') {
			var keyword		= Session.get('searchQuery');
			var query 		= new RegExp(keyword, 'i');
			ording			= {$or: [{'name': query}]}
		}

		if (Session.get('filter') != null || Session.get('filter') != undefined || Session.get('filter') != '') {
			switch(Session.get('filter')) {
				case 'tagName asc':
					sortding = { sort: { 'name': -1} }
				break;

				case 'tagName desc':
					sortding = { sort: { 'name': 1} }
				break;
			}
		}

		results	= Tags.find(ording, sortding);
		return { results: results };
	},
	editing: function() {
		return Session.get('target' + this._id);
	},
	groupsUseTag: function(tagId) {
		var groupList = Groups.find({ tags: { $in : [tagId]} }).fetch();
		var groupNames = '';

		if (groupList.length > 0) {
			for (var i = 0; i < groupList.length; i++) {
				groupNames += groupList[i].name + ', ';
			}
			return groupNames.substring(0, groupNames.length - 2);
		} else {
			return '-';
		}
	},
	offset: function(index) {
		result = index + 1;
		return result;
	}
});

Template.tags.events({
	'click span.makeNewTag a': function(event){
		event.preventDefault();

		$('.registerLogin').fadeToggle("slow");
	},
	'click td .edit': function(event){
		event.preventDefault();

		Session.set('target' + this._id, true);
	},
	'click td .delete': function(event){
		event.preventDefault();

		if(confirm('Wil je de tag "' + this.name + '" verwijderen?')) {
			Meteor.call('deleteTag', this._id);
			Notifications.success('FutureBase', 'De tag is verwijderd.');
		}
	},
	'click td .check': function(event){
		event.preventDefault();

		tagNameVar = $('#newName').val();

		if (tagNameVar != '') {
			$('#newName').removeClass('required');
			tagNameVarLetters = tagNameVar.replace(/[^a-zA-Z]/g, '').toLowerCase();
			same = false;

			var allTags = Tags.find().fetch();

			for (var i = 0; i < allTags.length; i++) {
				if (tagNameVarLetters === allTags[i].name.replace(/[^a-zA-Z]/g, '').toLowerCase()) {
					same = true;
				}
			}

			if (!same) {
				Meteor.call('updateTag',
					this._id,
					tagNameVar, (err, res) => {
						if (!err) {
							Notifications.success('FutureBase','"' + tagNameVar + '" is geüpdated.');
							return Session.set("target" + this._id, false);
						} else {
							console.log(err);
						}
					}
				);
			} else {
				Notifications.error('FutureBase', 'Deze tag bestaat al.');
			}
		} else {
			$('#newName').addClass('required');
			Notifications.error('FutureBase', 'Vul de benodigde velden in.');
		}
	},
	'click th.filter': function(e) {
		$('th').removeClass('active');

		var filter = e.target.className.replace('filter ', '');
		var filterName = filter.split(' ')[0];

		Session.set('filter', filter);
		$('.' + filterName).toggleClass('desc').toggleClass('asc');
		$(e.target).addClass('active');
	},
	'keypress input': function(event){
		tagNameVar = $('#newName').val();

		if (event.keyCode == 13) {
			if (tagNameVar != '') {
				$('#newName').removeClass('required');
				tagNameVarLetters = tagNameVar.replace(/[^a-zA-Z]/g, '').toLowerCase();
				same = false;

				var allTags = Tags.find().fetch();

				for (var i = 0; i < allTags.length; i++) {
					if (tagNameVarLetters === allTags[i].name.replace(/[^a-zA-Z]/g, '').toLowerCase()) {
						same = true;
					}
				}

				if (!same) {
					Meteor.call('updateTag',
						this._id,
						tagNameVar, (err, res) => {
							if (!err) {
								Notifications.success('FutureBase','"' + tagNameVar + '" is geüpdated.');
								return Session.set("target" + this._id, false);
							} else {
								console.log(err);
							}
						}
					);
				} else {
					Notifications.error('FutureBase', 'Deze tag bestaat al.');
				}
			} else {
				$('#newName').addClass('required');
				Notifications.error('FutureBase', 'Vul de benodigde velden in.');
			}
		}
	},
	'keyup .searchField input': function(event) {
		Session.set('searchQuery', event.currentTarget.value);
	}
});

Template.makeNewTag.events({
	'click .close a': function(event){
		event.preventDefault();

		$('.registerLogin').fadeToggle("slow");
	},
	'click #tagSubmit': function(event){
		event.preventDefault();

		tagNameVar = $('#tagName').val();

		if (tagNameVar != '') {
			$('#tagName').removeClass('required');
			tagNameVarLetters = tagNameVar.replace(/[^a-zA-Z]/g, '').toLowerCase();
			same = false;

			var allTags = Tags.find().fetch();

			for (var i = 0; i < allTags.length; i++) {
				if (tagNameVarLetters === allTags[i].name.replace(/[^a-zA-Z]/g, '').toLowerCase()) {
					same = true;
				}
			}

			if (!same) {
				Meteor.call('addTag',
					tagNameVar, (err, res) => {
						if (!err) {
							Notifications.success('FutureBase', tagNameVar + ' is aangemaakt.');
							$('.registerLogin').fadeToggle("slow");

							$('#tagName')[0].value = '';
						} else {
							console.log(err);
						}
					}
				);
			} else {
				Notifications.error('FutureBase', 'Deze tag bestaat al.');
			}
		} else {
			$('#tagName').addClass('required');
			Notifications.error('FutureBase', 'Vul de benodigde velden in.');
		}
	}
});
var data = [],
	$select;

Template.image.helpers({
	// listing all images in the database
	AllImages: function () {
		return Images.find();
	},
	allImageTags: function() {
		var tagsId = Images.find({
			_id: this._id
		}).map(function (tags) {
			return tags.tags
		});

		if (true) {}

		return Tags.find({
			"_id": { "$in": tagsId[0] }
		});
	},
	editing: function() {
		return Session.get('target' + this._id);
	},
	profile: function() {
		if (Router.current().route.getName() == 'profile') {
			return true;
		} else {
			return false;
		}
	}
});

Template.image.events({
	'click .profileActions i.fa-edit': function (e) {
		e.preventDefault();

		var tagsId 		= Groups.find({
			_id: Meteor.user().profile.groupId
		}).map(function (tags) {
			return tags.tags
		});
		var groupTags 	= Tags.find({
			"_id": { "$in": tagsId[0] }
		}).fetch();

		if (groupTags != null) {
			for (var i = 0; i < groupTags.length; i++) {
				data.push({
					id: groupTags[i]['_id'],
					name: groupTags[i]['name']
				});
			}
		}

		$select = $(document.getElementById('editTagSelection')).selectize({
			delimiter: ',',
			labelField: "name",
			options: data,
			persist: false,
			plugins: ['remove_button', 'restore_on_backspace'],
			searchField: 'name',
			sortField: 'name',
			valueField: "id"
		});
		var selectize = $select[0].selectize;

		Session.set('target' + this._id, true);
		Session.set('editId', this._id);
		Session.set('editImage', this.public_id);
		Session.set('editTags', this.tags);
		Session.set('editDescription', this.description);
		Session.set('editUrl', this.sourceURL);
		Session.set('editGps', [ this.gps.split(',')[0], this.gps.split(',')[1] ]);

		for (var i = 0; i < Session.get('editTags').length; i++) {
			selectize.addItem(Session.get('editTags')[i]);
		}
		$('#editLocationSelection').geocomplete("find", this.formatted_address);

		$('.editImage.registerLogin').fadeToggle("slow");
		window.scrollTo(0, 0);
	},
	'click .profileActions i.fa-trash': function (e) {
		e.preventDefault();

		if(confirm('Do you want to delete the image?')) {
			Session.set('target' + this._id, false);
			Images.remove(this._id);
			Notifications.success('FutureBase', 'The image is deleted');
		}
	},
	'click .profileActions i.fa-check': function (e) {
		e.preventDefault();
		
		Session.set('target' + this._id, false);
	}
});

Template.editImage.helpers({
	getImage: function () {
		return Session.get('editImage');
	},
	getTags: function () {
		return Session.get('editTags');
	},
	getDescription: function () {
		return Session.get('editDescription');
	},
	getUrl: function () {
		return Session.get('editUrl');
	},
	getGps: function () {
		return Session.get('editGps');
	}
});

Template.editImage.events({
	'click .close a': function(event){
		event.preventDefault();

		Session.set('target' + this._id, false);
		$('.registerLogin.editImage').fadeToggle("slow", function() {
			Session.set('editImage', false);
			Session.set('editTags', false);
			Session.set('editDescription', false);
			Session.set('editUrl', false);
			Session.set('editGps', false);
			$select[0].selectize.clear();
		});
	},
	'click #imageSubmit': function(event){
		event.preventDefault();

		if ($('#editURL').val() != null && $('#editLocationSelection').val() != null && $('#editDescription').val() != null) {
			var sourceURL 	= $('#editURL').val(),
				tagId 		= [];

			sourceURL.replace('https://', '');
			sourceURL.replace('http://', '');

			$(".editTagsSelector .item").each(function() {
				tagId.push($(this).attr("data-value"));
			});

			Meteor.call('updateImage', 
				Session.get('editId'),
				tagId,
				sourceURL, 
				$('#editFormatted_address')[0].innerHTML, 
				$('#editGps')[0].innerHTML, 
				$('#editDescription').val(), 
				function (error, result) {
					if (!error) {
						Session.set('target' + this._id, false);
						$('.registerLogin.editImage').fadeToggle("slow", function() {
							Session.set('editImage', false);
							Session.set('editTags', false);
							Session.set('editDescription', false);
							Session.set('editUrl', false);
							Session.set('editGps', false);
							$select[0].selectize.clear();
						});
					} else {
						console.log(error);
					}
				}
			);
		}
	}
})

Template.editImage.onCreated(function() {
	this.autorun(function () {
		// Wait for API to be loaded
		if (GoogleMaps.loaded()) {
			$('#editLocationSelection').geocomplete({
				details: ".editLocationSelection"
			});
		}
	});
});

Template.editImage.rendered = function () {
	this.autorun(function () {
		// Wait for API to be loaded
		if (GoogleMaps.loaded()) {
			$('#editLocationSelection').geocomplete({
				details: ".editLocationSelection"
			});
		}
	});
};
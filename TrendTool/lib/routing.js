Router.route('/', function () {
	this.wait(Meteor.subscribe('allImages'));
	this.wait(Meteor.subscribe('allUsers'));
	this.wait(Meteor.subscribe('allGroups'));
	this.wait(Session.set('adminPage', false));
	this.wait(Session.set('pageTitle', 'Home'));

	if (this.ready()) {
		this.render('home');

		if (Session.get('error') != null) {
			Notifications.error('FutureBase', Session.get('error'));

			Session.set('error', null);
		}
	} else {
		this.render('loading');
	}
});

Router.route('/dashboard', function () {
	// add the subscription handle to our waitlist
	this.wait(Meteor.subscribe('allTags'));
	this.wait(Meteor.subscribe('allImages'));
	this.wait(Meteor.subscribe('allGroups'));
	this.wait(Session.set('adminPage', false));
	this.wait(Session.set('pageTitle', 'Dashboard'));

	// this.ready() is true if all items in the wait list are ready
	if (Meteor.userId()) {
		if (this.ready()) {
			this.render('lessonImages');
		} else {
			this.render('loading');
		}
	} else {
		Router.go('/');

		Notifications.error('error', "You aren't logged in yet! Please make sure you have a account.");
	}
});

Router.route('/map', function () {
	this.wait(Meteor.subscribe('allImages'));
	this.wait(Meteor.subscribe('allGroups'));
	this.wait(Meteor.subscribe('allTags'));
	this.wait(Session.set('adminPage', false));
	this.wait(Session.set('pageTitle', 'Map'));

	if (this.ready()) {
		this.render('map');
	} else {
		this.render('loading');
	}
});

Router.route('/profile', function () {
	// add the subscription handle to our waitlist
	this.wait(Meteor.subscribe('allImages'));
	this.wait(Meteor.subscribe('allTags'));
	this.wait(Meteor.subscribe('allGroups'));
	this.wait(Session.set('adminPage', false));
	this.wait(Session.set('pageTitle', 'Profile'));

	// this.ready() is true if all items in the wait list are ready
	if (Meteor.userId()) {
		if (this.ready()) {
			this.render('profile');
		} else {
			this.render('loading');
		}
	} else {
		Router.go('/');
		Notifications.error('error', "You aren't logged in yet! Please make sure you have a account.");
	}
});

Router.route('/admin', function () {
	this.wait(Meteor.subscribe('allUsers'));
	this.wait(Meteor.subscribe('allImages'));
	this.wait(Meteor.subscribe('allGroups'));
	this.wait(Meteor.subscribe('allTags'));
	this.wait(Session.set('adminPage', true));
	this.wait(Session.set('pageTitle', 'Administration'));

	if (Meteor.userId()) {
		this.render('loading');

		// if (Roles.userIsInRole(Meteor.userId(), ['docent'], Roles.GLOBAL_GROUP)) {
			if (this.ready()) {
				this.render('admin');
			} else {
				this.render('loading');
			}
		// } else {
		// 	Router.go('/');
		// 	Session.set('error', 'You have not the right to be here, get out as soon as possible!');
		// }
	} else {
		Router.go('/');
		Notifications.error('error', "You aren't logged in yet! Please make sure you have a account.");
	}
});

Router.route('/admin/groups', function () {
	this.wait(Meteor.subscribe('allUsers'));
	this.wait(Meteor.subscribe('allGroups'));
	this.wait(Meteor.subscribe('allTags'));
	this.wait(Meteor.subscribe('allImages'));
	this.wait(Session.set('adminPage', true));
	this.wait(Session.set('pageTitle', 'Groups'));

	if (Meteor.userId()) {
		this.render('loading');

		// if (Roles.userIsInRole(Meteor.userId(), ['docent'], Roles.GLOBAL_GROUP)) {
			if (this.ready()) {
				this.render('groups');
			} else {
				this.render('loading');
			}
		// } else {
		// 	Router.go('/');
		// 	Session.set('error', 'You have not the right to be here, get out as soon as possible!');
		// }
	} else {
		Router.go('/');
		Notifications.error('error', "You aren't logged in yet! Please make sure you have a account.");
	}
});

Router.route('/admin/tags', function () {
	this.wait(Meteor.subscribe('allTags'));
	this.wait(Meteor.subscribe('allGroups'));
	this.wait(Session.set('adminPage', true));
	this.wait(Session.set('pageTitle', 'Tags'));

	if (Meteor.userId()) {
		this.render('loading');

		// if (Roles.userIsInRole(Meteor.userId(), ['docent'], Roles.GLOBAL_GROUP)) {
			if (this.ready()) {
				this.render('tags');
			} else {
				this.render('loading');
			}
		// } else {
		// 	Router.go('/');
		// 	Session.set('error', 'You have not the right to be here, get out as soon as possible!');
		// }
	} else {
		Router.go('/');
		Notifications.error('error', "You aren't logged in yet! Please make sure you have a account.");
	}
});
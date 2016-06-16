Router.route('/', function () {
	// this.wait(Meteor.subscribe('allImages'));
	this.wait(Meteor.subscribe('allUsers'));
	this.wait(Session.set('pageTitle', 'Home'));

	if (this.ready()) {
		this.render('home');

		if (Session.get('error') != null) {
			Bert.alert({
				message: Session.get('error'),
				type: 'danger',
				style: 'growl-top-right',
				icon: 'fa-close'
			});

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

	// this.ready() is true if all items in the wait list are ready
	if (Meteor.userId()) {
		if (this.ready()) {
			Session.set('pageTitle', 'Dashboard')
			this.render('lessonImages');
		} else {
			this.render('loading');
		}
	} else {
		Router.go('/');

		Bert.alert({
			message: 'Je bent niet ingelogd',
			type: 'danger',
			style: 'growl-top-right',
			icon: 'fa-close'
		});
	}
});

Router.route('/map', function () {
	this.wait(Meteor.subscribe('allImages'));
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

	// this.ready() is true if all items in the wait list are ready
	if (Meteor.userId()) {
		if (this.ready()) {
			Session.set('pageTitle', 'Profiel')
			this.render('profile');
		} else {
			this.render('loading');
		}
	} else {
		Router.go('/');
		Session.set('error', 'Je bent niet ingelogd.');
	}
});

Router.route('/admin', function () {
	if (this.userId()) {
		if (this.ready()) {
			Session.set('pageTitle', 'Administration');
			this.render('admin');
		} else {
			this.render('loading');
		}
	} else {
		Router.go('/');
		Session.set('error', 'Je bent niet ingelogd.');
	}
});



// // Router.configure({
// //   // layoutTemplate: "MasterLayout",
// //   // loadingTemplate: "Loading",
// //   notFoundTemplate: "Maintenance"
// //  blablabla
// // });

// // Router.route('/maintenance', function () {
// //   this.render('Maintenance');
// // });

// Router.route('/', function () {
//   this.render('userUploads');
// });

// Router.route('/users', function() {
//   this.render('userPage')
// });

// Router.route('/dashboard', function () {
//   // add the subscription handle to our waitlist
//   this.wait(Meteor.subscribe('allImageEntriesDB', this.params._id));

//   // this.ready() is true if all items in the wait list are ready

//   if (this.ready()) {
//     this.render('overviewDashboard');
//   } else {
//     this.render('Loading');
//   }
// });

// Router.route('/map', function () {
//   // add the subscription handle to our waitlist
//   this.wait(Meteor.subscribe('allImageEntriesDB', this.params._id));

//   // this.ready() is true if all items in the wait list are ready

//   if (this.ready()) {
//     this.render('mapPage');
//   } else {
//     this.render('Loading');
//   }
// });

// Router.route('/tags', function () {
//   this.render('tagAdministration');
// });
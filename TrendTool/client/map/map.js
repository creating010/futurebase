var markers = [];
var allTags = [];
var globalMap = null;

Session.set("tagFilterArray", []);
Session.set("interestFilterArray", []);
Session.set("BSRFilterArray", []);
Session.set("NFCFilterArray", []);

Template.topBarFilters.helpers({
	// listing all tags in the database
	allClassTags: function() {
		var tagsId = Groups.find({
			_id: Meteor.user().profile.groupId
		}).map(function (tags) {
			return tags.tags
		});

		Session.set('tagFilterArray', Tags.find({
				"_id": { "$in": tagsId[0] }
			}).map(function(tag) {
				return tag._id;
			})
		);

		return Tags.find({
			"_id": { "$in": tagsId[0] }
		});
	},
	allInterests: function() {
		var interests = [];

		interests.push({ 'name': 'Economics & Business Models', 'value': 'econVal' });
		interests.push({ 'name': 'Fashion & Lifestyle', 'value': 'fashionVal' });
		interests.push({ 'name': 'Gadgets & Technology', 'value': 'techVal' });
		interests.push({ 'name': 'Art & Culture', 'value': 'cultureVal' });
		interests.push({ 'name': 'Politics & Democracy', 'value': 'politicsVal' });

		return interests;
	},
	allBSROptions: function() {
		var BSROptions = [];

		BSROptions.push({ 'name': 'Geen', 'value': 'Empty' });
		BSROptions.push({ 'name': 'Blue', 'value': 'Blue' });
		BSROptions.push({ 'name': 'Yellow', 'value': 'Yellow' });
		BSROptions.push({ 'name': 'Green', 'value': 'Green' });
		BSROptions.push({ 'name': 'Red', 'value': 'Red' });

		return BSROptions;
	},
	allNFCOptions: function() {
		var NFCOptions = [];

		NFCOptions.push({ 'name': 'Highly curios', 'value': 'high' });

		return NFCOptions;
	},
	interestIsActive: function() {
		if (_.contains(Session.get('interestFilterArray'), this.toString())) {
			return {checked: true};
		}
	},
	NFCIsActive: function() {
		if (_.contains(Session.get('NFCFilterArray'), this.toString())) {
			return {checked: true};
		}
	},
	BSRIsActive: function() {
		if (_.contains(Session.get('BSRFilterArray'), this.toString())) {
			return {checked: true};
		}
	}
});

Template.topBarFilters.events({
	'click .activeTags input[type=checkbox]': function (event) {
		editTagFilters(this._id);
		createMarkers(globalMap);
	},
	'click .activeInterests input[type=checkbox]': function (event, template) {
		var interests = template.$('.activeInterests input:checked').map(function () {
			return $(this).val();
		});

		Session.set('interestFilterArray', $.makeArray(interests));
		createMarkers(globalMap);
	},
	'click .activeNFC input[type=checkbox]': function (event, template) {
		var NFC = template.$('.activeNFC input:checked').map(function () {
			return $(this).val();
		});

		Session.set('NFCFilterArray', $.makeArray(NFC));
		createMarkers(globalMap);
	},
	'click .activeBSR input[type=radio]': function (event, template) {
		var BSR = template.$('.activeBSR input:checked').map(function () {
			return $(this).val();
		});

		Session.set('BSRFilterArray', $.makeArray(BSR));
		createMarkers(globalMap);
	}
});

function editTagFilters(tag) {
	var tagFilterArray = Session.get("tagFilterArray");
	var newTagFilterArray = [];
	var alreadyIncluded = false;

	for (var i = 0; i < tagFilterArray.length; i++) {
		if(tagFilterArray[i] != tag){
			newTagFilterArray.push(tagFilterArray[i]);
		}
		else {
			alreadyIncluded = true;
		}
	}
	if(tagFilterArray.length == 0 || !alreadyIncluded){
		newTagFilterArray.push(tag);
	}

	Session.set("tagFilterArray", newTagFilterArray);
}

Template.mapView.helpers({
	TrendToolMapOptions: function () {
		// Make sure the maps API has loaded
		if (GoogleMaps.loaded()) {
			// Map initialization options
			return {
				center: new google.maps.LatLng(51.917937,4.487838),
				mapTypeControl: false,
				streetViewControl: false,
				styles: [
					{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [
						{
							"color": "#444444"
						}
						]
					},
					{
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [
						{
							"color": "#f2f2f2"
						}
						]
					},
					{
						"featureType": "poi",
						"elementType": "all",
						"stylers": [
						{
							"visibility": "off"
						}
						]
					},
					{
						"featureType": "road",
						"elementType": "all",
						"stylers": [
						{
							"saturation": -100
						},
						{
							"lightness": 45
						}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [
						{
							"visibility": "simplified"
						}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [
						{
							"visibility": "off"
						}
						]
					},
					{
						"featureType": "transit",
						"elementType": "all",
						"stylers": [
						{
							"visibility": "off"
						}
						]
					},
					{
						"featureType": "water",
						"elementType": "all",
						"stylers": [
						{
							"color": "#46bcec"
						},
						{
							"visibility": "on"
						},
						{
							"saturation": "0"
						},
						{
							"lightness": "60"
						}
						]
					}
					],
				zoom: 7
			};
		}
	}
});

Template.mapView.onCreated(function(){
	// We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('trendToolMarkers', function(map) {
		globalMap = map;
		createMarkers(map);
	});
});

function createMarkers(map) {
	var econFilter = 0,
		fashionFilter = 0,
		techFilter = 0,
		cultureFilter = 0,
		politicsFilter = 0,
		BSRFilter = { $in: [ "Red", "Yellow", "Green", "Blue" ] },
		NFCFilter = 0;
	removeMarkers();

	for (var i = 0; i < Session.get('interestFilterArray').length; i++) {
		switch(Session.get('interestFilterArray')[i]) {
			case 'econVal':
				econFilter = 3;
			break;

			case 'fashionVal':
				fashionFilter = 3;
			break;

			case 'techVal':
				techFilter = 3;
			break;

			case 'cultureVal':
				cultureFilter = 3;
			break;

			case 'politicsVal':
				politicsFilter = 3;
			break;
		}
	}
	for (var i = 0; i < Session.get("NFCFilterArray").length; i++) {
		switch(Session.get("NFCFilterArray")[i]) {
			case 'high':
				NFCFilter = 57;
			break;
		}
	}
	for (var i = 0; i < Session.get("BSRFilterArray").length; i++) {
		switch(Session.get("BSRFilterArray")[i]) {
			case 'Red':
				BSRFilter = "Red";
			break;

			case 'Yellow':
				BSRFilter = "Yellow";
			break;

			case 'Green':
				BSRFilter = "Green";
			break;

			case 'Blue':
				BSRFilter = "Blue";
			break;

			case 'Empty':
				BSRFilter = { $in: [ "Red", "Yellow", "Green", "Blue" ] };
			break;
		}
	}

	Images.find({ 
		'groupId': Meteor.user().profile.groupId,
		'tags': { $in: Session.get("tagFilterArray") },
		'econVal': { $gt: econFilter },
		'fashionVal': { $gt: fashionFilter },
		'techVal': { $gt: techFilter },
		'cultureVal': { $gt: cultureFilter },
		'politicsVal': { $gt: politicsFilter },
		'bsrColor': BSRFilter,
		'nfcValue': { $gt: NFCFilter }
	}).forEach(function (image) {
		if (image.gps) {
			var gpsCordinates = image.gps.split(',');
			var LatLng = new google.maps.LatLng(gpsCordinates[0], gpsCordinates[1]);
			var markerIcon = {
				anchor: new google.maps.Point(11, 32),
				origin: new google.maps.Point(0, 0),
				scaledSize: new google.maps.Size(21, 32),
				size: new google.maps.Size(42, 64),
				url: 'iets.png'
			};
			var marker = new google.maps.Marker({
				position: LatLng,
				// icon: markerIcon,
				map: map.instance,
				id: image._id
			});
			var infowindow = new google.maps.InfoWindow({
				content: Blaze.toHTMLWithData(Template.mapInfoWindow, image),
				maxWidth: 250
			});

			markers.push(marker);
			google.maps.event.addListener(marker, 'click', function () {
				if (!marker.open) {
					infowindow.open(map.instance, marker);
					marker.open = true;
				} else {
					infowindow.close(map.instance, marker);
					marker.open = false;
				}
			});
			google.maps.event.addListener(map.instance, 'click', function () {
				infowindow.close();
				marker.open = false;
			});
		}
	});
}

function removeMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

Template.mapInfoWindow.helpers({
	allImageTags: function() {
		var tagsId = Images.find({
			_id: this._id
		}).map(function (tags) {
			return tags.tags
		});

		return Tags.find({
			"_id": { "$in": tagsId[0] }
		});
	}
});
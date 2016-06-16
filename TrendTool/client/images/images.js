Template.image.helpers({
	// listing all images in the database
	AllImages: function () {
		return Images.find();
	},
	URLis: function (sourceURL) {
		return this.sourceURL == sourceURL;
	}
});
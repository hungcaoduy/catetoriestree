module.exports = function() {
	//schemas
	mongoose = require( 'mongoose' );
	var Keywords = new mongoose.Schema({
	    keyword: String
	});
	var Item = new mongoose.Schema({
	    title: String,
	    description: String,
	    url: String,
	    //image: String,
	    keywords: [Keywords],
	    effectiveDate: Date,
	    createdDate: Date,
	    createdBy: String,
	    updatedDate: Date,
	    updatedBy: String
	});

	return mongoose.model('Item',Item);

}
//a resourceful routing
module.exports = function(mongoose) {
	var ItemModel = require('../models/item')();
	return {
		//get items
		index: function(request, response) {
		    return ItemModel.find(null, null, {skip: 0, limit: 100}, function(err, items) {
		        if (!err) {
		            return response.send(items);
		        } else {
		            return console.log(err);
		        }
		    });
		},
		//insert a new item
		new: function(request, response) {
		    var item = new ItemModel({
		        title: request.body.title,
		        description: request.body.description,
		        effectiveDate: request.body.effectiveDate,
		        keywords: [], //request.body.keywords,
		        createdDate: new Date(),
		        createdBy: 'Unknown',
		        updatedDate: new Date(),
		        updatedBy: 'Unknown'
		    });
		    item.save(function(err) {
		        if (!err) {
		            console.log('created');
		            return response.send(item);
		        } else {
		            return console.log("saving ", item, " got error ", err);
		        }
		    });
		},
		//get a single item by id
		show: function(request, response) {
		    // console.log('request.params:', request.params);
		    return ItemModel.findById(request.params.item, function(err, item) {
		        if (!err) {
		            return response.send(item);
		        } else {
		            return console.log(err);
		        }
		    });
		},
		//Update a item
		update: function( request, response ) {
		    try {
		        return ItemModel.findById( request.params.item, function( err, item ) {
		            item.title = request.body.title;
		            item.description = request.body.description;
		            item.effectiveDate = request.body.effectiveDate;
		            item.keywords = [];//request.body.keywords;
		            item.createdDate = new Date();
		            item.createdBy = 'Unknown';
		            item.updatedDate = new Date();
		            item.updatedBy = 'Unknown';
		            return item.save( function( err ) {
		                if( !err ) {
		                    console.log( 'item updated' );
		                } else {
		                    console.log("updating ", item, " got error ", err);
		                }
		                return response.send( item );
		            });
		        });
		    } catch (exeption) {
		        console.log('something went wrong');
		    } finally {
		        console.log( 'Updating item ' + request.body );
		    }
		},
		//Delete a item
		destroy: function( request, response ) {
		    console.log( 'Deleting item with id: ' + request.params.item );
		    return ItemModel.findById( request.params.item, function( err, item ) {
		        return item.remove( function( err ) {
		            if( !err ) {
		                console.log( 'Item removed' );
		                return response.send( '' );
		            } else {
		                console.log( err );
		            }
		        });
		    });
		}
	};
};
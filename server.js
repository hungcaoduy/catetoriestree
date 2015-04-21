// Module dependencies.
var application_root = __dirname,
express = require( 'express' ), //Web framework
path = require( 'path' ), //Utilities for dealing with file paths
mongoose = require( 'mongoose' ); //MongoDB integration
//Create server
var app = express();
// Configure server
//parses request body and populates request.body
app.use( express.bodyParser() );
//checks request.body for HTTP method overrides
app.use( express.methodOverride() );
//perform route lookup based on URL and HTTP method
app.use( app.router );
//Where to serve static content
var staticContentPath = path.join( application_root, 'public');
console.log(staticContentPath);
app.use( express.static( staticContentPath ) );
//Show all errors in development
app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
// app.configure( function() {
// });
//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode',
        port, app.settings.env );
});

//routes
//get items
app.get('/api/items', function(request, response) {
    return ItemModel.find(null, null, {skip: 0, limit: 100}, function(err, items) {
        if (!err) {
            return response.send(items);
        } else {
            return console.log(err);
        }
    });
});
//insert a new item
app.post('/api/items', function(request, response) {
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
});
//get a single item by id
app.get('/api/items/:id', function(request, response) {
    return ItemModel.findById(request.params.id, function(err, item) {
        if (!err) {
            return response.send(item);
        } else {
            return console.log(err);
        }
    });
});
//Update a item
app.put( '/api/items/:id', function( request, response ) {
    console.log( 'Updating item ' + request.body.title );
    return ItemModel.findById( request.params.id, function( err, item ) {
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
});
//Delete a item
app.delete( '/api/items/:id', function( request, response ) {
    console.log( 'Deleting item with id: ' + request.params.id );
    return ItemModel.findById( request.params.id, function( err, item ) {
        return item.remove( function( err ) {
            if( !err ) {
                console.log( 'Item removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
});
//connect to database
mongoose.connect('mongodb://localhost/links_database');

//schemas
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

//models
var ItemModel = mongoose.model('Item',Item);

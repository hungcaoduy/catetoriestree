// Module dependencies.
var application_root = __dirname,
express = require( 'express' ), //Web framework
path = require( 'path' ), //Utilities for dealing with file paths
mongoose = require( 'mongoose' ); //MongoDB integration

var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var session = require('express-session');
//Create server
var app = express();
// Configure server
//to handdle session
app.use(express.cookieParser());
app.use(session({
    // genid: function(request) {
    //     return genuuid();
    // },
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard',
    //store: new MemoryStore()
}));
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
//get models from external files
var config = {
    mail: require('./config/mail')
}

var User = require('./models/user')(config, mongoose, nodemailer);
var ItemModel = require('./models/item')(mongoose);
var UserModel = User.model;
//connect to database
mongoose.connect('mongodb://localhost/mylinks_database');

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
    try {
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
    } catch (exeption) {
        console.log('something went wrong');
    } finally {
        console.log( 'Updating item ' + request.body );
    }
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

var authRoutes = require('./routes')(app, User);
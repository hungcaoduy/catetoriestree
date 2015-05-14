"use restricted";

// Module dependencies.
var application_root = __dirname,
express = require( 'express' ), //Web framework
path = require( 'path' ), //Utilities for dealing with file paths
mongoose = require( 'mongoose' ); //MongoDB integration

var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var session = require('express-session');

// Load express-resource BEFORE app is instantiated
var resource = require('express-resource');

//Create server
var app = express();

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

//connect to database
mongoose.connect('mongodb://localhost/mylinks_database');

//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode',
        port, app.settings.env );
});



var routes = require('./routes')(app, config, mongoose, nodemailer);
var itemsHandler = require('./handlers/items')(mongoose);
app.resource('items', itemsHandler);

module.exports = function(app, config, mongoose, nodemailer) {
	var User = require('./models/user')(config, mongoose, nodemailer);

	//The use of modular routing
	//1.load the handler
	var auth = require('./handlers/authentication.js')(User);
	//2.define the routes
	app.post('/register', auth.register);
	app.post('/login', auth.login);
	app.post('/forgotpassword', auth.forgotpassword);
	app.get('/resetPassword', auth.resetPassword);

	
	app.get('/', function(req, res){
	  res.render('index.jade');
	});

};
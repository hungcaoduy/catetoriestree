module.exports = function(app, User) {
	//load the handler
	var auth = require('./handlers/authentication.js')(User);
	//define the routes
	app.post('/register', auth.register);
	app.post('/login', auth.login);
	app.post('/forgotpassword', auth.forgotpassword);
	app.get('/resetPassword', auth.resetPassword);
};
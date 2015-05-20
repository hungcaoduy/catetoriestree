var loginTpl = require('./templates/login.jade');
var globalItemChannel = window.globalItemChannel;
var LoginView = Marionette.ItemView.extend({
	template: loginTpl,
	events: {
		'submit form': 'login'
	},
	login: function() {
		$.post('/login', {
			email: $('input[name=email]').val(),
			password: $('input[name=password]').val()
		}, function(data) {
			console.log(data);
			// App.start();
			Backbone.history.navigate('http://localhost:4711/home');
	        /*var header = require('scripts/apps/header/list/listController');
	        header.listHeader();
	        globalItemChannel.commands.execute('list:items');*/


		}).error(function() {
			$('#error').text('Unable to login');
			$('#error').slideDown();
		});
		return false;
	}
});
module.exports = LoginView;
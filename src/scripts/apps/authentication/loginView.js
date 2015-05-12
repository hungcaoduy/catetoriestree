var loginTpl = require('./templates/login.jade');
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
		}).error(function() {
			$('#error').text('Unable to login');
			$('#error').slideDown();
		});
		return false;
	}
});
module.exports = LoginView;
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
			globalItemChannel.commands.execute('go:authenticated', true);
			this.trigger('dialog:close');
		}).error(function() {
			$('#error').text('Unable to login');
			$('#error').slideDown();
		});
		return false;
	}
});
module.exports = LoginView;
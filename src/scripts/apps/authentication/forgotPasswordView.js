var tpl = require('./templates/forgotPassword.jade');
var view = Marionette.ItemView.extend({
	template: tpl,
	events: {
		'submit form': 'forgot'
	},
	forgot: function(e) {
		$.post('/forgotpassword', {
			email: $('input[name=email]').val()
		}, function(data) {
			console.log(data);
		});
		return false;
	}
});
module.exports = view;
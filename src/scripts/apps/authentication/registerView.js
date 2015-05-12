var registerTpl = require('./templates/register.jade');
var registerView = Marionette.ItemView.extend({
	template: registerTpl,
	events: {
		'submit form': 'register'
	},
	register: function() {
		console.log('submit register now');
		$.post('/register', {
			firstName: $('input[name=firstName]').val(),
			lastName: $('input[name=lastName]').val(),
			email: $('input[name=email]').val(),
			password: $('input[name=password]').val()
		}, function(data) {
			console.log(data);
		});
		return false;
	}
});
module.exports = registerView;
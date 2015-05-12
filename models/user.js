module.exports = function(config, mongoose, nodemailer) {
	var crypto = require('crypto');

	var Status = new mongoose.Schema({
		name: {
			first: {type: String},
			last: {type: String}
		},
		status: {type: String}
	});

	var UserSchema = new mongoose.Schema({
		// email: {type: String, unique: true},
		email: {type: String},
		password: {type: String},
		name: {
			first: {type: String},
			last: {type: String}
		},
		birthday: {
			day: {type: Number, min: 1, max: 31, required: false},
			month: {type: Number, min: 1, max: 12, required: false},
			year: {type: Number}
		},
		photoUrl: {type: String},
		biography: {type: String},
		status: [Status],
		activity: [Status]
	});

	var User = mongoose.model('User', UserSchema);

	var registerCallback = function(err) {
		if(err) {
			return console.log(err);
		};
		return console.log('User was created');
	};

	var login = function(email, password, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		User.findOne({email: email, password: shaSum.digest('hex')}, function(err, doc) {
			// callback(null!=doc)
			callback(doc);
		});
	};

	var findById = function(userId, callback) {
		User.findOne({_id: userId}, function(err, doc) {
			callback(doc);
		});
	};

	var register = function(email, password, firstName, lastName) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);

		console.log('Registering' + email);
		var user = new User({
			email: email,
			name: {
				first: firstName,
				last: lastName
			},
			password: shaSum.digest('hex')
		});
		user.save(registerCallback);
		console.log('Save command was sent');
	};

	var changePassword = function(userId, newpassword) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(newpassword);
		var hashedPassword = shaSum.digest('hex');
		User.update(
				{_id: userId}, 
				{$set: {password: hashedPassword}}, 
				{upsert: false},
				function changePasswordCallback(err) {
					console.log('Change password done for user ' + userId);
				}
			);
	};

	var forgotPassword = function(email, resetPasswordUrl, callback) {
		var user = User.findOne({email: email}, function findUser(err, doc) {
			if (err) {
				callback(false);
			} else {
				//nodemailer: is tight?
				var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
				resetPasswordUrl += '?user=' + doc._id;
				console.log('resetPasswordUrl:', resetPasswordUrl);
				console.log('doc:', doc);
				smtpTransport.sendMail({
					from: 'hungcdqt@gmail.com',
					to: doc.email,
					subject: 'test email- forgot password',
					text: 'Click here to reset your password: '+ resetPasswordUrl
				}, function forgotPasswordResult(err) {
					if (err) {
						console.log('send email get error:', err);
						callback(false);
					} else {
						callback(true);
					}
				});
			}
		});
	}

	return {
		register: register,
		login: login,
		forgotPassword: forgotPassword,
		findById: findById,
		model: User
	};
}
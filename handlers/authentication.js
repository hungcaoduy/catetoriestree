module.exports = function(User) {
    return {
        register: function(request, response) {
            
            var firstName = request.param('firstName', ''),
                lastName = request.param('lastName', ''),
                email = request.param('email', ''),
                password = request.param('password', null);

            if (!email || !password ){
                response.send(400);
                return;
            };
            User.register(email, password, firstName, lastName);
            response.send(200);
            console.log('get a register of ', firstName + ' - ' + lastName);
        },

        login: function(request, response){
            var email = request.param('email', null),
                password = request.param('password', null);

            if (!email || email.length < 1 || !password || password.length < 1) {
                response.send(400);
                return;
            };

            User.login(email, password, function(user) {
                if (!user) {
                    response.send(401);
                    return;
                };
                console.log('login was successful', request);
                request.session.loggedIn = true;
                request.session.userId = user._id;
                response.send(200);
            })
        },

        forgotpassword: function(request, response) {
            var email = request.param('email', null),
                hostname = request.headers.host,
                resetPasswordUrl = 'http://' + hostname + '/resetPassword';
            
            if (!email || email.length < 1) {
                response.send(400);
                return;
            }
            console.log('receiving a forgotPassword request');
            User.forgotPassword(email, resetPasswordUrl, function(success) {
                if (success) {
                    response.send(200);
                } else {
                    response.send(404);
                }
            });
        },

        resetPassword: function(request, response) {
            var userId = request.param('user', null);
            response.render('resetPassword.jade', {locals: {userId: userId}});
        }
    }
}
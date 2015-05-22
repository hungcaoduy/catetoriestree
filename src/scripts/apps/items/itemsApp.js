var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

var Dialog = require('scripts/common/dialog');
var App = new Marionette.Application();

App.addRegions({
    headerRegion: '#header-region',
    mainRegion: '#main-region',
    dialogRegion: Dialog.extend({
        el: '#dialog-region'
    }),
    utilityReion: '#utilitymenu-region',
    userRegion: '#user-region'
});

App.navigate = function(route,  options){
    console.log('route: ', route);
    options || (options = {});
    if (!options.trigger) _.extend(options, {trigger: true});
    Backbone.history.navigate(route, options);
};

App.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

var executeAction = function(action, arg){
    action(arg);
};


App.Router = Marionette.AppRouter.extend({
    appRoutes: {
        'items': 'listItems',
        'items/new': 'newItem',
        'items/:id': 'showItem',
        'items/:id/edit': 'editItem',
        'register': 'showRegister',
        'login': 'showLogin',
        'forgotpassword': 'showForgotpassword'
    },
    onRoute: function(name, path, arguments) {
        console.log('name, path, arguments:', name, path, arguments);
    }
});

var globalItemChannel = window.globalItemChannel = require('../../common/channels').globalItemChannel;

globalItemChannel.commands.setHandler('list:items', function() {
    App.navigate('items');
});


globalItemChannel.commands.setHandler('show:item', function(item) {
    var id = item.id;
    App.navigate('items/' + id);
});

globalItemChannel.commands.setHandler('edit:item', function(item) {
    var id = item.id;
    App.navigate('items/' + id + '/edit');
});

globalItemChannel.commands.setHandler('new:item', function() {
    console.log('I catch item:new, App say');
    App.navigate('items/new');
});

globalItemChannel.commands.setHandler('save:item', function(args) {
    args.model.set(args.data);
    args.model.save();
});


globalItemChannel.commands.setHandler('show:main', function(layoutView) {
    // console.log('about to show ', layoutView);
    App.mainRegion.show(layoutView);
});

globalItemChannel.commands.setHandler('show:dialog', function(view) {
    console.log('about to show dialog');
    App.dialogRegion.show(view);
});

globalItemChannel.commands.setHandler('show:header', function(view) {
    console.log('about to show header');
    App.headerRegion.show(view);
});

globalItemChannel.commands.setHandler('show:utility', function(view) {
    App.utilityReion.show(view);
});

globalItemChannel.commands.setHandler('show:user', function(view) {
    App.userRegion.show(view);
});

globalItemChannel.commands.setHandler('go:back', function() {
    window.history.back();
});

globalItemChannel.commands.setHandler('go:to', function(url) {
    checkLogin(whatRoute);
});

globalItemChannel.commands.setHandler('go:authenticated', function(authenticated) {
    whatRoute(authenticated);
});

App.addInitializer(function() {
    new App.Router({
        controller: API
    });
});

App.on('start', function(){
    console.log('App starting');
    // checkLogin(whatRoute);
    if (Backbone.history && !Backbone.History.started) Backbone.history.start({pushstate: true});
});

var checkLogin = function (callback) {
    $.get('/authenticated', function (data) {
        // console.log('get:', data);
    }).done(function(data) {
        console.log('done', data);
        callback(true);
    }).fail(function(err) {
        console.log('not authenticated!');
        callback(false);
    }).always(function() {
        console.log('good bye');
    });
}

var updateHeader = function(authenticated) {
    if (authenticated) {
        var header = require('scripts/common/action/listController');
        // header.list('action:entities','show:header');
        header.list('filter:entities','show:utility');        
    }
}

var whatRoute = function(authenticated) {
    if (authenticated)     {
        // window.location.hash = 'index';
        globalItemChannel.commands.execute('list:items');
    } else {
        window.location = 'http://localhost:4711/home';
    }
    updateHeader(authenticated);
}

var API = {
    listItems: function(criterion) {
        var ListController = require('scripts/apps/items/list/listController');
        executeAction(ListController.listItems, criterion);
    },
    showItem: function(id) {
        var showController = require('scripts/apps/items/show/showController');
        executeAction(showController.showItem, id);
    },
    editItem: function(id) {
        var editController = require('scripts/apps/items/edit/editController');
        executeAction(editController.editItem, id);
    },
    newItem: function() {
        var newController = require('scripts/apps/items/new/newController');
        executeAction(newController.newItem);
    },
    showRegister: function() {
        var RegisterView = require('scripts/apps/authentication/registerView');
        var rview = new RegisterView();
        globalItemChannel.commands.execute('show:dialog', rview);
    },
    showLogin: function() {
        var LoginView = require('scripts/apps/authentication/loginView');
        var lview = new LoginView();
        globalItemChannel.commands.execute('show:main', lview);
    },
    showForgotpassword: function() {
        var ForgotPasswordView = require('scripts/apps/authentication/forgotPasswordView');
        var fview = new ForgotPasswordView();
        globalItemChannel.commands.execute('show:dialog', fview);
    }
};


module.exports = App;
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
    })
});

App.navigate = function(route,  options){
    options || (options = {});
    if (!options.trigger) _.extend(options, {trigger: true});
    Backbone.history.navigate(route, options);
};

App.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

var executeAction = function(action, arg){
    action(arg);
    // App.execute('set:active:header', 'items');
};


App.Router = Marionette.AppRouter.extend({
    appRoutes: {
        'items': 'listItems',
        'items/new': 'newItem',
        'items/:id': 'showItem',
        'items/:id/edit': 'editItem'
    },
    onRoute: function(name, path, arguments) {
        console.log('name, path, arguments:', name, path, arguments);
    }
});
var API = {
    listItems: function(criterion) {
        var ListController = require('scripts/apps/items/list/listController');
        executeAction(ListController.listItems, criterion);
        // executeAction(ListController.gridItems, criterion);
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
    }
};

var globalItemChannel = window.globalItemChannel = require('../../common/channels').globalItemChannel;

globalItemChannel.commands.setHandler('list:items', function() {
    App.navigate('items');
});


globalItemChannel.commands.setHandler('show:item', function(item) {
    var id = item.id;
    App.navigate('items/' + id);
    // API.showItem(id);
});

globalItemChannel.commands.setHandler('edit:item', function(item) {
    var id = item.id;
    App.navigate('items/' + id + '/edit');
});

globalItemChannel.commands.setHandler('new:item', function() {
    console.log('I catch item:new, App say');
    App.navigate('items/new');
    // API.newItem();
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

globalItemChannel.commands.setHandler('go:back', function() {
    window.history.back();
})

App.addInitializer(function() {
    new App.Router({
        controller: API
    });
});


App.on('start', function(){
    if(Backbone.history){
        Backbone.history.start();
        if(App.getCurrentRoute() === ''){
            globalItemChannel.commands.execute('list:items');
        }

        var header = require('scripts/apps/header/list/listController');
        header.listHeader();
    }
});

module.exports = App;

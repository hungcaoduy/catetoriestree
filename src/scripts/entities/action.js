var globalHeaderChannel = require('scripts/common/channels').globalHeaderChannel;

var Entities = {};
Entities.Header = Backbone.Model.extend({
    initialize: function(){
        var selectable = new Backbone.Picky.Selectable(this);
        _.extend(this, selectable);
    }
});

Entities.HeaderCollection = Backbone.Collection.extend({
    model: Entities.Header,

    initialize: function(){
        var singleSelect = new Backbone.Picky.SingleSelect(this);
        _.extend(this, singleSelect);
    }
});

var initialize = function(name){
    switch(name) {
        case 'headers':
            Entities.headers = new Entities.HeaderCollection([
                { name: "Home", url: "", navigationTrigger: "" },
            ]);
            break;
        case 'actions':
            Entities.actions = new Entities.HeaderCollection([
                { name: "New", url: "items/new", navigationTrigger: "new:item" },
                { name: "List", url: "items", navigationTrigger: "list:items" },
                { name: "About", url: "about", navigationTrigger: "about:show" }
            ]);
            break;
        case 'filters':
            Entities.filters = new Entities.HeaderCollection([
                { name: "Favorites", url: "items/favorites", navigationTrigger: "items:favorites" },
                { name: "Articles", url: "items/articles", navigationTrigger: "items:articles" },
                { name: "Images", url: "items/images", navigationTrigger: "items:images" }
            ]);        
    }
};

var API = {
    getHeaders: function(){
        if(Entities.headers === undefined){
            initialize('headers');
        }
        return Entities.headers;
    },
    getFilters: function(){
        if(Entities.filters === undefined){
            initialize('filters');
        }
        return Entities.filters;
    },
    getActions: function(){
        if(Entities.actions === undefined){
            initialize('actions');
        }
        return Entities.actions;
    }
};

globalHeaderChannel.reqres.setHandler("header:entities", function(){
    return API.getHeaders();
});

globalHeaderChannel.reqres.setHandler("filter:entities", function(){
    return API.getFilters();
});

globalHeaderChannel.reqres.setHandler("action:entities", function(){
    return API.getActions();
});

module.exports = globalHeaderChannel;

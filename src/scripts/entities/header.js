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

var initializeHeaders = function(){
    Entities.headers = new Entities.HeaderCollection([
        { name: "New", url: "items/new", navigationTrigger: "new:item" },
        { name: "List", url: "items", navigationTrigger: "list:items" },
        { name: "About", url: "about", navigationTrigger: "about:show" }
    ]);
};

var API = {
    getHeaders: function(){
        if(Entities.headers === undefined){
            initializeHeaders();
        }
        return Entities.headers;
    }
};

globalHeaderChannel.reqres.setHandler("header:entities", function(){
    return API.getHeaders();
});

module.exports = globalHeaderChannel;

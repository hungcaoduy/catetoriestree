var headerChannel = require('scripts/entities/action');
var globalItemChannel = window.globalItemChannel;
var View = require('./listView');
module.exports = {
	list: function(listRequest, command2exec) {
        var links = headerChannel.reqres.request(listRequest);
        var listView = new View.Headers({collection: links});

        listView.on('brand:clicked', function(){
            // App.trigger('items:list');
            // globalItemChannel.commands.execute('list:item');
        });

        listView.on('childview:navigate', function(childView, model){
            var trigger = model.get('navigationTrigger');
            globalItemChannel.commands.execute(trigger);
        });

        globalItemChannel.commands.execute(command2exec, listView); //commands: 'show:header', 'show:filter'
	},
    setActive: function(headerUrl){
        var links = headerChannel.reqres.request('header:entities');

        var headerToSelect = links.find(function(header){ return header.get('url') === headerUrl; });

        headerToSelect.on('select', function() {
        	// console.log('I am selected');
        });

		var SelectableModel = Backbone.Model.extend({
		  initialize: function(){
		    var selectable = new Backbone.Picky.Selectable(this);
		    _.extend(this, selectable);
		  }
		});

        links.select(headerToSelect);
        links.trigger('reset');
    }
};
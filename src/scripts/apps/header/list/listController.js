var headerChannel = require('scripts/entities/header');
var globalItemChannel = window.globalItemChannel;
var View = require('./listView');
module.exports = {
	listHeader: function() {
        var links = headerChannel.reqres.request('header:entities');
        var headers = new View.Headers({collection: links});

        headers.on('brand:clicked', function(){
            // App.trigger('items:list');
            globalItemChannel.commands.execute('list:item');

        });

        headers.on('childview:navigate', function(childView, model){
            var trigger = model.get('navigationTrigger');
            // App.trigger(trigger);
            globalItemChannel.commands.execute(trigger);
        });

        // App.headerRegion.show(headers);
        globalItemChannel.commands.execute('show:header', headers);
	},
    setActiveHeader: function(headerUrl){
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

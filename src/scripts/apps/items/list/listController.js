View = require('./listView');
module.exports = {
    listItems: function(criteria) {
        var itemChannel = require('scripts/entities/item');
        var fetchingItems = itemChannel.reqres.request("item:entities");
        var globalItemChannel = window.globalItemChannel;
        var layoutView = new View.Layout();
        var panelView = new View.Panel();
        var listViewPrepared = $.Deferred();
        var layoutViewShown = $.Deferred();

        panelView.on('item:new', function() {
            console.log("about to add new item");
            globalItemChannel.commands.execute('new:item');
        });

        layoutView.on('childview:item:new', function() {
            console.log('catch item:new from childview, about to delegate to App');
            globalItemChannel.commands.execute('new:item');
        });

        layoutView.on('before:show', function() {
            layoutViewShown.resolve(layoutView);
        });

        $.when(layoutViewShown).done(function(layoutView){
            layoutView.showChildView('panelRegion', panelView);
        });

        $.when(layoutViewShown, listViewPrepared).done(function(layoutView, itemListView) {
            layoutView.showChildView('listRegion', itemListView);
        });

        globalItemChannel.commands.execute('show:main', layoutView);

        $.when(fetchingItems).done(function(items){
            console.log('item:', items);
            var common = require('scripts/entities/common');
            var filteredItems = new common.FilteredCollection({
                collection: items,
                filterFunction: function(filterCriterion) {
                    var criterion = filterCriterion.toLowerCase();
                    return function (item) {
                        if (item.get("title").toLowerCase().indexOf(criterion) !== -1 ||
                            item.get("description").toLowerCase().indexOf(criterion) !== -1) {
                            return item;
                        }
                    };
                }
            });
            var itemListView = new View.Items({collection: items});
            // var itemListView = new View.Items({collection: filteredItems});
            // var itemListView = new View.Grid({collection: items});

            itemListView.on('childview:item:show', function(childView) {
                globalItemChannel.commands.execute('show:item', {model: childView.model, id: childView.model.id});
            });

            itemListView.on('childview:item:edit', function(childView) {
                globalItemChannel.commands.execute('edit:item', {model: childView.model, id: childView.model.id});
            });

            itemListView.on('childview:item:delete', function(childView) {
                childView.model.destroy();
            });

            /*panelView.on('item:filter', function(criterion) {
                filteredItems.filter(criterion);
                console.log('items is filtered');
            });*/

            itemListView.listenTo(panelView, 'item:filter', function(criterion) {
                filteredItems.filter(criterion);
            });

            listViewPrepared.resolve(itemListView);
        });
    },
    gridItems: function(criteria) {
        var itemChannel = require('scripts/entities/item');
        // console.log('channels:', itemChannel);
        var fetchingItems = itemChannel.reqres.request("item:entities");
        var globalItemChannel = window.globalItemChannel;

        $.when(fetchingItems).done(function(items){
            var gridView = new View.Grid({collection: items});
            globalItemChannel.commands.execute('show:main', gridView);
        });
    },
    newItem: function() {
        console.log('now we actually new');
        var newItemView = new NewItemView();
        App.dialogRegion.show(newItemView);
    }
};

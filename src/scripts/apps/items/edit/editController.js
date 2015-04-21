var View = require('./editView');
var itemChannel = require('scripts/entities/item');
var globalChannel = window.globalItemChannel;
var Controller = {
    editItem: function(itemId) {
        var fetchingItem = itemChannel.reqres.request("item:entity", itemId);
        $.when(fetchingItem)
        .done(function(item){
            var itemView;
            console.log('item to be shown', item);
            if(item !== undefined){
                itemView = new View.Item({
                    model: item
                });
                itemView.on('item:save', function(data) {
                    data.model.set(data.data);
                    data.model.save();
                });
            }
            else {
                itemView = new View.MissingItem();
            }

            // App.dialogRegion.show(itemView);
            console.log('showing item view for item with id=', itemId);
            globalChannel.commands.execute('show:dialog', itemView);
        });
    }
};
module.exports = Controller;

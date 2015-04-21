var View = require('./newView');
var itemDataChannel = require('scripts/entities/item');
var globalItemChannel = window.globalItemChannel;
module.exports = {
    newItem: function() {
        var fetchingItem = itemDataChannel.reqres.request("item:entity:new");
        $.when(fetchingItem).done(function(item){
            var itemView;
            if(item !== undefined){
                item.set('effectiveDate', new Date().getTime());
                itemView = new View.Item({
                    model: item
                });
                itemView.on('item:save', function(data) {
                    console.log('data to save ', data);
                    data.model.set(data.data);
                    data.model.save();
                });
                globalItemChannel.commands.execute('show:dialog', itemView);
            } else {
                console.log('Item could not be resolved');
            }
        });
    }
};
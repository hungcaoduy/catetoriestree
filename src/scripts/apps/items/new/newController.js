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
                globalItemChannel.commands.execute('show:dialog', itemView);
            } else {
                console.log('Item could not be resolved');
            }
        });
    }
};
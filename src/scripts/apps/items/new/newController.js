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
                    data.model.set(data.data);
                    data.model.save();

                    var fetchAnotherItem = itemDataChannel.reqres.request("item:entity:new");
                    $.when(fetchAnotherItem).done(function(anotherItem) {
                        itemView.model = anotherItem;
                        itemView.render();
                    });
                });
                globalItemChannel.commands.execute('show:dialog', itemView);
            } else {
                console.log('Item could not be resolved');
            }
        });
    }
};

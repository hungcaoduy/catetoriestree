var View = require('./showView');
var globalItemChannel = window.globalItemChannel;
var itemDataChannel = require('scripts/entities/item');
module.exports = {
    showItem: function(id) {
        var fetchingItem = itemDataChannel.reqres.request("item:entity", id);
        $.when(fetchingItem).done(function(item){
            var itemView;
            if(item !== undefined){
                itemView = new View.Item({
                    model: item
                });
            }
            else {
                itemView = new View.MissingItem();
            }
            globalItemChannel.commands.execute('show:main', itemView);
        });
    }
};
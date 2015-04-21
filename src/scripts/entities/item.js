Options = require('../apps/config/options');
configureStorage = require('../apps/config/storage/localstorage');
// itemChannel = require('../common/channels');
var itemChannel = require('../common/channels').itemDataChannel;

var Item = Backbone.Model.extend({
    defaults: {
        title: 'default title',
        description: 'Unknown',
        url: 'Unknown',
        image: 'img/placeholder.jpg',
        keywords: 'None',
        effectiveDate: new Date(2015,02,01).getTime(),
        createdDate: 'Unknown',
        createdBy: 'Unknown',
        updatedDate: 'Unknown',
        updatedBy: 'Unknown'
    },
    initialize: function(options) {
        // console.log('Item is initialized!', this);
    },
    idAttribute: '_id',
    urlRoot: function() {
        return Options.itemUrl(); // + '/' + this._id;
        // console('this isNew?', this.id, this.isNew);
        /*if (!this.id){
            return Options.itemUrl();
        } else {
            return Options.itemUrl() + '/' + this.id;
        }*/
    }
});

var ItemCollection = Backbone.PageableCollection.extend({
// ItemCollection = Backbone.Collection.extend({
    model: Item,
    url: function() {
        return Options.itemUrl();
    },
    comparator: 'title',
    mode: 'client',
    state: {
        firstPage: 0,
        pageSize: 2,
        currentPage: 0
    },
    hasPrevious: function() {
        return this.hasPreviousPage();
    },

    hasNext: function() {
        return this.hasNextPage();
    },

    // Get total records
    parseState: function(res) {
        return {
        totalRecords: res.totalEntries
        };
    }/*,

    // Get data of page that we want to get
    parseRecords: function(res) {
        var results = res.results || [];

        return results;
    }*/

});

if (Options.isOffline) {
    configureStorage(Item);
    configureStorage(ItemCollection);
}

var initializeItems = function(){
    console.log('initializing data');
    var items = new ItemCollection([
        {_id: 1, title: 'JavaScript', description: 'Unknown', url: 'Unknown', image: 'img/placeholder.jpg', keywords: 'No ne', effectiveDate: new Date(2015,02,01).getTime(), createdDate: new Date(2015,02,01).getTime(), createdBy: 'Unknown', updatedDate: new Date(2015,02,01).getTime(), updatedBy: 'Unknown' },
        {_id: 2, title: 'Backbone', description: 'Unknown', url: 'Unknown', image: 'img/placeholder.jpg', keywords: 'N one', effectiveDate: new Date(2015,02,01).getTime(), createdDate: new Date(2015,02,01).getTime(), createdBy: 'Unknown', updatedDate: new Date(2015,02,01).getTime(), updatedBy: 'Unknown' },
        {_id: 3, title: 'Marionette', description: 'Unknown', url: 'Unknown', image: 'img/placeholder.jpg', keywords: 'Non e', effectiveDate: new Date(2015,02,01).getTime(), createdDate: new Date(2015,02,01).getTime(), createdBy: 'Unknown', updatedDate: new Date(2015,02,01).getTime(), updatedBy: 'Unknown' },
        {_id: 4, title: 'Gulp', description: 'Unknown', url: 'Unknown', image: 'img/placeholder.jpg', keywords: 'yes i am', effectiveDate: new Date(2015,02,01).getTime(), createdDate: new Date(2015,02,01).getTime(), createdBy: 'Unknown', updatedDate: new Date(2015,02,01).getTime(), updatedBy: 'Unknown' }
    ]);
    items.forEach(function(item){
        item.save();
    });
    console.log(items.models);
    return items.models;
};

var API = {
    getItemEntities: function(){
        console.log('geting item:entities');
        var items = new ItemCollection();

        var defer = $.Deferred();
        items.fetch({
            success: function(data){
                defer.resolve(data);
            }
        });
        var promise = defer.promise();
        $.when(promise).done(function(items){
            if(items.length === 0){
                // if we don't have any items yet, create some for convenience
                var models = initializeItems();
                items.reset(models);
            }
        });
        return promise;
    },

    getItemEntity: function(itemId){
        console.log('this is itemid', itemId);

        // var item = new Item({id: itemId, url: '/api/items/' + itemId});
        var item = new Item({_id: itemId});
        console.log('getting item with id=', itemId, item.url(), item);
        var defer = $.Deferred();
        item.fetch({
            success: function(data){
                defer.resolve(data);
                console.log('getItemEntity, data', data);
            },
            error: function(data){
                console.log('item is NOT fetched, something wrong');
                defer.resolve(undefined);
            }
        });
        return defer.promise();
    }
};

itemChannel.reqres.setHandler('item:entities', function() {
    console.log('serve the item:entities data request now!');
    return API.getItemEntities();
});
itemChannel.reqres.setHandler('item:entity', function(itemId) {
    return API.getItemEntity(itemId);
});
itemChannel.reqres.setHandler('item:entity:new', function() {
    return new Item();
});


//Fail to try using Radio
// itemChannel.reply('item:entities', function() {
//     return API.getItemEntities();
// });
// itemChannel.reply('item:entity', function(itemId) {
//     return API.getItemEntity(itemId);
// });
// itemChannel.reply('item:entityById', function(itemId) {
//     return API.getItemEntityById(itemId);
// });
// itemChannel.reply('item:entity:new', function() {
//     return new Item();
// });
console.log('exporting data channels');
module.exports = itemChannel;

var isOffline = true;
// var isOffline = false;
var options =  {
    isOffline: isOffline,
    itemUrl: function() {
        return isOffline? 'items' : '/api/items';
    }
};

module.exports = options;

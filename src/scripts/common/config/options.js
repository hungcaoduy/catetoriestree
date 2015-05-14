// var isOffline = true;
var isOffline = false;
var options =  {
    isOffline: isOffline,
    itemUrl: function() {
        return isOffline? 'items' : '/items';
    },
    dateFormat: 'DD/MM/YYYY',
    pickerDateFormat: 'dd/mm/yy'
};

module.exports = options;

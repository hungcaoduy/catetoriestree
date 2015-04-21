var ShowItemTpl = require('./templates/showItem.jade');
var MissingItemTpl = require('./templates/missingItem.jade');
var View = {};
var globalItemChannel = window.globalItemChannel;
View.MissingItem = Marionette.ItemView.extend({
	template: MissingItemTpl
});

View.Item = Marionette.ItemView.extend({
    template: ShowItemTpl,
    events: {
        'click .js-edit': 'itemEdit',
        'click .js-back': 'back'
    },
    itemEdit: function(e) {
        e.preventDefault();
        globalItemChannel.commands.execute('edit:item', {model: this.model, id: this.model.id});
    },
    back: function(e) {
        e.preventDefault();
        globalItemChannel.commands.execute('go:back');
    }
});
module.exports = View;
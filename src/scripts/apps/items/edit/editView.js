
var MissingItemTpl = require('./templates/missingItem');
// var EditItemTpl = require('./templates/editItem');
var View = {};
var CommonView = require('scripts/common/views');
View.MissingItem = Marionette.ItemView.extend({
	template: MissingItemTpl
});

View.Item = CommonView.Form.extend({
    title: 'Edit item',
});

module.exports = View;

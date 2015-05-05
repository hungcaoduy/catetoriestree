
var ItemRowTpl = require('./templates/itemRow.jade');
var ItemTableTpl = require('./templates/itemTable.jade');
var LayoutTpl = require('./templates/layout.jade');
var GridTpl = require('./templates/grid.jade');
var PanelTpl = require('./templates/panel.jade');
// var Backgrid = require('backgrid.paginator');
var View = {};
var CommonView = require('scripts/common/views');
View.Item = CommonView.Item.extend({
    template: ItemRowTpl
});

View.Items = CommonView.Items.extend({
    template: ItemTableTpl,
    childView: View.Item,
});

View.Panel = CommonView.Panel.extend({
    template: PanelTpl
});

View.Grid = CommonView.Grid.extend({
    template: GridTpl
});

View.Layout = Marionette.LayoutView.extend({
    template: LayoutTpl,
    regions: {
        formRegion: '#form-region',
        panelRegion: '#panel-region',
        listRegion: '#list-region'
    },
    onBeforeShow: function() {
        console.log('layout showing');
    }
});

module.exports = View;

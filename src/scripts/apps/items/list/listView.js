
var ItemRowTpl = require('./templates/itemRow.jade');
var ItemTableTpl = require('./templates/itemTable.jade');
var PanelTpl = require('./templates/panel.jade');
var LayoutTpl = require('./templates/layout.jade');
var GridTpl = require('./templates/grid.jade');
var View = {};
View.Item = Marionette.ItemView.extend({
    template: ItemRowTpl,
    tagName: 'tr',
    triggers: {
    'click td a.js-show': 'item:show',
    'click td a.js-edit': 'item:edit',
    'click button.js-delete': 'item:delete'
    },
    events: {
    'click': 'highlightName'
    },
    highlightName: function(e) {
        this.$el.toggleClass('warning');
    },
    remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
            Marionette.ItemView.prototype.remove.call(self);
        });
    },
    onRender: function() {
        // console.log('rendering childView', this.model);
    }
});

View.Items = Marionette.CompositeView.extend({
    // tagName: 'table',
    className: 'table table-hover',
    template: ItemTableTpl,
    childView: View.Item,
    childViewContainer: 'tbody',
    ui: {
        paginator: '.js-paginator'
    },
    onRenderCollection: function() {
        this.showPaginator(this.collection);
    },
    showPaginator: function(collection) {
        var paginator = new Backgrid.Extension.Paginator({
            collection: collection
        });
        this.ui.paginator.empty();
        if (collection.length>0) {
            this.ui.paginator.append(paginator.render().$el);
        }
    }
});

View.Grid = Marionette.ItemView.extend({
    template: GridTpl,
    ui: {
        paginator: '.js-paginator',
        grid: '.js-grid'
    },
    onRender: function() {
        var columns = [
        {name: 'image', label: 'image', cell: 'string'},
        {name: 'title', label: 'title', cell: 'string'},
        {name: 'description', label: 'description', cell: 'string'}
        ];
        var grid = new Backgrid.Grid({columns: columns, collection: this.collection});

        var paginator = new Backgrid.Extension.Paginator({
            collection: this.collection
        });
        this.ui.paginator.empty();
        this.ui.grid.empty();
        if (this.collection.length>0) {
            this.ui.paginator.append(paginator.render().$el);
            this.ui.grid.append(grid.render().$el);
        }
    }
});

View.Panel = Marionette.ItemView.extend({
    template: PanelTpl,
    initialize: function(options) {
        console.log('panel is initialize');
    },
    onRender: function(e) {
        console.log('panel',this.$el);
    },
    events: {
        'submit #filter-form': 'filterItems', //do next: for this, I want to search remotely
        'keyup #filter-form input': 'filterItems' //for this, I want to filter current collection on local
    },
    triggers: {
        'click .js-new': 'item:new',
        'click .js-save': 'item:save',
        'click .js-mass-delete': 'item:mass:delete'
    },
    config: {
        searchTimeout: {},
        searchDelay: 300
    },
    filterItems: function (e) {
        //only trigger the filter when user stop typing for a certain of time
        e.preventDefault();
        var self = this;
        clearTimeout(this.config.searchTimeout);
        this.config.searchTimeout = setTimeout(function() {
            var criterion = this.$(".js-filter-criterion").val();
            self.trigger("item:filter", criterion);
            console.log("panel:item:filter is triggered");
        }, this.config.searchDelay);
    },
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

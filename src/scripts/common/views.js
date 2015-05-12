
var moment = require('moment');
var LoadingTpl = require('./templates/loading');
var FormTpl = require('./templates/form');
var PanelTpl = require('./templates/panel.jade');
var ItemRowTpl = require('./templates/itemRow.jade');
var ItemTableTpl = require('./templates/itemTable.jade');
var LayoutTpl = require('./templates/layout.jade');
var GridTpl = require('./templates/grid.jade');

var View = {};
var moment = require('moment');
var options = require('scripts/common/config/options');
Backbone.Marionette.ItemView.prototype.mixinTemplateHelpers = function (target) {
    var self = this;
    var templateHelpers = Marionette.getOption(self, "templateHelpers");
    var result = {};

    target = target || {};

    if (_.isFunction(templateHelpers)){
        templateHelpers = templateHelpers.call(self);
    }

    // This _.each block is what we're adding
    _.each(templateHelpers, function (helper, index) {
        if (_.isFunction(helper)) {
            result[index] = helper.call(self);
        } else {
            result[index] = helper;
        }
    });

    return _.extend(target, result);
};


View.Loading = Marionette.ItemView.extend({
    template: LoadingTpl,

    title: 'Loading Data',
    message: 'Please wait, data is loading.',

    serializeData: function(){
        return {
            title: Marionette.getOption(this, 'title'),
            message: Marionette.getOption(this, 'message')
        };
    },

    onShow: function(){
        var opts = {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '30px', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        $('#spinner').spin(opts);
    }
});

View.Form = Marionette.ItemView.extend({
    template: FormTpl,
    events: {
        'click .js-save': 'itemSave',
        'click .js-save-close': 'itemSaveClose',
    },
    triggers: {
        'click .js-cancel': 'dialog:close'
    },
    itemSave: function(e) {
        e.preventDefault();
        this.saveData();
    },
    itemSaveClose: function(e) {
        e.preventDefault();
        this.saveData();
        this.trigger('dialog:close');
    },
    saveData: function() {
        Backbone.Syphon.InputReaders.register('datetext', function(el) {
            var dateStr = $(el).prop('value');
            var theDate = moment(dateStr, options.dateFormat).utc().toDate();
            return theDate.getTime();
        });
        var data = Backbone.Syphon.serialize(this);
        console.log('the serialized data is ', data);
        // data.effectiveDate = moment(data.effectiveDate, options.dateFormat).toDate();
        // console.log('the fixed data is ', data);
        this.trigger('item:save', {model: this.model, data: data});
    },
    templateHelpers: {
        dateFormat: options.dateFormat
    },
    serializeData: function() {
        console.log('serializeData arguments', arguments);
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments);
        console.log('serializeData', data);
        data.effectiveDate = moment.utc(data.effectiveDate).local().format(options.dateFormat);
        console.log('return serializeData', data);
        return data;
    },
    onFormDataInvalid: function(errors){
        var $view = this.$el;

        var clearFormErrors = function(){
            var $form = $view.find('form');
            $form.find('.help-inline.error').each(function(){
                $(this).remove();
            });
            $form.find('.control-group.error').each(function(){
                $(this).removeClass('error');
            });
        };

        var markErrors = function(value, key){
            var $controlGroup = $view.find('#contact-' + key).parent();
            var $errorEl = $('<span>', { class: 'help-inline error', text: value });
            $controlGroup.append($errorEl).addClass('error');
        };

        clearFormErrors();
        _.each(errors, markErrors);
    },
    onAttach: function(e) {
        // $('#effectiveDate').datepicker({dateFormat: options.pickerDateFormat});
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

//list---------------
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
    },
    serializeData: function() {
        var moment = require('moment');
        var options = require('scripts/common/config/options');
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments);
        data.effectiveDate = moment.utc(data.effectiveDate).local().format(options.dateFormat);
        return data;
    }
});

View.Items = Marionette.CompositeView.extend({
    // tagName: 'table',
    template: ItemTableTpl,
    className: 'table table-hover',
    childView: View.Item,
    childViewContainer: 'tbody',
    ui: {
        paginator: '.js-paginator'
    },
    initialize: function(options) {
        // this.listenTo('')
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
            this.ui.grid.append(grid.render().$el);
            this.ui.paginator.append(paginator.render().$el);
        }
    }
});
// /list-------------

module.exports = View;

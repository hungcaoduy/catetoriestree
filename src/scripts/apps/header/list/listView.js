
var listTpl = require('./templates/list.jade');
var listItemTpl = require('./templates/list_item.jade');
var View = {};
View.Header = Marionette.ItemView.extend({
    template: listItemTpl,
    tagName: 'li',

    events: {
        'click a': 'navigate'
    },

    navigate: function(e){
        e.preventDefault();
        this.trigger('navigate', this.model);
    },

    onRender: function(){
        if(this.model.selected){
            // add class so Bootstrap will highlight the active entry in the navbar
            this.$el.addClass('active');
        }
    }
});

View.Headers = Marionette.CompositeView.extend({
    template: listTpl,
    className: 'navbar navbar-inverse navbar-fixed-top',
    childView: View.Header,
    childViewContainer: 'ul',

    events: {
        'click a.brand': 'brandClicked'
    },

    brandClicked: function(e){
        e.preventDefault();
        this.trigger('brand:clicked');
    }
});

module.exports = View;

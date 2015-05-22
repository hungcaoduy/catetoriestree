
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
            this.$el.addClass('active');
        }
    }
});

View.Headers = Marionette.CompositeView.extend({
    template: listTpl,
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

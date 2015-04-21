// load everything
// require('jquery-ui');
// require('jquery-ui-browserify');

// or load just the modules you need
// require('jquery-ui/draggable');
// require('jquery-ui/droppable');
// require('jquery-ui/sortable');

module.exports = Marionette.Region.extend({
    onShow: function(view){
        this.listenTo(view, "dialog:close", this.closeDialog);

        var self = this;
        this.$el.dialog({
            modal: true,
            title: view.title,
            width: "auto",
            close: function(e, ui){
                self.closeDialog();
            }
        });
    },

    closeDialog: function(){
        this.stopListening();
        this.empty();
        this.$el.dialog("destroy");
        window.history.back();
    },
    onEmpty: function() {
            console.log('DialogRegion is now emptied');
            // window.history.back();
    }

});

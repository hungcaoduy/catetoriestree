var CommonViews = require('scripts/common/views');
var ItemFormTpl = require('./templates/itemBlankForm.jade');
module.exports = {
    Item: CommonViews.Form.extend({
        title: 'New Item',
        // template: ItemFormTpl,
        onAttach: function(e) {
        $('#effectiveDate').datepicker({dateFormat: 'dd/mm/yy'});   
    }
})
}

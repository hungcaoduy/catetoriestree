//try to test to use backgrid.paginator without backgrid
(function (root, factory) {

  if (typeof define === "function" && define.amd) {
    // AMD (+ global for extensions)
    define(["underscore", "backbone"], function (_, Backbone) {
      return (root.Backgrid = factory(_, Backbone));
    });
  } else if (typeof exports === "object") {
    // CommonJS
    module.exports = factory(require("underscore"), require("backbone"));
  } else {
    // Browser
    root.Backgrid = factory(root._, root.Backbone);
  }}(this, function (_, Backbone) {
    var Backgrid = {
      Extension: {},
      /*resolveNameToClass: function (name, suffix) {
        if (_.isString(name)) {
          var key = _.map(name.split('-'), function (e) {
            return e.slice(0, 1).toUpperCase() + e.slice(1);
          }).join('') + suffix;
          var klass = Backgrid[key] || Backgrid.Extension[key];
          if (_.isUndefined(klass)) {
            throw new ReferenceError("Class '" + key + "' not found");
          }
          return klass;
        }

        return name;
      },

      callByNeed: function () {
        var value = arguments[0];
        if (!_.isFunction(value)) return value;

        var context = arguments[1];
        var args = [].slice.call(arguments, 2);
        return value.apply(context, !!(args + '') ? args : []);
      }*/
    };
    return Backgrid;
  }));

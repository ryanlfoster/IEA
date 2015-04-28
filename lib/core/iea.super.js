'use strict';

//A convenient super method for the popular JavaScript library, Backbone.js.
// https://github.com/lukasolson/backbone-super

/*
Brief aside on super: JavaScript does not provide a simple way to call
super — the function of the same name defined higher on the prototype chain.
If you override a core function like set, or save, and you want to invoke
the parent object's implementation, you'll have to explicitly call it,
along these lines:

usage

old way

set: function(attributes, options) {
    Backbone.Model.prototype.set.call(this, attributes, options);
    ...
}

with super

set: function(attributes, options) {
    this._super(attributes, options);
    ...
}

*/

IEA.Model.extend = IEA.Collection.extend = IEA.View.extend = IEA.AbstractView.extend = function(protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
};

var unImplementedSuper = function(method) {
    throw "Super does not implement this method: " + method;
};

var fnTest = /\b_super\b/;

var makeWrapper = function(parentProto, name, fn) {
    var wrapper = function() {
        var tmp = this._super;

        // Add a new ._super() method that is the same method
        // but on the super-class
        this._super = parentProto[name] || unImplementedSuper(name);

        // The method only need to be bound temporarily, so we
        // remove it when we're done executing
        var ret;
        try {
            ret = fn.apply(this, arguments);
        } finally {
            this._super = tmp;
        }
        return ret;
    };

    //we must move properties from old function to new
    for (var prop in fn) {
        wrapper[prop] = fn[prop];
        delete fn[prop];
    }

    return wrapper;
};

var ctor = function() {},
    inherits = function(parent, protoProps, staticProps) {
        var child, parentProto = parent.prototype;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parentProto;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) {
            _.extend(child.prototype, protoProps);

            // Copy the properties over onto the new prototype
            for (var name in protoProps) {
                // Check if we're overwriting an existing function
                if (typeof protoProps[name] == "function" && fnTest.test(protoProps[name])) {
                    child.prototype[name] = makeWrapper(parentProto, name, protoProps[name]);
                }
            }
        }

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parentProto;

        return child;
    };

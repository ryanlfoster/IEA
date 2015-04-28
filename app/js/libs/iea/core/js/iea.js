//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define('backbone',['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.2';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
        modelMap[model.id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        router.execute(callback, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));

// Generated by CoffeeScript 1.6.2
/*!
jQuery Waypoints - v2.0.5
Copyright (c) 2011-2014 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function(){var t=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++){if(e in this&&this[e]===t)return e}return-1},e=[].slice;(function(t,e){if(typeof define==="function"&&define.amd){return define("waypoints",["jquery"],function(n){return e(n,t)})}else{return e(t.jQuery,t)}})(window,function(n,r){var i,o,l,s,f,u,c,a,h,d,p,y,v,w,g,m;i=n(r);a=t.call(r,"ontouchstart")>=0;s={horizontal:{},vertical:{}};f=1;c={};u="waypoints-context-id";p="resize.waypoints";y="scroll.waypoints";v=1;w="waypoints-waypoint-ids";g="waypoint";m="waypoints";o=function(){function t(t){var e=this;this.$element=t;this.element=t[0];this.didResize=false;this.didScroll=false;this.id="context"+f++;this.oldScroll={x:t.scrollLeft(),y:t.scrollTop()};this.waypoints={horizontal:{},vertical:{}};this.element[u]=this.id;c[this.id]=this;t.bind(y,function(){var t;if(!(e.didScroll||a)){e.didScroll=true;t=function(){e.doScroll();return e.didScroll=false};return r.setTimeout(t,n[m].settings.scrollThrottle)}});t.bind(p,function(){var t;if(!e.didResize){e.didResize=true;t=function(){n[m]("refresh");return e.didResize=false};return r.setTimeout(t,n[m].settings.resizeThrottle)}})}t.prototype.doScroll=function(){var t,e=this;t={horizontal:{newScroll:this.$element.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.$element.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};if(a&&(!t.vertical.oldScroll||!t.vertical.newScroll)){n[m]("refresh")}n.each(t,function(t,r){var i,o,l;l=[];o=r.newScroll>r.oldScroll;i=o?r.forward:r.backward;n.each(e.waypoints[t],function(t,e){var n,i;if(r.oldScroll<(n=e.offset)&&n<=r.newScroll){return l.push(e)}else if(r.newScroll<(i=e.offset)&&i<=r.oldScroll){return l.push(e)}});l.sort(function(t,e){return t.offset-e.offset});if(!o){l.reverse()}return n.each(l,function(t,e){if(e.options.continuous||t===l.length-1){return e.trigger([i])}})});return this.oldScroll={x:t.horizontal.newScroll,y:t.vertical.newScroll}};t.prototype.refresh=function(){var t,e,r,i=this;r=n.isWindow(this.element);e=this.$element.offset();this.doScroll();t={horizontal:{contextOffset:r?0:e.left,contextScroll:r?0:this.oldScroll.x,contextDimension:this.$element.width(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:r?0:e.top,contextScroll:r?0:this.oldScroll.y,contextDimension:r?n[m]("viewportHeight"):this.$element.height(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};return n.each(t,function(t,e){return n.each(i.waypoints[t],function(t,r){var i,o,l,s,f;i=r.options.offset;l=r.offset;o=n.isWindow(r.element)?0:r.$element.offset()[e.offsetProp];if(n.isFunction(i)){i=i.apply(r.element)}else if(typeof i==="string"){i=parseFloat(i);if(r.options.offset.indexOf("%")>-1){i=Math.ceil(e.contextDimension*i/100)}}r.offset=o-e.contextOffset+e.contextScroll-i;if(r.options.onlyOnScroll&&l!=null||!r.enabled){return}if(l!==null&&l<(s=e.oldScroll)&&s<=r.offset){return r.trigger([e.backward])}else if(l!==null&&l>(f=e.oldScroll)&&f>=r.offset){return r.trigger([e.forward])}else if(l===null&&e.oldScroll>=r.offset){return r.trigger([e.forward])}})})};t.prototype.checkEmpty=function(){if(n.isEmptyObject(this.waypoints.horizontal)&&n.isEmptyObject(this.waypoints.vertical)){this.$element.unbind([p,y].join(" "));return delete c[this.id]}};return t}();l=function(){function t(t,e,r){var i,o;if(r.offset==="bottom-in-view"){r.offset=function(){var t;t=n[m]("viewportHeight");if(!n.isWindow(e.element)){t=e.$element.height()}return t-n(this).outerHeight()}}this.$element=t;this.element=t[0];this.axis=r.horizontal?"horizontal":"vertical";this.callback=r.handler;this.context=e;this.enabled=r.enabled;this.id="waypoints"+v++;this.offset=null;this.options=r;e.waypoints[this.axis][this.id]=this;s[this.axis][this.id]=this;i=(o=this.element[w])!=null?o:[];i.push(this.id);this.element[w]=i}t.prototype.trigger=function(t){if(!this.enabled){return}if(this.callback!=null){this.callback.apply(this.element,t)}if(this.options.triggerOnce){return this.destroy()}};t.prototype.disable=function(){return this.enabled=false};t.prototype.enable=function(){this.context.refresh();return this.enabled=true};t.prototype.destroy=function(){delete s[this.axis][this.id];delete this.context.waypoints[this.axis][this.id];return this.context.checkEmpty()};t.getWaypointsByElement=function(t){var e,r;r=t[w];if(!r){return[]}e=n.extend({},s.horizontal,s.vertical);return n.map(r,function(t){return e[t]})};return t}();d={init:function(t,e){var r;e=n.extend({},n.fn[g].defaults,e);if((r=e.handler)==null){e.handler=t}this.each(function(){var t,r,i,s;t=n(this);i=(s=e.context)!=null?s:n.fn[g].defaults.context;if(!n.isWindow(i)){i=t.closest(i)}i=n(i);r=c[i[0][u]];if(!r){r=new o(i)}return new l(t,r,e)});n[m]("refresh");return this},disable:function(){return d._invoke.call(this,"disable")},enable:function(){return d._invoke.call(this,"enable")},destroy:function(){return d._invoke.call(this,"destroy")},prev:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e>0){return t.push(n[e-1])}})},next:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e<n.length-1){return t.push(n[e+1])}})},_traverse:function(t,e,i){var o,l;if(t==null){t="vertical"}if(e==null){e=r}l=h.aggregate(e);o=[];this.each(function(){var e;e=n.inArray(this,l[t]);return i(o,e,l[t])});return this.pushStack(o)},_invoke:function(t){this.each(function(){var e;e=l.getWaypointsByElement(this);return n.each(e,function(e,n){n[t]();return true})});return this}};n.fn[g]=function(){var t,r;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(d[r]){return d[r].apply(this,t)}else if(n.isFunction(r)){return d.init.apply(this,arguments)}else if(n.isPlainObject(r)){return d.init.apply(this,[null,r])}else if(!r){return n.error("jQuery Waypoints needs a callback function or handler option.")}else{return n.error("The "+r+" method does not exist in jQuery Waypoints.")}};n.fn[g].defaults={context:r,continuous:true,enabled:true,horizontal:false,offset:0,triggerOnce:false};h={refresh:function(){return n.each(c,function(t,e){return e.refresh()})},viewportHeight:function(){var t;return(t=r.innerHeight)!=null?t:i.height()},aggregate:function(t){var e,r,i;e=s;if(t){e=(i=c[n(t)[0][u]])!=null?i.waypoints:void 0}if(!e){return[]}r={horizontal:[],vertical:[]};n.each(r,function(t,i){n.each(e[t],function(t,e){return i.push(e)});i.sort(function(t,e){return t.offset-e.offset});r[t]=n.map(i,function(t){return t.element});return r[t]=n.unique(r[t])});return r},above:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset<=t.oldScroll.y})},below:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset>t.oldScroll.y})},left:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset<=t.oldScroll.x})},right:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset>t.oldScroll.x})},enable:function(){return h._invoke("enable")},disable:function(){return h._invoke("disable")},destroy:function(){return h._invoke("destroy")},extendFn:function(t,e){return d[t]=e},_invoke:function(t){var e;e=n.extend({},s.vertical,s.horizontal);return n.each(e,function(e,n){n[t]();return true})},_filter:function(t,e,r){var i,o;i=c[n(t)[0][u]];if(!i){return[]}o=[];n.each(i.waypoints[e],function(t,e){if(r(i,e)){return o.push(e)}});o.sort(function(t,e){return t.offset-e.offset});return n.map(o,function(t){return t.element})}};n[m]=function(){var t,n;n=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(h[n]){return h[n].apply(null,t)}else{return h.aggregate.call(null,n)}};n[m].settings={resizeThrottle:100,scrollThrottle:30};return i.on("load.waypoints",function(){return n[m]("refresh")})})}).call(this);
/*!
 * backbone.layoutmanager.js v0.9.6
 * Copyright 2013, Tim Branyen (@tbranyen)
 * backbone.layoutmanager.js may be freely distributed under the MIT license.
 */
(function(window, factory) {
  "use strict";

  // AMD. Register as an anonymous module.  Wrap in function so we have access
  // to root via `this`.
  if (typeof define === "function" && define.amd) {
    define('layoutmanager',["backbone", "underscore", "jquery"], function() {
      return factory.apply(window, arguments);
    });
  }

  // Node. Does not work with strict CommonJS, but only CommonJS-like
  // environments that support module.exports, like Node.
  else if (typeof exports === "object") {
    var Backbone = require("backbone");
    var _ = require("underscore");
    // In a browserify build, since this is the entry point, Backbone.$
    // is not bound. Ensure that it is.
    Backbone.$ = Backbone.$ || require("jquery");

    module.exports = factory.call(window, Backbone, _, Backbone.$);
  }

  // Browser globals.
  else {
    factory.call(window, window.Backbone, window._, window.Backbone.$);
  }
}(typeof global === "object" ? global : this, function (Backbone, _, $) {
"use strict";

// Create a reference to the global object. In browsers, it will map to the
// `window` object; in Node, it will be `global`.
var window = this;

// Maintain reference to the original constructor.
var ViewConstructor = Backbone.View;

// Cache these methods for performance.
var aPush = Array.prototype.push;
var aConcat = Array.prototype.concat;
var aSplice = Array.prototype.splice;
var trim = String.prototype.trim ?
  _.bind(String.prototype.trim.call, String.prototype.trim) :
  $.trim;

// LayoutManager is a wrapper around a `Backbone.View`.
// Backbone.View.extend takes options (protoProps, staticProps)
var LayoutManager = Backbone.View.extend({
  _render: function() {
    // Keep the view consistent between callbacks and deferreds.
    var view = this;
    // Shorthand the manager.
    var manager = view.__manager__;
    // Cache these properties.
    var beforeRender = view.beforeRender;
    // Create a deferred instead of going off
    var def = view.deferred();

    // Ensure all nested Views are properly scrubbed if re-rendering.
    if (view.hasRendered) {
      view._removeViews();
    }

    // This continues the render flow after `beforeRender` has completed.
    manager.callback = function() {
      // Clean up asynchronous manager properties.
      delete manager.isAsync;
      delete manager.callback;

      // Always emit a beforeRender event.
      view.trigger("beforeRender", view);

      // Render!
      view._viewRender(manager).render().then(function() {
        // Complete this deferred once resolved.
        def.resolve();
      });
    };

    // If a beforeRender function is defined, call it.
    if (beforeRender) {
      beforeRender.call(view, view);
    }

    if (!manager.isAsync) {
      manager.callback();
    }

    // Return this intermediary promise.
    return def.promise();
  },

  // This function is responsible for pairing the rendered template into the
  // DOM element.
  _applyTemplate: function(rendered, manager, def) {
    // Actually put the rendered contents into the element.
    if (_.isString(rendered)) {
      // If no container is specified, we must replace the content.
      if (manager.noel) {
        rendered = $.parseHTML(rendered, true);

        // Remove extra root elements.
        this.$el.slice(1).remove();

        // Swap out the View on the first top level element to avoid
        // duplication.
        this.$el.replaceWith(rendered);

        // Don't delegate events here - we'll do that in resolve()
        this.setElement(rendered, false);
      } else {
        this.html(this.$el, rendered);
      }
    }

    // Resolve only after fetch and render have succeeded.
    def.resolveWith(this, [this]);
  },

  // Creates a deferred and returns a function to call when finished.
  // This gets passed to all _render methods.  The `root` value here is passed
  // from the `manage(this).render()` line in the `_render` function
  _viewRender: function(manager) {
    var url, contents, def;
    var root = this;

    // Once the template is successfully fetched, use its contents to proceed.
    // Context argument is first, since it is bound for partial application
    // reasons.
    function done(context, template) {
      // Store the rendered template someplace so it can be re-assignable.
      var rendered;

      // Trigger this once the render method has completed.
      manager.callback = function(rendered) {
        // Clean up asynchronous manager properties.
        delete manager.isAsync;
        delete manager.callback;

        root._applyTemplate(rendered, manager, def);
      };

      // Ensure the cache is up-to-date.
      LayoutManager.cache(url, template);

      // Render the View into the el property.
      if (template) {
        rendered = root.renderTemplate.call(root, template, context);
      }

      // If the function was synchronous, continue execution.
      if (!manager.isAsync) {
        root._applyTemplate(rendered, manager, def);
      }
    }

    return {
      // This `render` function is what gets called inside of the View render,
      // when `manage(this).render` is called.  Returns a promise that can be
      // used to know when the element has been rendered into its parent.
      render: function() {
        var context = root.serialize;
        var template = root.template;

        // Create a deferred specifically for fetching.
        def = root.deferred();

        // If data is a function, immediately call it.
        if (_.isFunction(context)) {
          context = context.call(root);
        }

        // Set the internal callback to trigger once the asynchronous or
        // synchronous behavior has completed.
        manager.callback = function(contents) {
          // Clean up asynchronous manager properties.
          delete manager.isAsync;
          delete manager.callback;

          done(context, contents);
        };

        // Set the url to the prefix + the view's template property.
        if (typeof template === "string") {
          url = root.prefix + template;
        }

        // Check if contents are already cached and if they are, simply process
        // the template with the correct data.
        if (contents = LayoutManager.cache(url)) {
          done(context, contents, url);

          return def;
        }

        // Fetch layout and template contents.
        if (typeof template === "string") {
          contents = root.fetchTemplate.call(root, root.prefix +
            template);
        // If the template is already a function, simply call it.
        } else if (typeof template === "function") {
          contents = template;
        // If its not a string and not undefined, pass the value to `fetch`.
        } else if (template != null) {
          contents = root.fetchTemplate.call(root, template);
        }

        // If the function was synchronous, continue execution.
        if (!manager.isAsync) {
          done(context, contents);
        }

        return def;
      }
    };
  },

  // This named function allows for significantly easier debugging.
  constructor: function Layout(options) {
    // Grant this View superpowers.
    this.manage = true;

    // Give this View access to all passed options as instance properties.
    _.extend(this, options);

    // Have Backbone set up the rest of this View.
    Backbone.View.apply(this, arguments);
  },

  // This method is used within specific methods to indicate that they should
  // be treated as asynchronous.  This method should only be used within the
  // render chain, otherwise unexpected behavior may occur.
  async: function() {
    var manager = this.__manager__;

    // Set this View's action to be asynchronous.
    manager.isAsync = true;

    // Return the callback.
    return manager.callback;
  },

  promise: function() {
    return this.__manager__.renderDeferred.promise();
  },

  // Proxy `then` for easier invocation.
  then: function() {
    return this.promise().then.apply(this, arguments);
  },

  // Sometimes it's desirable to only render the child views under the parent.
  // This is typical for a layout that does not change.  This method will
  // iterate over the provided views or delegate to `getViews` to fetch child
  // Views and aggregate all render promises and return the parent View.
  // The internal `promise()` method will return the aggregate promise that
  // resolves once all children have completed their render.
  renderViews: function(views) {
    var root = this;
    var manager = root.__manager__;
    var newDeferred = root.deferred();

    // If the caller provided an array of views then render those, otherwise
    // delegate to getViews.
    if (views && _.isArray(views)) {
      views = _.chain(views);
    } else {
      views = root.getViews(views);
    }

    // Collect all promises from rendering the child views and wait till they
    // all complete.
    var promises = views.map(function(view) {
      return view.render().__manager__.renderDeferred;
    }).value();

    // Simulate a parent render to remain consistent.
    manager.renderDeferred = newDeferred.promise();

    // Once all child views have completed rendering, resolve parent deferred
    // with the correct context.
    root.when(promises).then(function() {
      newDeferred.resolveWith(root, [root]);
    });

    // Allow this method to be chained.
    return root;
  },

  // Shorthand to `setView` function with the `insert` flag set.
  insertView: function(selector, view) {
    // If the `view` argument exists, then a selector was passed in.  This code
    // path will forward the selector on to `setView`.
    if (view) {
      return this.setView(selector, view, true);
    }

    // If no `view` argument is defined, then assume the first argument is the
    // View, somewhat now confusingly named `selector`.
    return this.setView(selector, true);
  },

  // Iterate over an object and ensure every value is wrapped in an array to
  // ensure they will be inserted, then pass that object to `setViews`.
  insertViews: function(views) {
    // If an array of views was passed it should be inserted into the
    // root view. Much like calling insertView without a selector.
    if (_.isArray(views)) {
      return this.setViews({ "": views });
    }

    _.each(views, function(view, selector) {
      views[selector] = _.isArray(view) ? view : [view];
    });

    return this.setViews(views);
  },

  // Returns the View that matches the `getViews` filter function.
  getView: function(fn) {
    // If `getView` is invoked with undefined as the first argument, then the
    // second argument will be used instead.  This is to allow
    // `getViews(undefined, fn)` to work as `getViews(fn)`.  Useful for when
    // you are allowing an optional selector.
    if (fn == null) {
      fn = arguments[1];
    }

    return this.getViews(fn).first().value();
  },

  // Provide a filter function to get a flattened array of all the subviews.
  // If the filter function is omitted it will return all subviews.  If a
  // String is passed instead, it will return the Views for that selector.
  getViews: function(fn) {
    var views;

    // If the filter argument is a String, then return a chained Version of the
    // elements. The value at the specified filter may be undefined, a single
    // view, or an array of views; in all cases, chain on a flat array.
    if (typeof fn === "string") {
      fn = this.sections[fn] || fn;
      views = this.views[fn] || [];

      // If Views is undefined you are concatenating an `undefined` to an array
      // resulting in a value being returned.  Defaulting to an array prevents
      // this.
      //return _.chain([].concat(views || []));
      return _.chain([].concat(views));
    }

    // Generate an array of all top level (no deeply nested) Views flattened.
    views = _.chain(this.views).map(function(view) {
      return _.isArray(view) ? view : [view];
    }, this).flatten();

    // If the argument passed is an Object, then pass it to `_.where`.
    if (typeof fn === "object") {
      return views.where(fn);
    }

    // If a filter function is provided, run it on all Views and return a
    // wrapped chain. Otherwise, simply return a wrapped chain of all Views.
    return typeof fn === "function" ? views.filter(fn) : views;
  },

  // Use this to remove Views, internally uses `getViews` so you can pass the
  // same argument here as you would to that method.
  removeView: function(fn) {
    // Allow an optional selector or function to find the right model and
    // remove nested Views based off the results of the selector or filter.
    return this.getViews(fn).each(function(nestedView) {
      nestedView.remove();
    });
  },

  // This takes in a partial name and view instance and assigns them to
  // the internal collection of views.  If a view is not a LayoutManager
  // instance, then mix in the LayoutManager prototype.  This ensures
  // all Views can be used successfully.
  //
  // Must definitely wrap any render method passed in or defaults to a
  // typical render function `return layout(this).render()`.
  setView: function(name, view, insert) {
    var manager, selector;
    // Parent view, the one you are setting a View on.
    var root = this;

    // If no name was passed, use an empty string and shift all arguments.
    if (typeof name !== "string") {
      insert = view;
      view = name;
      name = "";
    }

    // Shorthand the `__manager__` property.
    manager = view.__manager__;

    // If the View has not been properly set up, throw an Error message
    // indicating that the View needs `manage: true` set.
    if (!manager) {
      throw new Error("The argument associated with selector '" + name +
        "' is defined and a View.  Set `manage` property to true for " +
        "Backbone.View instances.");
    }

    // Add reference to the parentView.
    manager.parent = root;

    // Add reference to the placement selector used.
    selector = manager.selector = root.sections[name] || name;

    // Code path is less complex for Views that are not being inserted.  Simply
    // remove existing Views and bail out with the assignment.
    if (!insert) {
      // Ensure remove is called only when swapping in a new view (when the
      // view is the same, it does not need to be removed or cleaned up).
      if (root.getView(name) !== view) {
        root.removeView(name);
      }

      // Assign to main views object and return for chainability.
      return root.views[selector] = view;
    }

    // Ensure this.views[selector] is an array and push this View to
    // the end.
    root.views[selector] = aConcat.call([], root.views[name] || [], view);

    // Put the parent view into `insert` mode.
    root.__manager__.insert = true;

    return view;
  },

  // Allows the setting of multiple views instead of a single view.
  setViews: function(views) {
    // Iterate over all the views and use the View's view method to assign.
    _.each(views, function(view, name) {
      // If the view is an array put all views into insert mode.
      if (_.isArray(view)) {
        return _.each(view, function(view) {
          this.insertView(name, view);
        }, this);
      }

      // Assign each view using the view function.
      this.setView(name, view);
    }, this);

    // Allow for chaining
    return this;
  },

  // By default this should find all nested views and render them into
  // the this.el and call done once all of them have successfully been
  // resolved.
  //
  // This function returns a promise that can be chained to determine
  // once all subviews and main view have been rendered into the view.el.
  render: function() {
    var root = this;
    var manager = root.__manager__;
    var parent = manager.parent;
    var rentManager = parent && parent.__manager__;
    var def = root.deferred();

    // Triggered once the render has succeeded.
    function resolve() {

      // Insert all subViews into the parent at once.
      _.each(root.views, function(views, selector) {
        // Fragments aren't used on arrays of subviews.
        if (_.isArray(views)) {
          root.htmlBatch(root, views, selector);
        }
      });

      // If there is a parent and we weren't attached to it via the previous
      // method (single view), attach.
      if (parent && !manager.insertedViaFragment) {
        if (!root.contains(parent.el, root.el)) {
          // Apply the partial using parent's html() method.
          parent.partial(parent.$el, root.$el, rentManager, manager);
        }
      }

      // Ensure events are always correctly bound after rendering.
      root.delegateEvents();

      // Set this View as successfully rendered.
      root.hasRendered = true;
      manager.renderInProgress = false;

      // Clear triggeredByRAF flag.
      delete manager.triggeredByRAF;

      // Only process the queue if it exists.
      if (manager.queue && manager.queue.length) {
        // Ensure that the next render is only called after all other
        // `done` handlers have completed.  This will prevent `render`
        // callbacks from firing out of order.
        (manager.queue.shift())();
      } else {
        // Once the queue is depleted, remove it, the render process has
        // completed.
        delete manager.queue;
      }

      // Reusable function for triggering the afterRender callback and event.
      function completeRender() {
        var console = window.console;
        var afterRender = root.afterRender;

        if (afterRender) {
          afterRender.call(root, root);
        }

        // Always emit an afterRender event.
        root.trigger("afterRender", root);

        // If there are multiple top level elements and `el: false` is used,
        // display a warning message and a stack trace.
        if (manager.noel && root.$el.length > 1) {
          // Do not display a warning while testing or if warning suppression
          // is enabled.
          if (_.isFunction(console.warn) && !root.suppressWarnings) {
            console.warn("`el: false` with multiple top level elements is " +
              "not supported.");

            // Provide a stack trace if available to aid with debugging.
            if (_.isFunction(console.trace)) {
              console.trace();
            }
          }
        }
      }

      // If the parent is currently rendering, wait until it has completed
      // until calling the nested View's `afterRender`.
      if (rentManager && (rentManager.renderInProgress || rentManager.queue)) {
        // Wait until the parent View has finished rendering, which could be
        // asynchronous, and trigger afterRender on this View once it has
        // completed.
        parent.once("afterRender", completeRender);
      } else {
        // This View and its parent have both rendered.
        completeRender();
      }

      return def.resolveWith(root, [root]);
    }

    // Actually facilitate a render.
    function actuallyRender() {

      // The `_viewRender` method is broken out to abstract away from having
      // too much code in `actuallyRender`.
      root._render().done(function() {
        // If there are no children to worry about, complete the render
        // instantly.
        if (!_.keys(root.views).length) {
          return resolve();
        }

        // Create a list of promises to wait on until rendering is done.
        // Since this method will run on all children as well, its sufficient
        // for a full hierarchical.
        var promises = _.map(root.views, function(view) {
          var insert = _.isArray(view);

          // If items are being inserted, they will be in a non-zero length
          // Array.
          if (insert && view.length) {
            // Mark each subview's manager so they don't attempt to attach by
            // themselves.  Return a single promise representing the entire
            // render.
            return root.when(_.map(view, function(subView) {
              subView.__manager__.insertedViaFragment = true;
              return subView.render().__manager__.renderDeferred;
            }));
          }

          // Only return the fetch deferred, resolve the main deferred after
          // the element has been attached to it's parent.
          return !insert ? view.render().__manager__.renderDeferred : view;
        });

        // Once all nested Views have been rendered, resolve this View's
        // deferred.
        root.when(promises).done(resolve);
      });
    }

    // Mark this render as in progress. This will prevent
    // afterRender from being fired until the entire chain has rendered.
    manager.renderInProgress = true;

    // Start the render.
    // Register this request & cancel any that conflict.
    root._registerWithRAF(actuallyRender, def);

    // Put the deferred inside of the `__manager__` object, since we don't want
    // end users accessing this directly anymore in favor of the `afterRender`
    // event.  So instead of doing `render().then(...` do
    // `render().once("afterRender", ...`.
    // FIXME: I think we need to move back to promises so that we don't
    // miss events, regardless of sync/async (useRAF setting)
    manager.renderDeferred = def;

    // Return the actual View for chainability purposes.
    return root;
  },

  // Ensure the cleanup function is called whenever remove is called.
  remove: function() {
    // Force remove itself from its parent.
    LayoutManager._removeView(this, true);

    // Call the original remove function.
    return this._remove.apply(this, arguments);
  },

  // Register a view render with RAF.
  _registerWithRAF: function(callback, deferred) {
    var root = this;
    var manager = root.__manager__;
    var rentManager = manager.parent && manager.parent.__manager__;

    // Allow RAF processing to be shut off using `useRAF`:false.
    if (this.useRAF === false) {
      if (manager.queue) {
        aPush.call(manager.queue, callback);
      } else {
        manager.queue = [];
        callback();
      }
      return;
    }

    // Keep track of all deferreds so we can resolve them.
    manager.deferreds = manager.deferreds || [];
    manager.deferreds.push(deferred);

    // Schedule resolving all deferreds that are waiting.
    deferred.done(resolveDeferreds);

    // Cancel any other renders on this view that are queued to execute.
    this._cancelQueuedRAFRender();

    // Trigger immediately if the parent was triggered by RAF.
    // The flag propagates downward so this view's children are also
    // rendered immediately.
    if (rentManager && rentManager.triggeredByRAF) {
      return finish();
    }

    // Register this request with requestAnimationFrame.
    manager.rafID = root.requestAnimationFrame(finish);

    function finish() {
      // Remove this ID as it is no longer valid.
      manager.rafID = null;

      // Set flag (will propagate to children) so they render
      // without waiting for RAF.
      manager.triggeredByRAF = true;

      // Call original cb.
      callback();
    }

    // Resolve all deferreds that were cancelled previously, if any.
    // This allows the user to bind callbacks to any render callback,
    // even if it was cancelled above.
    function resolveDeferreds() {
      for (var i = 0; i < manager.deferreds.length; i++){
        manager.deferreds[i].resolveWith(root, [root]);
      }
      manager.deferreds = [];
    }
  },

  // Cancel any queued render requests.
  _cancelQueuedRAFRender: function() {
    var root = this;
    var manager = root.__manager__;
    if (manager.rafID != null) {
      root.cancelAnimationFrame(manager.rafID);
    }
  }
},

// Static Properties
{
  // Clearable cache.
  _cache: {},

  // Remove all nested Views.
  _removeViews: function(root, force) {
    // Shift arguments around.
    if (typeof root === "boolean") {
      force = root;
      root = this;
    }

    // Allow removeView to be called on instances.
    root = root || this;

    // Iterate over all of the nested View's and remove.
    root.getViews().each(function(view) {
      // Force doesn't care about if a View has rendered or not.
      if (view.hasRendered || force) {
        LayoutManager._removeView(view, force);
      }
    });
  },

  // Remove a single nested View.
  _removeView: function(view, force) {
    var parentViews;
    // Shorthand the managers for easier access.
    var manager = view.__manager__;
    var rentManager = manager.parent && manager.parent.__manager__;
    // Test for keep.
    var keep = typeof view.keep === "boolean" ? view.keep : view.options.keep;

    // In insert mode, remove views that do not have `keep` attribute set,
    // unless the force flag is set.
    if ((!keep && rentManager && rentManager.insert === true) || force) {
      // Clean out the events.
      LayoutManager.cleanViews(view);

      // Since we are removing this view, force subviews to remove
      view._removeViews(true);

      // Remove the View completely.
      view.$el.remove();

      // Cancel any pending renders, if present.
      view._cancelQueuedRAFRender();

      // Bail out early if no parent exists.
      if (!manager.parent) { return; }

      // Assign (if they exist) the sibling Views to a property.
      parentViews = manager.parent.views[manager.selector];

      // If this is an array of items remove items that are not marked to
      // keep.
      if (_.isArray(parentViews)) {
        // Remove duplicate Views.
        _.each(_.clone(parentViews), function(view, i) {
          // If the managers match, splice off this View.
          if (view && view.__manager__ === manager) {
            aSplice.call(parentViews, i, 1);
          }
        });
        if (_.isEmpty(parentViews)) {
          manager.parent.trigger("empty", manager.selector);
        }
        return;
      }

      // Otherwise delete the parent selector.
      delete manager.parent.views[manager.selector];
      manager.parent.trigger("empty", manager.selector);
    }
  },

  // Cache templates into LayoutManager._cache.
  cache: function(path, contents) {
    // If template path is found in the cache, return the contents.
    if (path in this._cache && contents == null) {
      return this._cache[path];
    // Ensure path and contents aren't undefined.
    } else if (path != null && contents != null) {
      return this._cache[path] = contents;
    }

    // If the template is not in the cache, return undefined.
  },

  // Accept either a single view or an array of views to clean of all DOM
  // events internal model and collection references and all Backbone.Events.
  cleanViews: function(views) {
    // Clear out all existing views.
    _.each(aConcat.call([], views), function(view) {
      // Remove all custom events attached to this View.
      view.unbind();

      // Automatically unbind `model`.
      if (view.model instanceof Backbone.Model) {
        view.model.off(null, null, view);
      }

      // Automatically unbind `collection`.
      if (view.collection instanceof Backbone.Collection) {
        view.collection.off(null, null, view);
      }

      // Automatically unbind events bound to this View.
      view.stopListening();

      // If a custom cleanup method was provided on the view, call it after
      // the initial cleanup is done
      if (_.isFunction(view.cleanup)) {
        view.cleanup();
      }
    });
  },

  // This static method allows for global configuration of LayoutManager.
  configure: function(options) {
    _.extend(LayoutManager.prototype, options);

    // Allow LayoutManager to manage Backbone.View.prototype.
    if (options.manage) {
      Backbone.View.prototype.manage = true;
    }

    // Disable the element globally.
    if (options.el === false) {
      Backbone.View.prototype.el = false;
    }

    // Allow global configuration of `suppressWarnings`.
    if (options.suppressWarnings === true) {
      Backbone.View.prototype.suppressWarnings = true;
    }

    // Allow global configuration of `useRAF`.
    if (options.useRAF === false) {
      Backbone.View.prototype.useRAF = false;
    }
  },

  // Configure a View to work with the LayoutManager plugin.
  setupView: function(views, options) {
    // Ensure that options is always an object, and clone it so that
    // changes to the original object don't screw up this view.
    options = _.extend({}, options);

    // Set up all Views passed.
    _.each(aConcat.call([], views), function(view) {
      // If the View has already been setup, no need to do it again.
      if (view.__manager__) {
        return;
      }

      var views, declaredViews;
      var proto = LayoutManager.prototype;

      // Ensure necessary properties are set.
      _.defaults(view, {
        // Ensure a view always has a views object.
        views: {},

        // Ensure a view always has a sections object.
        sections: {},

        // Internal state object used to store whether or not a View has been
        // taken over by layout manager and if it has been rendered into the
        // DOM.
        __manager__: {},

        // Add the ability to remove all Views.
        _removeViews: LayoutManager._removeViews,

        // Add the ability to remove itself.
        _removeView: LayoutManager._removeView

      // Mix in all LayoutManager prototype properties as well.
      }, LayoutManager.prototype);

      // Assign passed options.
      view.options = options;

      // Merge the View options into the View.
      _.extend(view, options);

      // By default the original Remove function is the Backbone.View one.
      view._remove = Backbone.View.prototype.remove;

      // Ensure the render is always set correctly.
      view.render = LayoutManager.prototype.render;

      // If the user provided their own remove override, use that instead of
      // the default.
      if (view.remove !== proto.remove) {
        view._remove = view.remove;
        view.remove = proto.remove;
      }

      // Normalize views to exist on either instance or options, default to
      // options.
      views = options.views || view.views;

      // Set the internal views, only if selectors have been provided.
      if (_.keys(views).length) {
        // Keep original object declared containing Views.
        declaredViews = views;

        // Reset the property to avoid duplication or overwritting.
        view.views = {};

        // If any declared view is wrapped in a function, invoke it.
        _.each(declaredViews, function(declaredView, key) {
          if (typeof declaredView === "function") {
            declaredViews[key] = declaredView.call(view, view);
          }
        });

        // Set the declared Views.
        view.setViews(declaredViews);
      }
    });
  }
});

LayoutManager.VERSION = "0.9.6";

// Expose through Backbone object.
Backbone.Layout = LayoutManager;

// Override _configure to provide extra functionality that is necessary in
// order for the render function reference to be bound during initialize.
Backbone.View.prototype.constructor = function(options) {
  var noel;

  // Ensure options is always an object.
  options = options || {};

  // Remove the container element provided by Backbone.
  if ("el" in options ? options.el === false : this.el === false) {
    noel = true;
  }

  // If manage is set, do it!
  if (options.manage || this.manage) {
    // Set up this View.
    LayoutManager.setupView(this, options);
  }

  // Assign the `noel` property once we're sure the View we're working with is
  // managed by LayoutManager.
  if (this.__manager__) {
    this.__manager__.noel = noel;
    this.__manager__.suppressWarnings = options.suppressWarnings;
  }

  // Act like nothing happened.
  ViewConstructor.apply(this, arguments);
};

Backbone.View = Backbone.View.prototype.constructor;

// Copy over the extend method.
Backbone.View.extend = ViewConstructor.extend;

// Copy over the prototype as well.
Backbone.View.prototype = ViewConstructor.prototype;

// Default configuration options; designed to be overriden.
var defaultOptions = {
  // Prefix template/layout paths.
  prefix: "",

  // Use requestAnimationFrame to queue up view rendering and cancel
  // repeat requests. Leave on for better performance.
  useRAF: true,

  // Can be used to supply a different deferred implementation.
  deferred: function() {
    return $.Deferred();
  },

  // Fetch is passed a path and is expected to return template contents as a
  // function or string.
  fetchTemplate: function(path) {
    return _.template($(path).html());
  },

  // By default, render using underscore's templating and trim output.
  renderTemplate: function(template, context) {
    return trim(template.call(this, context));
  },

  // By default, pass model attributes to the templates
  serialize: function() {
    return this.model ? _.clone(this.model.attributes) : {};
  },

  // This is the most common way you will want to partially apply a view into
  // a layout.
  partial: function($root, $el, rentManager, manager) {
    var $filtered;

    // If selector is specified, attempt to find it.
    if (manager.selector) {
      if (rentManager.noel) {
        $filtered = $root.filter(manager.selector);
        $root = $filtered.length ? $filtered : $root.find(manager.selector);
      } else {
        $root = $root.find(manager.selector);
      }
    }

    // Use the insert method if the parent's `insert` argument is true.
    if (rentManager.insert) {
      this.insert($root, $el);
    } else {
      this.html($root, $el);
    }
  },

  // Override this with a custom HTML method, passed a root element and content
  // (a jQuery collection or a string) to replace the innerHTML with.
  html: function($root, content) {
    $root.html(content);
  },

  // Used for inserting subViews in a single batch.  This gives a small
  // performance boost as we write to a disconnected fragment instead of to the
  // DOM directly. Smarter browsers like Chrome will batch writes internally
  // and layout as seldom as possible, but even in that case this provides a
  // decent boost.  jQuery will use a DocumentFragment for the batch update,
  // but Cheerio in Node will not.
  htmlBatch: function(rootView, subViews, selector) {
    // Shorthand the parent manager object.
    var rentManager = rootView.__manager__;
    // Create a simplified manager object that tells partial() where
    // place the elements.
    var manager = { selector: selector };

    // Get the elements to be inserted into the root view.
    var els = _.reduce(subViews, function(memo, sub) {
      // Check if keep is present - do boolean check in case the user
      // has created a `keep` function.
      var keep = typeof sub.keep === "boolean" ? sub.keep : sub.options.keep;
      // If a subView is present, don't push it.  This can only happen if
      // `keep: true`.  We do the keep check for speed as $.contains is not
      // cheap.
      var exists = keep && $.contains(rootView.el, sub.el);

      // If there is an element and it doesn't already exist in our structure
      // attach it.
      if (sub.el && !exists) {
        memo.push(sub.el);
      }

      return memo;
    }, []);

    // Use partial to apply the elements. Wrap els in jQ obj for cheerio.
    return this.partial(rootView.$el, $(els), rentManager, manager);
  },

  // Very similar to HTML except this one will appendChild by default.
  insert: function($root, $el) {
    $root.append($el);
  },

  // Return a deferred for when all promises resolve/reject.
  when: function(promises) {
    return $.when.apply(null, promises);
  },

  // A method to determine if a View contains another.
  contains: function(parent, child) {
    return $.contains(parent, child);
  },

  // Based on:
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and
  // Tino Zijdel.
  requestAnimationFrame: (function() {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    var requestAnimationFrame = window.requestAnimationFrame;

    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
    }

    if (!requestAnimationFrame){
      requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    return _.bind(requestAnimationFrame, window);
  })(),

  cancelAnimationFrame: (function() {
    var vendors = ["ms", "moz", "webkit", "o"];
    var cancelAnimationFrame = window.cancelAnimationFrame;

    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      cancelAnimationFrame =
        window[vendors[i] + "CancelAnimationFrame"] ||
        window[vendors[i] + "CancelRequestAnimationFrame"];
    }

    if (!cancelAnimationFrame) {
      cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }

    return _.bind(cancelAnimationFrame, window);
  })()
};

// Extend LayoutManager with default options.
_.extend(LayoutManager.prototype, defaultOptions);

// Assign `LayoutManager` object for AMD loaders.
return LayoutManager;

}));

/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab: */
/**
 * Backbone-relational.js 0.8.8
 * (c) 2011-2013 Paul Uithol and contributors (https://github.com/PaulUithol/Backbone-relational/graphs/contributors)
 *
 * Backbone-relational may be freely distributed under the MIT license; see the accompanying LICENSE.txt.
 * For details and documentation: https://github.com/PaulUithol/Backbone-relational.
 * Depends on Backbone (and thus on Underscore as well): https://github.com/documentcloud/backbone.
 *
 * Example:
 *
	Zoo = Backbone.RelationalModel.extend({
		relations: [ {
			type: Backbone.HasMany,
			key: 'animals',
			relatedModel: 'Animal',
			reverseRelation: {
				key: 'livesIn',
				includeInJSON: 'id'
				// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
			}
		} ],

		toString: function() {
			return this.get( 'name' );
		}
	});

	Animal = Backbone.RelationalModel.extend({
		toString: function() {
			return this.get( 'species' );
		}
	});

	// Creating the zoo will give it a collection with one animal in it: the monkey.
	// The animal created after that has a relation `livesIn` that points to the zoo it's currently associated with.
	// If you instantiate (or fetch) the zebra later, it will automatically be added.

	var zoo = new Zoo({
		name: 'Artis',
		animals: [ { id: 'monkey-1', species: 'Chimp' }, 'lion-1', 'zebra-1' ]
	});

	var lion = new Animal( { id: 'lion-1', species: 'Lion' } ),
		monkey = zoo.get( 'animals' ).first(),
		sameZoo = lion.get( 'livesIn' );
 */
( function( root, factory ) {
	// Set up Backbone-relational for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( 'relational',[ 'exports', 'backbone', 'underscore' ], factory );
	}
	// Next for Node.js or CommonJS.
	else if ( typeof exports !== 'undefined' ) {
		factory( exports, require( 'backbone' ), require( 'underscore' ) );
	}
	// Finally, as a browser global. Use `root` here as it references `window`.
	else {
		factory( root, root.Backbone, root._ );
	}
}( this, function( exports, Backbone, _ ) {
	"use strict";

	Backbone.Relational = {
		showWarnings: true
	};

	/**
	 * Semaphore mixin; can be used as both binary and counting.
	 **/
	Backbone.Semaphore = {
		_permitsAvailable: null,
		_permitsUsed: 0,

		acquire: function() {
			if ( this._permitsAvailable && this._permitsUsed >= this._permitsAvailable ) {
				throw new Error( 'Max permits acquired' );
			}
			else {
				this._permitsUsed++;
			}
		},

		release: function() {
			if ( this._permitsUsed === 0 ) {
				throw new Error( 'All permits released' );
			}
			else {
				this._permitsUsed--;
			}
		},

		isLocked: function() {
			return this._permitsUsed > 0;
		},

		setAvailablePermits: function( amount ) {
			if ( this._permitsUsed > amount ) {
				throw new Error( 'Available permits cannot be less than used permits' );
			}
			this._permitsAvailable = amount;
		}
	};

	/**
	 * A BlockingQueue that accumulates items while blocked (via 'block'),
	 * and processes them when unblocked (via 'unblock').
	 * Process can also be called manually (via 'process').
	 */
	Backbone.BlockingQueue = function() {
		this._queue = [];
	};
	_.extend( Backbone.BlockingQueue.prototype, Backbone.Semaphore, {
		_queue: null,

		add: function( func ) {
			if ( this.isBlocked() ) {
				this._queue.push( func );
			}
			else {
				func();
			}
		},

		// Some of the queued events may trigger other blocking events. By
		// copying the queue here it allows queued events to process closer to
		// the natural order.
		//
		// queue events [ 'A', 'B', 'C' ]
		// A handler of 'B' triggers 'D' and 'E'
		// By copying `this._queue` this executes:
		// [ 'A', 'B', 'D', 'E', 'C' ]
		// The same order the would have executed if they didn't have to be
		// delayed and queued.
		process: function() {
			var queue = this._queue;
			this._queue = [];
			while ( queue && queue.length ) {
				queue.shift()();
			}
		},

		block: function() {
			this.acquire();
		},

		unblock: function() {
			this.release();
			if ( !this.isBlocked() ) {
				this.process();
			}
		},

		isBlocked: function() {
			return this.isLocked();
		}
	});
	/**
	 * Global event queue. Accumulates external events ('add:<key>', 'remove:<key>' and 'change:<key>')
	 * until the top-level object is fully initialized (see 'Backbone.RelationalModel').
	 */
	Backbone.Relational.eventQueue = new Backbone.BlockingQueue();

	/**
	 * Backbone.Store keeps track of all created (and destruction of) Backbone.RelationalModel.
	 * Handles lookup for relations.
	 */
	Backbone.Store = function() {
		this._collections = [];
		this._reverseRelations = [];
		this._orphanRelations = [];
		this._subModels = [];
		this._modelScopes = [ exports ];
	};
	_.extend( Backbone.Store.prototype, Backbone.Events, {
		/**
		 * Create a new `Relation`.
		 * @param {Backbone.RelationalModel} [model]
		 * @param {Object} relation
		 * @param {Object} [options]
		 */
		initializeRelation: function( model, relation, options ) {
			var type = !_.isString( relation.type ) ? relation.type : Backbone[ relation.type ] || this.getObjectByName( relation.type );
			if ( type && type.prototype instanceof Backbone.Relation ) {
				new type( model, relation, options ); // Also pushes the new Relation into `model._relations`
			}
			else {
				Backbone.Relational.showWarnings && typeof console !== 'undefined' && console.warn( 'Relation=%o; missing or invalid relation type!', relation );
			}
		},

		/**
		 * Add a scope for `getObjectByName` to look for model types by name.
		 * @param {Object} scope
		 */
		addModelScope: function( scope ) {
			this._modelScopes.push( scope );
		},

		/**
		 * Remove a scope.
		 * @param {Object} scope
		 */
		removeModelScope: function( scope ) {
			this._modelScopes = _.without( this._modelScopes, scope );
		},

		/**
		 * Add a set of subModelTypes to the store, that can be used to resolve the '_superModel'
		 * for a model later in 'setupSuperModel'.
		 *
		 * @param {Backbone.RelationalModel} subModelTypes
		 * @param {Backbone.RelationalModel} superModelType
		 */
		addSubModels: function( subModelTypes, superModelType ) {
			this._subModels.push({
				'superModelType': superModelType,
				'subModels': subModelTypes
			});
		},

		/**
		 * Check if the given modelType is registered as another model's subModel. If so, add it to the super model's
		 * '_subModels', and set the modelType's '_superModel', '_subModelTypeName', and '_subModelTypeAttribute'.
		 *
		 * @param {Backbone.RelationalModel} modelType
		 */
		setupSuperModel: function( modelType ) {
			_.find( this._subModels, function( subModelDef ) {
				return _.filter( subModelDef.subModels || [], function( subModelTypeName, typeValue ) {
					var subModelType = this.getObjectByName( subModelTypeName );

					if ( modelType === subModelType ) {
						// Set 'modelType' as a child of the found superModel
						subModelDef.superModelType._subModels[ typeValue ] = modelType;

						// Set '_superModel', '_subModelTypeValue', and '_subModelTypeAttribute' on 'modelType'.
						modelType._superModel = subModelDef.superModelType;
						modelType._subModelTypeValue = typeValue;
						modelType._subModelTypeAttribute = subModelDef.superModelType.prototype.subModelTypeAttribute;
						return true;
					}
				}, this ).length;
			}, this );
		},

		/**
		 * Add a reverse relation. Is added to the 'relations' property on model's prototype, and to
		 * existing instances of 'model' in the store as well.
		 * @param {Object} relation
		 * @param {Backbone.RelationalModel} relation.model
		 * @param {String} relation.type
		 * @param {String} relation.key
		 * @param {String|Object} relation.relatedModel
		 */
		addReverseRelation: function( relation ) {
			var exists = _.any( this._reverseRelations, function( rel ) {
				return _.all( relation || [], function( val, key ) {
					return val === rel[ key ];
				});
			});

			if ( !exists && relation.model && relation.type ) {
				this._reverseRelations.push( relation );
				this._addRelation( relation.model, relation );
				this.retroFitRelation( relation );
			}
		},

		/**
		 * Deposit a `relation` for which the `relatedModel` can't be resolved at the moment.
		 *
		 * @param {Object} relation
		 */
		addOrphanRelation: function( relation ) {
			var exists = _.any( this._orphanRelations, function( rel ) {
				return _.all( relation || [], function( val, key ) {
					return val === rel[ key ];
				});
			});

			if ( !exists && relation.model && relation.type ) {
				this._orphanRelations.push( relation );
			}
		},

		/**
		 * Try to initialize any `_orphanRelation`s
		 */
		processOrphanRelations: function() {
			// Make sure to operate on a copy since we're removing while iterating
			_.each( this._orphanRelations.slice( 0 ), function( rel ) {
				var relatedModel = Backbone.Relational.store.getObjectByName( rel.relatedModel );
				if ( relatedModel ) {
					this.initializeRelation( null, rel );
					this._orphanRelations = _.without( this._orphanRelations, rel );
				}
			}, this );
		},

		/**
		 *
		 * @param {Backbone.RelationalModel.constructor} type
		 * @param {Object} relation
		 * @private
		 */
		_addRelation: function( type, relation ) {
			if ( !type.prototype.relations ) {
				type.prototype.relations = [];
			}
			type.prototype.relations.push( relation );

			_.each( type._subModels || [], function( subModel ) {
				this._addRelation( subModel, relation );
			}, this );
		},

		/**
		 * Add a 'relation' to all existing instances of 'relation.model' in the store
		 * @param {Object} relation
		 */
		retroFitRelation: function( relation ) {
			var coll = this.getCollection( relation.model, false );
			coll && coll.each( function( model ) {
				if ( !( model instanceof relation.model ) ) {
					return;
				}

				new relation.type( model, relation );
			}, this );
		},

		/**
		 * Find the Store's collection for a certain type of model.
		 * @param {Backbone.RelationalModel} type
		 * @param {Boolean} [create=true] Should a collection be created if none is found?
		 * @return {Backbone.Collection} A collection if found (or applicable for 'model'), or null
		 */
		getCollection: function( type, create ) {
			if ( type instanceof Backbone.RelationalModel ) {
				type = type.constructor;
			}

			var rootModel = type;
			while ( rootModel._superModel ) {
				rootModel = rootModel._superModel;
			}

			var coll = _.find( this._collections, function( item ) {
				return item.model === rootModel;
			});

			if ( !coll && create !== false ) {
				coll = this._createCollection( rootModel );
			}

			return coll;
		},

		/**
		 * Find a model type on one of the modelScopes by name. Names are split on dots.
		 * @param {String} name
		 * @return {Object}
		 */
		getObjectByName: function( name ) {
			var parts = name.split( '.' ),
				type = null;

			_.find( this._modelScopes, function( scope ) {
				type = _.reduce( parts || [], function( memo, val ) {
					return memo ? memo[ val ] : undefined;
				}, scope );

				if ( type && type !== scope ) {
					return true;
				}
			}, this );

			return type;
		},

		_createCollection: function( type ) {
			var coll;

			// If 'type' is an instance, take its constructor
			if ( type instanceof Backbone.RelationalModel ) {
				type = type.constructor;
			}

			// Type should inherit from Backbone.RelationalModel.
			if ( type.prototype instanceof Backbone.RelationalModel ) {
				coll = new Backbone.Collection();
				coll.model = type;

				this._collections.push( coll );
			}

			return coll;
		},

		/**
		 * Find the attribute that is to be used as the `id` on a given object
		 * @param type
		 * @param {String|Number|Object|Backbone.RelationalModel} item
		 * @return {String|Number}
		 */
		resolveIdForItem: function( type, item ) {
			var id = _.isString( item ) || _.isNumber( item ) ? item : null;

			if ( id === null ) {
				if ( item instanceof Backbone.RelationalModel ) {
					id = item.id;
				}
				else if ( _.isObject( item ) ) {
					id = item[ type.prototype.idAttribute ];
				}
			}

			// Make all falsy values `null` (except for 0, which could be an id.. see '/issues/179')
			if ( !id && id !== 0 ) {
				id = null;
			}

			return id;
		},

		/**
		 * Find a specific model of a certain `type` in the store
		 * @param type
		 * @param {String|Number|Object|Backbone.RelationalModel} item
		 */
		find: function( type, item ) {
			var id = this.resolveIdForItem( type, item ),
				coll = this.getCollection( type );

			// Because the found object could be of any of the type's superModel
			// types, only return it if it's actually of the type asked for.
			if ( coll ) {
				var obj = coll.get( id );

				if ( obj instanceof type ) {
					return obj;
				}
			}

			return null;
		},

		/**
		 * Add a 'model' to its appropriate collection. Retain the original contents of 'model.collection'.
		 * @param {Backbone.RelationalModel} model
		 */
		register: function( model ) {
			var coll = this.getCollection( model );

			if ( coll ) {
				var modelColl = model.collection;
				coll.add( model );
				model.collection = modelColl;
			}
		},

		/**
		 * Check if the given model may use the given `id`
		 * @param model
		 * @param [id]
		 */
		checkId: function( model, id ) {
			var coll = this.getCollection( model ),
				duplicate = coll && coll.get( id );

			if ( duplicate && model !== duplicate ) {
				if ( Backbone.Relational.showWarnings && typeof console !== 'undefined' ) {
					console.warn( 'Duplicate id! Old RelationalModel=%o, new RelationalModel=%o', duplicate, model );
				}

				throw new Error( "Cannot instantiate more than one Backbone.RelationalModel with the same id per type!" );
			}
		},

		/**
		 * Explicitly update a model's id in its store collection
		 * @param {Backbone.RelationalModel} model
		 */
		update: function( model ) {
			var coll = this.getCollection( model );

			// Register a model if it isn't yet (which happens if it was created without an id).
			if ( !coll.contains( model ) ) {
				this.register( model );
			}

			// This triggers updating the lookup indices kept in a collection
			coll._onModelEvent( 'change:' + model.idAttribute, model, coll );

			// Trigger an event on model so related models (having the model's new id in their keyContents) can add it.
			model.trigger( 'relational:change:id', model, coll );
		},

		/**
		 * Unregister from the store: a specific model, a collection, or a model type.
		 * @param {Backbone.RelationalModel|Backbone.RelationalModel.constructor|Backbone.Collection} type
		 */
		unregister: function( type ) {
			var coll,
				models;

			if ( type instanceof Backbone.Model ) {
				coll = this.getCollection( type );
				models = [ type ];
			}
			else if ( type instanceof Backbone.Collection ) {
				coll = this.getCollection( type.model );
				models = _.clone( type.models );
			}
			else {
				coll = this.getCollection( type );
				models = _.clone( coll.models );
			}

			_.each( models, function( model ) {
				this.stopListening( model );
				_.invoke( model.getRelations(), 'stopListening' );
			}, this );


			// If we've unregistered an entire store collection, reset the collection (which is much faster).
			// Otherwise, remove each model one by one.
			if ( _.contains( this._collections, type ) ) {
				coll.reset( [] );
			}
			else {
				_.each( models, function( model ) {
					if ( coll.get( model ) ) {
						coll.remove( model );
					}
					else {
						coll.trigger( 'relational:remove', model, coll );
					}
				}, this );
			}
		},

		/**
		 * Reset the `store` to it's original state. The `reverseRelations` are kept though, since attempting to
		 * re-initialize these on models would lead to a large amount of warnings.
		 */
		reset: function() {
			this.stopListening();

			// Unregister each collection to remove event listeners
			_.each( this._collections, function( coll ) {
				this.unregister( coll );
			}, this );

			this._collections = [];
			this._subModels = [];
			this._modelScopes = [ exports ];
		}
	});
	Backbone.Relational.store = new Backbone.Store();

	/**
	 * The main Relation class, from which 'HasOne' and 'HasMany' inherit. Internally, 'relational:<key>' events
	 * are used to regulate addition and removal of models from relations.
	 *
	 * @param {Backbone.RelationalModel} [instance] Model that this relation is created for. If no model is supplied,
	 *      Relation just tries to instantiate it's `reverseRelation` if specified, and bails out after that.
	 * @param {Object} options
	 * @param {string} options.key
	 * @param {Backbone.RelationalModel.constructor} options.relatedModel
	 * @param {Boolean|String} [options.includeInJSON=true] Serialize the given attribute for related model(s)' in toJSON, or just their ids.
	 * @param {Boolean} [options.createModels=true] Create objects from the contents of keys if the object is not found in Backbone.store.
	 * @param {Object} [options.reverseRelation] Specify a bi-directional relation. If provided, Relation will reciprocate
	 *    the relation to the 'relatedModel'. Required and optional properties match 'options', except that it also needs
	 *    {Backbone.Relation|String} type ('HasOne' or 'HasMany').
	 * @param {Object} opts
	 */
	Backbone.Relation = function( instance, options, opts ) {
		this.instance = instance;
		// Make sure 'options' is sane, and fill with defaults from subclasses and this object's prototype
		options = _.isObject( options ) ? options : {};
		this.reverseRelation = _.defaults( options.reverseRelation || {}, this.options.reverseRelation );
		this.options = _.defaults( options, this.options, Backbone.Relation.prototype.options );

		this.reverseRelation.type = !_.isString( this.reverseRelation.type ) ? this.reverseRelation.type :
			Backbone[ this.reverseRelation.type ] || Backbone.Relational.store.getObjectByName( this.reverseRelation.type );

		this.key = this.options.key;
		this.keySource = this.options.keySource || this.key;
		this.keyDestination = this.options.keyDestination || this.keySource || this.key;

		this.model = this.options.model || this.instance.constructor;

		this.relatedModel = this.options.relatedModel;

		if ( _.isFunction( this.relatedModel ) && !( this.relatedModel.prototype instanceof Backbone.RelationalModel ) ) {
			this.relatedModel = _.result( this, 'relatedModel' );
		}
		if ( _.isString( this.relatedModel ) ) {
			this.relatedModel = Backbone.Relational.store.getObjectByName( this.relatedModel );
		}

		if ( !this.checkPreconditions() ) {
			return;
		}

		// Add the reverse relation on 'relatedModel' to the store's reverseRelations
		if ( !this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key ) {
			Backbone.Relational.store.addReverseRelation( _.defaults( {
					isAutoRelation: true,
					model: this.relatedModel,
					relatedModel: this.model,
					reverseRelation: this.options // current relation is the 'reverseRelation' for its own reverseRelation
				},
				this.reverseRelation // Take further properties from this.reverseRelation (type, key, etc.)
			) );
		}

		if ( instance ) {
			var contentKey = this.keySource;
			if ( contentKey !== this.key && typeof this.instance.get( this.key ) === 'object' ) {
				contentKey = this.key;
			}

			this.setKeyContents( this.instance.get( contentKey ) );
			this.relatedCollection = Backbone.Relational.store.getCollection( this.relatedModel );

			// Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
			if ( this.keySource !== this.key ) {
				delete this.instance.attributes[ this.keySource ];
			}

			// Add this Relation to instance._relations
			this.instance._relations[ this.key ] = this;

			this.initialize( opts );

			if ( this.options.autoFetch ) {
				this.instance.fetchRelated( this.key, _.isObject( this.options.autoFetch ) ? this.options.autoFetch : {} );
			}

			// When 'relatedModel' are created or destroyed, check if it affects this relation.
			this.listenTo( this.instance, 'destroy', this.destroy )
				.listenTo( this.relatedCollection, 'relational:add relational:change:id', this.tryAddRelated )
				.listenTo( this.relatedCollection, 'relational:remove', this.removeRelated )
		}
	};
	// Fix inheritance :\
	Backbone.Relation.extend = Backbone.Model.extend;
	// Set up all inheritable **Backbone.Relation** properties and methods.
	_.extend( Backbone.Relation.prototype, Backbone.Events, Backbone.Semaphore, {
		options: {
			createModels: true,
			includeInJSON: true,
			isAutoRelation: false,
			autoFetch: false,
			parse: false
		},

		instance: null,
		key: null,
		keyContents: null,
		relatedModel: null,
		relatedCollection: null,
		reverseRelation: null,
		related: null,

		/**
		 * Check several pre-conditions.
		 * @return {Boolean} True if pre-conditions are satisfied, false if they're not.
		 */
		checkPreconditions: function() {
			var i = this.instance,
				k = this.key,
				m = this.model,
				rm = this.relatedModel,
				warn = Backbone.Relational.showWarnings && typeof console !== 'undefined';

			if ( !m || !k || !rm ) {
				warn && console.warn( 'Relation=%o: missing model, key or relatedModel (%o, %o, %o).', this, m, k, rm );
				return false;
			}
			// Check if the type in 'model' inherits from Backbone.RelationalModel
			if ( !( m.prototype instanceof Backbone.RelationalModel ) ) {
				warn && console.warn( 'Relation=%o: model does not inherit from Backbone.RelationalModel (%o).', this, i );
				return false;
			}
			// Check if the type in 'relatedModel' inherits from Backbone.RelationalModel
			if ( !( rm.prototype instanceof Backbone.RelationalModel ) ) {
				warn && console.warn( 'Relation=%o: relatedModel does not inherit from Backbone.RelationalModel (%o).', this, rm );
				return false;
			}
			// Check if this is not a HasMany, and the reverse relation is HasMany as well
			if ( this instanceof Backbone.HasMany && this.reverseRelation.type === Backbone.HasMany ) {
				warn && console.warn( 'Relation=%o: relation is a HasMany, and the reverseRelation is HasMany as well.', this );
				return false;
			}
			// Check if we're not attempting to create a relationship on a `key` that's already used.
			if ( i && _.keys( i._relations ).length ) {
				var existing = _.find( i._relations, function( rel ) {
					return rel.key === k;
				}, this );

				if ( existing ) {
					warn && console.warn( 'Cannot create relation=%o on %o for model=%o: already taken by relation=%o.',
						this, k, i, existing );
					return false;
				}
			}

			return true;
		},

		/**
		 * Set the related model(s) for this relation
		 * @param {Backbone.Model|Backbone.Collection} related
		 */
		setRelated: function( related ) {
			this.related = related;
			this.instance.attributes[ this.key ] = related;
		},

		/**
		 * Determine if a relation (on a different RelationalModel) is the reverse
		 * relation of the current one.
		 * @param {Backbone.Relation} relation
		 * @return {Boolean}
		 */
		_isReverseRelation: function( relation ) {
			return relation.instance instanceof this.relatedModel && this.reverseRelation.key === relation.key &&
				this.key === relation.reverseRelation.key;
		},

		/**
		 * Get the reverse relations (pointing back to 'this.key' on 'this.instance') for the currently related model(s).
		 * @param {Backbone.RelationalModel} [model] Get the reverse relations for a specific model.
		 *    If not specified, 'this.related' is used.
		 * @return {Backbone.Relation[]}
		 */
		getReverseRelations: function( model ) {
			var reverseRelations = [];
			// Iterate over 'model', 'this.related.models' (if this.related is a Backbone.Collection), or wrap 'this.related' in an array.
			var models = !_.isUndefined( model ) ? [ model ] : this.related && ( this.related.models || [ this.related ] );
			_.each( models || [], function( related ) {
				_.each( related.getRelations() || [], function( relation ) {
					if ( this._isReverseRelation( relation ) ) {
						reverseRelations.push( relation );
					}
				}, this );
			}, this );

			return reverseRelations;
		},

		/**
		 * When `this.instance` is destroyed, cleanup our relations.
		 * Get reverse relation, call removeRelated on each.
		 */
		destroy: function() {
			this.stopListening();

			if ( this instanceof Backbone.HasOne ) {
				this.setRelated( null );
			}
			else if ( this instanceof Backbone.HasMany ) {
				this.setRelated( this._prepareCollection() );
			}

			_.each( this.getReverseRelations(), function( relation ) {
				relation.removeRelated( this.instance );
			}, this );
		}
	});

	Backbone.HasOne = Backbone.Relation.extend({
		options: {
			reverseRelation: { type: 'HasMany' }
		},

		initialize: function( opts ) {
			this.listenTo( this.instance, 'relational:change:' + this.key, this.onChange );

			var related = this.findRelated( opts );
			this.setRelated( related );

			// Notify new 'related' object of the new relation.
			_.each( this.getReverseRelations(), function( relation ) {
				relation.addRelated( this.instance, opts );
			}, this );
		},

		/**
		 * Find related Models.
		 * @param {Object} [options]
		 * @return {Backbone.Model}
		 */
		findRelated: function( options ) {
			var related = null;

			options = _.defaults( { parse: this.options.parse }, options );

			if ( this.keyContents instanceof this.relatedModel ) {
				related = this.keyContents;
			}
			else if ( this.keyContents || this.keyContents === 0 ) { // since 0 can be a valid `id` as well
				var opts = _.defaults( { create: this.options.createModels }, options );
				related = this.relatedModel.findOrCreate( this.keyContents, opts );
			}

			// Nullify `keyId` if we have a related model; in case it was already part of the relation
			if ( related ) {
				this.keyId = null;
			}

			return related;
		},

		/**
		 * Normalize and reduce `keyContents` to an `id`, for easier comparison
		 * @param {String|Number|Backbone.Model} keyContents
		 */
		setKeyContents: function( keyContents ) {
			this.keyContents = keyContents;
			this.keyId = Backbone.Relational.store.resolveIdForItem( this.relatedModel, this.keyContents );
		},

		/**
		 * Event handler for `change:<key>`.
		 * If the key is changed, notify old & new reverse relations and initialize the new relation.
		 */
		onChange: function( model, attr, options ) {
			// Don't accept recursive calls to onChange (like onChange->findRelated->findOrCreate->initializeRelations->addRelated->onChange)
			if ( this.isLocked() ) {
				return;
			}
			this.acquire();
			options = options ? _.clone( options ) : {};

			// 'options.__related' is set by 'addRelated'/'removeRelated'. If it is set, the change
			// is the result of a call from a relation. If it's not, the change is the result of
			// a 'set' call on this.instance.
			var changed = _.isUndefined( options.__related ),
				oldRelated = changed ? this.related : options.__related;

			if ( changed ) {
				this.setKeyContents( attr );
				var related = this.findRelated( options );
				this.setRelated( related );
			}

			// Notify old 'related' object of the terminated relation
			if ( oldRelated && this.related !== oldRelated ) {
				_.each( this.getReverseRelations( oldRelated ), function( relation ) {
					relation.removeRelated( this.instance, null, options );
				}, this );
			}

			// Notify new 'related' object of the new relation. Note we do re-apply even if this.related is oldRelated;
			// that can be necessary for bi-directional relations if 'this.instance' was created after 'this.related'.
			// In that case, 'this.instance' will already know 'this.related', but the reverse might not exist yet.
			_.each( this.getReverseRelations(), function( relation ) {
				relation.addRelated( this.instance, options );
			}, this );

			// Fire the 'change:<key>' event if 'related' was updated
			if ( !options.silent && this.related !== oldRelated ) {
				var dit = this;
				this.changed = true;
				Backbone.Relational.eventQueue.add( function() {
					dit.instance.trigger( 'change:' + dit.key, dit.instance, dit.related, options, true );
					dit.changed = false;
				});
			}
			this.release();
		},

		/**
		 * If a new 'this.relatedModel' appears in the 'store', try to match it to the last set 'keyContents'
		 */
		tryAddRelated: function( model, coll, options ) {
			if ( ( this.keyId || this.keyId === 0 ) && model.id === this.keyId ) { // since 0 can be a valid `id` as well
				this.addRelated( model, options );
				this.keyId = null;
			}
		},

		addRelated: function( model, options ) {
			// Allow 'model' to set up its relations before proceeding.
			// (which can result in a call to 'addRelated' from a relation of 'model')
			var dit = this;
			model.queue( function() {
				if ( model !== dit.related ) {
					var oldRelated = dit.related || null;
					dit.setRelated( model );
					dit.onChange( dit.instance, model, _.defaults( { __related: oldRelated }, options ) );
				}
			});
		},

		removeRelated: function( model, coll, options ) {
			if ( !this.related ) {
				return;
			}

			if ( model === this.related ) {
				var oldRelated = this.related || null;
				this.setRelated( null );
				this.onChange( this.instance, model, _.defaults( { __related: oldRelated }, options ) );
			}
		}
	});

	Backbone.HasMany = Backbone.Relation.extend({
		collectionType: null,

		options: {
			reverseRelation: { type: 'HasOne' },
			collectionType: Backbone.Collection,
			collectionKey: true,
			collectionOptions: {}
		},

		initialize: function( opts ) {
			this.listenTo( this.instance, 'relational:change:' + this.key, this.onChange );

			// Handle a custom 'collectionType'
			this.collectionType = this.options.collectionType;
			if ( _.isFunction( this.collectionType ) && this.collectionType !== Backbone.Collection && !( this.collectionType.prototype instanceof Backbone.Collection ) ) {
				this.collectionType = _.result( this, 'collectionType' );
			}
			if ( _.isString( this.collectionType ) ) {
				this.collectionType = Backbone.Relational.store.getObjectByName( this.collectionType );
			}
			if ( this.collectionType !== Backbone.Collection && !( this.collectionType.prototype instanceof Backbone.Collection ) ) {
				throw new Error( '`collectionType` must inherit from Backbone.Collection' );
			}

			var related = this.findRelated( opts );
			this.setRelated( related );
		},

		/**
		 * Bind events and setup collectionKeys for a collection that is to be used as the backing store for a HasMany.
		 * If no 'collection' is supplied, a new collection will be created of the specified 'collectionType' option.
		 * @param {Backbone.Collection} [collection]
		 * @return {Backbone.Collection}
		 */
		_prepareCollection: function( collection ) {
			if ( this.related ) {
				this.stopListening( this.related );
			}

			if ( !collection || !( collection instanceof Backbone.Collection ) ) {
				var options = _.isFunction( this.options.collectionOptions ) ?
					this.options.collectionOptions( this.instance ) : this.options.collectionOptions;

				collection = new this.collectionType( null, options );
			}

			collection.model = this.relatedModel;

			if ( this.options.collectionKey ) {
				var key = this.options.collectionKey === true ? this.options.reverseRelation.key : this.options.collectionKey;

				if ( collection[ key ] && collection[ key ] !== this.instance ) {
					if ( Backbone.Relational.showWarnings && typeof console !== 'undefined' ) {
						console.warn( 'Relation=%o; collectionKey=%s already exists on collection=%o', this, key, this.options.collectionKey );
					}
				}
				else if ( key ) {
					collection[ key ] = this.instance;
				}
			}

			this.listenTo( collection, 'relational:add', this.handleAddition )
				.listenTo( collection, 'relational:remove', this.handleRemoval )
				.listenTo( collection, 'relational:reset', this.handleReset );

			return collection;
		},

		/**
		 * Find related Models.
		 * @param {Object} [options]
		 * @return {Backbone.Collection}
		 */
		findRelated: function( options ) {
			var related = null;

			options = _.defaults( { parse: this.options.parse }, options );

			// Replace 'this.related' by 'this.keyContents' if it is a Backbone.Collection
			if ( this.keyContents instanceof Backbone.Collection ) {
				this._prepareCollection( this.keyContents );
				related = this.keyContents;
			}
			// Otherwise, 'this.keyContents' should be an array of related object ids.
			// Re-use the current 'this.related' if it is a Backbone.Collection; otherwise, create a new collection.
			else {
				var toAdd = [];

				_.each( this.keyContents, function( attributes ) {
					if ( attributes instanceof this.relatedModel ) {
						var model = attributes;
					}
					else {
						// If `merge` is true, update models here, instead of during update.
						model = this.relatedModel.findOrCreate( attributes,
							_.extend( { merge: true }, options, { create: this.options.createModels } )
						);
					}

					model && toAdd.push( model );
				}, this );

				if ( this.related instanceof Backbone.Collection ) {
					related = this.related;
				}
				else {
					related = this._prepareCollection();
				}

				// By now, both `merge` and `parse` will already have been executed for models if they were specified.
				// Disable them to prevent additional calls.
				related.set( toAdd, _.defaults( { merge: false, parse: false }, options ) );
			}

			// Remove entries from `keyIds` that were already part of the relation (and are thus 'unchanged')
			this.keyIds = _.difference( this.keyIds, _.pluck( related.models, 'id' ) );

			return related;
		},

		/**
		 * Normalize and reduce `keyContents` to a list of `ids`, for easier comparison
		 * @param {String|Number|String[]|Number[]|Backbone.Collection} keyContents
		 */
		setKeyContents: function( keyContents ) {
			this.keyContents = keyContents instanceof Backbone.Collection ? keyContents : null;
			this.keyIds = [];

			if ( !this.keyContents && ( keyContents || keyContents === 0 ) ) { // since 0 can be a valid `id` as well
				// Handle cases the an API/user supplies just an Object/id instead of an Array
				this.keyContents = _.isArray( keyContents ) ? keyContents : [ keyContents ];

				_.each( this.keyContents, function( item ) {
					var itemId = Backbone.Relational.store.resolveIdForItem( this.relatedModel, item );
					if ( itemId || itemId === 0 ) {
						this.keyIds.push( itemId );
					}
				}, this );
			}
		},

		/**
		 * Event handler for `change:<key>`.
		 * If the contents of the key are changed, notify old & new reverse relations and initialize the new relation.
		 */
		onChange: function( model, attr, options ) {
			options = options ? _.clone( options ) : {};
			this.setKeyContents( attr );
			this.changed = false;

			var related = this.findRelated( options );
			this.setRelated( related );

			if ( !options.silent ) {
				var dit = this;
				Backbone.Relational.eventQueue.add( function() {
					// The `changed` flag can be set in `handleAddition` or `handleRemoval`
					if ( dit.changed ) {
						dit.instance.trigger( 'change:' + dit.key, dit.instance, dit.related, options, true );
						dit.changed = false;
					}
				});
			}
		},

		/**
		 * When a model is added to a 'HasMany', trigger 'add' on 'this.instance' and notify reverse relations.
		 * (should be 'HasOne', must set 'this.instance' as their related).
		 */
		handleAddition: function( model, coll, options ) {
			//console.debug('handleAddition called; args=%o', arguments);
			options = options ? _.clone( options ) : {};
			this.changed = true;

			_.each( this.getReverseRelations( model ), function( relation ) {
				relation.addRelated( this.instance, options );
			}, this );

			// Only trigger 'add' once the newly added model is initialized (so, has its relations set up)
			var dit = this;
			!options.silent && Backbone.Relational.eventQueue.add( function() {
				dit.instance.trigger( 'add:' + dit.key, model, dit.related, options );
			});
		},

		/**
		 * When a model is removed from a 'HasMany', trigger 'remove' on 'this.instance' and notify reverse relations.
		 * (should be 'HasOne', which should be nullified)
		 */
		handleRemoval: function( model, coll, options ) {
			//console.debug('handleRemoval called; args=%o', arguments);
			options = options ? _.clone( options ) : {};
			this.changed = true;

			_.each( this.getReverseRelations( model ), function( relation ) {
				relation.removeRelated( this.instance, null, options );
			}, this );

			var dit = this;
			!options.silent && Backbone.Relational.eventQueue.add( function() {
				dit.instance.trigger( 'remove:' + dit.key, model, dit.related, options );
			});
		},

		handleReset: function( coll, options ) {
			var dit = this;
			options = options ? _.clone( options ) : {};
			!options.silent && Backbone.Relational.eventQueue.add( function() {
				dit.instance.trigger( 'reset:' + dit.key, dit.related, options );
			});
		},

		tryAddRelated: function( model, coll, options ) {
			var item = _.contains( this.keyIds, model.id );

			if ( item ) {
				this.addRelated( model, options );
				this.keyIds = _.without( this.keyIds, model.id );
			}
		},

		addRelated: function( model, options ) {
			// Allow 'model' to set up its relations before proceeding.
			// (which can result in a call to 'addRelated' from a relation of 'model')
			var dit = this;
			model.queue( function() {
				if ( dit.related && !dit.related.get( model ) ) {
					dit.related.add( model, _.defaults( { parse: false }, options ) );
				}
			});
		},

		removeRelated: function( model, coll, options ) {
			if ( this.related.get( model ) ) {
				this.related.remove( model, options );
			}
		}
	});

	/**
	 * A type of Backbone.Model that also maintains relations to other models and collections.
	 * New events when compared to the original:
	 *  - 'add:<key>' (model, related collection, options)
	 *  - 'remove:<key>' (model, related collection, options)
	 *  - 'change:<key>' (model, related model or collection, options)
	 */
	Backbone.RelationalModel = Backbone.Model.extend({
		relations: null, // Relation descriptions on the prototype
		_relations: null, // Relation instances
		_isInitialized: false,
		_deferProcessing: false,
		_queue: null,
		_attributeChangeFired: false, // Keeps track of `change` event firing under some conditions (like nested `set`s)

		subModelTypeAttribute: 'type',
		subModelTypes: null,

		constructor: function( attributes, options ) {
			// Nasty hack, for cases like 'model.get( <HasMany key> ).add( item )'.
			// Defer 'processQueue', so that when 'Relation.createModels' is used we trigger 'HasMany'
			// collection events only after the model is really fully set up.
			// Example: event for "p.on( 'add:jobs' )" -> "p.get('jobs').add( { company: c.id, person: p.id } )".
			if ( options && options.collection ) {
				var dit = this,
					collection = this.collection = options.collection;

				// Prevent `collection` from cascading down to nested models; they shouldn't go into this `if` clause.
				delete options.collection;

				this._deferProcessing = true;

				var processQueue = function( model ) {
					if ( model === dit ) {
						dit._deferProcessing = false;
						dit.processQueue();
						collection.off( 'relational:add', processQueue );
					}
				};
				collection.on( 'relational:add', processQueue );

				// So we do process the queue eventually, regardless of whether this model actually gets added to 'options.collection'.
				_.defer( function() {
					processQueue( dit );
				});
			}

			Backbone.Relational.store.processOrphanRelations();
			Backbone.Relational.store.listenTo( this, 'relational:unregister', Backbone.Relational.store.unregister );

			this._queue = new Backbone.BlockingQueue();
			this._queue.block();
			Backbone.Relational.eventQueue.block();

			try {
				Backbone.Model.apply( this, arguments );
			}
			finally {
				// Try to run the global queue holding external events
				Backbone.Relational.eventQueue.unblock();
			}
		},

		/**
		 * Override 'trigger' to queue 'change' and 'change:*' events
		 */
		trigger: function( eventName ) {
			if ( eventName.length > 5 && eventName.indexOf( 'change' ) === 0 ) {
				var dit = this,
					args = arguments;

				if ( !Backbone.Relational.eventQueue.isLocked() ) {
					// If we're not in a more complicated nested scenario, fire the change event right away
					Backbone.Model.prototype.trigger.apply( dit, args );
				}
				else {
					Backbone.Relational.eventQueue.add( function() {
						// Determine if the `change` event is still valid, now that all relations are populated
						var changed = true;
						if ( eventName === 'change' ) {
							// `hasChanged` may have gotten reset by nested calls to `set`.
							changed = dit.hasChanged() || dit._attributeChangeFired;
							dit._attributeChangeFired = false;
						}
						else {
							var attr = eventName.slice( 7 ),
								rel = dit.getRelation( attr );

							if ( rel ) {
								// If `attr` is a relation, `change:attr` get triggered from `Relation.onChange`.
								// These take precedence over `change:attr` events triggered by `Model.set`.
								// The relation sets a fourth attribute to `true`. If this attribute is present,
								// continue triggering this event; otherwise, it's from `Model.set` and should be stopped.
								changed = ( args[ 4 ] === true );

								// If this event was triggered by a relation, set the right value in `this.changed`
								// (a Collection or Model instead of raw data).
								if ( changed ) {
									dit.changed[ attr ] = args[ 2 ];
								}
								// Otherwise, this event is from `Model.set`. If the relation doesn't report a change,
								// remove attr from `dit.changed` so `hasChanged` doesn't take it into account.
								else if ( !rel.changed ) {
									delete dit.changed[ attr ];
								}
							}
							else if ( changed ) {
								dit._attributeChangeFired = true;
							}
						}

						changed && Backbone.Model.prototype.trigger.apply( dit, args );
					});
				}
			}
			else if ( eventName === 'destroy' ) {
				Backbone.Model.prototype.trigger.apply( this, arguments );
				Backbone.Relational.store.unregister( this );
			}
			else {
				Backbone.Model.prototype.trigger.apply( this, arguments );
			}

			return this;
		},

		/**
		 * Initialize Relations present in this.relations; determine the type (HasOne/HasMany), then creates a new instance.
		 * Invoked in the first call so 'set' (which is made from the Backbone.Model constructor).
		 */
		initializeRelations: function( options ) {
			this.acquire(); // Setting up relations often also involve calls to 'set', and we only want to enter this function once
			this._relations = {};

			_.each( this.relations || [], function( rel ) {
				Backbone.Relational.store.initializeRelation( this, rel, options );
			}, this );

			this._isInitialized = true;
			this.release();
			this.processQueue();
		},

		/**
		 * When new values are set, notify this model's relations (also if options.silent is set).
		 * (called from `set`; Relation.setRelated locks this model before calling 'set' on it to prevent loops)
		 * @param {Object} [changedAttrs]
		 * @param {Object} [options]
		 */
		updateRelations: function( changedAttrs, options ) {
			if ( this._isInitialized && !this.isLocked() ) {
				_.each( this._relations, function( rel ) {
					if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
						// Fetch data in `rel.keySource` if data got set in there, or `rel.key` otherwise
						var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ],
							attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );

						// Update a relation if its value differs from this model's attributes, or it's been explicitly nullified.
						// Which can also happen before the originally intended related model has been found (`val` is null).
						if ( rel.related !== value || ( value === null && attr === null ) ) {
							this.trigger( 'relational:change:' + rel.key, this, value, options || {} );
						}
					}

					// Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
					if ( rel.keySource !== rel.key ) {
						delete this.attributes[ rel.keySource ];
					}
				}, this );
			}
		},

		/**
		 * Either add to the queue (if we're not initialized yet), or execute right away.
		 */
		queue: function( func ) {
			this._queue.add( func );
		},

		/**
		 * Process _queue
		 */
		processQueue: function() {
			if ( this._isInitialized && !this._deferProcessing && this._queue.isBlocked() ) {
				this._queue.unblock();
			}
		},

		/**
		 * Get a specific relation.
		 * @param {string} key The relation key to look for.
		 * @return {Backbone.Relation} An instance of 'Backbone.Relation', if a relation was found for 'key', or null.
		 */
		getRelation: function( key ) {
			return this._relations[ key ];
		},

		/**
		 * Get all of the created relations.
		 * @return {Backbone.Relation[]}
		 */
		getRelations: function() {
			return _.values( this._relations );
		},

		/**
		 * Retrieve related objects.
		 * @param {string} key The relation key to fetch models for.
		 * @param {Object} [options] Options for 'Backbone.Model.fetch' and 'Backbone.sync'.
		 * @param {Boolean} [refresh=false] Fetch existing models from the server as well (in order to update them).
		 * @return {jQuery.when[]} An array of request objects
		 */
		fetchRelated: function( key, options, refresh ) {
			// Set default `options` for fetch
			options = _.extend( { update: true, remove: false }, options );

			var models,
				setUrl,
				requests = [],
				rel = this.getRelation( key ),
				idsToFetch = rel && ( ( rel.keyIds && rel.keyIds.slice( 0 ) ) || ( ( rel.keyId || rel.keyId === 0 ) ? [ rel.keyId ] : [] ) );

			// On `refresh`, add the ids for current models in the relation to `idsToFetch`
			if ( refresh ) {
				models = rel.related instanceof Backbone.Collection ? rel.related.models : [ rel.related ];
				_.each( models, function( model ) {
					if ( model.id || model.id === 0 ) {
						idsToFetch.push( model.id );
					}
				});
			}

			if ( idsToFetch && idsToFetch.length ) {
				// Find (or create) a model for each one that is to be fetched
				var created = [];
				models = _.map( idsToFetch, function( id ) {
					var model = rel.relatedModel.findModel( id );

					if ( !model ) {
						var attrs = {};
						attrs[ rel.relatedModel.prototype.idAttribute ] = id;
						model = rel.relatedModel.findOrCreate( attrs, options );
						created.push( model );
					}

					return model;
				}, this );

				// Try if the 'collection' can provide a url to fetch a set of models in one request.
				if ( rel.related instanceof Backbone.Collection && _.isFunction( rel.related.url ) ) {
					setUrl = rel.related.url( models );
				}

				// An assumption is that when 'Backbone.Collection.url' is a function, it can handle building of set urls.
				// To make sure it can, test if the url we got by supplying a list of models to fetch is different from
				// the one supplied for the default fetch action (without args to 'url').
				if ( setUrl && setUrl !== rel.related.url() ) {
					var opts = _.defaults(
						{
							error: function() {
								var args = arguments;
								_.each( created, function( model ) {
									model.trigger( 'destroy', model, model.collection, options );
									options.error && options.error.apply( model, args );
								});
							},
							url: setUrl
						},
						options
					);

					requests = [ rel.related.fetch( opts ) ];
				}
				else {
					requests = _.map( models, function( model ) {
						var opts = _.defaults(
							{
								error: function() {
									if ( _.contains( created, model ) ) {
										model.trigger( 'destroy', model, model.collection, options );
										options.error && options.error.apply( model, arguments );
									}
								}
							},
							options
						);
						return model.fetch( opts );
					}, this );
				}
			}

			return requests;
		},

		get: function( attr ) {
			var originalResult = Backbone.Model.prototype.get.call( this, attr );

			// Use `originalResult` get if dotNotation not enabled or not required because no dot is in `attr`
			if ( !this.dotNotation || attr.indexOf( '.' ) === -1 ) {
				return originalResult;
			}

			// Go through all splits and return the final result
			var splits = attr.split( '.' );
			var result = _.reduce( splits, function( model, split ) {
				if ( _.isNull( model ) || _.isUndefined( model ) ) {
					// Return undefined if the path cannot be expanded
					return undefined;
				}
				else if ( model instanceof Backbone.Model ) {
					return Backbone.Model.prototype.get.call( model, split );
				}
				else if ( model instanceof Backbone.Collection ) {
					return Backbone.Collection.prototype.at.call( model, split )
				}
				else {
					throw new Error( 'Attribute must be an instanceof Backbone.Model or Backbone.Collection. Is: ' + model + ', currentSplit: ' + split );
				}
			}, this );

			if ( originalResult !== undefined && result !== undefined ) {
				throw new Error( "Ambiguous result for '" + attr + "'. direct result: " + originalResult + ", dotNotation: " + result );
			}

			return originalResult || result;
		},

		set: function( key, value, options ) {
			Backbone.Relational.eventQueue.block();

			// Duplicate backbone's behavior to allow separate key/value parameters, instead of a single 'attributes' object
			var attributes;
			if ( _.isObject( key ) || key == null ) {
				attributes = key;
				options = value;
			}
			else {
				attributes = {};
				attributes[ key ] = value;
			}

			try {
				var id = this.id,
					newId = attributes && this.idAttribute in attributes && attributes[ this.idAttribute ];

				// Check if we're not setting a duplicate id before actually calling `set`.
				Backbone.Relational.store.checkId( this, newId );

				var result = Backbone.Model.prototype.set.apply( this, arguments );

				// Ideal place to set up relations, if this is the first time we're here for this model
				if ( !this._isInitialized && !this.isLocked() ) {
					this.constructor.initializeModelHierarchy();

					// Only register models that have an id. A model will be registered when/if it gets an id later on.
					if ( newId || newId === 0 ) {
						Backbone.Relational.store.register( this );
					}

					this.initializeRelations( options );
				}
				// The store should know about an `id` update asap
				else if ( newId && newId !== id ) {
					Backbone.Relational.store.update( this );
				}

				if ( attributes ) {
					this.updateRelations( attributes, options );
				}
			}
			finally {
				// Try to run the global queue holding external events
				Backbone.Relational.eventQueue.unblock();
			}

			return result;
		},

		clone: function() {
			var attributes = _.clone( this.attributes );
			if ( !_.isUndefined( attributes[ this.idAttribute ] ) ) {
				attributes[ this.idAttribute ] = null;
			}

			_.each( this.getRelations(), function( rel ) {
				delete attributes[ rel.key ];
			});

			return new this.constructor( attributes );
		},

		/**
		 * Convert relations to JSON, omits them when required
		 */
		toJSON: function( options ) {
			// If this Model has already been fully serialized in this branch once, return to avoid loops
			if ( this.isLocked() ) {
				return this.id;
			}

			this.acquire();
			var json = Backbone.Model.prototype.toJSON.call( this, options );

			if ( this.constructor._superModel && !( this.constructor._subModelTypeAttribute in json ) ) {
				json[ this.constructor._subModelTypeAttribute ] = this.constructor._subModelTypeValue;
			}

			_.each( this._relations, function( rel ) {
				var related = json[ rel.key ],
					includeInJSON = rel.options.includeInJSON,
					value = null;

				if ( includeInJSON === true ) {
					if ( related && _.isFunction( related.toJSON ) ) {
						value = related.toJSON( options );
					}
				}
				else if ( _.isString( includeInJSON ) ) {
					if ( related instanceof Backbone.Collection ) {
						value = related.pluck( includeInJSON );
					}
					else if ( related instanceof Backbone.Model ) {
						value = related.get( includeInJSON );
					}

					// Add ids for 'unfound' models if includeInJSON is equal to (only) the relatedModel's `idAttribute`
					if ( includeInJSON === rel.relatedModel.prototype.idAttribute ) {
						if ( rel instanceof Backbone.HasMany ) {
							value = value.concat( rel.keyIds );
						}
						else if ( rel instanceof Backbone.HasOne ) {
							value = value || rel.keyId;

							if ( !value && !_.isObject( rel.keyContents ) ) {
								value = rel.keyContents || null;
							}
						}
					}
				}
				else if ( _.isArray( includeInJSON ) ) {
					if ( related instanceof Backbone.Collection ) {
						value = [];
						related.each( function( model ) {
							var curJson = {};
							_.each( includeInJSON, function( key ) {
								curJson[ key ] = model.get( key );
							});
							value.push( curJson );
						});
					}
					else if ( related instanceof Backbone.Model ) {
						value = {};
						_.each( includeInJSON, function( key ) {
							value[ key ] = related.get( key );
						});
					}
				}
				else {
					delete json[ rel.key ];
				}

				if ( includeInJSON ) {
					json[ rel.keyDestination ] = value;
				}

				if ( rel.keyDestination !== rel.key ) {
					delete json[ rel.key ];
				}
			});

			this.release();
			return json;
		}
	},
	{
		/**
		 *
		 * @param superModel
		 * @returns {Backbone.RelationalModel.constructor}
		 */
		setup: function( superModel ) {
			// We don't want to share a relations array with a parent, as this will cause problems with reverse
			// relations. Since `relations` may also be a property or function, only use slice if we have an array.
			this.prototype.relations = ( this.prototype.relations || [] ).slice( 0 );

			this._subModels = {};
			this._superModel = null;

			// If this model has 'subModelTypes' itself, remember them in the store
			if ( this.prototype.hasOwnProperty( 'subModelTypes' ) ) {
				Backbone.Relational.store.addSubModels( this.prototype.subModelTypes, this );
			}
			// The 'subModelTypes' property should not be inherited, so reset it.
			else {
				this.prototype.subModelTypes = null;
			}

			// Initialize all reverseRelations that belong to this new model.
			_.each( this.prototype.relations || [], function( rel ) {
				if ( !rel.model ) {
					rel.model = this;
				}

				if ( rel.reverseRelation && rel.model === this ) {
					var preInitialize = true;
					if ( _.isString( rel.relatedModel ) ) {
						/**
						 * The related model might not be defined for two reasons
						 *  1. it is related to itself
						 *  2. it never gets defined, e.g. a typo
						 *  3. the model hasn't been defined yet, but will be later
						 * In neither of these cases do we need to pre-initialize reverse relations.
						 * However, for 3. (which is, to us, indistinguishable from 2.), we do need to attempt
						 * setting up this relation again later, in case the related model is defined later.
						 */
						var relatedModel = Backbone.Relational.store.getObjectByName( rel.relatedModel );
						preInitialize = relatedModel && ( relatedModel.prototype instanceof Backbone.RelationalModel );
					}

					if ( preInitialize ) {
						Backbone.Relational.store.initializeRelation( null, rel );
					}
					else if ( _.isString( rel.relatedModel ) ) {
						Backbone.Relational.store.addOrphanRelation( rel );
					}
				}
			}, this );

			return this;
		},

		/**
		 * Create a 'Backbone.Model' instance based on 'attributes'.
		 * @param {Object} attributes
		 * @param {Object} [options]
		 * @return {Backbone.Model}
		 */
		build: function( attributes, options ) {
			// 'build' is a possible entrypoint; it's possible no model hierarchy has been determined yet.
			this.initializeModelHierarchy();

			// Determine what type of (sub)model should be built if applicable.
			var model = this._findSubModelType( this, attributes ) || this;

			return new model( attributes, options );
		},

		/**
		 * Determines what type of (sub)model should be built if applicable.
		 * Looks up the proper subModelType in 'this._subModels', recursing into
		 * types until a match is found.  Returns the applicable 'Backbone.Model'
		 * or null if no match is found.
		 * @param {Backbone.Model} type
		 * @param {Object} attributes
		 * @return {Backbone.Model}
		 */
		_findSubModelType: function( type, attributes ) {
			if ( type._subModels && type.prototype.subModelTypeAttribute in attributes ) {
				var subModelTypeAttribute = attributes[ type.prototype.subModelTypeAttribute ];
				var subModelType = type._subModels[ subModelTypeAttribute ];
				if ( subModelType ) {
					return subModelType;
				}
				else {
					// Recurse into subModelTypes to find a match
					for ( subModelTypeAttribute in type._subModels ) {
						subModelType = this._findSubModelType( type._subModels[ subModelTypeAttribute ], attributes );
						if ( subModelType ) {
							return subModelType;
						}
					}
				}
			}
			return null;
		},

		/**
		 *
		 */
		initializeModelHierarchy: function() {
			// Inherit any relations that have been defined in the parent model.
			this.inheritRelations();

			// If we came here through 'build' for a model that has 'subModelTypes' then try to initialize the ones that
			// haven't been resolved yet.
			if ( this.prototype.subModelTypes ) {
				var resolvedSubModels = _.keys( this._subModels );
				var unresolvedSubModels = _.omit( this.prototype.subModelTypes, resolvedSubModels );
				_.each( unresolvedSubModels, function( subModelTypeName ) {
					var subModelType = Backbone.Relational.store.getObjectByName( subModelTypeName );
					subModelType && subModelType.initializeModelHierarchy();
				});
			}
		},

		inheritRelations: function() {
			// Bail out if we've been here before.
			if ( !_.isUndefined( this._superModel ) && !_.isNull( this._superModel ) ) {
				return;
			}
			// Try to initialize the _superModel.
			Backbone.Relational.store.setupSuperModel( this );

			// If a superModel has been found, copy relations from the _superModel if they haven't been inherited automatically
			// (due to a redefinition of 'relations').
			if ( this._superModel ) {
				// The _superModel needs a chance to initialize its own inherited relations before we attempt to inherit relations
				// from the _superModel. You don't want to call 'initializeModelHierarchy' because that could cause sub-models of
				// this class to inherit their relations before this class has had chance to inherit it's relations.
				this._superModel.inheritRelations();
				if ( this._superModel.prototype.relations ) {
					// Find relations that exist on the '_superModel', but not yet on this model.
					var inheritedRelations = _.filter( this._superModel.prototype.relations || [], function( superRel ) {
						return !_.any( this.prototype.relations || [], function( rel ) {
							return superRel.relatedModel === rel.relatedModel && superRel.key === rel.key;
						}, this );
					}, this );

					this.prototype.relations = inheritedRelations.concat( this.prototype.relations );
				}
			}
			// Otherwise, make sure we don't get here again for this type by making '_superModel' false so we fail the
			// isUndefined/isNull check next time.
			else {
				this._superModel = false;
			}
		},

		/**
		 * Find an instance of `this` type in 'Backbone.Relational.store'.
		 * A new model is created if no matching model is found, `attributes` is an object, and `options.create` is true.
		 * - If `attributes` is a string or a number, `findOrCreate` will query the `store` and return a model if found.
		 * - If `attributes` is an object and is found in the store, the model will be updated with `attributes` unless `options.update` is `false`.
		 * @param {Object|String|Number} attributes Either a model's id, or the attributes used to create or update a model.
		 * @param {Object} [options]
		 * @param {Boolean} [options.create=true]
		 * @param {Boolean} [options.merge=true]
		 * @param {Boolean} [options.parse=false]
		 * @return {Backbone.RelationalModel}
		 */
		findOrCreate: function( attributes, options ) {
			options || ( options = {} );
			var parsedAttributes = ( _.isObject( attributes ) && options.parse && this.prototype.parse ) ?
				this.prototype.parse( _.clone( attributes ) ) : attributes;

			// If specified, use a custom `find` function to match up existing models to the given attributes.
			// Otherwise, try to find an instance of 'this' model type in the store
			var model = this.findModel( parsedAttributes );

			// If we found an instance, update it with the data in 'item' (unless 'options.merge' is false).
			// If not, create an instance (unless 'options.create' is false).
			if ( _.isObject( attributes ) ) {
				if ( model && options.merge !== false ) {
					// Make sure `options.collection` and `options.url` doesn't cascade to nested models
					delete options.collection;
					delete options.url;

					model.set( parsedAttributes, options );
				}
				else if ( !model && options.create !== false ) {
					model = this.build( parsedAttributes, _.defaults( { parse: false }, options ) );
				}
			}

			return model;
		},

		/**
		 * Find an instance of `this` type in 'Backbone.Relational.store'.
		 * - If `attributes` is a string or a number, `find` will query the `store` and return a model if found.
		 * - If `attributes` is an object and is found in the store, the model will be updated with `attributes` unless `options.update` is `false`.
		 * @param {Object|String|Number} attributes Either a model's id, or the attributes used to create or update a model.
		 * @param {Object} [options]
		 * @param {Boolean} [options.merge=true]
		 * @param {Boolean} [options.parse=false]
		 * @return {Backbone.RelationalModel}
		 */
		find: function( attributes, options ) {
			options || ( options = {} );
			options.create = false;
			return this.findOrCreate( attributes, options );
		},

		/**
		 * A hook to override the matching when updating (or creating) a model.
		 * The default implementation is to look up the model by id in the store.
		 * @param {Object} attributes
		 * @returns {Backbone.RelationalModel}
		 */
		findModel: function( attributes ) {
			return Backbone.Relational.store.find( this, attributes );
		}
	});
	_.extend( Backbone.RelationalModel.prototype, Backbone.Semaphore );

	/**
	 * Override Backbone.Collection._prepareModel, so objects will be built using the correct type
	 * if the collection.model has subModels.
	 * Attempts to find a model for `attrs` in Backbone.store through `findOrCreate`
	 * (which sets the new properties on it if found), or instantiates a new model.
	 */
	Backbone.Collection.prototype.__prepareModel = Backbone.Collection.prototype._prepareModel;
	Backbone.Collection.prototype._prepareModel = function( attrs, options ) {
		var model;

		if ( attrs instanceof Backbone.Model ) {
			if ( !attrs.collection ) {
				attrs.collection = this;
			}
			model = attrs;
		}
		else {
			options = options ? _.clone( options ) : {};
			options.collection = this;

			if ( typeof this.model.findOrCreate !== 'undefined' ) {
				model = this.model.findOrCreate( attrs, options );
			}
			else {
				model = new this.model( attrs, options );
			}

			if ( model && model.validationError ) {
				this.trigger( 'invalid', this, attrs, options );
				model = false;
			}
		}

		return model;
	};


	/**
	 * Override Backbone.Collection.set, so we'll create objects from attributes where required,
	 * and update the existing models. Also, trigger 'relational:add'.
	 */
	var set = Backbone.Collection.prototype.__set = Backbone.Collection.prototype.set;
	Backbone.Collection.prototype.set = function( models, options ) {
		// Short-circuit if this Collection doesn't hold RelationalModels
		if ( !( this.model.prototype instanceof Backbone.RelationalModel ) ) {
			return set.apply( this, arguments );
		}

		if ( options && options.parse ) {
			models = this.parse( models, options );
		}

		var singular = !_.isArray( models ),
			newModels = [],
			toAdd = [];

		models = singular ? ( models ? [ models ] : [] ) : _.clone( models );

		//console.debug( 'calling add on coll=%o; model=%o, options=%o', this, models, options );
		_.each( models, function( model ) {
			if ( !( model instanceof Backbone.Model ) ) {
				model = Backbone.Collection.prototype._prepareModel.call( this, model, options );
			}

			if ( model ) {
				toAdd.push( model );

				if ( !( this.get( model ) || this.get( model.cid ) ) ) {
					newModels.push( model );
				}
				// If we arrive in `add` while performing a `set` (after a create, so the model gains an `id`),
				// we may get here before `_onModelEvent` has had the chance to update `_byId`.
				else if ( model.id != null ) {
					this._byId[ model.id ] = model;
				}
			}
		}, this );

		// Add 'models' in a single batch, so the original add will only be called once (and thus 'sort', etc).
		// If `parse` was specified, the collection and contained models have been parsed now.
		toAdd = singular ? ( toAdd.length ? toAdd[ 0 ] : null ) : toAdd;
		var result = set.call( this, toAdd, _.defaults( { parse: false }, options ) );

		_.each( newModels, function( model ) {
			// Fire a `relational:add` event for any model in `newModels` that has actually been added to the collection.
			if ( this.get( model ) || this.get( model.cid ) ) {
				this.trigger( 'relational:add', model, this, options );
			}
		}, this );

		return result;
	};

	/**
	 * Override 'Backbone.Collection.remove' to trigger 'relational:remove'.
	 */
	var remove = Backbone.Collection.prototype.__remove = Backbone.Collection.prototype.remove;
	Backbone.Collection.prototype.remove = function( models, options ) {
		// Short-circuit if this Collection doesn't hold RelationalModels
		if ( !( this.model.prototype instanceof Backbone.RelationalModel ) ) {
			return remove.apply( this, arguments );
		}

		var singular = !_.isArray( models ),
			toRemove = [];

		models = singular ? ( models ? [ models ] : [] ) : _.clone( models );
		options || ( options = {} );

		//console.debug('calling remove on coll=%o; models=%o, options=%o', this, models, options );
		_.each( models, function( model ) {
			model = this.get( model ) || ( model && this.get( model.cid ) );
			model && toRemove.push( model );
		}, this );

		var result = remove.call( this, singular ? ( toRemove.length ? toRemove[ 0 ] : null ) : toRemove, options );

		_.each( toRemove, function( model ) {
			this.trigger( 'relational:remove', model, this, options );
		}, this );

		return result;
	};

	/**
	 * Override 'Backbone.Collection.reset' to trigger 'relational:reset'.
	 */
	var reset = Backbone.Collection.prototype.__reset = Backbone.Collection.prototype.reset;
	Backbone.Collection.prototype.reset = function( models, options ) {
		options = _.extend( { merge: true }, options );
		var result = reset.call( this, models, options );

		if ( this.model.prototype instanceof Backbone.RelationalModel ) {
			this.trigger( 'relational:reset', this, options );
		}

		return result;
	};

	/**
	 * Override 'Backbone.Collection.sort' to trigger 'relational:reset'.
	 */
	var sort = Backbone.Collection.prototype.__sort = Backbone.Collection.prototype.sort;
	Backbone.Collection.prototype.sort = function( options ) {
		var result = sort.call( this, options );

		if ( this.model.prototype instanceof Backbone.RelationalModel ) {
			this.trigger( 'relational:reset', this, options );
		}

		return result;
	};

	/**
	 * Override 'Backbone.Collection.trigger' so 'add', 'remove' and 'reset' events are queued until relations
	 * are ready.
	 */
	var trigger = Backbone.Collection.prototype.__trigger = Backbone.Collection.prototype.trigger;
	Backbone.Collection.prototype.trigger = function( eventName ) {
		// Short-circuit if this Collection doesn't hold RelationalModels
		if ( !( this.model.prototype instanceof Backbone.RelationalModel ) ) {
			return trigger.apply( this, arguments );
		}

		if ( eventName === 'add' || eventName === 'remove' || eventName === 'reset' || eventName === 'sort' ) {
			var dit = this,
				args = arguments;

			if ( _.isObject( args[ 3 ] ) ) {
				args = _.toArray( args );
				// the fourth argument is the option object.
				// we need to clone it, as it could be modified while we wait on the eventQueue to be unblocked
				args[ 3 ] = _.clone( args[ 3 ] );
			}

			Backbone.Relational.eventQueue.add( function() {
				trigger.apply( dit, args );
			});
		}
		else {
			trigger.apply( this, arguments );
		}

		return this;
	};

	// Override .extend() to automatically call .setup()
	Backbone.RelationalModel.extend = function( protoProps, classProps ) {
		var child = Backbone.Model.extend.apply( this, arguments );

		child.setup( this );

		return child;
	};
}));

/*
  backbone.paginator 2.0.0
  http://github.com/backbone-paginator/backbone.paginator

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"), require("backbone"));
  }
  // AMD
  else if (typeof define == "function" && define.amd) {
    define('paginator',["underscore", "backbone"], factory);
  }
  // Browser
  else if (typeof _ !== "undefined" && typeof Backbone !== "undefined") {
    var oldPageableCollection = Backbone.PageableCollection;
    var PageableCollection = factory(_, Backbone);

    /**
       __BROWSER ONLY__

       If you already have an object named `PageableCollection` attached to the
       `Backbone` module, you can use this to return a local reference to this
       Backbone.PageableCollection class and reset the name
       Backbone.PageableCollection to its previous definition.

           // The left hand side gives you a reference to this
           // Backbone.PageableCollection implementation, the right hand side
           // resets Backbone.PageableCollection to your other
           // Backbone.PageableCollection.
           var PageableCollection = Backbone.PageableCollection.noConflict();

       @static
       @member Backbone.PageableCollection
       @return {Backbone.PageableCollection}
    */
    Backbone.PageableCollection.noConflict = function () {
      Backbone.PageableCollection = oldPageableCollection;
      return PageableCollection;
    };
  }

}(function (_, Backbone) {

  "use strict";

  var _extend = _.extend;
  var _omit = _.omit;
  var _clone = _.clone;
  var _each = _.each;
  var _pick = _.pick;
  var _contains = _.contains;
  var _isEmpty = _.isEmpty;
  var _pairs = _.pairs;
  var _invert = _.invert;
  var _isArray = _.isArray;
  var _isFunction = _.isFunction;
  var _isObject = _.isObject;
  var _keys = _.keys;
  var _isUndefined = _.isUndefined;
  var ceil = Math.ceil;
  var floor = Math.floor;
  var max = Math.max;

  var BBColProto = Backbone.Collection.prototype;

  function finiteInt (val, name) {
    if (!_.isNumber(val) || _.isNaN(val) || !_.isFinite(val) || ~~val !== val) {
      throw new TypeError("`" + name + "` must be a finite integer");
    }
    return val;
  }

  function queryStringToParams (qs) {
    var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
    var kvps = qs.split('&');
    for (var i = 0, l = kvps.length; i < l; i++) {
      var param = kvps[i];
      kvp = param.split('='), k = kvp[0], v = kvp[1] || true;
      k = decode(k), v = decode(v), ls = params[k];
      if (_isArray(ls)) ls.push(v);
      else if (ls) params[k] = [ls, v];
      else params[k] = v;
    }
    return params;
  }

  // hack to make sure the whatever event handlers for this event is run
  // before func is, and the event handlers that func will trigger.
  function runOnceAtLastHandler (col, event, func) {
    var eventHandlers = col._events[event];
    if (eventHandlers && eventHandlers.length) {
      var lastHandler = eventHandlers[eventHandlers.length - 1];
      var oldCallback = lastHandler.callback;
      lastHandler.callback = function () {
        try {
          oldCallback.apply(this, arguments);
          func();
        }
        catch (e) {
          throw e;
        }
        finally {
          lastHandler.callback = oldCallback;
        }
      };
    }
    else func();
  }

  var PARAM_TRIM_RE = /[\s'"]/g;
  var URL_TRIM_RE = /[<>\s'"]/g;

  /**
     Drop-in replacement for Backbone.Collection. Supports server-side and
     client-side pagination and sorting. Client-side mode also support fully
     multi-directional synchronization of changes between pages.

     @class Backbone.PageableCollection
     @extends Backbone.Collection
  */
  var PageableCollection = Backbone.PageableCollection = Backbone.Collection.extend({

    /**
       The container object to store all pagination states.

       You can override the default state by extending this class or specifying
       them in an `options` hash to the constructor.

       @property {Object} state

       @property {0|1} [state.firstPage=1] The first page index. Set to 0 if
       your server API uses 0-based indices. You should only override this value
       during extension, initialization or reset by the server after
       fetching. This value should be read only at other times.

       @property {number} [state.lastPage=null] The last page index. This value
       is __read only__ and it's calculated based on whether `firstPage` is 0 or
       1, during bootstrapping, fetching and resetting. Please don't change this
       value under any circumstances.

       @property {number} [state.currentPage=null] The current page index. You
       should only override this value during extension, initialization or reset
       by the server after fetching. This value should be read only at other
       times. Can be a 0-based or 1-based index, depending on whether
       `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
       on initialization.

       @property {number} [state.pageSize=25] How many records to show per
       page. This value is __read only__ after initialization, if you want to
       change the page size after initialization, you must call #setPageSize.

       @property {number} [state.totalPages=null] How many pages there are. This
       value is __read only__ and it is calculated from `totalRecords`.

       @property {number} [state.totalRecords=null] How many records there
       are. This value is __required__ under server mode. This value is optional
       for client mode as the number will be the same as the number of models
       during bootstrapping and during fetching, either supplied by the server
       in the metadata, or calculated from the size of the response.

       @property {string} [state.sortKey=null] The model attribute to use for
       sorting.

       @property {-1|0|1} [state.order=-1] The order to use for sorting. Specify
       -1 for ascending order or 1 for descending order. If 0, no client side
       sorting will be done and the order query parameter will not be sent to
       the server during a fetch.
    */
    state: {
      firstPage: 1,
      lastPage: null,
      currentPage: null,
      pageSize: 25,
      totalPages: null,
      totalRecords: null,
      sortKey: null,
      order: -1
    },

    /**
       @property {"server"|"client"|"infinite"} [mode="server"] The mode of
       operations for this collection. `"server"` paginates on the server-side,
       `"client"` paginates on the client-side and `"infinite"` paginates on the
       server-side for APIs that do not support `totalRecords`.
    */
    mode: "server",

    /**
       A translation map to convert Backbone.PageableCollection state attributes
       to the query parameters accepted by your server API.

       You can override the default state by extending this class or specifying
       them in `options.queryParams` object hash to the constructor.

       @property {Object} queryParams
       @property {string} [queryParams.currentPage="page"]
       @property {string} [queryParams.pageSize="per_page"]
       @property {string} [queryParams.totalPages="total_pages"]
       @property {string} [queryParams.totalRecords="total_entries"]
       @property {string} [queryParams.sortKey="sort_by"]
       @property {string} [queryParams.order="order"]
       @property {string} [queryParams.directions={"-1": "asc", "1": "desc"}] A
       map for translating a Backbone.PageableCollection#state.order constant to
       the ones your server API accepts.
    */
    queryParams: {
      currentPage: "page",
      pageSize: "per_page",
      totalPages: "total_pages",
      totalRecords: "total_entries",
      sortKey: "sort_by",
      order: "order",
      directions: {
        "-1": "asc",
        "1": "desc"
      }
    },

    /**
       __CLIENT MODE ONLY__

       This collection is the internal storage for the bootstrapped or fetched
       models. You can use this if you want to operate on all the pages.

       @property {Backbone.Collection} fullCollection
    */

    /**
       Given a list of models or model attributues, bootstraps the full
       collection in client mode or infinite mode, or just the page you want in
       server mode.

       If you want to initialize a collection to a different state than the
       default, you can specify them in `options.state`. Any state parameters
       supplied will be merged with the default. If you want to change the
       default mapping from #state keys to your server API's query parameter
       names, you can specifiy an object hash in `option.queryParams`. Likewise,
       any mapping provided will be merged with the default. Lastly, all
       Backbone.Collection constructor options are also accepted.

       See:

       - Backbone.PageableCollection#state
       - Backbone.PageableCollection#queryParams
       - [Backbone.Collection#initialize](http://backbonejs.org/#Collection-constructor)

       @param {Array.<Object>} [models]

       @param {Object} [options]

       @param {function(*, *): number} [options.comparator] If specified, this
       comparator is set to the current page under server mode, or the #fullCollection
       otherwise.

       @param {boolean} [options.full] If `false` and either a
       `options.comparator` or `sortKey` is defined, the comparator is attached
       to the current page. Default is `true` under client or infinite mode and
       the comparator will be attached to the #fullCollection.

       @param {Object} [options.state] The state attributes overriding the defaults.

       @param {string} [options.state.sortKey] The model attribute to use for
       sorting. If specified instead of `options.comparator`, a comparator will
       be automatically created using this value, and optionally a sorting order
       specified in `options.state.order`. The comparator is then attached to
       the new collection instance.

       @param {-1|1} [options.state.order] The order to use for sorting. Specify
       -1 for ascending order and 1 for descending order.

       @param {Object} [options.queryParam]
    */
    constructor: function (models, options) {

      BBColProto.constructor.apply(this, arguments);

      options = options || {};

      var mode = this.mode = options.mode || this.mode || PageableProto.mode;

      var queryParams = _extend({}, PageableProto.queryParams, this.queryParams,
                                options.queryParams || {});

      queryParams.directions = _extend({},
                                       PageableProto.queryParams.directions,
                                       this.queryParams.directions,
                                       queryParams.directions || {});

      this.queryParams = queryParams;

      var state = this.state = _extend({}, PageableProto.state, this.state,
                                       options.state || {});

      state.currentPage = state.currentPage == null ?
        state.firstPage :
        state.currentPage;

      if (!_isArray(models)) models = models ? [models] : [];
      models = models.slice();

      if (mode != "server" && state.totalRecords == null && !_isEmpty(models)) {
        state.totalRecords = models.length;
      }

      this.switchMode(mode, _extend({fetch: false,
                                     resetState: false,
                                     models: models}, options));

      var comparator = options.comparator;

      if (state.sortKey && !comparator) {
        this.setSorting(state.sortKey, state.order, options);
      }

      if (mode != "server") {
        var fullCollection = this.fullCollection;

        if (comparator && options.full) {
          this.comparator = null;
          fullCollection.comparator = comparator;
        }

        if (options.full) fullCollection.sort();

        // make sure the models in the current page and full collection have the
        // same references
        if (models && !_isEmpty(models)) {
          this.reset(models, _extend({silent: true}, options));
          this.getPage(state.currentPage);
          models.splice.apply(models, [0, models.length].concat(this.models));
        }
      }

      this._initState = _clone(this.state);
    },

    /**
       Makes a Backbone.Collection that contains all the pages.

       @private
       @param {Array.<Object|Backbone.Model>} models
       @param {Object} options Options for Backbone.Collection constructor.
       @return {Backbone.Collection}
    */
    _makeFullCollection: function (models, options) {

      var properties = ["url", "model", "sync", "comparator"];
      var thisProto = this.constructor.prototype;
      var i, length, prop;

      var proto = {};
      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (!_isUndefined(thisProto[prop])) {
          proto[prop] = thisProto[prop];
        }
      }

      var fullCollection = new (Backbone.Collection.extend(proto))(models, options);

      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (this[prop] !== thisProto[prop]) {
          fullCollection[prop] = this[prop];
        }
      }

      return fullCollection;
    },

    /**
       Factory method that returns a Backbone event handler that responses to
       the `add`, `remove`, `reset`, and the `sort` events. The returned event
       handler will synchronize the current page collection and the full
       collection's models.

       @private

       @param {Backbone.PageableCollection} pageCol
       @param {Backbone.Collection} fullCol

       @return {function(string, Backbone.Model, Backbone.Collection, Object)}
       Collection event handler
    */
    _makeCollectionEventHandler: function (pageCol, fullCol) {

      return function collectionEventHandler (event, model, collection, options) {

        var handlers = pageCol._handlers;
        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          pageCol.off(event, handler);
          fullCol.off(event, handler);
        });

        var state = _clone(pageCol.state);
        var firstPage = state.firstPage;
        var currentPage = firstPage === 0 ?
          state.currentPage :
          state.currentPage - 1;
        var pageSize = state.pageSize;
        var pageStart = currentPage * pageSize, pageEnd = pageStart + pageSize;

        if (event == "add") {
          var pageIndex, fullIndex, addAt, colToAdd, options = options || {};
          if (collection == fullCol) {
            fullIndex = fullCol.indexOf(model);
            if (fullIndex >= pageStart && fullIndex < pageEnd) {
              colToAdd = pageCol;
              pageIndex = addAt = fullIndex - pageStart;
            }
          }
          else {
            pageIndex = pageCol.indexOf(model);
            fullIndex = pageStart + pageIndex;
            colToAdd = fullCol;
            var addAt = !_isUndefined(options.at) ?
              options.at + pageStart :
              fullIndex;
          }

          if (!options.onRemove) {
            ++state.totalRecords;
            delete options.onRemove;
          }

          pageCol.state = pageCol._checkState(state);

          if (colToAdd) {
            colToAdd.add(model, _extend({}, options || {}, {at: addAt}));
            var modelToRemove = pageIndex >= pageSize ?
              model :
              !_isUndefined(options.at) && addAt < pageEnd && pageCol.length > pageSize ?
              pageCol.at(pageSize) :
              null;
            if (modelToRemove) {
              runOnceAtLastHandler(collection, event, function () {
                pageCol.remove(modelToRemove, {onAdd: true});
              });
            }
          }
        }

        // remove the model from the other collection as well
        if (event == "remove") {
          if (!options.onAdd) {
            // decrement totalRecords and update totalPages and lastPage
            if (!--state.totalRecords) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            else {
              var totalPages = state.totalPages = ceil(state.totalRecords / pageSize);
              state.lastPage = firstPage === 0 ? totalPages - 1 : totalPages || firstPage;
              if (state.currentPage > totalPages) state.currentPage = state.lastPage;
            }
            pageCol.state = pageCol._checkState(state);

            var nextModel, removedIndex = options.index;
            if (collection == pageCol) {
              if (nextModel = fullCol.at(pageEnd)) {
                runOnceAtLastHandler(pageCol, event, function () {
                  pageCol.push(nextModel, {onRemove: true});
                });
              }
              else if (!pageCol.length && state.totalRecords) {
                pageCol.reset(fullCol.models.slice(pageStart - pageSize, pageEnd - pageSize),
                              _extend({}, options, {parse: false}));
              }
              fullCol.remove(model);
            }
            else if (removedIndex >= pageStart && removedIndex < pageEnd) {
              if (nextModel = fullCol.at(pageEnd - 1)) {
                runOnceAtLastHandler(pageCol, event, function() {
                  pageCol.push(nextModel, {onRemove: true});
                });
              }
              pageCol.remove(model);
              if (!pageCol.length && state.totalRecords) {
                pageCol.reset(fullCol.models.slice(pageStart - pageSize, pageEnd - pageSize),
                              _extend({}, options, {parse: false}));
              }
            }
          }
          else delete options.onAdd;
        }

        if (event == "reset") {
          options = collection;
          collection = model;

          // Reset that's not a result of getPage
          if (collection == pageCol && options.from == null &&
              options.to == null) {
            var head = fullCol.models.slice(0, pageStart);
            var tail = fullCol.models.slice(pageStart + pageCol.models.length);
            fullCol.reset(head.concat(pageCol.models).concat(tail), options);
          }
          else if (collection == fullCol) {
            if (!(state.totalRecords = fullCol.models.length)) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            if (pageCol.mode == "client") {
              state.lastPage = state.currentPage = state.firstPage;
            }
            pageCol.state = pageCol._checkState(state);
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        if (event == "sort") {
          options = collection;
          collection = model;
          if (collection === fullCol) {
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          _each([pageCol, fullCol], function (col) {
            col.on(event, handler);
            var callbacks = col._events[event] || [];
            callbacks.unshift(callbacks.pop());
          });
        });
      };
    },

    /**
       Sanity check this collection's pagination states. Only perform checks
       when all the required pagination state values are defined and not null.
       If `totalPages` is undefined or null, it is set to `totalRecords` /
       `pageSize`. `lastPage` is set according to whether `firstPage` is 0 or 1
       when no error occurs.

       @private

       @throws {TypeError} If `totalRecords`, `pageSize`, `currentPage` or
       `firstPage` is not a finite integer.

       @throws {RangeError} If `pageSize`, `currentPage` or `firstPage` is out
       of bounds.

       @return {Object} Returns the `state` object if no error was found.
    */
    _checkState: function (state) {

      var mode = this.mode;
      var links = this.links;
      var totalRecords = state.totalRecords;
      var pageSize = state.pageSize;
      var currentPage = state.currentPage;
      var firstPage = state.firstPage;
      var totalPages = state.totalPages;

      if (totalRecords != null && pageSize != null && currentPage != null &&
          firstPage != null && (mode == "infinite" ? links : true)) {

        totalRecords = finiteInt(totalRecords, "totalRecords");
        pageSize = finiteInt(pageSize, "pageSize");
        currentPage = finiteInt(currentPage, "currentPage");
        firstPage = finiteInt(firstPage, "firstPage");

        if (pageSize < 1) {
          throw new RangeError("`pageSize` must be >= 1");
        }

        totalPages = state.totalPages = ceil(totalRecords / pageSize);

        if (firstPage < 0 || firstPage > 1) {
          throw new RangeError("`firstPage must be 0 or 1`");
        }

        state.lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;

        if (mode == "infinite") {
          if (!links[currentPage + '']) {
            throw new RangeError("No link found for page " + currentPage);
          }
        }
        else if (currentPage < firstPage ||
                 (totalPages > 0 &&
                  (firstPage ? currentPage > totalPages : currentPage >= totalPages))) {
          throw new RangeError("`currentPage` must be firstPage <= currentPage " +
                               (firstPage ? ">" : ">=") +
                               " totalPages if " + firstPage + "-based. Got " +
                               currentPage + '.');
        }
      }

      return state;
    },

    /**
       Change the page size of this collection.

       Under most if not all circumstances, you should call this method to
       change the page size of a pageable collection because it will keep the
       pagination state sane. By default, the method will recalculate the
       current page number to one that will retain the current page's models
       when increasing the page size. When decreasing the page size, this method
       will retain the last models to the current page that will fit into the
       smaller page size.

       If `options.first` is true, changing the page size will also reset the
       current page back to the first page instead of trying to be smart.

       For server mode operations, changing the page size will trigger a #fetch
       and subsequently a `reset` event.

       For client mode operations, changing the page size will `reset` the
       current page by recalculating the current page boundary on the client
       side.

       If `options.fetch` is true, a fetch can be forced if the collection is in
       client mode.

       @param {number} pageSize The new page size to set to #state.
       @param {Object} [options] {@link #fetch} options.
       @param {boolean} [options.first=false] Reset the current page number to
       the first page if `true`.
       @param {boolean} [options.fetch] If `true`, force a fetch in client mode.

       @throws {TypeError} If `pageSize` is not a finite integer.
       @throws {RangeError} If `pageSize` is less than 1.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    setPageSize: function (pageSize, options) {
      pageSize = finiteInt(pageSize, "pageSize");

      options = options || {first: false};

      var state = this.state;
      var totalPages = ceil(state.totalRecords / pageSize);
      var currentPage = totalPages ?
          max(state.firstPage, floor(totalPages * state.currentPage / state.totalPages)) :
        state.firstPage;

      state = this.state = this._checkState(_extend({}, state, {
        pageSize: pageSize,
        currentPage: options.first ? state.firstPage : currentPage,
        totalPages: totalPages
      }));

      return this.getPage(state.currentPage, _omit(options, ["first"]));
    },

    /**
       Switching between client, server and infinite mode.

       If switching from client to server mode, the #fullCollection is emptied
       first and then deleted and a fetch is immediately issued for the current
       page from the server. Pass `false` to `options.fetch` to skip fetching.

       If switching to infinite mode, and if `options.models` is given for an
       array of models, #links will be populated with a URL per page, using the
       default URL for this collection.

       If switching from server to client mode, all of the pages are immediately
       refetched. If you have too many pages, you can pass `false` to
       `options.fetch` to skip fetching.

       If switching to any mode from infinite mode, the #links will be deleted.

       @param {"server"|"client"|"infinite"} [mode] The mode to switch to.

       @param {Object} [options]

       @param {boolean} [options.fetch=true] If `false`, no fetching is done.

       @param {boolean} [options.resetState=true] If 'false', the state is not
       reset, but checked for sanity instead.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this if `options.fetch` is `false`.
    */
    switchMode: function (mode, options) {

      if (!_contains(["server", "client", "infinite"], mode)) {
        throw new TypeError('`mode` must be one of "server", "client" or "infinite"');
      }

      options = options || {fetch: true, resetState: true};

      var state = this.state = options.resetState ?
        _clone(this._initState) :
        this._checkState(_extend({}, this.state));

      this.mode = mode;

      var self = this;
      var fullCollection = this.fullCollection;
      var handlers = this._handlers = this._handlers || {}, handler;
      if (mode != "server" && !fullCollection) {
        fullCollection = this._makeFullCollection(options.models || [], options);
        fullCollection.pageableCollection = this;
        this.fullCollection = fullCollection;
        var allHandler = this._makeCollectionEventHandler(this, fullCollection);
        _each(["add", "remove", "reset", "sort"], function (event) {
          handlers[event] = handler = _.bind(allHandler, {}, event);
          self.on(event, handler);
          fullCollection.on(event, handler);
        });
        fullCollection.comparator = this._fullComparator;
      }
      else if (mode == "server" && fullCollection) {
        _each(_keys(handlers), function (event) {
          handler = handlers[event];
          self.off(event, handler);
          fullCollection.off(event, handler);
        });
        delete this._handlers;
        this._fullComparator = fullCollection.comparator;
        delete this.fullCollection;
      }

      if (mode == "infinite") {
        var links = this.links = {};
        var firstPage = state.firstPage;
        var totalPages = ceil(state.totalRecords / state.pageSize);
        var lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;
        for (var i = state.firstPage; i <= lastPage; i++) {
          links[i] = this.url;
        }
      }
      else if (this.links) delete this.links;

      return options.fetch ?
        this.fetch(_omit(options, "fetch", "resetState")) :
        this;
    },

    /**
       @return {boolean} `true` if this collection can page backward, `false`
       otherwise.
    */
    hasPreviousPage: function () {
      var state = this.state;
      var currentPage = state.currentPage;
      if (this.mode != "infinite") return currentPage > state.firstPage;
      return !!this.links[currentPage - 1];
    },

    /**
       @return {boolean} `true` if this collection can page forward, `false`
       otherwise.
    */
    hasNextPage: function () {
      var state = this.state;
      var currentPage = this.state.currentPage;
      if (this.mode != "infinite") return currentPage < state.lastPage;
      return !!this.links[currentPage + 1];
    },

    /**
       Fetch the first page in server mode, or reset the current page of this
       collection to the first page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getFirstPage: function (options) {
      return this.getPage("first", options);
    },

    /**
       Fetch the previous page in server mode, or reset the current page of this
       collection to the previous page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPreviousPage: function (options) {
      return this.getPage("prev", options);
    },

    /**
       Fetch the next page in server mode, or reset the current page of this
       collection to the next page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getNextPage: function (options) {
      return this.getPage("next", options);
    },

    /**
       Fetch the last page in server mode, or reset the current page of this
       collection to the last page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getLastPage: function (options) {
      return this.getPage("last", options);
    },

    /**
       Given a page index, set #state.currentPage to that index. If this
       collection is in server mode, fetch the page using the updated state,
       otherwise, reset the current page of this collection to the page
       specified by `index` in client mode. If `options.fetch` is true, a fetch
       can be forced in client mode before resetting the current page. Under
       infinite mode, if the index is less than the current page, a reset is
       done as in client mode. If the index is greater than the current page
       number, a fetch is made with the results **appended** to #fullCollection.
       The current page will then be reset after fetching.

       @param {number|string} index The page index to go to, or the page name to
       look up from #links in infinite mode.
       @param {Object} [options] {@link #fetch} options or
       [reset](http://backbonejs.org/#Collection-reset) options for client mode
       when `options.fetch` is `false`.
       @param {boolean} [options.fetch=false] If true, force a {@link #fetch} in
       client mode.

       @throws {TypeError} If `index` is not a finite integer under server or
       client mode, or does not yield a URL from #links under infinite mode.

       @throws {RangeError} If `index` is out of bounds.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPage: function (index, options) {

      var mode = this.mode, fullCollection = this.fullCollection;

      options = options || {fetch: false};

      var state = this.state,
      firstPage = state.firstPage,
      currentPage = state.currentPage,
      lastPage = state.lastPage,
      pageSize = state.pageSize;

      var pageNum = index;
      switch (index) {
        case "first": pageNum = firstPage; break;
        case "prev": pageNum = currentPage - 1; break;
        case "next": pageNum = currentPage + 1; break;
        case "last": pageNum = lastPage; break;
        default: pageNum = finiteInt(index, "index");
      }

      this.state = this._checkState(_extend({}, state, {currentPage: pageNum}));

      options.from = currentPage, options.to = pageNum;

      var pageStart = (firstPage === 0 ? pageNum : pageNum - 1) * pageSize;
      var pageModels = fullCollection && fullCollection.length ?
        fullCollection.models.slice(pageStart, pageStart + pageSize) :
        [];
      if ((mode == "client" || (mode == "infinite" && !_isEmpty(pageModels))) &&
          !options.fetch) {
        this.reset(pageModels, _omit(options, "fetch"));
        return this;
      }

      if (mode == "infinite") options.url = this.links[pageNum];

      return this.fetch(_omit(options, "fetch"));
    },

    /**
       Fetch the page for the provided item offset in server mode, or reset the current page of this
       collection to the page for the provided item offset in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPageByOffset: function (offset, options) {
      if (offset < 0) {
        throw new RangeError("`offset must be > 0`");
      }
      offset = finiteInt(offset);

      var page = floor(offset / this.state.pageSize);
      if (this.state.firstPage !== 0) page++;
      if (page > this.state.lastPage) page = this.state.lastPage;
      return this.getPage(page, options);
    },

    /**
       Overidden to make `getPage` compatible with Zepto.

       @param {string} method
       @param {Backbone.Model|Backbone.Collection} model
       @param {Object} [options]

       @return {XMLHttpRequest}
    */
    sync: function (method, model, options) {
      var self = this;
      if (self.mode == "infinite") {
        var success = options.success;
        var currentPage = self.state.currentPage;
        options.success = function (resp, status, xhr) {
          var links = self.links;
          var newLinks = self.parseLinks(resp, _extend({xhr: xhr}, options));
          if (newLinks.first) links[self.state.firstPage] = newLinks.first;
          if (newLinks.prev) links[currentPage - 1] = newLinks.prev;
          if (newLinks.next) links[currentPage + 1] = newLinks.next;
          if (success) success(resp, status, xhr);
        };
      }

      return (BBColProto.sync || Backbone.sync).call(self, method, model, options);
    },

    /**
       Parse pagination links from the server response. Only valid under
       infinite mode.

       Given a response body and a XMLHttpRequest object, extract pagination
       links from them for infinite paging.

       This default implementation parses the RFC 5988 `Link` header and extract
       3 links from it - `first`, `prev`, `next`. Any subclasses overriding this
       method __must__ return an object hash having only the keys
       above. However, simply returning a `next` link or an empty hash if there
       are no more links should be enough for most implementations.

       @param {*} resp The deserialized response body.
       @param {Object} [options]
       @param {XMLHttpRequest} [options.xhr] The XMLHttpRequest object for this
       response.
       @return {Object}
    */
    parseLinks: function (resp, options) {
      var links = {};
      var linkHeader = options.xhr.getResponseHeader("Link");
      if (linkHeader) {
        var relations = ["first", "prev", "next"];
        _each(linkHeader.split(","), function (linkValue) {
          var linkParts = linkValue.split(";");
          var url = linkParts[0].replace(URL_TRIM_RE, '');
          var params = linkParts.slice(1);
          _each(params, function (param) {
            var paramParts = param.split("=");
            var key = paramParts[0].replace(PARAM_TRIM_RE, '');
            var value = paramParts[1].replace(PARAM_TRIM_RE, '');
            if (key == "rel" && _contains(relations, value)) links[value] = url;
          });
        });
      }

      return links;
    },

    /**
       Parse server response data.

       This default implementation assumes the response data is in one of two
       structures:

           [
             {}, // Your new pagination state
             [{}, ...] // An array of JSON objects
           ]

       Or,

           [{}] // An array of JSON objects

       The first structure is the preferred form because the pagination states
       may have been updated on the server side, sending them down again allows
       this collection to update its states. If the response has a pagination
       state object, it is checked for errors.

       The second structure is the
       [Backbone.Collection#parse](http://backbonejs.org/#Collection-parse)
       default.

       **Note:** this method has been further simplified since 1.1.7. While
       existing #parse implementations will continue to work, new code is
       encouraged to override #parseState and #parseRecords instead.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} the options for the ajax request

       @return {Array.<Object>} An array of model objects
    */
    parse: function (resp, options) {
      var newState = this.parseState(resp, _clone(this.queryParams), _clone(this.state), options);
      if (newState) this.state = this._checkState(_extend({}, this.state, newState));
      return this.parseRecords(resp, options);
    },

    /**
       Parse server response for server pagination state updates. Not applicable
       under infinite mode.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, a state object is
       returned by mapping the server state keys to this pageable collection
       instance's query parameter keys using `queryParams`.

       It is __NOT__ neccessary to return a full state object complete with all
       the mappings defined in #queryParams. Any state object resulted is merged
       with a copy of the current pageable collection state and checked for
       sanity before actually updating. Most of the time, simply providing a new
       `totalRecords` value is enough to trigger a full pagination state
       recalculation.

           parseState: function (resp, queryParams, state, options) {
             return {totalRecords: resp.total_entries};
           }

       If you want to use header fields use:

           parseState: function (resp, queryParams, state, options) {
               return {totalRecords: options.xhr.getResponseHeader("X-total")};
           }

       This method __MUST__ return a new state object instead of directly
       modifying the #state object. The behavior of directly modifying #state is
       undefined.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} queryParams A copy of #queryParams.
       @param {Object} state A copy of #state.
       @param {Object} [options] The options passed through from
       `parse`. (backbone >= 0.9.10 only)

       @return {Object} A new (partial) state object.
     */
    parseState: function (resp, queryParams, state, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {

        var newState = _clone(state);
        var serverState = resp[0];

        _each(_pairs(_omit(queryParams, "directions")), function (kvp) {
          var k = kvp[0], v = kvp[1];
          var serverVal = serverState[v];
          if (!_isUndefined(serverVal) && !_.isNull(serverVal)) newState[k] = serverState[v];
        });

        if (serverState.order) {
          newState.order = _invert(queryParams.directions)[serverState.order] * 1;
        }

        return newState;
      }
    },

    /**
       Parse server response for an array of model objects.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, the array of model
       objects is assumed to be the second element, otherwise the entire
       response is returned directly.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} [options] The options passed through from the
       `parse`. (backbone >= 0.9.10 only)

       @return {Array.<Object>} An array of model objects
     */
    parseRecords: function (resp, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {
        return resp[1];
      }

      return resp;
    },

    /**
       Fetch a page from the server in server mode, or all the pages in client
       mode. Under infinite mode, the current page is refetched by default and
       then reset.

       The query string is constructed by translating the current pagination
       state to your server API query parameter using #queryParams. The current
       page will reset after fetch.

       @param {Object} [options] Accepts all
       [Backbone.Collection#fetch](http://backbonejs.org/#Collection-fetch)
       options.

       @return {XMLHttpRequest}
    */
    fetch: function (options) {

      options = options || {};

      var state = this._checkState(this.state);

      var mode = this.mode;

      if (mode == "infinite" && !options.url) {
        options.url = this.links[state.currentPage];
      }

      var data = options.data || {};

      // dedup query params
      var url = options.url || this.url || "";
      if (_isFunction(url)) url = url.call(this);
      var qsi = url.indexOf('?');
      if (qsi != -1) {
        _extend(data, queryStringToParams(url.slice(qsi + 1)));
        url = url.slice(0, qsi);
      }

      options.url = url;
      options.data = data;

      // map params except directions
      var queryParams = this.mode == "client" ?
        _pick(this.queryParams, "sortKey", "order") :
        _omit(_pick(this.queryParams, _keys(PageableProto.queryParams)),
              "directions");

      var i, kvp, k, v, kvps = _pairs(queryParams), thisCopy = _clone(this);
      for (i = 0; i < kvps.length; i++) {
        kvp = kvps[i], k = kvp[0], v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (state[k] != null && v != null) {
          data[v] = state[k];
        }
      }

      // fix up sorting parameters
      if (state.sortKey && state.order) {
        var o = _isFunction(queryParams.order) ?
          queryParams.order.call(thisCopy) :
          queryParams.order;
        data[o] = this.queryParams.directions[state.order + ""];
      }
      else if (!state.sortKey) delete data[queryParams.order];

      // map extra query parameters
      var extraKvps = _pairs(_omit(this.queryParams,
                                   _keys(PageableProto.queryParams)));
      for (i = 0; i < extraKvps.length; i++) {
        kvp = extraKvps[i];
        v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (v != null) data[kvp[0]] = v;
      }

      if (mode != "server") {
        var self = this, fullCol = this.fullCollection;
        var success = options.success;
        options.success = function (col, resp, opts) {

          // make sure the caller's intent is obeyed
          opts = opts || {};
          if (_isUndefined(options.silent)) delete opts.silent;
          else opts.silent = options.silent;

          var models = col.models;
          if (mode == "client") fullCol.reset(models, opts);
          else {
            fullCol.add(models, _extend({at: fullCol.length},
                                        _extend(opts, {parse: false})));
            self.trigger("reset", self, opts);
          }

          if (success) success(col, resp, opts);
        };

        // silent the first reset from backbone
        return BBColProto.fetch.call(this, _extend({}, options, {silent: true}));
      }

      return BBColProto.fetch.call(this, options);
    },

    /**
       Convenient method for making a `comparator` sorted by a model attribute
       identified by `sortKey` and ordered by `order`.

       Like a Backbone.Collection, a Backbone.PageableCollection will maintain
       the __current page__ in sorted order on the client side if a `comparator`
       is attached to it. If the collection is in client mode, you can attach a
       comparator to #fullCollection to have all the pages reflect the global
       sorting order by specifying an option `full` to `true`. You __must__ call
       `sort` manually or #fullCollection.sort after calling this method to
       force a resort.

       While you can use this method to sort the current page in server mode,
       the sorting order may not reflect the global sorting order due to the
       additions or removals of the records on the server since the last
       fetch. If you want the most updated page in a global sorting order, it is
       recommended that you set #state.sortKey and optionally #state.order, and
       then call #fetch.

       @protected

       @param {string} [sortKey=this.state.sortKey] See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {(function(Backbone.Model, string): Object) | string} [sortValue] See #setSorting.

       See [Backbone.Collection.comparator](http://backbonejs.org/#Collection-comparator).
    */
    _makeComparator: function (sortKey, order, sortValue) {
      var state = this.state;

      sortKey = sortKey || state.sortKey;
      order = order || state.order;

      if (!sortKey || !order) return;

      if (!sortValue) sortValue = function (model, attr) {
        return model.get(attr);
      };

      return function (left, right) {
        var l = sortValue(left, sortKey), r = sortValue(right, sortKey), t;
        if (order === 1) t = l, l = r, r = t;
        if (l === r) return 0;
        else if (l < r) return -1;
        return 1;
      };
    },

    /**
       Adjusts the sorting for this pageable collection.

       Given a `sortKey` and an `order`, sets `state.sortKey` and
       `state.order`. A comparator can be applied on the client side to sort in
       the order defined if `options.side` is `"client"`. By default the
       comparator is applied to the #fullCollection. Set `options.full` to
       `false` to apply a comparator to the current page under any mode. Setting
       `sortKey` to `null` removes the comparator from both the current page and
       the full collection.

       If a `sortValue` function is given, it will be passed the `(model,
       sortKey)` arguments and is used to extract a value from the model during
       comparison sorts. If `sortValue` is not given, `model.get(sortKey)` is
       used for sorting.

       @chainable

       @param {string} sortKey See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {Object} [options]
       @param {"server"|"client"} [options.side] By default, `"client"` if
       `mode` is `"client"`, `"server"` otherwise.
       @param {boolean} [options.full=true]
       @param {(function(Backbone.Model, string): Object) | string} [options.sortValue]
    */
    setSorting: function (sortKey, order, options) {

      var state = this.state;

      state.sortKey = sortKey;
      state.order = order = order || state.order;

      var fullCollection = this.fullCollection;

      var delComp = false, delFullComp = false;

      if (!sortKey) delComp = delFullComp = true;

      var mode = this.mode;
      options = _extend({side: mode == "client" ? mode : "server", full: true},
                        options);

      var comparator = this._makeComparator(sortKey, order, options.sortValue);

      var full = options.full, side = options.side;

      if (side == "client") {
        if (full) {
          if (fullCollection) fullCollection.comparator = comparator;
          delComp = true;
        }
        else {
          this.comparator = comparator;
          delFullComp = true;
        }
      }
      else if (side == "server" && !full) {
        this.comparator = comparator;
      }

      if (delComp) this.comparator = null;
      if (delFullComp && fullCollection) fullCollection.comparator = null;

      return this;
    }

  });

  var PageableProto = PageableCollection.prototype;

  return PageableCollection;

}));

/*!
 * Bootstrap v3.0.2 by @fat and @mdo
 * Copyright 2013 Twitter, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 *
 * Designed and built with all the love in the world by @mdo and @fat.
 */

if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.2
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.2
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.2
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.2
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.2
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.2
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.2
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.2
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.2
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.2
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.2
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.2
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);

define("bootstrap", function(){});

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

define("matchMedia", function(){});

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
    // Bail out for browsers that have addListener support
    if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
    }

    var localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening     = false,
        timeoutID       = 0,    // setTimeout for debouncing 'handleChange'
        queries         = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange    = function(evt) {
            // Debounce
            clearTimeout(timeoutID);

            timeoutID = setTimeout(function() {
                for (var i = 0, il = queries.length; i < il; i++) {
                    var mql         = queries[i].mql,
                        listeners   = queries[i].listeners || [],
                        matches     = localMatchMedia(mql.media).matches;

                    // Update mql.matches value and call listeners
                    // Fire listeners only if transitioning to or from matched state
                    if (matches !== mql.matches) {
                        mql.matches = matches;

                        for (var j = 0, jl = listeners.length; j < jl; j++) {
                            listeners[j].call(window, mql);
                        }
                    }
                }
            }, 30);
        };

    window.matchMedia = function(media) {
        var mql         = localMatchMedia(media),
            listeners   = [],
            index       = 0;

        mql.addListener = function(listener) {
            // Changes would not occur to css media type so return now (Affects IE <= 8)
            if (!hasMediaQueries) {
                return;
            }

            // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
            // There should only ever be 1 resize listener running for performance
            if (!isListening) {
                isListening = true;
                window.addEventListener('resize', handleChange, true);
            }

            // Push object only if it has not been pushed already
            if (index === 0) {
                index = queries.push({
                    mql         : mql,
                    listeners   : listeners
                });
            }

            listeners.push(listener);
        };

        mql.removeListener = function(listener) {
            for (var i = 0, il = listeners.length; i < il; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                }
            }
        };

        return mql;
    };
}());

define("matchMediaaddListener", function(){});

/*!
 * enquire.js v2.1.2 - Awesome Media Queries in JavaScript
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/enquire.js
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

;(function (name, context, factory) {
	var matchMedia = window.matchMedia;

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(matchMedia);
	}
	else if (typeof define === 'function' && define.amd) {
		define('enquire',[],function() {
			return (context[name] = factory(matchMedia));
		});
	}
	else {
		context[name] = factory(matchMedia);
	}
}('enquire', this, function (matchMedia) {

	'use strict';

    /*jshint unused:false */
    /**
     * Helper function for iterating over a collection
     *
     * @param collection
     * @param fn
     */
    function each(collection, fn) {
        var i      = 0,
            length = collection.length,
            cont;

        for(i; i < length; i++) {
            cont = fn(collection[i], i);
            if(cont === false) {
                break; //allow early exit
            }
        }
    }

    /**
     * Helper function for determining whether target object is an array
     *
     * @param target the object under test
     * @return {Boolean} true if array, false otherwise
     */
    function isArray(target) {
        return Object.prototype.toString.apply(target) === '[object Array]';
    }

    /**
     * Helper function for determining whether target object is a function
     *
     * @param target the object under test
     * @return {Boolean} true if function, false otherwise
     */
    function isFunction(target) {
        return typeof target === 'function';
    }

    /**
     * Delegate to handle a media query being matched and unmatched.
     *
     * @param {object} options
     * @param {function} options.match callback for when the media query is matched
     * @param {function} [options.unmatch] callback for when the media query is unmatched
     * @param {function} [options.setup] one-time callback triggered the first time a query is matched
     * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
     * @constructor
     */
    function QueryHandler(options) {
        this.options = options;
        !options.deferSetup && this.setup();
    }
    QueryHandler.prototype = {

        /**
         * coordinates setup of the handler
         *
         * @function
         */
        setup : function() {
            if(this.options.setup) {
                this.options.setup();
            }
            this.initialised = true;
        },

        /**
         * coordinates setup and triggering of the handler
         *
         * @function
         */
        on : function() {
            !this.initialised && this.setup();
            this.options.match && this.options.match();
        },

        /**
         * coordinates the unmatch event for the handler
         *
         * @function
         */
        off : function() {
            this.options.unmatch && this.options.unmatch();
        },

        /**
         * called when a handler is to be destroyed.
         * delegates to the destroy or unmatch callbacks, depending on availability.
         *
         * @function
         */
        destroy : function() {
            this.options.destroy ? this.options.destroy() : this.off();
        },

        /**
         * determines equality by reference.
         * if object is supplied compare options, if function, compare match callback
         *
         * @function
         * @param {object || function} [target] the target for comparison
         */
        equals : function(target) {
            return this.options === target || this.options.match === target;
        }

    };
    /**
     * Represents a single media query, manages it's state and registered handlers for this query
     *
     * @constructor
     * @param {string} query the media query string
     * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
     */
    function MediaQuery(query, isUnconditional) {
        this.query = query;
        this.isUnconditional = isUnconditional;
        this.handlers = [];
        this.mql = matchMedia(query);

        var self = this;
        this.listener = function(mql) {
            self.mql = mql;
            self.assess();
        };
        this.mql.addListener(this.listener);
    }
    MediaQuery.prototype = {

        /**
         * add a handler for this query, triggering if already active
         *
         * @param {object} handler
         * @param {function} handler.match callback for when query is activated
         * @param {function} [handler.unmatch] callback for when query is deactivated
         * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
         * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
         */
        addHandler : function(handler) {
            var qh = new QueryHandler(handler);
            this.handlers.push(qh);

            this.matches() && qh.on();
        },

        /**
         * removes the given handler from the collection, and calls it's destroy methods
         * 
         * @param {object || function} handler the handler to remove
         */
        removeHandler : function(handler) {
            var handlers = this.handlers;
            each(handlers, function(h, i) {
                if(h.equals(handler)) {
                    h.destroy();
                    return !handlers.splice(i,1); //remove from array and exit each early
                }
            });
        },

        /**
         * Determine whether the media query should be considered a match
         * 
         * @return {Boolean} true if media query can be considered a match, false otherwise
         */
        matches : function() {
            return this.mql.matches || this.isUnconditional;
        },

        /**
         * Clears all handlers and unbinds events
         */
        clear : function() {
            each(this.handlers, function(handler) {
                handler.destroy();
            });
            this.mql.removeListener(this.listener);
            this.handlers.length = 0; //clear array
        },

        /*
         * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
         */
        assess : function() {
            var action = this.matches() ? 'on' : 'off';

            each(this.handlers, function(handler) {
                handler[action]();
            });
        }
    };
    /**
     * Allows for registration of query handlers.
     * Manages the query handler's state and is responsible for wiring up browser events
     *
     * @constructor
     */
    function MediaQueryDispatch () {
        if(!matchMedia) {
            throw new Error('matchMedia not present, legacy browsers require a polyfill');
        }

        this.queries = {};
        this.browserIsIncapable = !matchMedia('only all').matches;
    }

    MediaQueryDispatch.prototype = {

        /**
         * Registers a handler for the given media query
         *
         * @param {string} q the media query
         * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
         * @param {function} options.match fired when query matched
         * @param {function} [options.unmatch] fired when a query is no longer matched
         * @param {function} [options.setup] fired when handler first triggered
         * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
         * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
         */
        register : function(q, options, shouldDegrade) {
            var queries         = this.queries,
                isUnconditional = shouldDegrade && this.browserIsIncapable;

            if(!queries[q]) {
                queries[q] = new MediaQuery(q, isUnconditional);
            }

            //normalise to object in an array
            if(isFunction(options)) {
                options = { match : options };
            }
            if(!isArray(options)) {
                options = [options];
            }
            each(options, function(handler) {
                if (isFunction(handler)) {
                    handler = { match : handler };
                }
                queries[q].addHandler(handler);
            });

            return this;
        },

        /**
         * unregisters a query and all it's handlers, or a specific handler for a query
         *
         * @param {string} q the media query to target
         * @param {object || function} [handler] specific handler to unregister
         */
        unregister : function(q, handler) {
            var query = this.queries[q];

            if(query) {
                if(handler) {
                    query.removeHandler(handler);
                }
                else {
                    query.clear();
                    delete this.queries[q];
                }
            }

            return this;
        }
    };

	return new MediaQueryDispatch();

}));
/*! Picturefill - v2.1.0 - 2014-10-08
* http://scottjehl.github.io/picturefill
* Copyright (c) 2014 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
/*! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function( root, factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define('picturefill',[],function() {
            return factory(root, root.document, new root.Image());
        });
    } else if ( typeof exports === "object" ) {
        // CommonJS, just export
        module.exports = factory(root, root.document, new root.Image());
    } else {
        // Browser globals (root is window)
        root.picturefill = factory(root, root.document, new root.Image());
    }
}( this, function( w, doc, image ) {
    // Enable strict mode
    "use strict";

    // If picture is supported, well, that's awesome. Let's get outta here...
    if ( w.HTMLPictureElement ) {
        w.picturefill = function() { };
        return w.picturefill;
    }

    // HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
    doc.createElement( "picture" );

    // local object for method references and testing exposure
    var pf = {};

    // namespace
    pf.ns = "picturefill";

    // srcset support test
    (function() {
        pf.srcsetSupported = "srcset" in image;
        pf.sizesSupported = "sizes" in image;
    })();

    // just a string trim workaround
    pf.trim = function( str ) {
        return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, "" );
    };

    // just a string endsWith workaround
    pf.endsWith = function( str, suffix ) {
        return str.endsWith ? str.endsWith( suffix ) : str.indexOf( suffix, str.length - suffix.length ) !== -1;
    };

    /**
     * Shortcut method for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
     */
    pf.restrictsMixedContent = function() {
        return w.location.protocol === "https:";
    };
    /**
     * Shortcut method for matchMedia ( for easy overriding in tests )
     */

    pf.matchesMedia = function( media ) {
        return w.matchMedia && w.matchMedia( media ).matches;
    };

    // Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
    pf.getDpr = function() {
        return ( w.devicePixelRatio || 1 );
    };

    /**
     * Get width in css pixel value from a "length" value
     * http://dev.w3.org/csswg/css-values-3/#length-value
     */
    pf.getWidthFromLength = function( length ) {
        // If a length is specified and doesn’t contain a percentage, and it is greater than 0 or using `calc`, use it. Else, use the `100vw` default.
        length = length && length.indexOf( "%" ) > -1 === false && ( parseFloat( length ) > 0 || length.indexOf( "calc(" ) > -1 ) ? length : "100vw";

        /**
         * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
         * is injected at the top of the document.
         *
         * TODO: maybe we should put this behind a feature test for `vw`?
         */
        length = length.replace( "vw", "%" );

        // Create a cached element for getting length value widths
        if ( !pf.lengthEl ) {
            pf.lengthEl = doc.createElement( "div" );

            // Positioning styles help prevent padding/margin/width on `html` or `body` from throwing calculations off.
            pf.lengthEl.style.cssText = "border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden";
        }

        pf.lengthEl.style.width = length;

        doc.body.appendChild(pf.lengthEl);

        // Add a class, so that everyone knows where this element comes from
        pf.lengthEl.className = "helper-from-picturefill-js";

        if ( pf.lengthEl.offsetWidth <= 0 ) {
            // Something has gone wrong. `calc()` is in use and unsupported, most likely. Default to `100vw` (`100%`, for broader support.):
            pf.lengthEl.style.width = doc.documentElement.offsetWidth + "px";
        }

        var offsetWidth = pf.lengthEl.offsetWidth;

        doc.body.removeChild( pf.lengthEl );

        return offsetWidth;
    };

    // container of supported mime types that one might need to qualify before using
    pf.types =  {};

    // Add support for standard mime types
    pf.types[ "image/jpeg" ] = true;
    pf.types[ "image/gif" ] = true;
    pf.types[ "image/png" ] = true;

    // test svg support
    pf.types[ "image/svg+xml" ] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");

    // test webp support, only when the markup calls for it
    pf.types[ "image/webp" ] = function() {
        // based on Modernizr's lossless img-webp test
        // note: asynchronous
        var type = "image/webp";

        image.onerror = function() {
            pf.types[ type ] = false;
            picturefill();
        };
        image.onload = function() {
            pf.types[ type ] = image.width === 1;
            picturefill();
        };
        image.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    };

    /**
     * Takes a source element and checks if its type attribute is present and if so, supported
     * Note: for type tests that require a async logic,
     * you can define them as a function that'll run only if that type needs to be tested. Just make the test function call picturefill again when it is complete.
     * see the async webp test above for example
     */
    pf.verifyTypeSupport = function( source ) {
        var type = source.getAttribute( "type" );
        // if type attribute exists, return test result, otherwise return true
        if ( type === null || type === "" ) {
            return true;
        } else {
            // if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
            if ( typeof( pf.types[ type ] ) === "function" ) {
                pf.types[ type ]();
                return "pending";
            } else {
                return pf.types[ type ];
            }
        }
    };

    // Parses an individual `size` and returns the length, and optional media query
    pf.parseSize = function( sourceSizeStr ) {
        var match = /(\([^)]+\))?\s*(.+)/g.exec( sourceSizeStr );
        return {
            media: match && match[1],
            length: match && match[2]
        };
    };

    // Takes a string of sizes and returns the width in pixels as a number
    pf.findWidthFromSourceSize = function( sourceSizeListStr ) {
        // Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
        //                            or (min-width:30em) calc(30% - 15px)
        var sourceSizeList = pf.trim( sourceSizeListStr ).split( /\s*,\s*/ ),
            winningLength;

        for ( var i = 0, len = sourceSizeList.length; i < len; i++ ) {
            // Match <media-condition>? length, ie ( min-width: 50em ) 100%
            var sourceSize = sourceSizeList[ i ],
                // Split "( min-width: 50em ) 100%" into separate strings
                parsedSize = pf.parseSize( sourceSize ),
                length = parsedSize.length,
                media = parsedSize.media;

            if ( !length ) {
                continue;
            }
            if ( !media || pf.matchesMedia( media ) ) {
                // if there is no media query or it matches, choose this as our winning length
                // and end algorithm
                winningLength = length;
                break;
            }
        }

        // pass the length to a method that can properly determine length
        // in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
        return pf.getWidthFromLength( winningLength );
    };

    pf.parseSrcset = function( srcset ) {
        /**
         * A lot of this was pulled from Boris Smus’ parser for the now-defunct WHATWG `srcset`
         * https://github.com/borismus/srcset-polyfill/blob/master/js/srcset-info.js
         *
         * 1. Let input (`srcset`) be the value passed to this algorithm.
         * 2. Let position be a pointer into input, initially pointing at the start of the string.
         * 3. Let raw candidates be an initially empty ordered list of URLs with associated
         *    unparsed descriptors. The order of entries in the list is the order in which entries
         *    are added to the list.
         */
        var candidates = [];

        while ( srcset !== "" ) {
            srcset = srcset.replace( /^\s+/g, "" );

            // 5. Collect a sequence of characters that are not space characters, and let that be url.
            var pos = srcset.search(/\s/g),
                url, descriptor = null;

            if ( pos !== -1 ) {
                url = srcset.slice( 0, pos );

                var last = url.slice(-1);

                // 6. If url ends with a U+002C COMMA character (,), remove that character from url
                // and let descriptors be the empty string. Otherwise, follow these substeps
                // 6.1. If url is empty, then jump to the step labeled descriptor parser.

                if ( last === "," || url === "" ) {
                    url = url.replace( /,+$/, "" );
                    descriptor = "";
                }
                srcset = srcset.slice( pos + 1 );

                // 6.2. Collect a sequence of characters that are not U+002C COMMA characters (,), and
                // let that be descriptors.
                if ( descriptor === null ) {
                    var descpos = srcset.indexOf( "," );
                    if ( descpos !== -1 ) {
                        descriptor = srcset.slice( 0, descpos );
                        srcset = srcset.slice( descpos + 1 );
                    } else {
                        descriptor = srcset;
                        srcset = "";
                    }
                }
            } else {
                url = srcset;
                srcset = "";
            }

            // 7. Add url to raw candidates, associated with descriptors.
            if ( url || descriptor ) {
                candidates.push({
                    url: url,
                    descriptor: descriptor
                });
            }
        }
        return candidates;
    };

    pf.parseDescriptor = function( descriptor, sizesattr ) {
        // 11. Descriptor parser: Let candidates be an initially empty source set. The order of entries in the list
        // is the order in which entries are added to the list.
        var sizes = sizesattr || "100vw",
            sizeDescriptor = descriptor && descriptor.replace( /(^\s+|\s+$)/g, "" ),
            widthInCssPixels = pf.findWidthFromSourceSize( sizes ),
            resCandidate;

            if ( sizeDescriptor ) {
                var splitDescriptor = sizeDescriptor.split(" ");

                for (var i = splitDescriptor.length - 1; i >= 0; i--) {
                    var curr = splitDescriptor[ i ],
                        lastchar = curr && curr.slice( curr.length - 1 );

                    if ( ( lastchar === "h" || lastchar === "w" ) && !pf.sizesSupported ) {
                        resCandidate = parseFloat( ( parseInt( curr, 10 ) / widthInCssPixels ) );
                    } else if ( lastchar === "x" ) {
                        var res = curr && parseFloat( curr, 10 );
                        resCandidate = res && !isNaN( res ) ? res : 1;
                    }
                }
            }
        return resCandidate || 1;
    };

    /**
     * Takes a srcset in the form of url/
     * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
     *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
     *     "images/pic-small.png"
     * Get an array of image candidates in the form of
     *      {url: "/foo/bar.png", resolution: 1}
     * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
     * If sizes is specified, resolution is calculated
     */
    pf.getCandidatesFromSourceSet = function( srcset, sizes ) {
        var candidates = pf.parseSrcset( srcset ),
            formattedCandidates = [];

        for ( var i = 0, len = candidates.length; i < len; i++ ) {
            var candidate = candidates[ i ];

            formattedCandidates.push({
                url: candidate.url,
                resolution: pf.parseDescriptor( candidate.descriptor, sizes )
            });
        }
        return formattedCandidates;
    };

    /**
     * if it's an img element and it has a srcset property,
     * we need to remove the attribute so we can manipulate src
     * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
     * this moves srcset's value to memory for later use and removes the attr
     */
    pf.dodgeSrcset = function( img ) {
        if ( img.srcset ) {
            img[ pf.ns ].srcset = img.srcset;
            img.removeAttribute( "srcset" );
        }
    };

    // Accept a source or img element and process its srcset and sizes attrs
    pf.processSourceSet = function( el ) {
        var srcset = el.getAttribute( "srcset" ),
            sizes = el.getAttribute( "sizes" ),
            candidates = [];

        // if it's an img element, use the cached srcset property (defined or not)
        if ( el.nodeName.toUpperCase() === "IMG" && el[ pf.ns ] && el[ pf.ns ].srcset ) {
            srcset = el[ pf.ns ].srcset;
        }

        if ( srcset ) {
            candidates = pf.getCandidatesFromSourceSet( srcset, sizes );
        }
        return candidates;
    };

    pf.applyBestCandidate = function( candidates, picImg ) {
        var candidate,
            length,
            bestCandidate;

        candidates.sort( pf.ascendingSort );

        length = candidates.length;
        bestCandidate = candidates[ length - 1 ];

        for ( var i = 0; i < length; i++ ) {
            candidate = candidates[ i ];
            if ( candidate.resolution >= pf.getDpr() ) {
                bestCandidate = candidate;
                break;
            }
        }

        if ( bestCandidate && !pf.endsWith( picImg.src, bestCandidate.url ) ) {
            if ( pf.restrictsMixedContent() && bestCandidate.url.substr(0, "http:".length).toLowerCase() === "http:" ) {
                if ( typeof console !== undefined ) {
                    console.warn( "Blocked mixed content image " + bestCandidate.url );
                }
            } else {
                picImg.src = bestCandidate.url;
                // currentSrc attribute and property to match
                // http://picture.responsiveimages.org/#the-img-element
                picImg.currentSrc = picImg.src;

                var style = picImg.style || {},
                    WebkitBackfaceVisibility = "webkitBackfaceVisibility" in style,
                    currentZoom = style.zoom;

                if (WebkitBackfaceVisibility) { // See: https://github.com/scottjehl/picturefill/issues/332
                    style.zoom = ".999";

                    WebkitBackfaceVisibility = picImg.offsetWidth;

                    style.zoom = currentZoom;
                }
            }
        }
    };

    pf.ascendingSort = function( a, b ) {
        return a.resolution - b.resolution;
    };

    /**
     * In IE9, <source> elements get removed if they aren't children of
     * video elements. Thus, we conditionally wrap source elements
     * using <!--[if IE 9]><video style="display: none;"><![endif]-->
     * and must account for that here by moving those source elements
     * back into the picture element.
     */
    pf.removeVideoShim = function( picture ) {
        var videos = picture.getElementsByTagName( "video" );
        if ( videos.length ) {
            var video = videos[ 0 ],
                vsources = video.getElementsByTagName( "source" );
            while ( vsources.length ) {
                picture.insertBefore( vsources[ 0 ], video );
            }
            // Remove the video element once we're finished removing its children
            video.parentNode.removeChild( video );
        }
    };

    /**
     * Find all `img` elements, and add them to the candidate list if they have
     * a `picture` parent, a `sizes` attribute in basic `srcset` supporting browsers,
     * a `srcset` attribute at all, and they haven’t been evaluated already.
     */
    pf.getAllElements = function() {
        var elems = [],
            imgs = doc.getElementsByTagName( "img" );

        for ( var h = 0, len = imgs.length; h < len; h++ ) {
            var currImg = imgs[ h ];

            if ( currImg.parentNode.nodeName.toUpperCase() === "PICTURE" ||
            ( currImg.getAttribute( "srcset" ) !== null ) || currImg[ pf.ns ] && currImg[ pf.ns ].srcset !== null ) {
                elems.push( currImg );
            }
        }
        return elems;
    };

    pf.getMatch = function( img, picture ) {
        var sources = picture.childNodes,
            match;

        // Go through each child, and if they have media queries, evaluate them
        for ( var j = 0, slen = sources.length; j < slen; j++ ) {
            var source = sources[ j ];

            // ignore non-element nodes
            if ( source.nodeType !== 1 ) {
                continue;
            }

            // Hitting the `img` element that started everything stops the search for `sources`.
            // If no previous `source` matches, the `img` itself is evaluated later.
            if ( source === img ) {
                return match;
            }

            // ignore non-`source` nodes
            if ( source.nodeName.toUpperCase() !== "SOURCE" ) {
                continue;
            }
            // if it's a source element that has the `src` property set, throw a warning in the console
            if ( source.getAttribute( "src" ) !== null && typeof console !== undefined ) {
                console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
            }

            var media = source.getAttribute( "media" );

            // if source does not have a srcset attribute, skip
            if ( !source.getAttribute( "srcset" ) ) {
                continue;
            }

            // if there's no media specified, OR w.matchMedia is supported
            if ( ( !media || pf.matchesMedia( media ) ) ) {
                var typeSupported = pf.verifyTypeSupport( source );

                if ( typeSupported === true ) {
                    match = source;
                    break;
                } else if ( typeSupported === "pending" ) {
                    return false;
                }
            }
        }

        return match;
    };

    function picturefill( opt ) {
        var elements,
            element,
            parent,
            firstMatch,
            candidates,
            options = opt || {};

        elements = options.elements || pf.getAllElements();

        // Loop through all elements
        for ( var i = 0, plen = elements.length; i < plen; i++ ) {
            element = elements[ i ];
            parent = element.parentNode;
            firstMatch = undefined;
            candidates = undefined;

            // immediately skip non-`img` nodes
            if ( element.nodeName.toUpperCase() !== "IMG" ) {
                continue;
            }

            // expando for caching data on the img
            if ( !element[ pf.ns ] ) {
                element[ pf.ns ] = {};
            }

            // if the element has already been evaluated, skip it unless
            // `options.reevaluate` is set to true ( this, for example,
            // is set to true when running `picturefill` on `resize` ).
            if ( !options.reevaluate && element[ pf.ns ].evaluated ) {
                continue;
            }

            // if `img` is in a `picture` element
            if ( parent.nodeName.toUpperCase() === "PICTURE" ) {

                // IE9 video workaround
                pf.removeVideoShim( parent );

                // return the first match which might undefined
                // returns false if there is a pending source
                // TODO the return type here is brutal, cleanup
                firstMatch = pf.getMatch( element, parent );

                // if any sources are pending in this picture due to async type test(s)
                // remove the evaluated attr and skip for now ( the pending test will
                // rerun picturefill on this element when complete)
                if ( firstMatch === false ) {
                    continue;
                }
            } else {
                firstMatch = undefined;
            }

            // Cache and remove `srcset` if present and we’re going to be doing `picture`/`srcset`/`sizes` polyfilling to it.
            if ( parent.nodeName.toUpperCase() === "PICTURE" ||
            ( element.srcset && !pf.srcsetSupported ) ||
            ( !pf.sizesSupported && ( element.srcset && element.srcset.indexOf("w") > -1 ) ) ) {
                pf.dodgeSrcset( element );
            }

            if ( firstMatch ) {
                candidates = pf.processSourceSet( firstMatch );
                pf.applyBestCandidate( candidates, element );
            } else {
                // No sources matched, so we’re down to processing the inner `img` as a source.
                candidates = pf.processSourceSet( element );

                if ( element.srcset === undefined || element[ pf.ns ].srcset ) {
                    // Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
                    pf.applyBestCandidate( candidates, element );
                } // Else, resolution-only `srcset` is supported natively.
            }

            // set evaluated to true to avoid unnecessary reparsing
            element[ pf.ns ].evaluated = true;
        }
    }

    /**
     * Sets up picture polyfill by polling the document and running
     * the polyfill every 250ms until the document is ready.
     * Also attaches picturefill on resize
     */
    function runPicturefill() {
        picturefill();
        var intervalId = setInterval( function() {
            // When the document has finished loading, stop checking for new images
            // https://github.com/ded/domready/blob/master/ready.js#L15
            picturefill();
            if ( /^loaded|^i|^c/.test( doc.readyState ) ) {
                clearInterval( intervalId );
                return;
            }
        }, 250 );

        function checkResize() {
            var resizeThrottle;

            if ( !w._picturefillWorking ) {
                w._picturefillWorking = true;
                w.clearTimeout( resizeThrottle );
                resizeThrottle = w.setTimeout( function() {
                    picturefill({ reevaluate: true });
                    w._picturefillWorking = false;
                }, 60 );
            }
        }

        if ( w.addEventListener ) {
            w.addEventListener( "resize", checkResize, false );
        } else if ( w.attachEvent ) {
            w.attachEvent( "onresize", checkResize );
        }
    }

    runPicturefill();

    /* expose methods for testing */
    picturefill._ = pf;

    /* expose picturefill */
    return picturefill;
} ));
/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


/*!
 * EventEmitter v4.2.6 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * imagesLoaded v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'imagesloaded',[
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {



var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !( nodeType === 1 || nodeType === 9 || nodeType === 11 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new EventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ImagesLoaded;

});

(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {

        define('iea',['backbone', 'underscore', 'layoutmanager', 'relational','paginator', 'bootstrap', 'enquire', 'picturefill', 'imagesloaded'], function(Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded) {
            return (root.IEA = factory(root, Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded));
        });

    } else if (typeof exports !== 'undefined') {

        var Backbone = require('backbone'),
            _ = require('underscore'),
            Layoutmanager = require('layoutmanager'),
            Relational = require('relational'),
            Bootstrap = require('boostrap'),
            Enquire = require('enquire'),
            Picturefill = require('picturefill'),
            Paginator = require('paginator');
            Imagesloaded = require('imagesloaded');


        module.exports = factory(root, Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded);

    } else {
        root.IEA = factory(root, root.Backbone, root._, root.Layoutmanager, root.Relational, root.Paginator, root.Bootstrap, root.Enquire, root.Picturefill, root.Imagesloaded);
    }

}(this, function(root, Backbone, _, Layoutmanager, Relational, Paginator, Bootstrap, Enquire, Picturefill, Imagesloaded) {
    'use strict';

    var previousIEA = root.IEA;

    var IEA = Backbone.IEA = {};

    IEA.VERSION = '<%= version %>';

    IEA.History = Backbone.History;

    IEA.noConflict = function() {
        root.IEA = previousIEA;
        return this;
    };

    // Get the Deferred creator for later use
    IEA.Deferred = Backbone.$.Deferred;

    /* jshint unused: false */
    'use strict';
    
    // Helpers
    // -------
    
    // For slicing `arguments` in functions
    var slice = Array.prototype.slice;
    
    // Borrow the Backbone `extend` method so we can use it as needed
    IEA.extend = Backbone.Model.extend;
    IEA.modules = {};
    
    /**
     * Retrieve an object, function or other value from a target
     * object or its `options`, with `options` taking precedence.
     * @method getOption
     * @param {} target
     * @param {} optionName
     * @return value
     */
    IEA.getOption = function(target, optionName) {
        if (!target || !optionName) {
            return;
        }
        var value;
    
        if (target.options && (target.options[optionName] !== undefined)) {
            value = target.options[optionName];
        } else {
            value = target[optionName];
        }
    
        return value;
    };
    
    /**
     * application set options
     * @method setOption
     * @param {} target
     * @param {} optionName
     * @param {} value
     * @return Literal
     */
    IEA.setOption = function(target, optionName, value) {
        if (!target || !optionName) {
            return false;
        }
    
        if (target.options && (target.options[optionName] !== undefined)) {
            target.options[optionName] = value;
        } else {
            target[optionName] = value;
        }
    
        return true;
    
    };
    
    /**
     * prototypical way of creating new instance of an object
     * @method create
     * @param {} o
     * @return
     */
    IEA.create = function(o) {
        if (typeof Object.create !== 'function') {
            Object.create = function(o) {
                function F() {}
                F.prototype = o;
                return new F();
            };
        } else {
            return Object.create(o);
        }
    };
    
    /**
     * get applicatin instance
     * @method getApplication
     * @return application
     */
    IEA.getApplication = function() {
        return IEA.instance;
    };
    
    /**
     * create iea module. regiter them immediately if the application is running or put it to scope
     * and wait for application to load and register all of them
     * @method addModule
     * @param {} moduleName
     * @param {} moduleDefenition
     * @return
     */
    IEA.module = function(moduleName, moduleDefenition) {
        var args = Array.prototype.slice.call(arguments);
    
        if (typeof IEA.currentInstance !== 'undefined') {
            return IEA.currentInstance.addModule.apply(IEA.currentInstance, args);
        } else {
            return IEA.modules[moduleName] = moduleDefenition;
        }
    };
    
    /**
     * create new iea service and return new instances everytime the service is requested
     * @method service
     * @param {} serviceName
     * @param {} serviceDefenition
     * @return serviceDefenition
     */
    IEA.service = function(serviceName, serviceDefenition) {
        /**
         * Description
         * @method serviceName
         * @param {} options
         * @return CallExpression
         */
        IEA[serviceName] = function(options) {
            // build the correct list of arguments for the module definition
            var args = _.flatten([
                    this,
                    IEA.currentInstance,
                    IEA,
                    Backbone.$, _
                ]),
                serviceArgs = Array.prototype.slice.call(arguments),
                newInstance, serviceDef;
    
            serviceDef = serviceDefenition.apply(this, args),
    
                _.extend(serviceDef.prototype, Backbone.Events, {
                    _initCallbacks: new IEA.Callbacks(),
    
                    /**
                     * Add an initializer that is either run at when the `start`
                     * method is called, or run immediately if added after `start`
                     * has already been called.
                     * @method addInitializer
                     * @param {} initializer
                     * @return
                     */
                    addInitializer: function(initializer) {
                        this._initCallbacks.add(initializer);
                    },
    
                    /**
                     * kick off all of the application's processes.
                     * initializes all of the initializer functions
                     * @method start
                     * @param {} options
                     * @return
                     */
                    start: function(options) {
                        this._initCallbacks.run(options, this);
                    },
    
                    triggerMethod: IEA.triggerMethod
                });
    
            newInstance = new serviceDef
            return newInstance.initialize.apply(newInstance, serviceArgs);
        };
    
        return serviceDefenition;
    };
    
    /**
     * once the application is started it lookes through the iea modules which are not yet registerd and hen register the same
     * @method registerModules
     * @param {} app
     * @return
     */
    IEA.registerModules = function(app) {
        setTimeout(function() {
            for (var module in IEA.modules) {
                app.addModule(module, IEA.modules[module]);
            }
        }, 100);
    };
    
    /**
     * IEA Event aggregator instance from the backbone core.
     * @method EventAggregator
     * @return EA
     */
    IEA.EventAggregator = function() {
    
        /**
         * Description
         * @method EA
         * @return
         */
        var EA = function() {};
    
        // Copy the `extend` function used by Backbone's classes
        EA.extend = Backbone.Model.extend;
    
        // Copy the basic Backbone.Events on to the event aggregator
        _.extend(EA.prototype, Backbone.Events);
    
        return EA;
    };
    
    
    /**
     * Mix in methods from Underscore, for iteration, and other
     * collection related features.
     * Borrowing this code from Backbone.Collection:
     * http://backbonejs.org/docs/backbone.html#section-121
     * @method actAsCollection
     * @param {} object
     * @param {} listProperty
     * @return
     */
    IEA.actAsCollection = function(object, listProperty) {
        var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
            'select', 'reject', 'every', 'all', 'some', 'any', 'include',
            'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
            'last', 'without', 'isEmpty', 'pluck'
        ];
    
        _.each(methods, function(method) {
            /**
             * Description
             * @method method
             * @return CallExpression
             */
            object[method] = function() {
                var list = _.values(_.result(this, listProperty));
                var args = [list].concat(_.toArray(arguments));
                return _[method].apply(_, args);
            };
        });
    };
    
    IEA.serializeFormObject = function(el) {
        "use strict";
    
        var a = {},
            b = function(b, c) {
                var d = a[c.name];
                "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push($.trim(c.value)) : a[c.name] = [d, $.trim(c.value)] : a[c.name] = $.trim(c.value)
            };
    
        return $.each(el.serializeArray(), b), a
    };
    
    /**
     * Protect window.console method calls, e.g. console is not defined on IE8
     * unless dev tools are open, and IE doesn't define console.debug.
     * From http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
     * @method consolify
     * @param {} debug
     * @return
     */
    IEA.consolify = function(debug) {
    
        /**
         * Description
         * @method dummy
         * @return
         */
        function dummy() {}
    
        if (!window.console) {
            window.console = {};
        }
    
        // union of Chrome, FF, IE, and Safari console methods
        // keep log out from this for now 'log',
        var m = ['info','warn', 'error', 'debug', 'trace', 'dir', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'dirxml', 'assert', 'count', 'markTimeline', 'timeStamp', 'clear'],
            i = 0,
            len = m.length;
    
        if(typeof debug === 'object') {
    
        }
    
        // define undefined methods as noops to prevent errors
        for (i; i < len; i++) {
            if (!window.console[m[i]] || debug === false) {
                window.console[m[i]] = dummy;
            }
        }
    };
    
    /**
     * IE 10+ doesn't support conditional comments so this helps to check which version of IE is being used.
     * We have to wrap the check inside of a Function to avoid minification of JS code removing the comment.
     * http://stackoverflow.com/a/16367030
     * @method checkNonConditionalIEVersion
     * @return ObjectExpression
     */
    IEA.checkNonConditionalIEVersion = function() {
        var isIE = false,
            actualVersion = null,
            Fn = Function, // https://github.com/jshint/jshint/issues/525
            jscriptVersion = new Fn('/*@cc_on return @_jscript_version; @*/')();
    
        if (!!window.MSInputMethodContext) {
            // http://stackoverflow.com/a/22082397
            isIE = true;
            actualVersion = 11;
        } else if (jscriptVersion !== undefined) {
            isIE = true;
            actualVersion = jscriptVersion;
        }
    
        return {
            isIE: isIE,
            version: Number(actualVersion)
        };
    };
    
    'use strict';
    
    /**
     * application configuration class which will hold all the application level information and can be accessed anywhere from the application.
     * @method Config
     * @param {} options
     * @param {} app
     * @return
     */
    IEA.Config= function (options, app) {
        Backbone.Model.apply(this, [options]);
        this.app = app;
    };
    
    IEA.Config.extend = Backbone.Model.extend;
    
    _.extend(IEA.Config.prototype, Backbone.Model.prototype, {
    
        defaults: {
            '$htmlAndBody': $('html, body'),
            '$body': $('body'),
            '$window': $(window),
            '$document': $(document),
            'isIE8': $('body').hasClass('lt-ie9'),
            'pageTitle': document.title,
            'isMobileBreakpoint': false,
            'isTabletBreakpoint': false,
            'isDesktopBreakpoint': false,
    
            'FLCN_TEMPLATE': {},
            'FLCN_BASEPATH': 'lib',
            'FLCN_TEMPLATEPATH': 'lib/js/templates/',
            'FLCN_IMAGEPATH': 'lib/images/',
            'FLCN_VIEWPATH': 'lib/js/templates/',
            'FLCN_SASSPATH': 'lib/js/sass/',
            'FLCN_THEMEPATH': 'lib/js/sass/theme/',
            'FLCN_DEPENDENCIES': ['iea.components'],
    
    
            'templateFramework':'Handlebars',
            'defaultTemplateName' : '',
            'dependencies': [],
            'loadErrorMsg' : "Component load error",
            'loadErrorDetails': "could not load the requested component",
            'theme': 'whitelabel',
            'selector': 'enscale',
            'extension': 'jpg',
            'breakpoints': {},
    
    
            // application template and engine settings
            'template':{},
    
            // internationalization settings
            'i18n':{},
    
            // layout settings
            'layout':{},
    
            // debug settings
            'debug': true,
    
            // application folder and file nameing convensions
            'conventions':{},
    
            // other application settings
            'settings':{},
    
            // environment detection and settings
            'environment': {
                'development': [],
                'stage': [],
                'production': [],
            },
    
            // development settings
            'development': {},
    
            // stageserver settings
            'stage': {},
    
            // production settings
            'production': {}
        },
    
        /**
         * configuration object intialize and add the configuration at application level as well as server side json.
         * @method initialize
         * @return
         */
        initialize: function (options) {
            var self = this,
                breakpoints = options.breakpoints,
                deviceSmall = +breakpoints.deviceSmall.slice(0, -2),
                deviceMedium = +breakpoints.deviceMedium.slice(0, -2),
                deviceLarge = +breakpoints.deviceLarge.slice(0, -2),
                deviceXlarge = +breakpoints.deviceXlarge.slice(0, -2);
    
            if (options && typeof options.url !== 'undefined') {
                this.urlRoot = options.url;
            }
    
            this.set({
                template: {
                    namespace: options.template.namespace || options.name
                },
    
                breakpoints: {
                    'mobile': {
                        'media': 'screen and (min-width: ' + deviceSmall + 'px) and (max-width: ' + (deviceLarge - 1) + 'px)',
                        'prefix': '.mobP.high.'
                    },
                    'mobileLandscape': {
                        'media': 'screen and (min-width: ' + deviceSmall + 'px) and (max-width: ' + (deviceLarge - 1) + 'px) and (orientation : landscape)',
                        'prefix':'.mobL.high.'
                    },
                    'tablet': {
                        'media': 'screen and (min-width: ' + deviceLarge + 'px) and (max-width: ' + (deviceXlarge - 1) + 'px)',
                        'prefix': '.tabP.high.'
                    },
                    'tabletLandscape': {
                        'media': 'screen and (min-width: ' + deviceLarge + 'px) and (max-width: ' + (deviceXlarge - 1) + 'px) and (orientation : landscape)',
                        'prefix': '.tabL.high.'
                    },
                    'desktop': {
                        'media': 'screen and (min-width: ' + deviceXlarge + 'px)',
                        'prefix': '.full.high.'
                    }
                }
            });
    
            // add change event to configuration whic will trigger an event at application level
            this.on('change', function (config) {
                if(options.debug) {
                    console.info('%c configuration changed! ', 'background: #222; color: #fff',  config.changed);
                }
                self.app.trigger('configuration:changed', config.changed);
            });
        },
    
        getTemplateSetting: function (argument) {
            return this.get('template');
        },
    
        geti18NSetting: function (argument) {
            return this.get('i18n');
        },
    
        getLayoutSetting: function (argument) {
            return this.get('layout');
        },
    
        getDebugSetting : function (argument) {
            return this.get('debug');
        },
    
        getConventionSetting: function (argument) {
            return this.get('conventions');
        },
    
        getEnvironment: function (argument) {
            return this.get('environment');
        },
    
        getEnvironmentSetting: function (argument) {
            return this.get('environment');
        },
    
        getDevelopmentSetting: function (argument) {
            return this.get('development');
        },
    
        getStageSetting: function (argument) {
            return this.get('stage');
        },
    
        getProductionSetting: function (argument) {
            return this.get('production');
        }
    });
    
    
    // Trigger an event and/or a corresponding method name. Examples:
    //
    // `this.triggerMethod("foo")` will trigger the "foo" event and
    // call the "onFoo" method.
    //
    // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
    // call the "onFooBar" method.
    
    IEA.triggerMethod = function(event) {
    'use strict';
      // split the event name on the ":"
      var splitter = /(^|:)(\w)/gi;
    
      // take the event section ("section1:section2:section3")
      // and turn it in to uppercase name
      function getEventName(match, prefix, eventName) {
        return eventName.toUpperCase();
      }
    
      // get the method name from the event name
      var methodName = 'on' + event.replace(splitter, getEventName);
      var method = this[methodName];
      var result;
    
      // call the onMethodName if it exists
      if (_.isFunction(method)) {
        // pass all arguments, except the event name
        result = method.apply(this, _.tail(arguments));
      }
    
      // trigger the event, if a trigger method exists
      if (_.isFunction(this.trigger)) {
        this.trigger.apply(this, arguments);
      }
    
      return result;
    };
    
    // triggerMethodOn invokes triggerMethod on a specific context
    //
    // e.g. `IEA.triggerMethodOn(view, 'show')`
    // will trigger a "show" event or invoke onShow the view.
    IEA.triggerMethodOn = function(context, event) {
      'use strict';
      var args = _.tail(arguments, 2);
      var fnc;
    
      if (_.isFunction(context.triggerMethod)) {
        fnc = context.triggerMethod;
      } else {
        fnc = IEA.triggerMethod;
      }
    
      return fnc.apply(context, [event].concat(args));
    };
    
    /* jshint maxparams: 9 */
    
    // Module
    // ------
    
    // A simple module system, used to create privacy and encapsulation in
    'use strict';
    
    // IEA applications
    IEA.Module = function(moduleName, app, options) {
        this.moduleName = moduleName;
        this.options = _.extend({}, this.options, options);
        // Allow for a user to overide the initialize
        // for a given module instance.
        this.initialize = options.initialize || this.initialize;
    
        // Set up an internal store for sub-modules.
        this.submodules = {};
    
        this._setupInitializersAndFinalizers();
    
        // Set an internal reference to the app
        // within a module.
        this.app = app;
    
        if (_.isFunction(this.initialize)) {
            this.initialize(moduleName, app, this.options);
        }
    };
    
    IEA.Module.extend = IEA.extend;
    
    // Extend the Module prototype with events / listenTo, so that the module
    // can be used as an event aggregator or pub/sub.
    _.extend(IEA.Module.prototype, Backbone.Events, {
    
        // By default modules start with their parents.
        startWithParent: true,
    
        // Initialize is an empty function by default. Override it with your own
        // initialization logic when extending IEA.Module.
        initialize: function(options) {
            _.extend(this, options);
        },
    
        // Initializer for a specific module. Initializers are run when the
        // module's `start` method is called.
        addInitializer: function(callback) {
            this._initializerCallbacks.add(callback);
        },
    
        // Finalizers are run when a module is stopped. They are used to teardown
        // and finalize any variables, references, events and other code that the
        // module had set up.
        addFinalizer: function(callback) {
            this._finalizerCallbacks.add(callback);
        },
    
        // Start the module, and run all of its initializers
        start: function(options) {
            // Prevent re-starting a module that is already started
            if (this._isInitialized) {
                return;
            }
    
            // start the sub-modules (depth-first hierarchy)
            _.each(this.submodules, function(mod) {
                // check to see if we should start the sub-module with this parent
                if (mod.startWithParent) {
                    mod.start(options);
                }
            });
    
            // run the callbacks to "start" the current module
            this.triggerMethod('before:start', options);
    
            this._initializerCallbacks.run(options, this);
            this._isInitialized = true;
    
            this.triggerMethod('start', options);
        },
    
        // Stop this module by running its finalizers and then stop all of
        // the sub-modules for this module
        stop: function() {
            // if we are not initialized, don't bother finalizing
            if (!this._isInitialized) {
                return;
            }
            this._isInitialized = false;
    
            this.triggerMethod('before:stop');
    
            // stop the sub-modules; depth-first, to make sure the
            // sub-modules are stopped / finalized before parents
            _.each(this.submodules, function(mod) {
                mod.stop();
            });
    
            // run the finalizers
            this._finalizerCallbacks.run(undefined, this);
    
            // reset the initializers and finalizers
            this._initializerCallbacks.reset();
            this._finalizerCallbacks.reset();
    
            this.triggerMethod('stop');
        },
    
        // Configure the module with a definition function and any custom args
        // that are to be passed in to the definition function
        addDefinition: function(moduleDefinition, customArgs) {
            this._runModuleDefinition(moduleDefinition, customArgs);
        },
    
        getViewInstance: function (data) {
            var self = this;
            if(typeof this.View !== 'undefined') {
                return new this.View({
                    className: self.moduleName,
                    parent: self,
                    app: self.app,
                    el: $('<div>'),
                    model: new IEA.Model(data)
                });
            } else {
                return new IEA.View({
                    el: $('<div>'),
                    model: new IEA.Model(data)
                });
            }
        },
    
        // Internal method: run the module definition function with the correct
        // arguments
        _runModuleDefinition: function(definition, customArgs) {
            // If there is no definition short circut the method.
            if (!definition) {
                return;
            }
            // build the correct list of arguments for the module definition
            var args = _.flatten([
                this,
                this.app,
                IEA,
                Backbone.$, _,
                customArgs
            ]);
    
            definition.apply(this, args);
        },
    
        // Internal method: set up new copies of initializers and finalizers.
        // Calling this method will wipe out all existing initializers and
        // finalizers.
        _setupInitializersAndFinalizers: function() {
            this._initializerCallbacks = new IEA.Callbacks();
            this._finalizerCallbacks = new IEA.Callbacks();
        },
    
        // import the `triggerMethod` to trigger events with corresponding
        // methods if the method exists
        triggerMethod: IEA.triggerMethod
    });
    
    // Class methods to create modules
    _.extend(IEA.Module, {
    
        // Create a module, hanging off the app parameter as the parent object.
        create: function(app, moduleNames, moduleDefinition) {
            var module = app;
    
            // get the custom args passed in after the module definition and
            // get rid of the module name and definition function
            var customArgs = slice.call(arguments);
            customArgs.splice(0, 3);
    
            // Split the module names and get the number of submodules.
            // i.e. an example module name of `Doge.Wow.Amaze` would
            // then have the potential for 3 module definitions.
            moduleNames = moduleNames.split('.');
            var length = moduleNames.length;
    
            // store the module definition for the last module in the chain
            var moduleDefinitions = [];
            moduleDefinitions[length - 1] = moduleDefinition;
    
            // Loop through all the parts of the module definition
            _.each(moduleNames, function(moduleName, i) {
                var parentModule = module;
                module = this._getModule(parentModule, moduleName, app, moduleDefinition);
                this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
                //this._loadComponents(module);
            }, this);
    
            // Return the last module in the definition chain
            return module;
        },
    
        _getModule: function(parentModule, moduleName, app, def, args) {
            var options = _.extend({}, def);
            var ModuleClass = this.getClass(def);
    
            // Get an existing module of this name if we have one
            var module = parentModule[moduleName];
    
            if (!module) {
                // Create a new module if we don't have one
                module = new ModuleClass(moduleName, app, options);
                parentModule[moduleName] = module;
                // store the module on the parent
                parentModule.submodules[moduleName] = module;
                parentModule.submodules[moduleName].parent = parentModule;
            }
    
            return module;
        },
    
        // ## Module Classes
        //
        // Module classes can be used as an alternative to the define pattern.
        // The extend function of a Module is identical to the extend functions
        // on other Backbone and IEA classes.
        // This allows module lifecyle events like `onStart` and `onStop` to be called directly.
        getClass: function(moduleDefinition) {
            var ModuleClass = IEA.Module;
    
            if (!moduleDefinition) {
                return ModuleClass;
            }
    
            // If all of the module's functionality is defined inside its class,
            // then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
            if (moduleDefinition.prototype instanceof ModuleClass) {
                return moduleDefinition;
            }
    
            return moduleDefinition.moduleClass || ModuleClass;
        },
    
        // Add the module definition and add a startWithParent initializer function.
        // This is complicated because module definitions are heavily overloaded
        // and support an anonymous function, module class, or options object
        _addModuleDefinition: function(parentModule, module, def, args) {
            var fn = this._getDefine(def);
            var startWithParent = this._getStartWithParent(def, module);
    
            if (fn) {
                module.addDefinition(fn, args);
            }
    
            this._addStartWithParent(parentModule, module, startWithParent);
        },
    
        _getStartWithParent: function(def, module) {
            var swp;
    
            if (_.isFunction(def) && (def.prototype instanceof IEA.Module)) {
                swp = module.constructor.prototype.startWithParent;
                return _.isUndefined(swp) ? true : swp;
            }
    
            if (_.isObject(def)) {
                swp = def.startWithParent;
                return _.isUndefined(swp) ? true : swp;
            }
    
            return true;
        },
    
        _getDefine: function(def) {
            if (_.isFunction(def) && !(def.prototype instanceof IEA.Module)) {
                return def;
            }
    
            if (_.isObject(def)) {
                return def.define;
            }
    
            return null;
        },
    
        _addStartWithParent: function(parentModule, module, startWithParent) {
            module.startWithParent = module.startWithParent && startWithParent;
    
            if (!module.startWithParent || !!module.startWithParentIsConfigured) {
                return;
            }
    
            module.startWithParentIsConfigured = true;
    
            parentModule.addInitializer(function(options) {
                if (module.startWithParent) {
                    module.start(options);
                }
            });
        },
    
        _loadComponents: function(module) {
    
            if (module.parent === 'undefined' || module.parent.moduleName !== 'UI') {
                return;
            }
    
            module.addInitializer(function(options) {
                var self = this,
    
                    // add initialier which gets triggered once the page is loaded. this will make sure that the inline component
                    // markup is binded with the backbone view
    
                    renderStaticCompnent = function(el, data, viewOptions) {
                        // create new instance of the module view and add the data as model
                        this.view = new this.View(_.extend(viewOptions, {
                            el: el,
                            model: new IEA.Model(data)
                        }));
    
                        // in case of serverside component, no need the render the page
                        // only fire enable to make sure the logic is applied.
                        this.view.triggerMethod('before:show', this);
                        this.app.trigger('component:loaded', this);
                        this.view.enable();
                        this.view.triggerMethod('show', this);
                        this.app.trigger('image:lazyload', this);
    
                        //imageloader binding
                        self.view.$el.imagesLoaded()
                        .done( function( instance ) {
                            self.view.triggerMethod('image:load', this);
                        })
                        .fail( function() {
                            self.view.triggerMethod('image:fail', this);
                        });
    
                        // add instance object to DOM for future reference
                        el.data('module', self);
                    },
    
                    renderDynamicComponent = function(el, data, viewOptions) {
                        // create new instance of the module view and add the data as model
                        this.view = new this.View(_.extend(viewOptions, {
                            el: el,
                            model: new IEA.Model(data)
                        }));
    
                        this.view.triggerMethod('before:show', this);
                        this.app.trigger('component:loaded', this);
                        this.view.render();
                        this.view.triggerMethod('show', this);
                        setTimeout(function () {
                            self.app.trigger('image:lazyload', self);
    
                            //imageloader binding
                            self.view.$el.imagesLoaded()
                            .done( function( instance ) {
                                self.view.triggerMethod('image:load', this);
                            })
                            .fail( function() {
                                self.view.triggerMethod('image:fail', this);
                            });
    
                        }, 300);
    
                        // add instance object to DOM for future reference
                        el.data('module', self);
                    };
    
                // this call also be fired with app.UI.accordion.start()
                $('[data-role="' + module.moduleName + '"]').each(function(indx, component) {
                    var $component = $(component),
                        isServerComponent = $component.data('server'),
                        compConfig = $('#' + $component.data('config')),
                        compDataURL = $component.data('path');
    
                    _.extend(module.View.prototype, {
                        className: module.moduleName,
                        parent: module,
                        app: module.app,
                        isServerComponent:  isServerComponent,
                        template : module.app.getTemplate(module.moduleName)
                    });
    
                    // this is a default view binding with server rendered component.
                    var viewOptions = {};
    
                    if (typeof compConfig !== 'undefined' && compConfig.length) {
                        console.log('%c Serverside component found : ', 'background: #428bca; color: #fff',  module.moduleName);
    
                        try {
                            compConfig = JSON.parse(compConfig.html());
                        } catch (err) {
                            compConfig = {};
                        }
    
                        renderStaticCompnent.apply(self, [$component, compConfig, viewOptions]);
    
                    } else if (typeof compDataURL !== 'undefined' && typeof compDataURL === 'string') {
                        console.log('%c Clientside component found : ', 'background: #428bca; color: #fff',  module.moduleName);
    
                        var compxhr,
                            componentData = new IEA.Model({
                                url: compDataURL
                            });
    
                        compxhr = componentData.fetch();
    
                        compxhr.done(function (data) {
    
                            if(_.isEmpty(data)) {
                                data = {
                                    status: "Error",
                                    details: "No data found"
                                };
    
                                viewOptions = {
                                    template: module.app.getTemplate('notfound'),
                                    _isEnabled: true
                                };
                            }
    
                            renderDynamicComponent.apply(self, [$component, data, viewOptions]);
                        });
    
                        compxhr.fail(function (object, status, details) {
    
                            renderDynamicComponent.apply(self, [$component, {
                                status: status,
                                details: details
                            }, {
                                template: module.app.getTemplate('notfound'),
                                _isEnabled: true
                            }]);
                        });
    
                    } else {
                        console.log('%c Serverside component found : ', 'background: #428bca; color: #fff',  module.moduleName);
    
                        renderStaticCompnent.apply(self, [$component, {},
                            viewOptions
                        ]);
                    }
                });
            });
    
            // finalizer get called when the module is stopped and make sure that all the binding is unbinded
            // can be called using app.UI.accordion.stop();
            module.addFinalizer(function(component) {
                var self = this;
                //TODO: need to correct this logic
                $('[data-role="' + module.moduleName + '"]').each(function(indx, component) {
                    var view = $(this).data('view');
                    view.stop();
                });
            });
        }
    });
    
    'use strict';
    
    /**
     * Description
     * @method Model
     * @param {} options
     * @return
     */
    IEA.Model = function(options) {
        Backbone.Model.apply(this, [options]);
    };
    
    IEA.Model.extend = Backbone.Model.extend;
    
    _.extend(IEA.Model.prototype, Backbone.Model.prototype, {
    
        defaults: {
            hasShown: false
        },
    
        /**
         * Description
         * @method initialize
         * @param {} options
         * @return
         */
        initialize: function(options) {
            _.extend(this, options);
    
            if (options && typeof options.url !== 'undefined') {
                this.urlRoot = options.url;
            }
    
        }
    });
    
    'use strict';
    
    /**
     * Description
     * @method Collection
     * @param {} options
     * @return
     */
    IEA.Collection = function(options) {
        Backbone.Collection.apply(this, [options]);
    };
    
    IEA.Collection.extend = Backbone.Collection.extend;
    
    _.extend(IEA.Collection.prototype, Backbone.Collection.prototype, {
        model: IEA.Model,
    
        defaults: {
            hasShown: false
        },
    
        /**
         * Description
         * @method initialize
         * @param {} options
         * @return
         */
        initialize: function(options) {
            _.extend(this, options);
    
            if (options && typeof options.url !== 'undefined') {
                this.urlRoot = options.url;
            }
    
        }
    });
    
    'use strict';
    
    /**
     * iea abstract view function class
     * @method AbstractView
     * @param {} options
     * @return
     */
    IEA.AbstractView = function(options) {
        Backbone.View.apply(this, [options]);
    };
    
    // set Layout intitial configuration to use view as layouts and disable elements
    Backbone.Layout.configure({
        manage: false,
        el: false
    });
    
    // add extend to abstractView from backbone
    IEA.AbstractView.extend = Backbone.View.extend;
    
    // add LayoutManager into IEA scope. From here onways IEA.View also is equipped with Layout manager and
    // all its features
    IEA.Layout = Backbone.Layout;
    
    _.extend(IEA.AbstractView.prototype, Backbone.View.prototype, {
        /* ----------------------------------------------------------------------------- *\
               Public Methods
        \* ----------------------------------------------------------------------------- */
    
        /**
        * Executed immediately when creating a new instance. Hides the containing element so that we can use the transitioning methods to show it.
        * @method initialize
        * @return {null}
        **/
        initialize: function(options) {
            var self = this;
            _.extend(this, options);
    
            // bind listeners for reponsive behavior
            this.app.on('matchMobile', $.proxy(this.triggerMethod, this, 'matchMobile'));
            this.app.on('unmatchMobile', $.proxy(this.triggerMethod, this, 'unmatchMobile'));
            this.app.on('matchTablet', $.proxy(this.triggerMethod, this, 'matchTablet'));
            this.app.on('unmatchTablet', $.proxy(this.triggerMethod, this, 'unmatchTablet'));
            this.app.on('matchDesktop', $.proxy(this.triggerMethod, this, 'matchDesktop'));
            this.app.on('unmatchDesktop', $.proxy(this.triggerMethod, this, 'unmatchDesktop'));
            this.app.on('window:resized', $.proxy(this.triggerMethod, this, 'window:resized'));
    
            // when view is intialized, fire the current breakpoint event
            setTimeout(function () {
                self.triggerMethod(self.app.getCurrentBreakpoint());
            },300);
    
            // view level variables
            this._isEnabled= false;
    
        },
    
        /**
        Clears the provided element's styles from the DOM.
        @method clearStyles
        @example
            this.clearStyles(this.$el);
        @param {jQuery Element} el The element to clear the styles of
        @return {null}
        **/
        clearStyles: function($el) {
            $el.attr('style', '');
        },
    
        /**
        Disposes of the view.  Unbinds its events and removes it from the DOM.
        @method dispose
        @return {null}
        **/
        stop: function() {
            this.undelegateEvents();
            this.remove();
        },
    
        /**
        show the view
        @method show
        @return {null}
        **/
        show: function() {
            this.$el.fadeIn(0);
        },
    
        /**
        hide the view
        @method hide
        @return {null}
        **/
        hide: function(cb, scope, params) {
            this.$el.fadeOut(0, function() {
                if (typeof cb === 'function') {
                    if (typeof params === 'undefined') {
                        params = [];
                    }
                    cb.apply(scope, params);
                }
            });
        },
    
        /**
        Cleans up the view.  Unbinds its events and removes it from the DOM.
        @method clean
        @return {null}
        **/
        clean: function() {
    
        },
    
        triggerMethod: IEA.triggerMethod,
    
        /* ----------------------------------------------------------------------------- *\
            Event Handlers
        \* ----------------------------------------------------------------------------- */
    
    });
    
    'use strict';
    
    
    /**
     * IEA view
     * @return
     * @method View
     * @param {} options
     * @return
     */
    IEA.View = function(options) {
        IEA.AbstractView.apply(this, [options]);
    };
    
    
    IEA.View.extend = IEA.AbstractView.extend;
    
    // extend abstract view into iea view to give it more power.
    _.extend(IEA.View.prototype, IEA.AbstractView.prototype, {
    
        /**
         * intialize function
         * @return
         * @method initialize
         * @param {} options
         * @return
         */
        initialize: function(options) {
            IEA.AbstractView.prototype.initialize.apply(this, arguments);
    
            //get all the options and set it to the view scope
            _.extend(this, options);
            _.bindAll(this, 'render');
    
            //any change in the component model will trigger the render again
            this.listenTo(this.model, 'change', function(data) {
                this.triggerMethod('model:change', this.model.changed);
            });
    
            // add the module name as the class to the component element to bind the the css
            this.$el.addClass(this.parent.moduleName);
        },
    
        addEvent: function (viewEvents, callback) {
            if(_.isObject(viewEvents)) {
                _.extend(this.events, viewEvents);
            }
    
            if(_.isString(viewEvents)) {
                this.events[viewEvents] = callback;
            }
        },
    
        removeEvent: function (viewEventName) {
            this.events = _.omit(this.events, viewEventName);
        },
    
        updateSetting: function (settings, callback) {
            if(_.isObject(settings)) {
                _.extend(this.defaultSettings, settings);
            }
    
            if(_.isString(settings)) {
                this.defaultSettings[settings] = callback;
            }
        },
    
        /**
         * get component template
         * @method getTemplate
         * @param {} name
         * @return CallExpression
         */
        getTemplate: function(name, path) {
            var args = Array.prototype.slice.call(arguments);
            return this.app.getTemplate.apply(this.app, args);
        },
    
        /**
         * get component name
         * @method getViewName
         * @return MemberExpression
         */
        getViewName: function() {
            return this.parent.moduleName;
        },
    
        /**
         * parse the data from the form to model
         * @method parse
         * @param {} objName
         * @return
         */
        parse: function(objName) {
            var self = this,
                _recurse_form = function(object, objName) {
                    _.each(object, function(v, k) {
                        if (v instanceof Object) {
                            object[k] = _recurse_form(v, objName + '[' + k + '_attributes]');
                        } else {
                            object[k] = self.$('[name="' + objName + '[' + k + ']"]').val();
                        }
                    });
                    return object;
                };
    
            this.model.attributes = _recurse_form(this.model.attributes, objName);
        },
    
        /**
         * populate model data into the form
         * @method populate
         * @param {} objName
         * @return
         */
        populate: function(objName) {
            var self = this,
                _recurse_obj = function(object, objName) {
                    _.each(object, function(v, k) {
                        if (v instanceof Object) {
                            _recurse_obj(v, objName + '[' + k + '_attributes]');
                        } else if (_.isString(v)) {
                            self.$('[name="' + objName + '[' + k + ']"]').val(v);
                        }
                    });
                };
    
            _recurse_obj(this.model.attributes, objName);
        }
    });
    
    'use strict';
    
    // Callbacks
    // ---------
    
    /**
     * A simple way of managing a collection of callbacks and executing them at a later point in time, using jQuery's `Deferred` object.
     * @method Callbacks
     * @return
     */
    IEA.Callbacks = function() {
        this._deferred = IEA.Deferred();
        this._callbacks = [];
    };
    
    _.extend(IEA.Callbacks.prototype, {
    
        /**
         * Add a callback to be executed. Callbacks added here are// guaranteed to execute, even if they are added after the// `run` method is called.
         * @method add
         * @param {} callback
         * @param {} contextOverride
         * @return
         */
        add: function(callback, contextOverride) {
            var promise = _.result(this._deferred, 'promise');
    
            this._callbacks.push({
                cb: callback,
                ctx: contextOverride
            });
    
            promise.then(function(args) {
                if (contextOverride) {
                    args.context = contextOverride;
                }
                callback.call(args.context, args.options);
            });
        },
    
        /**
         * Run all registered callbacks with the context specified.// Additional callbacks can be added after this has been run// and they will still be executed.
         * @method run
         * @param {} options
         * @param {} context
         * @return
         */
        run: function(options, context) {
            this._deferred.resolve({
                options: options,
                context: context
            });
        },
    
        /**
         * Resets the list of callbacks to be run, allowing the same list// to be run multiple times - whenever the `run` method is called.
         * @method reset
         * @return
         */
        reset: function() {
            var callbacks = this._callbacks;
            this._deferred = IEA.Deferred();
            this._callbacks = [];
    
            _.each(callbacks, function(cb) {
                this.add(cb.cb, cb.ctx);
            }, this);
        }
    });
    
    /*jshint nocap: true*/
    
    'use strict';
    
    // Application
    
    /**
     * IEA Application class
     * @return
     * @method Application
     * @param {object} options
     * @return
     */
    IEA.Application = function(options) {
        this._initCallbacks = new IEA.Callbacks();
        this.submodules = {};
        this.dependencies = [];
        this.initialize.apply(this, arguments);
    };
    
    // Copy the `extend` function used by Backbone's classes
    IEA.Application.extend = IEA.extend;
    
    _.extend(IEA.Application.prototype, Backbone.Events, {
    
        /**
         * Initialize is an empty function by default. Override it with your own
         * @return
         * @method initialize
         * @param {} options
         * @return
         */
        initialize: function(options) {
            var self = this,
                configURL = $('body').data('config');
    
            // add the current application instance to IEA scope for future use
            IEA.currentInstance = this;
    
            // create a new backbone configuration model and add it to application scope
            if (typeof configURL !== 'undefined' && configURL !== '') {
                options = _.extend(options, {
                    url: configURL
                });
            }
    
            // create a config model with basic configuration
            this.config = new IEA.Config(options, this);
    
            try {
                // fetch the configuration json and update the option model.
                this.config.fetch({
    
                    success: function(data) {
                        self.triggerMethod('config:loaded', self);
                    },
    
                    error: function() {
                        console.info('Configuration load error');
                    }
                });
            } catch (err) {
                // put a very minor delay to make sure that the listeners are registered before its fired.
                setTimeout($.proxy(this.triggerMethod, this, 'config:loaded', this), 100);
            }
    
            this.on('config:loaded', function(app) {
                // run the consolify funtion to make sure that console is either diabled or gracefully killed.
                IEA.consolify(self.config.getDebugSetting());
    
                // add dependecies to be loaded before the application starts
                self.addDependencies(app.getValue('FLCN_DEPENDENCIES'));
                self.addDependencies(app.getValue('dependencies'));
    
                // add all the application start stuffs
                self.addInitializer($.proxy(self._registerModules, self, self));
                self.addInitializer($.proxy(self._listenToWindowEvents, self));
                self.addInitializer($.proxy(self._setUserAgent, self));
                self.addInitializer($.proxy(self._listenToViewportEvents, self));
                self.addInitializer($.proxy(self._loadComponentModules, self));
    
                // $.when(self.loadDependencies(app.getValue('dependencies'))).done($.proxy(self._loadComponentModules, self));
    
                setTimeout($.proxy(self.triggerMethod, self, 'application:ready', self), 100);
            });
    
            this.on('image:lazyload', $.proxy(this._handleLazyLoad, this));
        },
    
        /**
         * Add an initializer that is either run at when the `start` method is called, or run immediately if added after `start` has already been called.
         * @return
         * @method addInitializer
         * @param {function} initializer
         * @return
         */
        addInitializer: function(initializer) {
            this._initCallbacks.add(initializer);
        },
    
        /**
         * kick off all of the application's processes. initializes all of the initializer functions
         * @return
         * @method start
         * @param {} options
         * @return
         */
        start: function(options) {
            this.triggerMethod('before:start', options);
            this._initCallbacks.run(options, this);
            this.triggerMethod('start', options);
        },
    
        /**
         * Create a module, attached to the application
         * @method module
         * @param {string} moduleNames
         * @param {function} moduleDefinition
         * @return CallExpression
         */
        addModule: function(moduleNames, moduleDefinition) {
    
            // Overwrite the module class if the user specifies one
            var ModuleClass = IEA.Module.getClass(moduleDefinition);
    
            // slice the args, and add this application object as the
            // first argument of the array
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
    
            // see the IEA.Module object for more information
            return ModuleClass.create.apply(ModuleClass, args);
        },
    
        /**
         * Retrieve an object, function or other value from a target object or its `options`, with `options` taking precedence.
         * @method getValue
         * @param {} optionName
         * @return value
         */
        getValue: function(optionName) {
            if (!optionName) {
                return;
            }
            var value;
    
            if (typeof this.config !== undefined) {
                value = this.config.get(optionName);
            }
    
            return value;
        },
    
        /**
         * set value to the application level options
         * @method setValue
         * @param {string} optionName
         * @param {any} value
         * @return Literal
         */
        setValue: function(optionName, value) {
            if (!optionName) {
                return false;
            }
    
            if (typeof this.config !== undefined) {
                this.config.set(optionName, value);
            }
    
            return true;
        },
    
        /**
         * Description
         * @method getTemplateFramework
         * @return CallExpression
         */
        getTemplateFramework: function() {
            return this.getValue('templateFramework');
        },
    
        /**
         * Description
         * @method getTemplateExtension
         * @return xtn
         */
        getTemplateExtension: function() {
            var xtn = '';
    
            switch (this.getValue('templateFramework')) {
                case 'Handlebars':
                    xtn = 'hbss';
                    break;
            }
    
            return xtn;
        },
    
        /**
         * Description
         * @method getTemplate
         * @param {} templateName
         * @return MemberExpression
         */
        getTemplate: function(templateName, templatePath) {
    
            // if there is a default template settingused, the rather than folder name it used defaultTemplatenname
            // templatefilename can also be an array of possible names
            var templateFileName = (typeof this.getValue('defaultTemplateName') !== 'undefined' && this.getValue('defaultTemplateName') !== '') ? this.getValue('defaultTemplateName') : templateName,
                templateKey, appTemplate, ieaTemplate, componentNS = this.getValue('componentLookupSeq');
    
            // if templateName is empty means the use has send a custom templatePath to explicity load
            // moslty used in case of sub view load.
            if (!templateName) {
                return false;
            }
    
            for (var indx = 0; indx < componentNS.length; indx++) {
    
                // if application specific template exists then use that rather than looking into iea templates.
                if (window[componentNS[indx]]) {
    
                    //if user has send templatPath specifically , then use that rather than deriving the url based on templateName
                    if (typeof templatePath !== 'undefined' && _.isString(templatePath) && templatePath.indexOf(this.getValue('templatePath')) < 0) {
    
                        // if the templatPath is relative then prefix the path with templatePath
                        appTemplate = this.getValue('templatePath') + templatePath;
    
                        // if the path does not have the extendion then append the extension
                        if (appTemplate.indexOf(this.getTemplateExtension()) < 0) {
                            appTemplate = appTemplate + '.' + this.getTemplateExtension();
                        }
                    }
    
                    // if user has send custom path, then use it else derive the path from templateName and templateFileNames
                    if (appTemplate) {
                        templateKey = appTemplate;
                    } else {
                        // if the defaultTemplates is an array then we have to loop it and see which one exist
                        if (_.isArray(templateFileName)) {
                            for (var i = 0; i < templateFileName.length; i++) {
                                templateKey = this.getValue('templatePath') + templateName + '/' + templateFileName[i] + '.' + this.getTemplateExtension();
    
                                // if the template exist in the application namespace, then use it. else if will
                                // exit the condition and go to iea template fetching logic
                                if (_.has(window[componentNS[indx]], templateKey)) {
                                    console.info('%c '+componentNS[indx]+' HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                                    return window[componentNS[indx]][templateKey]
                                }
                            };
                        } else {
                            templateKey = this.getValue('templatePath') + templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
                        }
                    }
    
                    // if the template exist in the application namespace, then use it. else if will
                    // exit the condition and go to iea template fetching logic
                    if (_.has(window[componentNS[indx]], templateKey)) {
                        console.info('%c '+ componentNS[indx] + ' HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                        return window[componentNS[indx]][templateKey]
                    }
                }
    
            };
    
            // if not found anywhere in the compnent NS then pick the one from iea lib
    
            if (typeof templatePath !== 'undefined' && _.isString(templatePath) && templatePath.indexOf(this.getValue('FLCN_BASEPATH')) < 0) {
                ieaTemplate = this.getValue('FLCN_TEMPLATEPATH') + templatePath;
    
                if (ieaTemplate.indexOf(this.getTemplateExtension()) < 0) {
                    ieaTemplate = ieaTemplate + '.' + this.getTemplateExtension();
                }
            }
    
            if (ieaTemplate) {
                templateKey = ieaTemplate;
            } else {
                if (_.isArray(templateFileName)) {
                    for (var i = 0; i < templateFileName.length; i++) {
                        templateKey = this.getValue('FLCN_TEMPLATEPATH') + templateName + '/' + templateFileName[i] + '.' + this.getTemplateExtension();
    
                        // if the template exist in the iea namespace, then use it.
                        if (_.has(window[this.getValue('FLCN_BASEPATH')], templateKey)) {
                            console.info('%c IEA HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                            return window[this.getValue('FLCN_BASEPATH')][templateKey];
                        }
                    };
                } else {
                    templateKey = this.getValue('FLCN_TEMPLATEPATH') + templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
                }
            }
    
            if (_.has(window[this.getValue('FLCN_BASEPATH')], templateKey)) {
                console.info('%c IEA HBSS included : ', 'background: #00A61E; color: #fff', templateKey);
                return window[this.getValue('FLCN_BASEPATH')][templateKey];
            }
    
    
            // if client template is available pick it else pick application template
            /*if (this.getValue('appBasePath')) {
                templateAvailable = (typeof window[this.getValue('appBasePath')][this.getValue('templatePath') + this.getValue('FLCN_TEMPLATE')[templateName]] !== 'undefined') ? window[this.getValue('appBasePath')][this.getValue('templatePath') + this.getValue('FLCN_TEMPLATE')[templateName]] : window.app[this.getValue('FLCN_TEMPLATEPATH') + this.getValue('FLCN_TEMPLATE')[templateName]];
            } else {
                templateAvailable = window.app[this.getValue('FLCN_TEMPLATEPATH') + this.getValue('FLCN_TEMPLATE')[templateName]];
            }
    
            return templateAvailable;*/
        },
    
        /**
         * Description
         * @method registerTemplate
         * @param {} templateName
         * @param {} templateName
         * @return MemberExpression
         */
        registerTemplate: function(templateName, partialPath) {
    
            var templateFileName = (typeof this.getValue('defaultTemplateName') !== 'undefined' && this.getValue('defaultTemplateName') !== '') ? this.getValue('defaultTemplateName') : templateName,
                path = '';
    
            if (!templateName) {
                return false;
            }
    
            if (partialPath) {
                //path = this.getValue('templatePath') + partialPath + '.' + this.getTemplateExtension();
                path = partialPath + '.' + this.getTemplateExtension();
            } else {
                //path = this.getValue('templatePath') + templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
                path = templateName + '/' + templateFileName + '.' + this.getTemplateExtension();
            }
            if (typeof this.config.attributes.FLCN_TEMPLATE !== undefined) {
                this.getValue('FLCN_TEMPLATE')[templateName] = path;
            }
            //this.setValue(templateName, path);
    
            return true;
        },
    
        /**
         * returns currently set application breakpoint
         * @method getCurrentBreakpoint
         * @return currentBreakpoint
         */
        getCurrentBreakpoint: function() {
            var currentBreakpoint = 'matchDesktop';
    
            if (this.getValue('isMobileBreakpoint')) {
                currentBreakpoint = 'matchMobile';
            } else if (this.getValue('isTabletBreakpoint')) {
                currentBreakpoint = 'matchTablet';
            } else if (this.getValue('isDesktopBreakpoint')) {
                currentBreakpoint = 'matchDesktop'
            }
    
            return currentBreakpoint;
        },
        /**
         * Description
         * @method addDependencies
         * @param {} dep
         * @return MemberExpression
         */
        addDependencies: function(dep) {
            if (_.isArray(dep)) {
                this.dependencies = this.dependencies.concat(dep)
            } else {
                this.dependencies.push(dep);
            }
            return this.dependencies;
        },
        /**
         * Description
         * @method loadDependencies
         * @param {} callback
         * @return
         */
        loadDependencies: function(deps, callback) {
            if (_.isFunction(deps)) {
                callback = deps;
                deps = this.dependencies;
            }
    
            function load(queue, results) {
                if (queue.length) {
                    require([queue.shift()], function(result) {
                        results.push(result);
                        load(queue, results);
                    });
                } else {
                    callback.apply(null, results);
                }
            }
    
            load(deps, []);
        },
    
        // import the `triggerMethod` to trigger events with corresponding
        // methods if the method exists
        triggerMethod: IEA.triggerMethod,
    
        /* -----------------------------------------------------------------------------
         Private Methods
         ----------------------------------------------------------------------------- */
    
        /**
         * load all component modules when the application is loaded.
         * @return
         * @method _loadComponentModules
         * @return
         */
        _loadComponentModules: function() {
            var self = this;
    
            this.loadDependencies(function() {
                $('[data-role]', $(document)).each(function(indx, component) {
                    var $component = $(component),
                        componentName = $component.data('role'),
                        isServerComponent = $component.data('server'),
                        compConfig = $('#' + $component.data('config')),
                        compTemplatePath = $component.data('template'),
                        compName = $component.data('name'),
                        compDataURL = $component.data('path'),
                        module = '';
    
                    if (typeof self.UI !== 'undefined' && typeof self.UI[componentName] !== 'undefined') {
                        module = self.UI[componentName];
                        module.View = IEA.View.extend(module);
                        module.name = compName || 'view';
    
                        _.extend(module.View.prototype, {
                            className: module.moduleName,
                            parent: module,
                            app: module.app,
                            isServerComponent: isServerComponent,
                            template: module.app.getTemplate(module.moduleName)
                        });
    
                        // this is a default view binding with server rendered component.
                        var viewOptions = {};
    
                        if (typeof compConfig !== 'undefined' && typeof compDataURL === 'undefined' && compConfig.length) {
                            console.info('%c SSR component enabled : ', 'background: #428bca; color: #fff', module.moduleName);
    
                            try {
                                compConfig = JSON.parse(compConfig.html());
                            } catch (err) {
                                compConfig = {};
                            }
    
                            self._renderStaticCompnent.apply(self, [module, $component, compConfig, viewOptions]);
    
                        } else if (typeof compDataURL !== 'undefined' && typeof compDataURL === 'string') {
                            console.info('%c CSR component rendered : ', 'background: #428bca; color: #fff', module.moduleName, compDataURL);
    
                            var compxhr,
                                componentData = new IEA.Model({
                                    url: compDataURL
                                });
    
                            compxhr = componentData.fetch();
    
                            compxhr.done(function(data) {
    
                                if (_.isEmpty(data)) {
                                    data = {
                                        status: module.app.getValue('loadErrorMsg') || "Component Error",
                                        details: module.app.getValue('loadErrorDetails') || "Component cannot be loaded"
                                    };
    
                                    viewOptions = {
                                        template: module.app.getTemplate('notfound'),
                                        _isEnabled: true
                                    };
                                }
    
                                self._renderDynamicComponent.apply(self, [module, $component, data, viewOptions]);
                            });
    
                            compxhr.fail(function(object, status, details) {
    
                                self._renderDynamicComponent.apply(self, [module, $component, {
                                    status: module.app.getValue('loadErrorMsg') || status,
                                    details: module.app.getValue('loadErrorMsg') || details
                                }, {
                                    template: module.app.getTemplate('notfound'),
                                    _isEnabled: true
                                }]);
                            });
    
                        } else {
                            console.info('%c Serverside component enabled : ', 'background: #428bca; color: #fff', module.moduleName);
    
                            self._renderStaticCompnent.apply(self, [module, $component, {}, viewOptions]);
                        }
    
                    }
                });
            });
        },
        /**
         * Description
         * @method _renderStaticCompnent
         * @param {} module
         * @param {} el
         * @param {} data
         * @param {} viewOptions
         * @return
         */
        _renderStaticCompnent: function(module, el, data, viewOptions) {
            // create new instance of the module view and add the data as model
            module[module.name] = new module.View(_.extend(viewOptions, {
                el: el,
                model: new IEA.Model(data)
            }));
    
            // in case of serverside component, no need the render the page
            // only fire enable to make sure the logic is applied.
            module[module.name].triggerMethod('before:show', module);
            module.app.trigger('component:loaded', module);
            module[module.name].enable();
            module[module.name].triggerMethod('show', module);
            module.app.trigger('image:lazyload', module[module.name]);
    
            // add instance object to DOM for future reference
            el.data('module', module);
        },
    
        /**
         * Description
         * @method _renderDynamicComponent
         * @param {} module
         * @param {} el
         * @param {} data
         * @param {} viewOptions
         * @return
         */
        _renderDynamicComponent: function(module, el, data, viewOptions) {
            // create new instance of the module view and add the data as model
            module[module.name] = new module.View(_.extend(viewOptions, {
                el: el,
                model: new IEA.Model(data)
            }));
    
            module[module.name].triggerMethod('before:show', module);
            module.app.trigger('component:loaded', module);
            module[module.name].render();
            module[module.name].triggerMethod('show', module);
    
            //setTimeout(function() {
            module.app.trigger('image:lazyload', module[module.name]);
            //}, 300);
    
            // add instance object to DOM for future reference
            el.data('module', module);
        },
    
        /**
         * Initialize enquire setup.
         * @return
         * @method _listenToViewportEvents
         * @return
         */
        _listenToViewportEvents: function() {
            var self = this;
    
            if (this.getValue('isIE8')) {
                this.setValue('isMobileBreakpoint', false);
                this.setValue('isTabletBreakpoint', false);
                this.setValue('isDesktopBreakpoint', true);
                self.trigger('matchDesktop');
            } else {
                enquire.register(this.getValue('breakpoints').mobile.media, {
                    /**
                     * Description
                     * @return
                     * @method setup
                     * @return
                     */
                    setup: function() {
                        // body...
                    },
                    /**
                     * Description
                     * @return
                     * @method match
                     * @return
                     */
                    match: function() {
                        self.setValue('isMobileBreakpoint', true);
                        self.setValue('isTabletBreakpoint', false);
                        self.setValue('isDesktopBreakpoint', false);
                        self.trigger('matchMobile');
                    },
                    /**
                     * Description
                     * @return
                     * @method unmatch
                     * @return
                     */
                    unmatch: function() {
                        self.setValue('isMobileBreakpoint', false);
                        self.trigger('unMatchMobile');
                    }
    
                }).register(this.getValue('breakpoints').tablet.media, {
                    /**
                     * Description
                     * @return
                     * @method setup
                     * @return
                     */
                    setup: function() {
                        // body...
                    },
                    /**
                     * Description
                     * @return
                     * @method match
                     * @return
                     */
                    match: function() {
                        self.setValue('isMobileBreakpoint', false);
                        self.setValue('isTabletBreakpoint', true);
                        self.setValue('isDesktopBreakpoint', false);
                        self.trigger('matchTablet');
                    },
                    /**
                     * Description
                     * @return
                     * @method unmatch
                     * @return
                     */
                    unmatch: function() {
                        self.setValue('isTabletBreakpoint', false);
                        self.trigger('unmatchTablet');
                    }
                }).register(this.getValue('breakpoints').desktop.media, {
                    /**
                     * Description
                     * @return
                     * @method setup
                     * @return
                     */
                    setup: function() {
                        // body...
                    },
                    /**
                     * Description
                     * @return
                     * @method match
                     * @return
                     */
                    match: function() {
                        self.setValue('isMobileBreakpoint', false);
                        self.setValue('isTabletBreakpoint', false);
                        self.setValue('isDesktopBreakpoint', true);
                        self.trigger('matchDesktop');
                    },
                    /**
                     * Description
                     * @return
                     * @method unmatch
                     * @return
                     */
                    unmatch: function() {
                        self.setValue('isDesktopBreakpoint', false);
                        self.trigger('unmatchDesktop');
                    }
                }, true);
            }
        },
    
    
        //_.debounce: http://rifatnabi.com/post/detect-end-of-jquery-resize-event-using-underscore-debounce
        //resize: http://stackoverflow.com/a/1921259
    
        /**
         * initialize applicatin level window event listeners and event emitters
         * @method _listenToWindowEvents
         * @return
         */
        _listenToWindowEvents: function() {
            var self = this,
                $window = $(window),
                width = $window.width(),
                height = $window.height(),
                newWidth = 0,
                newHeight = 0;
    
            $window.on('resize orientationchange', _.debounce(function(evt) {
                newWidth = $window.width();
                newHeight = $window.height();
    
                if (newWidth !== width || newHeight !== height) {
                    width = newWidth;
                    height = newHeight;
    
                    //TODO: this needs to be standardized
                    self._handleLazyLoad(self);
                    self.trigger('window:resized', evt);
                }
            }, 500));
    
            $window.on('scroll', _.debounce(function(evt) {
                self.trigger('window:scrolled', evt);
                self.trigger('image:lazyload', self);
            }, 100));
    
            self.trigger('window:resized');
        },
    
        /**
         * Description
         * @method _handleLazyLoad
         * @return
         */
        _handleLazyLoad: function(view) {
            Picturefill();
    
            if (view instanceof IEA.View) {
                view.loadedImageCount = 0;
    
                view.$el.imagesLoaded()
                    .progress(function(imgLoad, image) {
                        var $image = $(image.img),
                            $item = $image.parent();
    
                        $item.removeClass('is-loading').addClass('loaded');
    
                        IEA.triggerMethodOn($image, 'load');
    
                        if (!image.isLoaded) {
                            $item.addClass('is-broken');
                            IEA.triggerMethodOn($image, 'fail');
                        } else {
                            $item.removeClass('is-loading').addClass('loaded');
                        }
    
                        view.loadedImageCount++;
                    })
                    .always(function(instance) {
                        view.triggerMethod('image:loaded');
                        $('picture.loaded', view.$el).removeClass('is-broken');
                    });
    
            }
        },
    
        /**
         * application level UA sniffer
         * @method _setUserAgent
         * @return
         */
        _setUserAgent: function() {
            var ieInfo = IEA.checkNonConditionalIEVersion(),
                isiPad = navigator.userAgent.match(/iPad/i) !== null,
                $body = $('body');
    
            this.setValue('isIE', ieInfo.isIE);
            this.setValue('IEVersion', ieInfo.version);
    
            if (ieInfo.isIE && ieInfo.version >= 10) {
                $body.addClass('ie ie' + ieInfo.version);
            }
    
            if (isiPad) {
                $body.addClass('iPad');
            }
        },
    
        _registerModules: IEA.registerModules,
    });
    
    'use strict';
    
    //TODO : look for more options which was be part of IEA like
    // https://github.com/kendagriff/backbone.analytics/blob/master/backbone.analytics.js
    
    /**
     * IEA Analytics class
     * @method Analytics
     * @param {object} options
     * @return
     */
    IEA.Analytics = function (options) {
        this.options = options;
        this._initCallbacks = new IEA.Callbacks();
        _.extend(this, options);
        this.initialize.apply(this, arguments);
    };
    
    // Copy the `extend` function used by Backbone's classes
    IEA.Analytics.extend = IEA.extend;
    
    _.extend(IEA.Analytics.prototype, {
    
        /**
         * analytics intialize function
         * @method initialize
         * @return
         */
        initialize: function () {},
    
        /**
         * Add an initializer that is either run at when the `start`method is called, or run immediately if added after `start` has already been called.
         * @method addInitializer
         * @param {} initializer
         * @return
         */
        addInitializer: function(initializer) {
            this._initCallbacks.add(initializer);
        },
    
        /**
         * kick off all of the application's processes.initializes all of the initializer functions
         * @method start
         * @param {object} options
         * @return
         */
        start: function(options) {
            this._initCallbacks.run(options, this);
        },
    
        /**
         * Description
         * @method page
         * @return
         */
        page: function () {
            //page track;
        },
    
        /**
         * Description
         * @method component
         * @return
         */
        component: function () {
            //CTA Track;
        },
    
        /**
         * Description
         * @method link
         * @return
         */
        link: function () {
            // body...
        },
    
        /**
         * Description
         * @method video
         * @return
         */
        video: function () {
            // body...
        },
    
        /**
         * Description
         * @method custom
         * @return
         */
        custom: function () {
            // body...
        },
    
        /**
         * Description
         * @method _clearVariables
         * @return
         */
        _clearVariables: function () {
            // body...
        }
    
    
    });
    
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
    

    return IEA;
}));

/*!

 handlebars v3.0.0

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('handlebars',[], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Handlebars = factory();
  }
}(this, function () {
// handlebars/utils.js
var __module3__ = (function() {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  /* istanbul ignore next */
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  /* istanbul ignore next */
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;
  // Older IE versions do not directly support indexOf so we must implement our own, sadly.
  function indexOf(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  }

  __exports__.indexOf = indexOf;
  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return "";
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;function blockParams(params, ids) {
    params.path = ids;
    return params;
  }

  __exports__.blockParams = blockParams;function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }

  __exports__.appendContextPath = appendContextPath;
  return __exports__;
})();

// handlebars/exception.js
var __module4__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var loc = node && node.loc,
        line,
        column;
    if (loc) {
      line = loc.start.line;
      column = loc.start.column;

      message += ' - ' + line + ':' + column;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (loc) {
      this.lineNumber = line;
      this.column = column;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module2__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "3.0.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 6;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '== 1.x.x',
    5: '== 2.0.0-alpha.x',
    6: '>= 2.0.0-beta.1'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn) {
      if (toString.call(name) === objectType) {
        if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        this.helpers[name] = fn;
      }
    },
    unregisterHelper: function(name) {
      delete this.helpers[name];
    },

    registerPartial: function(name, partial) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        if (typeof partial === 'undefined') {
          throw new Exception('Attempting to register a partial as undefined');
        }
        this.partials[name] = partial;
      }
    },
    unregisterPartial: function(name) {
      delete this.partials[name];
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(/* [args, ]options */) {
      if(arguments.length === 1) {
        // A missing field in a {{foo}} constuct.
        return undefined;
      } else {
        // Someone is actually trying to call something, blow up.
        throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse,
          fn = options.fn;

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          if (options.ids) {
            options.ids = [options.name];
          }

          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
          options = {data: data};
        }

        return fn(context, options);
      }
    });

    instance.registerHelper('each', function(context, options) {
      if (!options) {
        throw new Exception('Must pass iterator to #each');
      }

      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      var contextPath;
      if (options.data && options.ids) {
        contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
      }

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      function execIteration(key, i, last) {
        if (data) {
          data.key = key;
          data.index = i;
          data.first = i === 0;
          data.last  = !!last;

          if (contextPath) {
            data.contextPath = contextPath + key;
          }
        }

        ret = ret + fn(context[key], {
          data: data,
          blockParams: Utils.blockParams([context[key], key], [contextPath + key, null])
        });
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            execIteration(i, i, i === context.length-1);
          }
        } else {
          var priorKey;

          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              // We're running the iterations one step out of sync so we can detect
              // the last iteration without have to scan the object twice and create
              // an itermediate keys array. 
              if (priorKey) {
                execIteration(priorKey, i-1);
              }
              priorKey = key;
              i++;
            }
          }
          if (priorKey) {
            execIteration(priorKey, i-1, true);
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      var fn = options.fn;

      if (!Utils.isEmpty(context)) {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
          options = {data:data};
        }

        return fn(context, options);
      } else {
        return options.inverse(this);
      }
    });

    instance.registerHelper('log', function(message, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, message);
    });

    instance.registerHelper('lookup', function(obj, field) {
      return obj && obj[field];
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 1,

    // Can be overridden in the host environment
    log: function(level, message) {
      if (typeof console !== 'undefined' && logger.level <= level) {
        var method = logger.methodMap[level];
        (console[method] || console.log).call(console, message);
      }
    }
  };
  __exports__.logger = logger;
  var log = logger.log;
  __exports__.log = log;
  var createFrame = function(object) {
    var frame = Utils.extend({}, object);
    frame._parent = object;
    return frame;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module3__, __module4__);

// handlebars/safe-string.js
var __module5__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/runtime.js
var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;
  var createFrame = __dependency3__.createFrame;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    /* istanbul ignore next */
    if (!env) {
      throw new Exception("No environment passed to template");
    }
    if (!templateSpec || !templateSpec.main) {
      throw new Exception('Unknown template object: ' + typeof templateSpec);
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    env.VM.checkRevision(templateSpec.compiler);

    var invokePartialWrapper = function(partial, context, options) {
      if (options.hash) {
        context = Utils.extend({}, context, options.hash);
      }

      partial = env.VM.resolvePartial.call(this, partial, context, options);
      var result = env.VM.invokePartial.call(this, partial, context, options);

      if (result == null && env.compile) {
        options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
        result = options.partials[options.name](context, options);
      }
      if (result != null) {
        if (options.indent) {
          var lines = result.split('\n');
          for (var i = 0, l = lines.length; i < l; i++) {
            if (!lines[i] && i + 1 === l) {
              break;
            }

            lines[i] = options.indent + lines[i];
          }
          result = lines.join('\n');
        }
        return result;
      } else {
        throw new Exception("The partial " + options.name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      strict: function(obj, name) {
        if (!(name in obj)) {
          throw new Exception('"' + name + '" not defined in ' + obj);
        }
        return obj[name];
      },
      lookup: function(depths, name) {
        var len = depths.length;
        for (var i = 0; i < len; i++) {
          if (depths[i] && depths[i][name] != null) {
            return depths[i][name];
          }
        }
      },
      lambda: function(current, context) {
        return typeof current === 'function' ? current.call(context) : current;
      },

      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,

      fn: function(i) {
        return templateSpec[i];
      },

      programs: [],
      program: function(i, data, declaredBlockParams, blockParams, depths) {
        var programWrapper = this.programs[i],
            fn = this.fn(i);
        if (data || depths || blockParams || declaredBlockParams) {
          programWrapper = program(this, i, fn, data, declaredBlockParams, blockParams, depths);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(this, i, fn);
        }
        return programWrapper;
      },

      data: function(data, depth) {
        while (data && depth--) {
          data = data._parent;
        }
        return data;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = Utils.extend({}, common, param);
        }

        return ret;
      },

      noop: env.VM.noop,
      compilerInfo: templateSpec.compiler
    };

    var ret = function(context, options) {
      options = options || {};
      var data = options.data;

      ret._setup(options);
      if (!options.partial && templateSpec.useData) {
        data = initData(context, data);
      }
      var depths,
          blockParams = templateSpec.useBlockParams ? [] : undefined;
      if (templateSpec.useDepths) {
        depths = options.depths ? [context].concat(options.depths) : [context];
      }

      return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
    };
    ret.isTop = true;

    ret._setup = function(options) {
      if (!options.partial) {
        container.helpers = container.merge(options.helpers, env.helpers);

        if (templateSpec.usePartial) {
          container.partials = container.merge(options.partials, env.partials);
        }
      } else {
        container.helpers = options.helpers;
        container.partials = options.partials;
      }
    };

    ret._child = function(i, data, blockParams, depths) {
      if (templateSpec.useBlockParams && !blockParams) {
        throw new Exception('must pass block params');
      }
      if (templateSpec.useDepths && !depths) {
        throw new Exception('must pass parent depths');
      }

      return program(container, i, templateSpec[i], data, 0, blockParams, depths);
    };
    return ret;
  }

  __exports__.template = template;function program(container, i, fn, data, declaredBlockParams, blockParams, depths) {
    var prog = function(context, options) {
      options = options || {};

      return fn.call(container,
          context,
          container.helpers, container.partials,
          options.data || data,
          blockParams && [options.blockParams].concat(blockParams),
          depths && [context].concat(depths));
    };
    prog.program = i;
    prog.depth = depths ? depths.length : 0;
    prog.blockParams = declaredBlockParams || 0;
    return prog;
  }

  __exports__.program = program;function resolvePartial(partial, context, options) {
    if (!partial) {
      partial = options.partials[options.name];
    } else if (!partial.call && !options.name) {
      // This is a dynamic partial that returned a string
      options.name = partial;
      partial = options.partials[partial];
    }
    return partial;
  }

  __exports__.resolvePartial = resolvePartial;function invokePartial(partial, context, options) {
    options.partial = true;

    if(partial === undefined) {
      throw new Exception("The partial " + options.name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;function initData(context, data) {
    if (!data || !('root' in data)) {
      data = data ? createFrame(data) : {};
      data.root = context;
    }
    return data;
  }
  return __exports__;
})(__module3__, __module4__, __module2__);

// handlebars.runtime.js
var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;
    hb.escapeExpression = Utils.escapeExpression;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  /*jshint -W040 */
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function() {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module2__, __module5__, __module4__, __module3__, __module6__);

// handlebars/compiler/ast.js
var __module7__ = (function() {
  "use strict";
  var __exports__;
  var AST = {
    Program: function(statements, blockParams, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'Program';
      this.body = statements;

      this.blockParams = blockParams;
      this.strip = strip;
    },

    MustacheStatement: function(path, params, hash, escaped, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'MustacheStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.escaped = escaped;

      this.strip = strip;
    },

    BlockStatement: function(path, params, hash, program, inverse, openStrip, inverseStrip, closeStrip, locInfo) {
      this.loc = locInfo;
      this.type = 'BlockStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.program  = program;
      this.inverse  = inverse;

      this.openStrip = openStrip;
      this.inverseStrip = inverseStrip;
      this.closeStrip = closeStrip;
    },

    PartialStatement: function(name, params, hash, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'PartialStatement';

      this.name = name;
      this.params = params || [];
      this.hash = hash;

      this.indent = '';
      this.strip = strip;
    },

    ContentStatement: function(string, locInfo) {
      this.loc = locInfo;
      this.type = 'ContentStatement';
      this.original = this.value = string;
    },

    CommentStatement: function(comment, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'CommentStatement';
      this.value = comment;

      this.strip = strip;
    },

    SubExpression: function(path, params, hash, locInfo) {
      this.loc = locInfo;

      this.type = 'SubExpression';
      this.path = path;
      this.params = params || [];
      this.hash = hash;
    },

    PathExpression: function(data, depth, parts, original, locInfo) {
      this.loc = locInfo;
      this.type = 'PathExpression';

      this.data = data;
      this.original = original;
      this.parts    = parts;
      this.depth    = depth;
    },

    StringLiteral: function(string, locInfo) {
      this.loc = locInfo;
      this.type = 'StringLiteral';
      this.original =
        this.value = string;
    },

    NumberLiteral: function(number, locInfo) {
      this.loc = locInfo;
      this.type = 'NumberLiteral';
      this.original =
        this.value = Number(number);
    },

    BooleanLiteral: function(bool, locInfo) {
      this.loc = locInfo;
      this.type = 'BooleanLiteral';
      this.original =
        this.value = bool === 'true';
    },

    Hash: function(pairs, locInfo) {
      this.loc = locInfo;
      this.type = 'Hash';
      this.pairs = pairs;
    },
    HashPair: function(key, value, locInfo) {
      this.loc = locInfo;
      this.type = 'HashPair';
      this.key = key;
      this.value = value;
    },

    // Public API used to evaluate derived attributes regarding AST nodes
    helpers: {
      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      // TODO: Make these public utility methods
      helperExpression: function(node) {
        return !!(node.type === 'SubExpression' || node.params.length || node.hash);
      },

      scopedId: function(path) {
        return (/^\.|this\b/).test(path.original);
      },

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      simpleId: function(path) {
        return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
      }
    }
  };


  // Must be exported as an object rather than the root of the module as the jison lexer
  // must modify the object to operate properly.
  __exports__ = AST;
  return __exports__;
})();

// handlebars/compiler/parser.js
var __module9__ = (function() {
  "use strict";
  var __exports__;
  /* jshint ignore:start */
  /* istanbul ignore next */
  /* Jison generated parser */
  var handlebars = (function(){
  var parser = {trace: function trace() { },
  yy: {},
  symbols_: {"error":2,"root":3,"program":4,"EOF":5,"program_repetition0":6,"statement":7,"mustache":8,"block":9,"rawBlock":10,"partial":11,"content":12,"COMMENT":13,"CONTENT":14,"openRawBlock":15,"END_RAW_BLOCK":16,"OPEN_RAW_BLOCK":17,"helperName":18,"openRawBlock_repetition0":19,"openRawBlock_option0":20,"CLOSE_RAW_BLOCK":21,"openBlock":22,"block_option0":23,"closeBlock":24,"openInverse":25,"block_option1":26,"OPEN_BLOCK":27,"openBlock_repetition0":28,"openBlock_option0":29,"openBlock_option1":30,"CLOSE":31,"OPEN_INVERSE":32,"openInverse_repetition0":33,"openInverse_option0":34,"openInverse_option1":35,"openInverseChain":36,"OPEN_INVERSE_CHAIN":37,"openInverseChain_repetition0":38,"openInverseChain_option0":39,"openInverseChain_option1":40,"inverseAndProgram":41,"INVERSE":42,"inverseChain":43,"inverseChain_option0":44,"OPEN_ENDBLOCK":45,"OPEN":46,"mustache_repetition0":47,"mustache_option0":48,"OPEN_UNESCAPED":49,"mustache_repetition1":50,"mustache_option1":51,"CLOSE_UNESCAPED":52,"OPEN_PARTIAL":53,"partialName":54,"partial_repetition0":55,"partial_option0":56,"param":57,"sexpr":58,"OPEN_SEXPR":59,"sexpr_repetition0":60,"sexpr_option0":61,"CLOSE_SEXPR":62,"hash":63,"hash_repetition_plus0":64,"hashSegment":65,"ID":66,"EQUALS":67,"blockParams":68,"OPEN_BLOCK_PARAMS":69,"blockParams_repetition_plus0":70,"CLOSE_BLOCK_PARAMS":71,"path":72,"dataName":73,"STRING":74,"NUMBER":75,"BOOLEAN":76,"DATA":77,"pathSegments":78,"SEP":79,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",13:"COMMENT",14:"CONTENT",16:"END_RAW_BLOCK",17:"OPEN_RAW_BLOCK",21:"CLOSE_RAW_BLOCK",27:"OPEN_BLOCK",31:"CLOSE",32:"OPEN_INVERSE",37:"OPEN_INVERSE_CHAIN",42:"INVERSE",45:"OPEN_ENDBLOCK",46:"OPEN",49:"OPEN_UNESCAPED",52:"CLOSE_UNESCAPED",53:"OPEN_PARTIAL",59:"OPEN_SEXPR",62:"CLOSE_SEXPR",66:"ID",67:"EQUALS",69:"OPEN_BLOCK_PARAMS",71:"CLOSE_BLOCK_PARAMS",74:"STRING",75:"NUMBER",76:"BOOLEAN",77:"DATA",79:"SEP"},
  productions_: [0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[12,1],[10,3],[15,5],[9,4],[9,4],[22,6],[25,6],[36,6],[41,2],[43,3],[43,1],[24,3],[8,5],[8,5],[11,5],[57,1],[57,1],[58,5],[63,1],[65,3],[68,3],[18,1],[18,1],[18,1],[18,1],[18,1],[54,1],[54,1],[73,2],[72,1],[78,3],[78,1],[6,0],[6,2],[19,0],[19,2],[20,0],[20,1],[23,0],[23,1],[26,0],[26,1],[28,0],[28,2],[29,0],[29,1],[30,0],[30,1],[33,0],[33,2],[34,0],[34,1],[35,0],[35,1],[38,0],[38,2],[39,0],[39,1],[40,0],[40,1],[44,0],[44,1],[47,0],[47,2],[48,0],[48,1],[50,0],[50,2],[51,0],[51,1],[55,0],[55,2],[56,0],[56,1],[60,0],[60,2],[61,0],[61,1],[64,1],[64,2],[70,1],[70,2]],
  performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: return $$[$0-1]; 
  break;
  case 2:this.$ = new yy.Program($$[$0], null, {}, yy.locInfo(this._$));
  break;
  case 3:this.$ = $$[$0];
  break;
  case 4:this.$ = $$[$0];
  break;
  case 5:this.$ = $$[$0];
  break;
  case 6:this.$ = $$[$0];
  break;
  case 7:this.$ = $$[$0];
  break;
  case 8:this.$ = new yy.CommentStatement(yy.stripComment($$[$0]), yy.stripFlags($$[$0], $$[$0]), yy.locInfo(this._$));
  break;
  case 9:this.$ = new yy.ContentStatement($$[$0], yy.locInfo(this._$));
  break;
  case 10:this.$ = yy.prepareRawBlock($$[$0-2], $$[$0-1], $$[$0], this._$);
  break;
  case 11:this.$ = { path: $$[$0-3], params: $$[$0-2], hash: $$[$0-1] };
  break;
  case 12:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], false, this._$);
  break;
  case 13:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], true, this._$);
  break;
  case 14:this.$ = { path: $$[$0-4], params: $$[$0-3], hash: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-5], $$[$0]) };
  break;
  case 15:this.$ = { path: $$[$0-4], params: $$[$0-3], hash: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-5], $$[$0]) };
  break;
  case 16:this.$ = { path: $$[$0-4], params: $$[$0-3], hash: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-5], $$[$0]) };
  break;
  case 17:this.$ = { strip: yy.stripFlags($$[$0-1], $$[$0-1]), program: $$[$0] };
  break;
  case 18:
      var inverse = yy.prepareBlock($$[$0-2], $$[$0-1], $$[$0], $$[$0], false, this._$),
          program = new yy.Program([inverse], null, {}, yy.locInfo(this._$));
      program.chained = true;

      this.$ = { strip: $$[$0-2].strip, program: program, chain: true };
    
  break;
  case 19:this.$ = $$[$0];
  break;
  case 20:this.$ = {path: $$[$0-1], strip: yy.stripFlags($$[$0-2], $$[$0])};
  break;
  case 21:this.$ = yy.prepareMustache($$[$0-3], $$[$0-2], $$[$0-1], $$[$0-4], yy.stripFlags($$[$0-4], $$[$0]), this._$);
  break;
  case 22:this.$ = yy.prepareMustache($$[$0-3], $$[$0-2], $$[$0-1], $$[$0-4], yy.stripFlags($$[$0-4], $$[$0]), this._$);
  break;
  case 23:this.$ = new yy.PartialStatement($$[$0-3], $$[$0-2], $$[$0-1], yy.stripFlags($$[$0-4], $$[$0]), yy.locInfo(this._$));
  break;
  case 24:this.$ = $$[$0];
  break;
  case 25:this.$ = $$[$0];
  break;
  case 26:this.$ = new yy.SubExpression($$[$0-3], $$[$0-2], $$[$0-1], yy.locInfo(this._$));
  break;
  case 27:this.$ = new yy.Hash($$[$0], yy.locInfo(this._$));
  break;
  case 28:this.$ = new yy.HashPair($$[$0-2], $$[$0], yy.locInfo(this._$));
  break;
  case 29:this.$ = $$[$0-1];
  break;
  case 30:this.$ = $$[$0];
  break;
  case 31:this.$ = $$[$0];
  break;
  case 32:this.$ = new yy.StringLiteral($$[$0], yy.locInfo(this._$));
  break;
  case 33:this.$ = new yy.NumberLiteral($$[$0], yy.locInfo(this._$));
  break;
  case 34:this.$ = new yy.BooleanLiteral($$[$0], yy.locInfo(this._$));
  break;
  case 35:this.$ = $$[$0];
  break;
  case 36:this.$ = $$[$0];
  break;
  case 37:this.$ = yy.preparePath(true, $$[$0], this._$);
  break;
  case 38:this.$ = yy.preparePath(false, $$[$0], this._$);
  break;
  case 39: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
  break;
  case 40:this.$ = [{part: $$[$0]}];
  break;
  case 41:this.$ = [];
  break;
  case 42:$$[$0-1].push($$[$0]);
  break;
  case 43:this.$ = [];
  break;
  case 44:$$[$0-1].push($$[$0]);
  break;
  case 51:this.$ = [];
  break;
  case 52:$$[$0-1].push($$[$0]);
  break;
  case 57:this.$ = [];
  break;
  case 58:$$[$0-1].push($$[$0]);
  break;
  case 63:this.$ = [];
  break;
  case 64:$$[$0-1].push($$[$0]);
  break;
  case 71:this.$ = [];
  break;
  case 72:$$[$0-1].push($$[$0]);
  break;
  case 75:this.$ = [];
  break;
  case 76:$$[$0-1].push($$[$0]);
  break;
  case 79:this.$ = [];
  break;
  case 80:$$[$0-1].push($$[$0]);
  break;
  case 83:this.$ = [];
  break;
  case 84:$$[$0-1].push($$[$0]);
  break;
  case 87:this.$ = [$$[$0]];
  break;
  case 88:$$[$0-1].push($$[$0]);
  break;
  case 89:this.$ = [$$[$0]];
  break;
  case 90:$$[$0-1].push($$[$0]);
  break;
  }
  },
  table: [{3:1,4:2,5:[2,41],6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],46:[2,41],49:[2,41],53:[2,41]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:[1,11],14:[1,18],15:16,17:[1,21],22:14,25:15,27:[1,19],32:[1,20],37:[2,2],42:[2,2],45:[2,2],46:[1,12],49:[1,13],53:[1,17]},{1:[2,1]},{5:[2,42],13:[2,42],14:[2,42],17:[2,42],27:[2,42],32:[2,42],37:[2,42],42:[2,42],45:[2,42],46:[2,42],49:[2,42],53:[2,42]},{5:[2,3],13:[2,3],14:[2,3],17:[2,3],27:[2,3],32:[2,3],37:[2,3],42:[2,3],45:[2,3],46:[2,3],49:[2,3],53:[2,3]},{5:[2,4],13:[2,4],14:[2,4],17:[2,4],27:[2,4],32:[2,4],37:[2,4],42:[2,4],45:[2,4],46:[2,4],49:[2,4],53:[2,4]},{5:[2,5],13:[2,5],14:[2,5],17:[2,5],27:[2,5],32:[2,5],37:[2,5],42:[2,5],45:[2,5],46:[2,5],49:[2,5],53:[2,5]},{5:[2,6],13:[2,6],14:[2,6],17:[2,6],27:[2,6],32:[2,6],37:[2,6],42:[2,6],45:[2,6],46:[2,6],49:[2,6],53:[2,6]},{5:[2,7],13:[2,7],14:[2,7],17:[2,7],27:[2,7],32:[2,7],37:[2,7],42:[2,7],45:[2,7],46:[2,7],49:[2,7],53:[2,7]},{5:[2,8],13:[2,8],14:[2,8],17:[2,8],27:[2,8],32:[2,8],37:[2,8],42:[2,8],45:[2,8],46:[2,8],49:[2,8],53:[2,8]},{18:22,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:31,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{4:32,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],37:[2,41],42:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{4:33,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],42:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{12:34,14:[1,18]},{18:36,54:35,58:37,59:[1,38],66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{5:[2,9],13:[2,9],14:[2,9],16:[2,9],17:[2,9],27:[2,9],32:[2,9],37:[2,9],42:[2,9],45:[2,9],46:[2,9],49:[2,9],53:[2,9]},{18:39,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:40,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:41,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{31:[2,71],47:42,59:[2,71],66:[2,71],74:[2,71],75:[2,71],76:[2,71],77:[2,71]},{21:[2,30],31:[2,30],52:[2,30],59:[2,30],62:[2,30],66:[2,30],69:[2,30],74:[2,30],75:[2,30],76:[2,30],77:[2,30]},{21:[2,31],31:[2,31],52:[2,31],59:[2,31],62:[2,31],66:[2,31],69:[2,31],74:[2,31],75:[2,31],76:[2,31],77:[2,31]},{21:[2,32],31:[2,32],52:[2,32],59:[2,32],62:[2,32],66:[2,32],69:[2,32],74:[2,32],75:[2,32],76:[2,32],77:[2,32]},{21:[2,33],31:[2,33],52:[2,33],59:[2,33],62:[2,33],66:[2,33],69:[2,33],74:[2,33],75:[2,33],76:[2,33],77:[2,33]},{21:[2,34],31:[2,34],52:[2,34],59:[2,34],62:[2,34],66:[2,34],69:[2,34],74:[2,34],75:[2,34],76:[2,34],77:[2,34]},{21:[2,38],31:[2,38],52:[2,38],59:[2,38],62:[2,38],66:[2,38],69:[2,38],74:[2,38],75:[2,38],76:[2,38],77:[2,38],79:[1,43]},{66:[1,30],78:44},{21:[2,40],31:[2,40],52:[2,40],59:[2,40],62:[2,40],66:[2,40],69:[2,40],74:[2,40],75:[2,40],76:[2,40],77:[2,40],79:[2,40]},{50:45,52:[2,75],59:[2,75],66:[2,75],74:[2,75],75:[2,75],76:[2,75],77:[2,75]},{23:46,36:48,37:[1,50],41:49,42:[1,51],43:47,45:[2,47]},{26:52,41:53,42:[1,51],45:[2,49]},{16:[1,54]},{31:[2,79],55:55,59:[2,79],66:[2,79],74:[2,79],75:[2,79],76:[2,79],77:[2,79]},{31:[2,35],59:[2,35],66:[2,35],74:[2,35],75:[2,35],76:[2,35],77:[2,35]},{31:[2,36],59:[2,36],66:[2,36],74:[2,36],75:[2,36],76:[2,36],77:[2,36]},{18:56,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{28:57,31:[2,51],59:[2,51],66:[2,51],69:[2,51],74:[2,51],75:[2,51],76:[2,51],77:[2,51]},{31:[2,57],33:58,59:[2,57],66:[2,57],69:[2,57],74:[2,57],75:[2,57],76:[2,57],77:[2,57]},{19:59,21:[2,43],59:[2,43],66:[2,43],74:[2,43],75:[2,43],76:[2,43],77:[2,43]},{18:63,31:[2,73],48:60,57:61,58:64,59:[1,38],63:62,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{66:[1,68]},{21:[2,37],31:[2,37],52:[2,37],59:[2,37],62:[2,37],66:[2,37],69:[2,37],74:[2,37],75:[2,37],76:[2,37],77:[2,37],79:[1,43]},{18:63,51:69,52:[2,77],57:70,58:64,59:[1,38],63:71,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{24:72,45:[1,73]},{45:[2,48]},{4:74,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],37:[2,41],42:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{45:[2,19]},{18:75,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{4:76,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{24:77,45:[1,73]},{45:[2,50]},{5:[2,10],13:[2,10],14:[2,10],17:[2,10],27:[2,10],32:[2,10],37:[2,10],42:[2,10],45:[2,10],46:[2,10],49:[2,10],53:[2,10]},{18:63,31:[2,81],56:78,57:79,58:64,59:[1,38],63:80,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{59:[2,83],60:81,62:[2,83],66:[2,83],74:[2,83],75:[2,83],76:[2,83],77:[2,83]},{18:63,29:82,31:[2,53],57:83,58:64,59:[1,38],63:84,64:65,65:66,66:[1,67],69:[2,53],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:63,31:[2,59],34:85,57:86,58:64,59:[1,38],63:87,64:65,65:66,66:[1,67],69:[2,59],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:63,20:88,21:[2,45],57:89,58:64,59:[1,38],63:90,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{31:[1,91]},{31:[2,72],59:[2,72],66:[2,72],74:[2,72],75:[2,72],76:[2,72],77:[2,72]},{31:[2,74]},{21:[2,24],31:[2,24],52:[2,24],59:[2,24],62:[2,24],66:[2,24],69:[2,24],74:[2,24],75:[2,24],76:[2,24],77:[2,24]},{21:[2,25],31:[2,25],52:[2,25],59:[2,25],62:[2,25],66:[2,25],69:[2,25],74:[2,25],75:[2,25],76:[2,25],77:[2,25]},{21:[2,27],31:[2,27],52:[2,27],62:[2,27],65:92,66:[1,93],69:[2,27]},{21:[2,87],31:[2,87],52:[2,87],62:[2,87],66:[2,87],69:[2,87]},{21:[2,40],31:[2,40],52:[2,40],59:[2,40],62:[2,40],66:[2,40],67:[1,94],69:[2,40],74:[2,40],75:[2,40],76:[2,40],77:[2,40],79:[2,40]},{21:[2,39],31:[2,39],52:[2,39],59:[2,39],62:[2,39],66:[2,39],69:[2,39],74:[2,39],75:[2,39],76:[2,39],77:[2,39],79:[2,39]},{52:[1,95]},{52:[2,76],59:[2,76],66:[2,76],74:[2,76],75:[2,76],76:[2,76],77:[2,76]},{52:[2,78]},{5:[2,12],13:[2,12],14:[2,12],17:[2,12],27:[2,12],32:[2,12],37:[2,12],42:[2,12],45:[2,12],46:[2,12],49:[2,12],53:[2,12]},{18:96,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{36:48,37:[1,50],41:49,42:[1,51],43:98,44:97,45:[2,69]},{31:[2,63],38:99,59:[2,63],66:[2,63],69:[2,63],74:[2,63],75:[2,63],76:[2,63],77:[2,63]},{45:[2,17]},{5:[2,13],13:[2,13],14:[2,13],17:[2,13],27:[2,13],32:[2,13],37:[2,13],42:[2,13],45:[2,13],46:[2,13],49:[2,13],53:[2,13]},{31:[1,100]},{31:[2,80],59:[2,80],66:[2,80],74:[2,80],75:[2,80],76:[2,80],77:[2,80]},{31:[2,82]},{18:63,57:102,58:64,59:[1,38],61:101,62:[2,85],63:103,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{30:104,31:[2,55],68:105,69:[1,106]},{31:[2,52],59:[2,52],66:[2,52],69:[2,52],74:[2,52],75:[2,52],76:[2,52],77:[2,52]},{31:[2,54],69:[2,54]},{31:[2,61],35:107,68:108,69:[1,106]},{31:[2,58],59:[2,58],66:[2,58],69:[2,58],74:[2,58],75:[2,58],76:[2,58],77:[2,58]},{31:[2,60],69:[2,60]},{21:[1,109]},{21:[2,44],59:[2,44],66:[2,44],74:[2,44],75:[2,44],76:[2,44],77:[2,44]},{21:[2,46]},{5:[2,21],13:[2,21],14:[2,21],17:[2,21],27:[2,21],32:[2,21],37:[2,21],42:[2,21],45:[2,21],46:[2,21],49:[2,21],53:[2,21]},{21:[2,88],31:[2,88],52:[2,88],62:[2,88],66:[2,88],69:[2,88]},{67:[1,94]},{18:63,57:110,58:64,59:[1,38],66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{5:[2,22],13:[2,22],14:[2,22],17:[2,22],27:[2,22],32:[2,22],37:[2,22],42:[2,22],45:[2,22],46:[2,22],49:[2,22],53:[2,22]},{31:[1,111]},{45:[2,18]},{45:[2,70]},{18:63,31:[2,65],39:112,57:113,58:64,59:[1,38],63:114,64:65,65:66,66:[1,67],69:[2,65],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{5:[2,23],13:[2,23],14:[2,23],17:[2,23],27:[2,23],32:[2,23],37:[2,23],42:[2,23],45:[2,23],46:[2,23],49:[2,23],53:[2,23]},{62:[1,115]},{59:[2,84],62:[2,84],66:[2,84],74:[2,84],75:[2,84],76:[2,84],77:[2,84]},{62:[2,86]},{31:[1,116]},{31:[2,56]},{66:[1,118],70:117},{31:[1,119]},{31:[2,62]},{14:[2,11]},{21:[2,28],31:[2,28],52:[2,28],62:[2,28],66:[2,28],69:[2,28]},{5:[2,20],13:[2,20],14:[2,20],17:[2,20],27:[2,20],32:[2,20],37:[2,20],42:[2,20],45:[2,20],46:[2,20],49:[2,20],53:[2,20]},{31:[2,67],40:120,68:121,69:[1,106]},{31:[2,64],59:[2,64],66:[2,64],69:[2,64],74:[2,64],75:[2,64],76:[2,64],77:[2,64]},{31:[2,66],69:[2,66]},{21:[2,26],31:[2,26],52:[2,26],59:[2,26],62:[2,26],66:[2,26],69:[2,26],74:[2,26],75:[2,26],76:[2,26],77:[2,26]},{13:[2,14],14:[2,14],17:[2,14],27:[2,14],32:[2,14],37:[2,14],42:[2,14],45:[2,14],46:[2,14],49:[2,14],53:[2,14]},{66:[1,123],71:[1,122]},{66:[2,89],71:[2,89]},{13:[2,15],14:[2,15],17:[2,15],27:[2,15],32:[2,15],42:[2,15],45:[2,15],46:[2,15],49:[2,15],53:[2,15]},{31:[1,124]},{31:[2,68]},{31:[2,29]},{66:[2,90],71:[2,90]},{13:[2,16],14:[2,16],17:[2,16],27:[2,16],32:[2,16],37:[2,16],42:[2,16],45:[2,16],46:[2,16],49:[2,16],53:[2,16]}],
  defaultActions: {4:[2,1],47:[2,48],49:[2,19],53:[2,50],62:[2,74],71:[2,78],76:[2,17],80:[2,82],90:[2,46],97:[2,18],98:[2,70],103:[2,86],105:[2,56],108:[2,62],109:[2,11],121:[2,68],122:[2,29]},
  parseError: function parseError(str, hash) {
      throw new Error(str);
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      this.lexer.setInput(input);
      this.lexer.yy = this.yy;
      this.yy.lexer = this.lexer;
      this.yy.parser = this;
      if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
      var yyloc = this.lexer.yylloc;
      lstack.push(yyloc);
      var ranges = this.lexer.options && this.lexer.options.ranges;
      if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
      function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
      }
      function lex() {
          var token;
          token = self.lexer.lex() || 1;
          if (typeof token !== "number") {
              token = self.symbols_[token] || token;
          }
          return token;
      }
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == "undefined") {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              if (!recovering) {
                  expected = [];
                  for (p in table[state])
                      if (this.terminals_[p] && p > 2) {
                          expected.push("'" + this.terminals_[p] + "'");
                      }
                  if (this.lexer.showPosition) {
                      errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                      errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }
          }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = this.lexer.yyleng;
                  yytext = this.lexer.yytext;
                  yylineno = this.lexer.yylineno;
                  yyloc = this.lexer.yylloc;
                  if (recovering > 0)
                      recovering--;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
              if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }
  };
  /* Jison generated lexer */
  var lexer = (function(){
  var lexer = ({EOF:1,
  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },
  setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          if (this.options.ranges) this.yylloc.range = [0,0];
          this.offset = 0;
          return this;
      },
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) this.yylloc.range[1]++;

          this._input = this._input.slice(1);
          return ch;
      },
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length-1);
          this.matched = this.matched.substr(0, this.matched.length-1);

          if (lines.length-1) this.yylineno -= lines.length-1;
          var r = this.yylloc.range;

          this.yylloc = {first_line: this.yylloc.first_line,
            last_line: this.yylineno+1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
                this.yylloc.first_column - len
            };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
      },
  more:function () {
          this._more = true;
          return this;
      },
  less:function (n) {
          this.unput(this.match.slice(n));
      },
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
      },
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
      },
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
              match,
              tempMatch,
              index,
              col,
              lines;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (!this.options.flex) break;
              }
          }
          if (match) {
              lines = match[0].match(/(?:\r\n?|\n).*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                             last_line: this.yylineno+1,
                             first_column: this.yylloc.last_column,
                             last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
              }
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
              if (this.done && this._input) this.done = false;
              if (token) return token;
              else return;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                      {text: "", token: null, line: this.yylineno});
          }
      },
  lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
              return r;
          } else {
              return this.lex();
          }
      },
  begin:function begin(condition) {
          this.conditionStack.push(condition);
      },
  popState:function popState() {
          return this.conditionStack.pop();
      },
  _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
      },
  topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
      },
  pushState:function begin(condition) {
          this.begin(condition);
      }});
  lexer.options = {};
  lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


  function strip(start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
  }


  var YYSTATE=YY_START
  switch($avoiding_name_collisions) {
  case 0:
                                     if(yy_.yytext.slice(-2) === "\\\\") {
                                       strip(0,1);
                                       this.begin("mu");
                                     } else if(yy_.yytext.slice(-1) === "\\") {
                                       strip(0,1);
                                       this.begin("emu");
                                     } else {
                                       this.begin("mu");
                                     }
                                     if(yy_.yytext) return 14;
                                   
  break;
  case 1:return 14;
  break;
  case 2:
                                     this.popState();
                                     return 14;
                                   
  break;
  case 3:
                                    yy_.yytext = yy_.yytext.substr(5, yy_.yyleng-9);
                                    this.popState();
                                    return 16;
                                   
  break;
  case 4: return 14; 
  break;
  case 5:
    this.popState();
    return 13;

  break;
  case 6:return 59;
  break;
  case 7:return 62;
  break;
  case 8: return 17; 
  break;
  case 9:
                                    this.popState();
                                    this.begin('raw');
                                    return 21;
                                   
  break;
  case 10:return 53;
  break;
  case 11:return 27;
  break;
  case 12:return 45;
  break;
  case 13:this.popState(); return 42;
  break;
  case 14:this.popState(); return 42;
  break;
  case 15:return 32;
  break;
  case 16:return 37;
  break;
  case 17:return 49;
  break;
  case 18:return 46;
  break;
  case 19:
    this.unput(yy_.yytext);
    this.popState();
    this.begin('com');

  break;
  case 20:
    this.popState();
    return 13;

  break;
  case 21:return 46;
  break;
  case 22:return 67;
  break;
  case 23:return 66;
  break;
  case 24:return 66;
  break;
  case 25:return 79;
  break;
  case 26:// ignore whitespace
  break;
  case 27:this.popState(); return 52;
  break;
  case 28:this.popState(); return 31;
  break;
  case 29:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 74;
  break;
  case 30:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 74;
  break;
  case 31:return 77;
  break;
  case 32:return 76;
  break;
  case 33:return 76;
  break;
  case 34:return 75;
  break;
  case 35:return 69;
  break;
  case 36:return 71;
  break;
  case 37:return 66;
  break;
  case 38:yy_.yytext = strip(1,2); return 66;
  break;
  case 39:return 'INVALID';
  break;
  case 40:return 5;
  break;
  }
  };
  lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{\/)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
  lexer.conditions = {"mu":{"rules":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[5],"inclusive":false},"raw":{"rules":[3,4],"inclusive":false},"INITIAL":{"rules":[0,1,40],"inclusive":true}};
  return lexer;})()
  parser.lexer = lexer;
  function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();__exports__ = handlebars;
  /* jshint ignore:end */
  return __exports__;
})();

// handlebars/compiler/visitor.js
var __module11__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__;
  var Exception = __dependency1__;
  var AST = __dependency2__;

  function Visitor() {
    this.parents = [];
  }

  Visitor.prototype = {
    constructor: Visitor,
    mutating: false,

    // Visits a given value. If mutating, will replace the value if necessary.
    acceptKey: function(node, name) {
      var value = this.accept(node[name]);
      if (this.mutating) {
        // Hacky sanity check:
        if (value && (!value.type || !AST[value.type])) {
          throw new Exception('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
        }
        node[name] = value;
      }
    },

    // Performs an accept operation with added sanity check to ensure
    // required keys are not removed.
    acceptRequired: function(node, name) {
      this.acceptKey(node, name);

      if (!node[name]) {
        throw new Exception(node.type + ' requires ' + name);
      }
    },

    // Traverses a given array. If mutating, empty respnses will be removed
    // for child elements.
    acceptArray: function(array) {
      for (var i = 0, l = array.length; i < l; i++) {
        this.acceptKey(array, i);

        if (!array[i]) {
          array.splice(i, 1);
          i--;
          l--;
        }
      }
    },

    accept: function(object) {
      if (!object) {
        return;
      }

      if (this.current) {
        this.parents.unshift(this.current);
      }
      this.current = object;

      var ret = this[object.type](object);

      this.current = this.parents.shift();

      if (!this.mutating || ret) {
        return ret;
      } else if (ret !== false) {
        return object;
      }
    },

    Program: function(program) {
      this.acceptArray(program.body);
    },

    MustacheStatement: function(mustache) {
      this.acceptRequired(mustache, 'path');
      this.acceptArray(mustache.params);
      this.acceptKey(mustache, 'hash');
    },

    BlockStatement: function(block) {
      this.acceptRequired(block, 'path');
      this.acceptArray(block.params);
      this.acceptKey(block, 'hash');

      this.acceptKey(block, 'program');
      this.acceptKey(block, 'inverse');
    },

    PartialStatement: function(partial) {
      this.acceptRequired(partial, 'name');
      this.acceptArray(partial.params);
      this.acceptKey(partial, 'hash');
    },

    ContentStatement: function(/* content */) {},
    CommentStatement: function(/* comment */) {},

    SubExpression: function(sexpr) {
      this.acceptRequired(sexpr, 'path');
      this.acceptArray(sexpr.params);
      this.acceptKey(sexpr, 'hash');
    },
    PartialExpression: function(partial) {
      this.acceptRequired(partial, 'name');
      this.acceptArray(partial.params);
      this.acceptKey(partial, 'hash');
    },

    PathExpression: function(/* path */) {},

    StringLiteral: function(/* string */) {},
    NumberLiteral: function(/* number */) {},
    BooleanLiteral: function(/* bool */) {},

    Hash: function(hash) {
      this.acceptArray(hash.pairs);
    },
    HashPair: function(pair) {
      this.acceptRequired(pair, 'value');
    }
  };

  __exports__ = Visitor;
  return __exports__;
})(__module4__, __module7__);

// handlebars/compiler/whitespace-control.js
var __module10__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var Visitor = __dependency1__;

  function WhitespaceControl() {
  }
  WhitespaceControl.prototype = new Visitor();

  WhitespaceControl.prototype.Program = function(program) {
    var isRoot = !this.isRootSeen;
    this.isRootSeen = true;

    var body = program.body;
    for (var i = 0, l = body.length; i < l; i++) {
      var current = body[i],
          strip = this.accept(current);

      if (!strip) {
        continue;
      }

      var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
          _isNextWhitespace = isNextWhitespace(body, i, isRoot),

          openStandalone = strip.openStandalone && _isPrevWhitespace,
          closeStandalone = strip.closeStandalone && _isNextWhitespace,
          inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

      if (strip.close) {
        omitRight(body, i, true);
      }
      if (strip.open) {
        omitLeft(body, i, true);
      }

      if (inlineStandalone) {
        omitRight(body, i);

        if (omitLeft(body, i)) {
          // If we are on a standalone node, save the indent info for partials
          if (current.type === 'PartialStatement') {
            // Pull out the whitespace from the final line
            current.indent = (/([ \t]+$)/).exec(body[i-1].original)[1];
          }
        }
      }
      if (openStandalone) {
        omitRight((current.program || current.inverse).body);

        // Strip out the previous content node if it's whitespace only
        omitLeft(body, i);
      }
      if (closeStandalone) {
        // Always strip the next node
        omitRight(body, i);

        omitLeft((current.inverse || current.program).body);
      }
    }

    return program;
  };
  WhitespaceControl.prototype.BlockStatement = function(block) {
    this.accept(block.program);
    this.accept(block.inverse);

    // Find the inverse program that is involed with whitespace stripping.
    var program = block.program || block.inverse,
        inverse = block.program && block.inverse,
        firstInverse = inverse,
        lastInverse = inverse;

    if (inverse && inverse.chained) {
      firstInverse = inverse.body[0].program;

      // Walk the inverse chain to find the last inverse that is actually in the chain.
      while (lastInverse.chained) {
        lastInverse = lastInverse.body[lastInverse.body.length-1].program;
      }
    }

    var strip = {
      open: block.openStrip.open,
      close: block.closeStrip.close,

      // Determine the standalone candiacy. Basically flag our content as being possibly standalone
      // so our parent can determine if we actually are standalone
      openStandalone: isNextWhitespace(program.body),
      closeStandalone: isPrevWhitespace((firstInverse || program).body)
    };

    if (block.openStrip.close) {
      omitRight(program.body, null, true);
    }

    if (inverse) {
      var inverseStrip = block.inverseStrip;

      if (inverseStrip.open) {
        omitLeft(program.body, null, true);
      }

      if (inverseStrip.close) {
        omitRight(firstInverse.body, null, true);
      }
      if (block.closeStrip.open) {
        omitLeft(lastInverse.body, null, true);
      }

      // Find standalone else statments
      if (isPrevWhitespace(program.body)
          && isNextWhitespace(firstInverse.body)) {

        omitLeft(program.body);
        omitRight(firstInverse.body);
      }
    } else {
      if (block.closeStrip.open) {
        omitLeft(program.body, null, true);
      }
    }

    return strip;
  };

  WhitespaceControl.prototype.MustacheStatement = function(mustache) {
    return mustache.strip;
  };

  WhitespaceControl.prototype.PartialStatement = 
      WhitespaceControl.prototype.CommentStatement = function(node) {
    /* istanbul ignore next */
    var strip = node.strip || {};
    return {
      inlineStandalone: true,
      open: strip.open,
      close: strip.close
    };
  };


  function isPrevWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = body.length;
    }

    // Nodes that end with newlines are considered whitespace (but are special
    // cased for strip operations)
    var prev = body[i-1],
        sibling = body[i-2];
    if (!prev) {
      return isRoot;
    }

    if (prev.type === 'ContentStatement') {
      return (sibling || !isRoot ? (/\r?\n\s*?$/) : (/(^|\r?\n)\s*?$/)).test(prev.original);
    }
  }
  function isNextWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = -1;
    }

    var next = body[i+1],
        sibling = body[i+2];
    if (!next) {
      return isRoot;
    }

    if (next.type === 'ContentStatement') {
      return (sibling || !isRoot ? (/^\s*?\r?\n/) : (/^\s*?(\r?\n|$)/)).test(next.original);
    }
  }

  // Marks the node to the right of the position as omitted.
  // I.e. {{foo}}' ' will mark the ' ' node as omitted.
  //
  // If i is undefined, then the first child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitRight(body, i, multiple) {
    var current = body[i == null ? 0 : i + 1];
    if (!current || current.type !== 'ContentStatement' || (!multiple && current.rightStripped)) {
      return;
    }

    var original = current.value;
    current.value = current.value.replace(multiple ? (/^\s+/) : (/^[ \t]*\r?\n?/), '');
    current.rightStripped = current.value !== original;
  }

  // Marks the node to the left of the position as omitted.
  // I.e. ' '{{foo}} will mark the ' ' node as omitted.
  //
  // If i is undefined then the last child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitLeft(body, i, multiple) {
    var current = body[i == null ? body.length - 1 : i - 1];
    if (!current || current.type !== 'ContentStatement' || (!multiple && current.leftStripped)) {
      return;
    }

    // We omit the last node if it's whitespace only and not preceeded by a non-content node.
    var original = current.value;
    current.value = current.value.replace(multiple ? (/\s+$/) : (/[ \t]+$/), '');
    current.leftStripped = current.value !== original;
    return current.leftStripped;
  }

  __exports__ = WhitespaceControl;
  return __exports__;
})(__module11__);

// handlebars/compiler/helpers.js
var __module12__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;

  function SourceLocation(source, locInfo) {
    this.source = source;
    this.start = {
      line: locInfo.first_line,
      column: locInfo.first_column
    };
    this.end = {
      line: locInfo.last_line,
      column: locInfo.last_column
    };
  }

  __exports__.SourceLocation = SourceLocation;function stripFlags(open, close) {
    return {
      open: open.charAt(2) === '~',
      close: close.charAt(close.length-3) === '~'
    };
  }

  __exports__.stripFlags = stripFlags;function stripComment(comment) {
    return comment.replace(/^\{\{~?\!-?-?/, '')
                  .replace(/-?-?~?\}\}$/, '');
  }

  __exports__.stripComment = stripComment;function preparePath(data, parts, locInfo) {
    /*jshint -W040 */
    locInfo = this.locInfo(locInfo);

    var original = data ? '@' : '',
        dig = [],
        depth = 0,
        depthString = '';

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i].part;
      original += (parts[i].separator || '') + part;

      if (part === '..' || part === '.' || part === 'this') {
        if (dig.length > 0) {
          throw new Exception('Invalid path: ' + original, {loc: locInfo});
        } else if (part === '..') {
          depth++;
          depthString += '../';
        }
      } else {
        dig.push(part);
      }
    }

    return new this.PathExpression(data, depth, dig, original, locInfo);
  }

  __exports__.preparePath = preparePath;function prepareMustache(path, params, hash, open, strip, locInfo) {
    /*jshint -W040 */
    // Must use charAt to support IE pre-10
    var escapeFlag = open.charAt(3) || open.charAt(2),
        escaped = escapeFlag !== '{' && escapeFlag !== '&';

    return new this.MustacheStatement(path, params, hash, escaped, strip, this.locInfo(locInfo));
  }

  __exports__.prepareMustache = prepareMustache;function prepareRawBlock(openRawBlock, content, close, locInfo) {
    /*jshint -W040 */
    if (openRawBlock.path.original !== close) {
      var errorNode = {loc: openRawBlock.path.loc};

      throw new Exception(openRawBlock.path.original + " doesn't match " + close, errorNode);
    }

    locInfo = this.locInfo(locInfo);
    var program = new this.Program([content], null, {}, locInfo);

    return new this.BlockStatement(
        openRawBlock.path, openRawBlock.params, openRawBlock.hash,
        program, undefined,
        {}, {}, {},
        locInfo);
  }

  __exports__.prepareRawBlock = prepareRawBlock;function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
    /*jshint -W040 */
    // When we are chaining inverse calls, we will not have a close path
    if (close && close.path && openBlock.path.original !== close.path.original) {
      var errorNode = {loc: openBlock.path.loc};

      throw new Exception(openBlock.path.original + ' doesn\'t match ' + close.path.original, errorNode);
    }

    program.blockParams = openBlock.blockParams;

    var inverse,
        inverseStrip;

    if (inverseAndProgram) {
      if (inverseAndProgram.chain) {
        inverseAndProgram.program.body[0].closeStrip = close.strip;
      }

      inverseStrip = inverseAndProgram.strip;
      inverse = inverseAndProgram.program;
    }

    if (inverted) {
      inverted = inverse;
      inverse = program;
      program = inverted;
    }

    return new this.BlockStatement(
        openBlock.path, openBlock.params, openBlock.hash,
        program, inverse,
        openBlock.strip, inverseStrip, close && close.strip,
        this.locInfo(locInfo));
  }

  __exports__.prepareBlock = prepareBlock;
  return __exports__;
})(__module4__);

// handlebars/compiler/base.js
var __module8__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__ = {};
  var parser = __dependency1__;
  var AST = __dependency2__;
  var WhitespaceControl = __dependency3__;
  var Helpers = __dependency4__;
  var extend = __dependency5__.extend;

  __exports__.parser = parser;

  var yy = {};
  extend(yy, Helpers, AST);

  function parse(input, options) {
    // Just return if an already-compiled AST was passed in.
    if (input.type === 'Program') { return input; }

    parser.yy = yy;

    // Altering the shared object here, but this is ok as parser is a sync operation
    yy.locInfo = function(locInfo) {
      return new yy.SourceLocation(options && options.srcName, locInfo);
    };

    var strip = new WhitespaceControl();
    return strip.accept(parser.parse(input));
  }

  __exports__.parse = parse;
  return __exports__;
})(__module9__, __module7__, __module10__, __module12__, __module3__);

// handlebars/compiler/compiler.js
var __module13__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;
  var isArray = __dependency2__.isArray;
  var indexOf = __dependency2__.indexOf;
  var AST = __dependency3__;

  var slice = [].slice;


  function Compiler() {}

  __exports__.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
          return false;
        }
      }

      // We know that length is the same between the two arrays because they are directly tied
      // to the opcode behavior above.
      len = this.children.length;
      for (i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.sourceNode = [];
      this.opcodes = [];
      this.children = [];
      this.options = options;
      this.stringParams = options.stringParams;
      this.trackIds = options.trackIds;

      options.blockParams = options.blockParams || [];

      // These changes will propagate to the other compiler components
      var knownHelpers = options.knownHelpers;
      options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true,
        'lookup': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.accept(program);
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;
      this.useDepths = this.useDepths || result.useDepths;

      return guid;
    },

    accept: function(node) {
      this.sourceNode.unshift(node);
      var ret = this[node.type](node);
      this.sourceNode.shift();
      return ret;
    },

    Program: function(program) {
      this.options.blockParams.unshift(program.blockParams);

      var body = program.body;
      for(var i=0, l=body.length; i<l; i++) {
        this.accept(body[i]);
      }

      this.options.blockParams.shift();

      this.isSimple = l === 1;
      this.blockParams = program.blockParams ? program.blockParams.length : 0;

      return this;
    },

    BlockStatement: function(block) {
      transformLiteralToPath(block);

      var program = block.program,
          inverse = block.inverse;

      program = program && this.compileProgram(program);
      inverse = inverse && this.compileProgram(inverse);

      var type = this.classifySexpr(block);

      if (type === 'helper') {
        this.helperSexpr(block, program, inverse);
      } else if (type === 'simple') {
        this.simpleSexpr(block);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue', block.path.original);
      } else {
        this.ambiguousSexpr(block, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    PartialStatement: function(partial) {
      this.usePartial = true;

      var params = partial.params;
      if (params.length > 1) {
        throw new Exception('Unsupported number of partial arguments: ' + params.length, partial);
      } else if (!params.length) {
        params.push({type: 'PathExpression', parts: [], depth: 0});
      }

      var partialName = partial.name.original,
          isDynamic = partial.name.type === 'SubExpression';
      if (isDynamic) {
        this.accept(partial.name);
      }

      this.setupFullMustacheParams(partial, undefined, undefined, true);

      var indent = partial.indent || '';
      if (this.options.preventIndent && indent) {
        this.opcode('appendContent', indent);
        indent = '';
      }

      this.opcode('invokePartial', isDynamic, partialName, indent);
      this.opcode('append');
    },

    MustacheStatement: function(mustache) {
      this.SubExpression(mustache);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ContentStatement: function(content) {
      if (content.value) {
        this.opcode('appendContent', content.value);
      }
    },

    CommentStatement: function() {},

    SubExpression: function(sexpr) {
      transformLiteralToPath(sexpr);
      var type = this.classifySexpr(sexpr);

      if (type === 'simple') {
        this.simpleSexpr(sexpr);
      } else if (type === 'helper') {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },
    ambiguousSexpr: function(sexpr, program, inverse) {
      var path = sexpr.path,
          name = path.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', path.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.accept(path);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function(sexpr) {
      this.accept(sexpr.path);
      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          path = sexpr.path,
          name = path.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        path.falsy = true;

        this.accept(path);
        this.opcode('invokeHelper', params.length, path.original, AST.helpers.simpleId(path));
      }
    },

    PathExpression: function(path) {
      this.addDepth(path.depth);
      this.opcode('getContext', path.depth);

      var name = path.parts[0],
          scoped = AST.helpers.scopedId(path),
          blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

      if (blockParamId) {
        this.opcode('lookupBlockParam', blockParamId, path.parts);
      } else  if (!name) {
        // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
        this.opcode('pushContext');
      } else if (path.data) {
        this.options.data = true;
        this.opcode('lookupData', path.depth, path.parts);
      } else {
        this.opcode('lookupOnContext', path.parts, path.falsy, scoped);
      }
    },

    StringLiteral: function(string) {
      this.opcode('pushString', string.value);
    },

    NumberLiteral: function(number) {
      this.opcode('pushLiteral', number.value);
    },

    BooleanLiteral: function(bool) {
      this.opcode('pushLiteral', bool.value);
    },

    Hash: function(hash) {
      var pairs = hash.pairs, i, l;

      this.opcode('pushHash');

      for (i=0, l=pairs.length; i<l; i++) {
        this.pushParam(pairs[i].value);
      }
      while (i--) {
        this.opcode('assignToHash', pairs[i].key);
      }
      this.opcode('popHash');
    },

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
    },

    addDepth: function(depth) {
      if (!depth) {
        return;
      }

      this.useDepths = true;
    },

    classifySexpr: function(sexpr) {
      var isSimple = AST.helpers.simpleId(sexpr.path);

      var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      var isHelper = !isBlockParam && AST.helpers.helperExpression(sexpr);

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
      var isEligible = !isBlockParam && (isHelper || isSimple);

      var options = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
      if (isEligible && !isHelper) {
        var name = sexpr.path.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return 'helper'; }
      else if (isEligible) { return 'ambiguous'; }
      else { return 'simple'; }
    },

    pushParams: function(params) {
      for(var i=0, l=params.length; i<l; i++) {
        this.pushParam(params[i]);
      }
    },

    pushParam: function(val) {
      var value = val.value != null ? val.value : val.original || '';

      if (this.stringParams) {
        if (value.replace) {
          value = value
              .replace(/^(\.?\.\/)*/g, '')
              .replace(/\//g, '.');
        }

        if(val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode('getContext', val.depth || 0);
        this.opcode('pushStringParam', value, val.type);

        if (val.type === 'SubExpression') {
          // SubExpressions get evaluated and passed in
          // in string params mode.
          this.accept(val);
        }
      } else {
        if (this.trackIds) {
          var blockParamIndex;
          if (val.parts && !AST.helpers.scopedId(val) && !val.depth) {
             blockParamIndex = this.blockParamIndex(val.parts[0]);
          }
          if (blockParamIndex) {
            var blockParamChild = val.parts.slice(1).join('.');
            this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
          } else {
            value = val.original || value;
            if (value.replace) {
              value = value
                  .replace(/^\.\//g, '')
                  .replace(/^\.$/g, '');
            }

            this.opcode('pushId', val.type, value);
          }
        }
        this.accept(val);
      }
    },

    setupFullMustacheParams: function(sexpr, program, inverse, omitEmpty) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.accept(sexpr.hash);
      } else {
        this.opcode('emptyHash', omitEmpty);
      }

      return params;
    },

    blockParamIndex: function(name) {
      for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
        var blockParams = this.options.blockParams[depth],
            param = blockParams && indexOf(blockParams, name);
        if (blockParams && param >= 0) {
          return [depth, param];
        }
      }
    }
  };

  function precompile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.type !== 'Program')) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var ast = env.parse(input, options);
    var environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  __exports__.precompile = precompile;function compile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.type !== 'Program')) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }

    options = options || {};

    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var compiled;

    function compileInput() {
      var ast = env.parse(input, options);
      var environment = new env.Compiler().compile(ast, options);
      var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    // Template is only compiled on first use and cached after that point.
    var ret = function(context, options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, options);
    };
    ret._setup = function(options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._setup(options);
    };
    ret._child = function(i, data, blockParams, depths) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._child(i, data, blockParams, depths);
    };
    return ret;
  }

  __exports__.compile = compile;function argEquals(a, b) {
    if (a === b) {
      return true;
    }

    if (isArray(a) && isArray(b) && a.length === b.length) {
      for (var i = 0; i < a.length; i++) {
        if (!argEquals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }

  function transformLiteralToPath(sexpr) {
    if (!sexpr.path.parts) {
      var literal = sexpr.path;
      // Casting to string here to make false and 0 literal values play nicely with the rest
      // of the system.
      sexpr.path = new AST.PathExpression(false, 0, [literal.original+''], literal.original+'', literal.log);
    }
  }
  return __exports__;
})(__module4__, __module3__, __module7__);

// handlebars/compiler/code-gen.js
var __module15__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var isArray = __dependency1__.isArray;

  try {
    var SourceMap = require('source-map'),
          SourceNode = SourceMap.SourceNode;
  } catch (err) {
    /* istanbul ignore next: tested but not covered in istanbul due to dist build  */
    SourceNode = function(line, column, srcFile, chunks) {
      this.src = '';
      if (chunks) {
        this.add(chunks);
      }
    };
    /* istanbul ignore next */
    SourceNode.prototype = {
      add: function(chunks) {
        if (isArray(chunks)) {
          chunks = chunks.join('');
        }
        this.src += chunks;
      },
      prepend: function(chunks) {
        if (isArray(chunks)) {
          chunks = chunks.join('');
        }
        this.src = chunks + this.src;
      },
      toStringWithSourceMap: function() {
        return {code: this.toString()};
      },
      toString: function() {
        return this.src;
      }
    };
  }


  function castChunk(chunk, codeGen, loc) {
    if (isArray(chunk)) {
      var ret = [];

      for (var i = 0, len = chunk.length; i < len; i++) {
        ret.push(codeGen.wrap(chunk[i], loc));
      }
      return ret;
    } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
      // Handle primitives that the SourceNode will throw up on
      return chunk+'';
    }
    return chunk;
  }


  function CodeGen(srcFile) {
    this.srcFile = srcFile;
    this.source = [];
  }

  CodeGen.prototype = {
    prepend: function(source, loc) {
      this.source.unshift(this.wrap(source, loc));
    },
    push: function(source, loc) {
      this.source.push(this.wrap(source, loc));
    },

    merge: function() {
      var source = this.empty();
      this.each(function(line) {
        source.add(['  ', line, '\n']);
      });
      return source;
    },

    each: function(iter) {
      for (var i = 0, len = this.source.length; i < len; i++) {
        iter(this.source[i]);
      }
    },

    empty: function(loc) {
      loc = loc || this.currentLocation || {start:{}};
      return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
    },
    wrap: function(chunk, loc) {
      if (chunk instanceof SourceNode) {
        return chunk;
      }

      loc = loc || this.currentLocation || {start:{}};
      chunk = castChunk(chunk, this, loc);

      return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
    },

    functionCall: function(fn, type, params) {
      params = this.generateList(params);
      return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
    },

    quotedString: function(str) {
      return '"' + (str + '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
        .replace(/\u2029/g, '\\u2029') + '"';
    },

    objectLiteral: function(obj) {
      var pairs = [];

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var value = castChunk(obj[key], this);
          if (value !== 'undefined') {
            pairs.push([this.quotedString(key), ':', value]);
          }
        }
      }

      var ret = this.generateList(pairs);
      ret.prepend('{');
      ret.add('}');
      return ret;
    },


    generateList: function(entries, loc) {
      var ret = this.empty(loc);

      for (var i = 0, len = entries.length; i < len; i++) {
        if (i) {
          ret.add(',');
        }

        ret.add(castChunk(entries[i], this, loc));
      }

      return ret;
    },

    generateArray: function(entries, loc) {
      var ret = this.generateList(entries, loc);
      ret.prepend('[');
      ret.add(']');

      return ret;
    }
  };

  __exports__ = CodeGen;
  return __exports__;
})(__module3__);

// handlebars/compiler/javascript-compiler.js
var __module14__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
  "use strict";
  var __exports__;
  var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;
  var Exception = __dependency2__;
  var isArray = __dependency3__.isArray;
  var CodeGen = __dependency4__;

  function Literal(value) {
    this.value = value;
  }

  function JavaScriptCompiler() {}

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name /* , type*/) {
      if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return [parent, ".", name];
      } else {
        return [parent, "['", name, "']"];
      }
    },
    depthedLookup: function(name) {
      return [this.aliasable('this.lookup'), '(depths, "', name, '")'];
    },

    compilerInfo: function() {
      var revision = COMPILER_REVISION,
          versions = REVISION_CHANGES[revision];
      return [revision, versions];
    },

    appendToBuffer: function(source, location, explicit) {
      // Force a source as this simplifies the merge logic.
      if (!isArray(source)) {
        source = [source];
      }
      source = this.source.wrap(source, location);

      if (this.environment.isSimple) {
        return ['return ', source, ';'];
      } else if (explicit) {
        // This is a case where the buffer operation occurs as a child of another
        // construct, generally braces. We have to explicitly output these buffer
        // operations to ensure that the emitted code goes in the correct location.
        return ['buffer += ', source, ';'];
      } else {
        source.appendToBuffer = true;
        return source;
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options;
      this.stringParams = this.options.stringParams;
      this.trackIds = this.options.trackIds;
      this.precompile = !asObject;

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: []
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.aliases = {};
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];
      this.blockParams = [];

      this.compileChildren(environment, options);

      this.useDepths = this.useDepths || environment.useDepths || this.options.compat;
      this.useBlockParams = this.useBlockParams || environment.useBlockParams;

      var opcodes = environment.opcodes,
          opcode,
          firstLoc,
          i,
          l;

      for (i = 0, l = opcodes.length; i < l; i++) {
        opcode = opcodes[i];

        this.source.currentLocation = opcode.loc;
        firstLoc = firstLoc || opcode.loc;
        this[opcode.opcode].apply(this, opcode.args);
      }

      // Flush any trailing content that might be pending.
      this.source.currentLocation = firstLoc;
      this.pushSource('');

      /* istanbul ignore next */
      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new Exception('Compile completed with content left on stack');
      }

      var fn = this.createFunctionContext(asObject);
      if (!this.isChild) {
        var ret = {
          compiler: this.compilerInfo(),
          main: fn
        };
        var programs = this.context.programs;
        for (i = 0, l = programs.length; i < l; i++) {
          if (programs[i]) {
            ret[i] = programs[i];
          }
        }

        if (this.environment.usePartial) {
          ret.usePartial = true;
        }
        if (this.options.data) {
          ret.useData = true;
        }
        if (this.useDepths) {
          ret.useDepths = true;
        }
        if (this.useBlockParams) {
          ret.useBlockParams = true;
        }
        if (this.options.compat) {
          ret.compat = true;
        }

        if (!asObject) {
          ret.compiler = JSON.stringify(ret.compiler);

          this.source.currentLocation = {start: {line: 1, column: 0}};
          ret = this.objectLiteral(ret);

          if (options.srcName) {
            ret = ret.toStringWithSourceMap({file: options.destName});
            ret.map = ret.map && ret.map.toString();
          } else {
            ret = ret.toString();
          }
        } else {
          ret.compilerOptions = this.options;
        }

        return ret;
      } else {
        return fn;
      }
    },

    preamble: function() {
      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = new CodeGen(this.options.srcName);
    },

    createFunctionContext: function(asObject) {
      var varDeclarations = '';

      var locals = this.stackVars.concat(this.registers.list);
      if(locals.length > 0) {
        varDeclarations += ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      //
      // When using true SourceNodes, this will update all references to the given alias
      // as the source nodes are reused in situ. For the non-source node compilation mode,
      // aliases will not be used, but this case is already being run on the client and
      // we aren't concern about minimizing the template size.
      var aliasCount = 0;
      for (var alias in this.aliases) {
        var node = this.aliases[alias];

        if (this.aliases.hasOwnProperty(alias) && node.children && node.referenceCount > 1) {
          varDeclarations += ', alias' + (++aliasCount) + '=' + alias;
          node.children[0] = 'alias' + aliasCount;
        }
      }

      var params = ["depth0", "helpers", "partials", "data"];

      if (this.useBlockParams || this.useDepths) {
        params.push('blockParams');
      }
      if (this.useDepths) {
        params.push('depths');
      }

      // Perform a second pass over the output to merge content when possible
      var source = this.mergeSource(varDeclarations);

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
      }
    },
    mergeSource: function(varDeclarations) {
      var isSimple = this.environment.isSimple,
          appendOnly = !this.forceBuffer,
          appendFirst,

          sourceSeen,
          bufferStart,
          bufferEnd;
      this.source.each(function(line) {
        if (line.appendToBuffer) {
          if (bufferStart) {
            line.prepend('  + ');
          } else {
            bufferStart = line;
          }
          bufferEnd = line;
        } else {
          if (bufferStart) {
            if (!sourceSeen) {
              appendFirst = true;
            } else {
              bufferStart.prepend('buffer += ');
            }
            bufferEnd.add(';');
            bufferStart = bufferEnd = undefined;
          }

          sourceSeen = true;
          if (!isSimple) {
            appendOnly = false;
          }
        }
      });


      if (appendOnly) {
        if (bufferStart) {
          bufferStart.prepend('return ');
          bufferEnd.add(';');
        } else if (!sourceSeen) {
          this.source.push('return "";');
        }
      } else {
        varDeclarations += ", buffer = " + (appendFirst ? '' : this.initializeBuffer());

        if (bufferStart) {
          bufferStart.prepend('return buffer + ');
          bufferEnd.add(';');
        } else {
          this.source.push('return buffer;');
        }
      }

      if (varDeclarations) {
        this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
      }

      return this.source.merge();
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function(name) {
      var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
          params = [this.contextName(0)];
      this.setupHelperArgs(name, 0, params);

      var blockName = this.popStack();
      params.splice(1, 0, blockName);

      this.push(this.source.functionCall(blockHelperMissing, 'call', params));
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      // We're being a bit cheeky and reusing the options value from the prior exec
      var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
          params = [this.contextName(0)];
      this.setupHelperArgs('', 0, params, true);

      this.flushInline();

      var current = this.topStack();
      params.splice(1, 0, current);

      this.pushSource([
          'if (!', this.lastHelper, ') { ',
            current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params),
          '}']);
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      } else {
        this.pendingLocation = this.source.currentLocation;
      }

      this.pendingContent = content;
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      if (this.isInline()) {
        this.replaceStack(function(current) {
          return [' != null ? ', current, ' : ""'];
        });

        this.pushSource(this.appendToBuffer(this.popStack()));
      } else {
        var local = this.popStack();
        this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
        if (this.environment.isSimple) {
          this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
        }
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      this.pushSource(this.appendToBuffer(
          [this.aliasable('this.escapeExpression'), '(', this.popStack(), ')']));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      this.lastContext = depth;
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral(this.contextName(this.lastContext));
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(parts, falsy, scoped) {
      var i = 0;

      if (!scoped && this.options.compat && !this.lastContext) {
        // The depthed query is expected to handle the undefined logic for the root level that
        // is implemented below, so we evaluate that directly in compat mode
        this.push(this.depthedLookup(parts[i++]));
      } else {
        this.pushContext();
      }

      this.resolvePath('context', parts, i, falsy);
    },

    // [lookupBlockParam]
    //
    // On stack, before: ...
    // On stack, after: blockParam[name], ...
    //
    // Looks up the value of `parts` on the given block param and pushes
    // it onto the stack.
    lookupBlockParam: function(blockParamId, parts) {
      this.useBlockParams = true;

      this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
      this.resolvePath('context', parts, 1);
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data, ...
    //
    // Push the data lookup operator
    lookupData: function(depth, parts) {
      /*jshint -W083 */
      if (!depth) {
        this.pushStackLiteral('data');
      } else {
        this.pushStackLiteral('this.data(data, ' + depth + ')');
      }

      this.resolvePath('data', parts, 0, true);
    },

    resolvePath: function(type, parts, i, falsy) {
      /*jshint -W083 */
      if (this.options.strict || this.options.assumeObjects) {
        this.push(strictLookup(this.options.strict, this, parts, type));
        return;
      }

      var len = parts.length;
      for (; i < len; i++) {
        this.replaceStack(function(current) {
          var lookup = this.nameLookup(current, parts[i], type);
          // We want to ensure that zero and false are handled properly if the context (falsy flag)
          // needs to have the special handling for these values.
          if (!falsy) {
            return [' != null ? ', lookup, ' : ', current];
          } else {
            // Otherwise we can use generic falsy handling
            return [' && ', lookup];
          }
        });
      }
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.push([this.aliasable('this.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushContext();
      this.pushString(type);

      // If it's a subexpression, the string result
      // will be pushed after this opcode.
      if (type !== 'SubExpression') {
        if (typeof string === 'string') {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },

    emptyHash: function(omitEmpty) {
      if (this.trackIds) {
        this.push('{}'); // hashIds
      }
      if (this.stringParams) {
        this.push('{}'); // hashContexts
        this.push('{}'); // hashTypes
      }
      this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
    },
    pushHash: function() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = {values: [], types: [], contexts: [], ids: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = this.hashes.pop();

      if (this.trackIds) {
        this.push(this.objectLiteral(hash.ids));
      }
      if (this.stringParams) {
        this.push(this.objectLiteral(hash.contexts));
        this.push(this.objectLiteral(hash.types));
      }

      this.push(this.objectLiteral(hash.values));
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name, isSimple) {
      var nonHelper = this.popStack();
      var helper = this.setupHelper(paramSize, name);
      var simple = isSimple ? [helper.name, ' || '] : '';

      var lookup = ['('].concat(simple, nonHelper);
      if (!this.options.strict) {
        lookup.push(' || ', this.aliasable('helpers.helperMissing'));
      }
      lookup.push(')');

      this.push(this.source.functionCall(lookup, 'call', helper.callParams));
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name, helperCall) {
      this.useRegister('helper');

      var nonHelper = this.popStack();

      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
      if (!this.options.strict) {
        lookup[0] = '(helper = ';
        lookup.push(
          ' != null ? helper : ',
          this.aliasable('helpers.helperMissing')
        );
      }

      this.push([
          '(', lookup,
          (helper.paramsInit ? ['),(', helper.paramsInit] : []), '),',
          '(typeof helper === ', this.aliasable('"function"'), ' ? ',
          this.source.functionCall('helper','call', helper.callParams), ' : helper))'
      ]);
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(isDynamic, name, indent) {
      var params = [],
          options = this.setupParams(name, 1, params, false);

      if (isDynamic) {
        name = this.popStack();
        delete options.name;
      }

      if (indent) {
        options.indent = JSON.stringify(indent);
      }
      options.helpers = 'helpers';
      options.partials = 'partials';

      if (!isDynamic) {
        params.unshift(this.nameLookup('partials', name, 'partial'));
      } else {
        params.unshift(name);
      }

      if (this.options.compat) {
        options.depths = 'depths';
      }
      options = this.objectLiteral(options);
      params.push(options);

      this.push(this.source.functionCall('this.invokePartial', '', params));
    },

    // [assignToHash]
    //
    // On stack, before: value, ..., hash, ...
    // On stack, after: ..., hash, ...
    //
    // Pops a value off the stack and assigns it to the current hash
    assignToHash: function(key) {
      var value = this.popStack(),
          context,
          type,
          id;

      if (this.trackIds) {
        id = this.popStack();
      }
      if (this.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }

      var hash = this.hash;
      if (context) {
        hash.contexts[key] = context;
      }
      if (type) {
        hash.types[key] = type;
      }
      if (id) {
        hash.ids[key] = id;
      }
      hash.values[key] = value;
    },

    pushId: function(type, name, child) {
      if (type === 'BlockParam') {
        this.pushStackLiteral(
            'blockParams[' + name[0] + '].path[' + name[1] + ']'
            + (child ? ' + ' + JSON.stringify('.' + child) : ''));
      } else if (type === 'PathExpression') {
        this.pushString(name);
      } else if (type === 'SubExpression') {
        this.pushStackLiteral('true');
      } else {
        this.pushStackLiteral('null');
      }
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
          this.context.environments[index] = child;

          this.useDepths = this.useDepths || compiler.useDepths;
          this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
        } else {
          child.index = index;
          child.name = 'program' + index;

          this.useDepths = this.useDepths || child.useDepths;
          this.useBlockParams = this.useBlockParams || child.useBlockParams;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      var child = this.environment.children[guid],
          programParams = [child.index, 'data', child.blockParams];

      if (this.useBlockParams || this.useDepths) {
        programParams.push('blockParams');
      }
      if (this.useDepths) {
        programParams.push('depths');
      }

      return 'this.program(' + programParams.join(', ') + ')';
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    push: function(expr) {
      if (!(expr instanceof Literal)) {
        expr = this.source.wrap(expr);
      }

      this.inlineStack.push(expr);
      return expr;
    },

    pushStackLiteral: function(item) {
      this.push(new Literal(item));
    },

    pushSource: function(source) {
      if (this.pendingContent) {
        this.source.push(
            this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
        this.pendingContent = undefined;
      }

      if (source) {
        this.source.push(source);
      }
    },

    replaceStack: function(callback) {
      var prefix = ['('],
          stack,
          createdStack,
          usedLiteral;

      /* istanbul ignore next */
      if (!this.isInline()) {
        throw new Exception('replaceStack on non-inline');
      }

      // We want to merge the inline statement into the replacement statement via ','
      var top = this.popStack(true);

      if (top instanceof Literal) {
        // Literals do not need to be inlined
        stack = [top.value];
        prefix = ['(', stack];
        usedLiteral = true;
      } else {
        // Get or create the current stack name for use by the inline
        createdStack = true;
        var name = this.incrStack();

        prefix = ['((', this.push(name), ' = ', top, ')'];
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (!usedLiteral) {
        this.popStack();
      }
      if (createdStack) {
        this.stackSlot--;
      }
      this.push(prefix.concat(item, ')'));
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      this.inlineStack = [];
      for (var i = 0, len = inlineStack.length; i < len; i++) {
        var entry = inlineStack[i];
        /* istanbul ignore if */
        if (entry instanceof Literal) {
          this.compileStack.push(entry);
        } else {
          var stack = this.incrStack();
          this.pushSource([stack, ' = ', entry, ';']);
          this.compileStack.push(stack);
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          /* istanbul ignore next */
          if (!this.stackSlot) {
            throw new Exception('Invalid stack pop');
          }
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function() {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      /* istanbul ignore if */
      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    contextName: function(context) {
      if (this.useDepths && context) {
        return 'depths[' + context + ']';
      } else {
        return 'depth' + context;
      }
    },

    quotedString: function(str) {
      return this.source.quotedString(str);
    },

    objectLiteral: function(obj) {
      return this.source.objectLiteral(obj);
    },

    aliasable: function(name) {
      var ret = this.aliases[name];
      if (ret) {
        ret.referenceCount++;
        return ret;
      }

      ret = this.aliases[name] = this.source.wrap(name);
      ret.aliasable = true;
      ret.referenceCount = 1;

      return ret;
    },

    setupHelper: function(paramSize, name, blockHelper) {
      var params = [],
          paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        paramsInit: paramsInit,
        name: foundHelper,
        callParams: [this.contextName(0)].concat(params)
      };
    },

    setupParams: function(helper, paramSize, params) {
      var options = {}, contexts = [], types = [], ids = [], param;

      options.name = this.quotedString(helper);
      options.hash = this.popStack();

      if (this.trackIds) {
        options.hashIds = this.popStack();
      }
      if (this.stringParams) {
        options.hashTypes = this.popStack();
        options.hashContexts = this.popStack();
      }

      var inverse = this.popStack(),
          program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        options.fn = program || 'this.noop';
        options.inverse = inverse || 'this.noop';
      }

      // The parameters go on to the stack in order (making sure that they are evaluated in order)
      // so we need to pop them off the stack in reverse order
      var i = paramSize;
      while (i--) {
        param = this.popStack();
        params[i] = param;

        if (this.trackIds) {
          ids[i] = this.popStack();
        }
        if (this.stringParams) {
          types[i] = this.popStack();
          contexts[i] = this.popStack();
        }
      }

      if (this.trackIds) {
        options.ids = this.source.generateArray(ids);
      }
      if (this.stringParams) {
        options.types = this.source.generateArray(types);
        options.contexts = this.source.generateArray(contexts);
      }

      if (this.options.data) {
        options.data = 'data';
      }
      if (this.useBlockParams) {
        options.blockParams = 'blockParams';
      }
      return options;
    },

    setupHelperArgs: function(helper, paramSize, params, useRegister) {
      var options = this.setupParams(helper, paramSize, params, true);
      options = this.objectLiteral(options);
      if (useRegister) {
        this.useRegister('options');
        params.push('options');
        return ['options=', options];
      } else {
        params.push(options);
        return '';
      }
    }
  };


  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield await" +
    " null true false"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  };

  function strictLookup(requireTerminal, compiler, parts, type) {
    var stack = compiler.popStack();

    var i = 0,
        len = parts.length;
    if (requireTerminal) {
      len--;
    }

    for (; i < len; i++) {
      stack = compiler.nameLookup(stack, parts[i], type);
    }

    if (requireTerminal) {
      return [compiler.aliasable('this.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ')'];
    } else {
      return stack;
    }
  }

  __exports__ = JavaScriptCompiler;
  return __exports__;
})(__module2__, __module4__, __module3__, __module15__);

// handlebars.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var Handlebars = __dependency1__;

  // Compiler imports
  var AST = __dependency2__;
  var Parser = __dependency3__.parser;
  var parse = __dependency3__.parse;
  var Compiler = __dependency4__.Compiler;
  var compile = __dependency4__.compile;
  var precompile = __dependency4__.precompile;
  var JavaScriptCompiler = __dependency5__;

  var _create = Handlebars.create;
  var create = function() {
    var hb = _create();

    hb.compile = function(input, options) {
      return compile(input, options, hb);
    };
    hb.precompile = function (input, options) {
      return precompile(input, options, hb);
    };

    hb.AST = AST;
    hb.Compiler = Compiler;
    hb.JavaScriptCompiler = JavaScriptCompiler;
    hb.Parser = Parser;
    hb.parse = parse;

    return hb;
  };

  Handlebars = create();
  Handlebars.create = create;

  /*jshint -W040 */
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function() {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module7__, __module8__, __module13__, __module14__);

  return __module0__;
}));

/* jshint quotmark:false */

define('helpers',[
    'handlebars'
], function(
    Handlebars
) {
    'use strict';

    var Helper = IEA.module('helpers', function(module, app, iea) {
        var helpers = {},
            self = this;

        this.stringify = function(obj) {
            if ("JSON" in window) {
                return JSON.stringify(obj);
            }

            var t = typeof(obj);
            if (t !== "object" || obj === null) {
                // simple data type
                if (t === "string") {
                    obj = '"' + obj + '"';
                }

                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [],
                    arr = (obj && obj.constructor === Array);

                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t === "string") {
                            v = '"' + v + '"';
                        } else if (t === "object" && v !== null) {
                            v = jQuery.stringify(v);
                        }

                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };

        // all the helpers for handlebar goes here.
        _.extend(helpers, {
            /**
             * Description
             * @method include
             * @param {} contextData
             * @param {} path
             * @param {} c
             * @return NewExpression
             */
            include: function(contextData, path, c) {
                var datas = app.getTemplate('include', path)(contextData);
                return new Handlebars.SafeString(datas);
            },

            /**
             * Description
             * @method ifCond
             * @param {} v1
             * @param {} v2
             * @param {} options
             * @return CallExpression
             */
            ifCond: function(v1, v2, options) {
                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * Checks if the val is present in set of multiVal
             * @method ifCond
             * @param {} multiVal
             * @param {} val
             * @param {} options
             * @return CallExpression
             */
            hasValue: function(multiVal, val, options) {
                var strArray = multiVal.split(',');

                if(strArray.indexOf($.trim(val)) !== -1) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            ifCondx: function(v1, operator, v2, options) {
                switch (operator) {
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },

            eachUpTo: function(ary, max, options) {
                if(!ary || ary.length === 0) {
                    return options.inverse(this);
                }

                var result = [ ];
                for(var i = 0; i < max && i < ary.length; ++i) {
                    result.push(options.fn(ary[i]));
                }
                return result.join('');
            },

            media: function(bp, options) {
                if (app.getCurrentBreakpoint() === bp) {
                    return options.fn(this);
                }
            },

            stringify: function(data, options) {
                return self.stringify(data);
            },

            /**
             * Description
             * @method adaptive
             * @param {} url
             * @param {} ext
             * @param {} alt
             * @param {} title
             * @param {} filename
             * @return NewExpression
             */
            adaptive: function(url, ext, alt, title, filename) {
                var parsedURL = [],
                    imageExtension = (typeof ext !== 'undefined' && ext !== '' && typeof ext !== 'object') ? ext : app.getValue('extension'),
                    imageMarkup = '';
                /*
                    url : http://www.engagednow.com/content/dam/engagednow/hero-idea.jpg
                    url" /content/engagewithadobe/en_us/events/jcr:content/flexi_hero_par/adaptiveimage

                    selector : enscale

                    filename: hero-idea
                    filename: ''

                    extension: .jpg

                    http://www.engagednow.com/content/dam/engagednow/hero-idea.jpg.enscale.hero-idea.full.high.jpg
                    /content/engagewithadobe/en_us/events/jcr:content/flexi_hero_par/adaptiveimage.enscale.full.high.jpg

                */

                parsedURL.push(url);

                if (app.getValue('selector')) {
                    parsedURL.push(app.getValue('selector'));
                }

                if (typeof filename !== 'undefined' && filename !== '' && typeof filename !== 'object') {
                    parsedURL.push(filename);
                }

                parsedURL = parsedURL.join('.');

                if (typeof title !== 'undefined' && title !== '' && typeof title !== 'object') {
                    imageMarkup = '<img class="' + title + '" src="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" title="' + title + '" alt="' + alt + '">';
                } else {
                    imageMarkup = '<img src="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" alt="' + alt + '">';
                }

                return new Handlebars.SafeString(
                    '<picture class="lazy-load is-loading">' +
                    '<!--[if IE 9]><video style="display: none;"><![endif]-->' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" media="' + app.getValue('breakpoints').desktop.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').tabletLandscape.prefix + imageExtension + '" media="' + app.getValue('breakpoints').tabletLandscape.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').tablet.prefix + imageExtension + '" media="' + app.getValue('breakpoints').tablet.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').mobileLandscape.prefix + imageExtension + '" media="' + app.getValue('breakpoints').mobileLandscape.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').mobile.prefix + imageExtension + '" media="' + app.getValue('breakpoints').mobile.media + '">' +
                    '<!--[if IE 9]></video><![endif]-->' +
                    imageMarkup +
                    '</picture>'
                );
            },

            /**
             * Description
             * @method debug
             * @param {} value
             * @return CallExpression
             */
            debug: function(value) {
                console.log('===============DEBUG START==================');
                console.log('Context: ', this);
                console.log('Value: ', value);
                return console.log('=============DEBUG END====================');
            }

        });

        // register all helpers from the helper object into handlebars
        /**
         * Description
         * @method registerHelpers
         * @param {} options
         * @return
         */
        this.registerHelpers = function(options) {
            options = options || {};
            for (var helper in helpers) {
                if (helpers.hasOwnProperty(helper)) {
                    Handlebars.registerHelper(helper, helpers[helper]);
                }
            }
            this.triggerMethod('helper:registered');
        };

        // add self init code to fire register helper when module loaded.
        this.addInitializer(this.registerHelpers);

    });

    return Helper;
});

/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
(function(e){var t={};var n={mode:"horizontal",slideSelector:"",infiniteLoop:true,hideControlOnEnd:false,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:false,captions:false,ticker:false,tickerHover:false,adaptiveHeight:false,adaptiveHeightSpeed:500,video:false,useCSS:true,preloadImages:"visible",responsive:true,touchEnabled:true,swipeThreshold:50,oneToOneTouch:true,preventDefaultSwipeX:true,preventDefaultSwipeY:false,pager:true,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:true,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:false,startText:"Start",stopText:"Stop",autoControlsCombine:false,autoControlsSelector:null,auto:false,pause:4e3,autoStart:true,autoDirection:"next",autoHover:false,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};e.fn.bxSlider=function(r){if(this.length==0)return this;if(this.length>1){this.each(function(){e(this).bxSlider(r)});return this}var s={};var o=this;t.el=this;var u=e(window).width();var a=e(window).height();var f=function(){s.settings=e.extend({},n,r);s.settings.slideWidth=parseInt(s.settings.slideWidth);s.children=o.children(s.settings.slideSelector);if(s.children.length<s.settings.minSlides)s.settings.minSlides=s.children.length;if(s.children.length<s.settings.maxSlides)s.settings.maxSlides=s.children.length;if(s.settings.randomStart)s.settings.startSlide=Math.floor(Math.random()*s.children.length);s.active={index:s.settings.startSlide};s.carousel=s.settings.minSlides>1||s.settings.maxSlides>1;if(s.carousel)s.settings.preloadImages="all";s.minThreshold=s.settings.minSlides*s.settings.slideWidth+(s.settings.minSlides-1)*s.settings.slideMargin;s.maxThreshold=s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin;s.working=false;s.controls={};s.interval=null;s.animProp=s.settings.mode=="vertical"?"top":"left";s.usingCSS=s.settings.useCSS&&s.settings.mode!="fade"&&function(){var e=document.createElement("div");var t=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in t){if(e.style[t[n]]!==undefined){s.cssPrefix=t[n].replace("Perspective","").toLowerCase();s.animProp="-"+s.cssPrefix+"-transform";return true}}return false}();if(s.settings.mode=="vertical")s.settings.maxSlides=s.settings.minSlides;o.data("origStyle",o.attr("style"));o.children(s.settings.slideSelector).each(function(){e(this).data("origStyle",e(this).attr("style"))});l()};var l=function(){o.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');s.viewport=o.parent();s.loader=e('<div class="bx-loading" />');s.viewport.prepend(s.loader);o.css({width:s.settings.mode=="horizontal"?s.children.length*100+215+"%":"auto",position:"relative"});if(s.usingCSS&&s.settings.easing){o.css("-"+s.cssPrefix+"-transition-timing-function",s.settings.easing)}else if(!s.settings.easing){s.settings.easing="swing"}var t=m();s.viewport.css({width:"100%",overflow:"hidden",position:"relative"});s.viewport.parent().css({maxWidth:d()});if(!s.settings.pager){s.viewport.parent().css({margin:"0 auto 0px"})}s.children.css({"float":s.settings.mode=="horizontal"?"left":"none",listStyle:"none",position:"relative"});s.children.css("width",v());if(s.settings.mode=="horizontal"&&s.settings.slideMargin>0)s.children.css("marginRight",s.settings.slideMargin);if(s.settings.mode=="vertical"&&s.settings.slideMargin>0)s.children.css("marginBottom",s.settings.slideMargin);if(s.settings.mode=="fade"){s.children.css({position:"absolute",zIndex:0,display:"none"});s.children.eq(s.settings.startSlide).css({zIndex:50,display:"block"})}s.controls.el=e('<div class="bx-controls" />');if(s.settings.captions)N();s.active.last=s.settings.startSlide==g()-1;if(s.settings.video)o.fitVids();var n=s.children.eq(s.settings.startSlide);if(s.settings.preloadImages=="all")n=s.children;if(!s.settings.ticker){if(s.settings.pager)S();if(s.settings.controls)x();if(s.settings.auto&&s.settings.autoControls)T();if(s.settings.controls||s.settings.autoControls||s.settings.pager)s.viewport.after(s.controls.el)}else{s.settings.pager=false}c(n,h)};var c=function(t,n){var r=t.find("img, iframe").length;if(r==0){n();return}var i=0;t.find("img, iframe").each(function(){e(this).one("load",function(){if(++i==r)n()}).each(function(){if(this.complete)e(this).load()})})};var h=function(){if(s.settings.infiniteLoop&&s.settings.mode!="fade"&&!s.settings.ticker){var t=s.settings.mode=="vertical"?s.settings.minSlides:s.settings.maxSlides;var n=s.children.slice(0,t).clone().addClass("bx-clone");var r=s.children.slice(-t).clone().addClass("bx-clone");o.append(n).prepend(r)}s.loader.remove();b();if(s.settings.mode=="vertical")s.settings.adaptiveHeight=true;s.viewport.height(p());o.redrawSlider();s.settings.onSliderLoad(s.active.index);s.initialized=true;if(s.settings.responsive)e(window).bind("resize",U);if(s.settings.auto&&s.settings.autoStart)H();if(s.settings.ticker)B();if(s.settings.pager)M(s.settings.startSlide);if(s.settings.controls)P();if(s.settings.touchEnabled&&!s.settings.ticker)F()};var p=function(){var t=0;var n=e();if(s.settings.mode!="vertical"&&!s.settings.adaptiveHeight){n=s.children}else{if(!s.carousel){n=s.children.eq(s.active.index)}else{var r=s.settings.moveSlides==1?s.active.index:s.active.index*y();n=s.children.eq(r);for(i=1;i<=s.settings.maxSlides-1;i++){if(r+i>=s.children.length){n=n.add(s.children.eq(i-1))}else{n=n.add(s.children.eq(r+i))}}}}if(s.settings.mode=="vertical"){n.each(function(n){t+=e(this).outerHeight()});if(s.settings.slideMargin>0){t+=s.settings.slideMargin*(s.settings.minSlides-1)}}else{t=Math.max.apply(Math,n.map(function(){return e(this).outerHeight(false)}).get())}return t};var d=function(){var e="100%";if(s.settings.slideWidth>0){if(s.settings.mode=="horizontal"){e=s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin}else{e=s.settings.slideWidth}}return e};var v=function(){var e=s.settings.slideWidth;var t=s.viewport.width();if(s.settings.slideWidth==0||s.settings.slideWidth>t&&!s.carousel||s.settings.mode=="vertical"){e=t}else if(s.settings.maxSlides>1&&s.settings.mode=="horizontal"){if(t>s.maxThreshold){}else if(t<s.minThreshold){e=(t-s.settings.slideMargin*(s.settings.minSlides-1))/s.settings.minSlides}}return e};var m=function(){var e=1;if(s.settings.mode=="horizontal"&&s.settings.slideWidth>0){if(s.viewport.width()<s.minThreshold){e=s.settings.minSlides}else if(s.viewport.width()>s.maxThreshold){e=s.settings.maxSlides}else{var t=s.children.first().width();e=Math.floor(s.viewport.width()/t)}}else if(s.settings.mode=="vertical"){e=s.settings.minSlides}return e};var g=function(){var e=0;if(s.settings.moveSlides>0){if(s.settings.infiniteLoop){e=s.children.length/y()}else{var t=0;var n=0;while(t<s.children.length){++e;t=n+m();n+=s.settings.moveSlides<=m()?s.settings.moveSlides:m()}}}else{e=Math.ceil(s.children.length/m())}return e};var y=function(){if(s.settings.moveSlides>0&&s.settings.moveSlides<=m()){return s.settings.moveSlides}return m()};var b=function(){if(s.children.length>s.settings.maxSlides&&s.active.last&&!s.settings.infiniteLoop){if(s.settings.mode=="horizontal"){var e=s.children.last();var t=e.position();w(-(t.left-(s.viewport.width()-e.width())),"reset",0)}else if(s.settings.mode=="vertical"){var n=s.children.length-s.settings.minSlides;var t=s.children.eq(n).position();w(-t.top,"reset",0)}}else{var t=s.children.eq(s.active.index*y()).position();if(s.active.index==g()-1)s.active.last=true;if(t!=undefined){if(s.settings.mode=="horizontal")w(-t.left,"reset",0);else if(s.settings.mode=="vertical")w(-t.top,"reset",0)}}};var w=function(e,t,n,r){if(s.usingCSS){var i=s.settings.mode=="vertical"?"translate3d(0, "+e+"px, 0)":"translate3d("+e+"px, 0, 0)";o.css("-"+s.cssPrefix+"-transition-duration",n/1e3+"s");if(t=="slide"){o.css(s.animProp,i);o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");_()})}else if(t=="reset"){o.css(s.animProp,i)}else if(t=="ticker"){o.css("-"+s.cssPrefix+"-transition-timing-function","linear");o.css(s.animProp,i);o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");w(r["resetValue"],"reset",0);j()})}}else{var u={};u[s.animProp]=e;if(t=="slide"){o.animate(u,n,s.settings.easing,function(){_()})}else if(t=="reset"){o.css(s.animProp,e)}else if(t=="ticker"){o.animate(u,speed,"linear",function(){w(r["resetValue"],"reset",0);j()})}}};var E=function(){var t="";var n=g();for(var r=0;r<n;r++){var i="";if(s.settings.buildPager&&e.isFunction(s.settings.buildPager)){i=s.settings.buildPager(r);s.pagerEl.addClass("bx-custom-pager")}else{i=r+1;s.pagerEl.addClass("bx-default-pager")}t+='<div class="bx-pager-item"><a href="" data-slide-index="'+r+'" class="bx-pager-link">'+i+"</a></div>"}s.pagerEl.html(t)};var S=function(){if(!s.settings.pagerCustom){s.pagerEl=e('<div class="bx-pager" />');if(s.settings.pagerSelector){e(s.settings.pagerSelector).html(s.pagerEl)}else{s.controls.el.addClass("bx-has-pager").append(s.pagerEl)}E()}else{s.pagerEl=e(s.settings.pagerCustom)}s.pagerEl.delegate("a","click",O)};var x=function(){s.controls.next=e('<a class="bx-next" href="">'+s.settings.nextText+"</a>");s.controls.prev=e('<a class="bx-prev" href="">'+s.settings.prevText+"</a>");s.controls.next.bind("click",C);s.controls.prev.bind("click",k);if(s.settings.nextSelector){e(s.settings.nextSelector).bind("click",C)}if(s.settings.prevSelector){e(s.settings.prevSelector).bind("click",k)}if(!s.settings.nextSelector&&!s.settings.prevSelector){s.controls.directionEl=e('<div class="bx-controls-direction" />');s.controls.directionEl.append(s.controls.prev).append(s.controls.next);s.controls.el.addClass("bx-has-controls-direction").append(s.controls.directionEl)}};var T=function(){s.controls.start=e('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+s.settings.startText+"</a></div>");s.controls.stop=e('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+s.settings.stopText+"</a></div>");s.controls.autoEl=e('<div class="bx-controls-auto" />');s.controls.autoEl.delegate(".bx-start","click",L);s.controls.autoEl.delegate(".bx-stop","click",A);if(s.settings.autoControlsCombine){s.controls.autoEl.append(s.controls.start)}else{s.controls.autoEl.append(s.controls.start).append(s.controls.stop)}if(s.settings.autoControlsSelector){e(s.settings.autoControlsSelector).html(s.controls.autoEl)}else{s.controls.el.addClass("bx-has-controls-auto").append(s.controls.autoEl)}D(s.settings.autoStart?"stop":"start")};var N=function(){s.children.each(function(t){var n=e(this).find("img:first").attr("title");if(n!=undefined&&(""+n).length){e(this).append('<div class="bx-caption"><span>'+n+"</span></div>")}})};var C=function(e){if(s.settings.auto)o.stopAuto();o.goToNextSlide();e.preventDefault()};var k=function(e){if(s.settings.auto)o.stopAuto();o.goToPrevSlide();e.preventDefault()};var L=function(e){o.startAuto();e.preventDefault()};var A=function(e){o.stopAuto();e.preventDefault()};var O=function(t){if(s.settings.auto)o.stopAuto();var n=e(t.currentTarget);var r=parseInt(n.attr("data-slide-index"));if(r!=s.active.index)o.goToSlide(r);t.preventDefault()};var M=function(t){var n=s.children.length;if(s.settings.pagerType=="short"){if(s.settings.maxSlides>1){n=Math.ceil(s.children.length/s.settings.maxSlides)}s.pagerEl.html(t+1+s.settings.pagerShortSeparator+n);return}s.pagerEl.find("a").removeClass("active");s.pagerEl.each(function(n,r){e(r).find("a").eq(t).addClass("active")})};var _=function(){if(s.settings.infiniteLoop){var e="";if(s.active.index==0){e=s.children.eq(0).position()}else if(s.active.index==g()-1&&s.carousel){e=s.children.eq((g()-1)*y()).position()}else if(s.active.index==s.children.length-1){e=s.children.eq(s.children.length-1).position()}if(s.settings.mode=="horizontal"){w(-e.left,"reset",0);}else if(s.settings.mode=="vertical"){w(-e.top,"reset",0);}}s.working=false;s.settings.onSlideAfter(s.children.eq(s.active.index),s.oldIndex,s.active.index)};var D=function(e){if(s.settings.autoControlsCombine){s.controls.autoEl.html(s.controls[e])}else{s.controls.autoEl.find("a").removeClass("active");s.controls.autoEl.find("a:not(.bx-"+e+")").addClass("active")}};var P=function(){if(g()==1){s.controls.prev.addClass("disabled");s.controls.next.addClass("disabled")}else if(!s.settings.infiniteLoop&&s.settings.hideControlOnEnd){if(s.active.index==0){s.controls.prev.addClass("disabled");s.controls.next.removeClass("disabled")}else if(s.active.index==g()-1){s.controls.next.addClass("disabled");s.controls.prev.removeClass("disabled")}else{s.controls.prev.removeClass("disabled");s.controls.next.removeClass("disabled")}}};var H=function(){if(s.settings.autoDelay>0){var e=setTimeout(o.startAuto,s.settings.autoDelay)}else{o.startAuto()}if(s.settings.autoHover){o.hover(function(){if(s.interval){o.stopAuto(true);s.autoPaused=true}},function(){if(s.autoPaused){o.startAuto(true);s.autoPaused=null}})}};var B=function(){var t=0;if(s.settings.autoDirection=="next"){o.append(s.children.clone().addClass("bx-clone"))}else{o.prepend(s.children.clone().addClass("bx-clone"));var n=s.children.first().position();t=s.settings.mode=="horizontal"?-n.left:-n.top}w(t,"reset",0);s.settings.pager=false;s.settings.controls=false;s.settings.autoControls=false;if(s.settings.tickerHover&&!s.usingCSS){s.viewport.hover(function(){o.stop()},function(){var t=0;s.children.each(function(n){t+=s.settings.mode=="horizontal"?e(this).outerWidth(true):e(this).outerHeight(true)});var n=s.settings.speed/t;var r=s.settings.mode=="horizontal"?"left":"top";var i=n*(t-Math.abs(parseInt(o.css(r))));j(i)})}j()};var j=function(e){speed=e?e:s.settings.speed;var t={left:0,top:0};var n={left:0,top:0};if(s.settings.autoDirection=="next"){t=o.find(".bx-clone").first().position()}else{n=s.children.first().position()}var r=s.settings.mode=="horizontal"?-t.left:-t.top;var i=s.settings.mode=="horizontal"?-n.left:-n.top;var u={resetValue:i};w(r,"ticker",speed,u)};var F=function(){s.touch={start:{x:0,y:0},end:{x:0,y:0}};s.viewport.bind("touchstart",I)};var I=function(e){if(s.working){e.preventDefault()}else{s.touch.originalPos=o.position();var t=e.originalEvent;s.touch.start.x=t.changedTouches[0].pageX;s.touch.start.y=t.changedTouches[0].pageY;s.viewport.bind("touchmove",q);s.viewport.bind("touchend",R)}};var q=function(e){var t=e.originalEvent;var n=Math.abs(t.changedTouches[0].pageX-s.touch.start.x);var r=Math.abs(t.changedTouches[0].pageY-s.touch.start.y);if(n*3>r&&s.settings.preventDefaultSwipeX){e.preventDefault()}else if(r*3>n&&s.settings.preventDefaultSwipeY){e.preventDefault()}if(s.settings.mode!="fade"&&s.settings.oneToOneTouch){var i=0;if(s.settings.mode=="horizontal"){var o=t.changedTouches[0].pageX-s.touch.start.x;i=s.touch.originalPos.left+o}else{var o=t.changedTouches[0].pageY-s.touch.start.y;i=s.touch.originalPos.top+o}w(i,"reset",0)}};var R=function(e){s.viewport.unbind("touchmove",q);var t=e.originalEvent;var n=0;s.touch.end.x=t.changedTouches[0].pageX;s.touch.end.y=t.changedTouches[0].pageY;if(s.settings.mode=="fade"){var r=Math.abs(s.touch.start.x-s.touch.end.x);if(r>=s.settings.swipeThreshold){s.touch.start.x>s.touch.end.x?o.goToNextSlide():o.goToPrevSlide();o.stopAuto()}}else{var r=0;if(s.settings.mode=="horizontal"){r=s.touch.end.x-s.touch.start.x;n=s.touch.originalPos.left}else{r=s.touch.end.y-s.touch.start.y;n=s.touch.originalPos.top}if(!s.settings.infiniteLoop&&(s.active.index==0&&r>0||s.active.last&&r<0)){w(n,"reset",200)}else{if(Math.abs(r)>=s.settings.swipeThreshold){r<0?o.goToNextSlide():o.goToPrevSlide();o.stopAuto()}else{w(n,"reset",200)}}}s.viewport.unbind("touchend",R)};var U=function(t){var n=e(window).width();var r=e(window).height();if(u!=n||a!=r){u=n;a=r;o.redrawSlider()}};o.goToSlide=function(t,n){if(s.working||s.active.index==t)return;s.working=true;s.oldIndex=s.active.index;if(t<0){s.active.index=g()-1}else if(t>=g()){s.active.index=0}else{s.active.index=t}s.settings.onSlideBefore(s.children.eq(s.active.index),s.oldIndex,s.active.index);if(n=="next"){s.settings.onSlideNext(s.children.eq(s.active.index),s.oldIndex,s.active.index)}else if(n=="prev"){s.settings.onSlidePrev(s.children.eq(s.active.index),s.oldIndex,s.active.index)}s.active.last=s.active.index>=g()-1;if(s.settings.pager)M(s.active.index);if(s.settings.controls)P();if(s.settings.mode=="fade"){if(s.settings.adaptiveHeight&&s.viewport.height()!=p()){s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed)}s.children.filter(":visible").fadeOut(s.settings.speed).css({zIndex:0});s.children.eq(s.active.index).css("zIndex",51).fadeIn(s.settings.speed,function(){e(this).css("zIndex",50);_()})}else{if(s.settings.adaptiveHeight&&s.viewport.height()!=p()){s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed)}var r=0;var i={left:0,top:0};if(!s.settings.infiniteLoop&&s.carousel&&s.active.last){if(s.settings.mode=="horizontal"){var u=s.children.eq(s.children.length-1);i=u.position();r=s.viewport.width()-u.outerWidth()}else{var a=s.children.length-s.settings.minSlides;i=s.children.eq(a).position()}}else if(s.carousel&&s.active.last&&n=="prev"){var f=s.settings.moveSlides==1?s.settings.maxSlides-y():(g()-1)*y()-(s.children.length-s.settings.maxSlides);var u=o.children(".bx-clone").eq(f);i=u.position()}else if(n=="next"&&s.active.index==0){i=o.find("> .bx-clone").eq(s.settings.maxSlides).position();s.active.last=false}else if(t>=0){var l=t*y();i=s.children.eq(l).position()}if("undefined"!==typeof i){var c=s.settings.mode=="horizontal"?-(i.left-r):-i.top;w(c,"slide",s.settings.speed)}}};o.goToNextSlide=function(){if(!s.settings.infiniteLoop&&s.active.last)return;var e=parseInt(s.active.index)+1;o.goToSlide(e,"next")};o.goToPrevSlide=function(){if(!s.settings.infiniteLoop&&s.active.index==0)return;var e=parseInt(s.active.index)-1;o.goToSlide(e,"prev")};o.startAuto=function(e){if(s.interval)return;s.interval=setInterval(function(){s.settings.autoDirection=="next"?o.goToNextSlide():o.goToPrevSlide()},s.settings.pause);if(s.settings.autoControls&&e!=true)D("stop")};o.stopAuto=function(e){if(!s.interval)return;clearInterval(s.interval);s.interval=null;if(s.settings.autoControls&&e!=true)D("start")};o.getCurrentSlide=function(){return s.active.index};o.getSlideCount=function(){return s.children.length};o.redrawSlider=function(){s.children.add(o.find(".bx-clone")).outerWidth(v());s.viewport.css("height",p());if(!s.settings.ticker)b();if(s.active.last)s.active.index=g()-1;if(s.active.index>=g())s.active.last=true;if(s.settings.pager&&!s.settings.pagerCustom){E();M(s.active.index)}};o.destroySlider=function(){if(!s.initialized)return;s.initialized=false;e(".bx-clone",this).remove();s.children.each(function(){e(this).data("origStyle")!=undefined?e(this).attr("style",e(this).data("origStyle")):e(this).removeAttr("style")});e(this).data("origStyle")!=undefined?this.attr("style",e(this).data("origStyle")):e(this).removeAttr("style");e(this).unwrap().unwrap();if(s.controls.el)s.controls.el.remove();if(s.controls.next)s.controls.next.remove();if(s.controls.prev)s.controls.prev.remove();if(s.pagerEl)s.pagerEl.remove();e(".bx-caption",this).remove();if(s.controls.autoEl)s.controls.autoEl.remove();clearInterval(s.interval);if(s.settings.responsive)e(window).unbind("resize",U)};o.reloadSlider=function(e){if(e!=undefined)r=e;o.destroySlider();f()};f();return this}})(jQuery);
define("bxSlider", function(){});

/*
Usage Example

//creating new instance of slider
var  slider = IEA.slider(element, config) // default configuration
or
var  slider = IEA.slider(elemnt, {auto: true}) // initialization with congiruation

// start the carousel
slider.enable();

//public methods
slider.disable();
slider.distroy();
slider.reload(); // just reload with set config
slider.reload({auto: false}); // reload the carousel with new configuration
slider.getCurrentSlide();
slider.getSlideCount();
slider.play();
slider.pause()

//Events
slider:load
slide:before
slide:after
slide:next
slide:prev
*/


define('slider',['underscore',
    'iea',
    'bxSlider'
], function(_,
    iea,
    BXSlider) {
    'use strict';

    IEA.service('slider', function(service, app, iea) {

        /**
         * Slider class
         * @method Slider
         * @param {} options
         * @return ThisExpression
         */
        var Slider = function(options) {
            this.pluginName = 'bxSlider';
            this.isLoaded = false;
            return this;
        };

        // extend abstract Slider into iea Slider to give it more power.
        _.extend(Slider.prototype, {

            /**
             * slider intialize function
             * @method initialize
             * @param {jquery|string} el
             * @param {object} options
             * @return ThisExpression
             */
            initialize: function(el, options) {
                var self = this,
                    defaultSetting = {
                        // carousel settings
                        mode: 'horizontal',
                        speed: 500,
                        slideMargin: 0,
                        startSlide: 0,
                        randomStart: false,
                        slideSelector: '',
                        infiniteLoop: true,
                        hideControlOnEnd: false,
                        easing: 'easeInOutQuint',
                        captions: false,
                        ticker: false,
                        tickerHover: false,
                        adaptiveHeight: false,
                        adaptiveHeightSpeed: 500,
                        video: false,
                        responsive: true,
                        useCSS: true,
                        preloadImages: 'visible',
                        touchEnabled: true,
                        swipeThreshold: 50,
                        oneToOneTouch: true,
                        preventDefaultSwipeX: true,
                        preventDefaultSwipeY: false,

                        // pager settings
                        pager: true,
                        pagerType: 'full',
                        pagerShortSeparator: '/',
                        pagerSelector: '',
                        pagerCustom: null,
                        buildPager: null,

                        // control settings
                        controls: true,
                        nextText: '<i class="icon-arrow-right"></i>',
                        prevText: '<i class="icon-arrow-left"></i>',
                        /*nextSelector: null,
                        prevSelector: null,*/
                        autoControls: false,
                        startText: 'Start',
                        stopText: 'Stop',
                        autoControlsCombine: false,
                        autoControlsSelector: null,

                        auto: true,
                        pause: 4000,
                        autoStart: true,
                        autoDirection: 'next',
                        autoHover: false,
                        autoDelay: 0,
                        minSlides: 1,
                        maxSlides: 1,
                        moveSlides: 0,
                        slideWidth: 0,

                        //Callbacks

                        onSliderLoad: function(currentIndex) {
                            if(!self.isLoaded) {
                                self.triggerMethod('slider:load', currentIndex);
                                self.isLoaded = true;
                            }
                        },
                        onSlideBefore: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:before', $slideElement, oldIndex, newIndex);
                        },
                        onSlideAfter: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:after', $slideElement, oldIndex, newIndex);
                        },
                        onSlideNext: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:next', $slideElement, oldIndex, newIndex);
                        },
                        onSlidePrev: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:prev', $slideElement, oldIndex, newIndex);
                        },

                        // custom options
                        thumbnails: true

                    };

                this.options = _.extend(defaultSetting, options);
                this.$el = (el.jquery) ? el : $(el);

                this.pluginMethods = {
                    destroy: 'destroySlider',
                    reload: 'reloadSlider',
                    slideCount: 'getSlideCount',
                    currentSlide: 'getCurrentSlide',
                    goToSlide: 'goToSlide',
                    goToNextSlide: 'goToNextSlide',
                    goToPrevSlide: 'goToPrevSlide',
                    startAuto: 'startAuto',
                    stopAuto: 'stopAuto',
                    redraw: 'redrawSlider'
                };

                return this;
            },

            /**
             * Slider enable
             * @method enable
             * @param {object} options
             * @return ThisExpression
             */
            enable: function(options) {
                if (typeof options === 'object') {
                    this.options = _.extend(this.options, options);
                }

                /*if(this.options.thumbnails) {
                    this.options.pagerCustom = this._createImagePager();
                }*/

                this.instance = this.$el[this.pluginName](this.options);
                this.isSliderEnabled = true;

                //this._registerpluginMethods();
                // /_.extend(this, this.instance);

                return this;
            },

            /**
             * disable slider
             * @method disable
             * @return
             */
            disable: function() {
                this.pause();
            },

            /**
             * destroy slider
             * @method destroy
             * @return
             */
            destroy: function() {
                var self = this;
                if (_.isFunction(this.instance[this.pluginMethods.destroy])) {
                    setTimeout(function() {
                        self.instance[self.pluginMethods.destroy]();
                    }, 100);

                    return true;
                }
            },

            /**
             * reload slider
             * @method reload
             * @return
             */
            reload: function(options) {
                if (typeof options === 'object') {
                    this.options = _.extend(this.options, options);
                }

                if (_.isFunction(this.instance[this.pluginMethods.reload])) {
                    return this.instance[this.pluginMethods.reload](this.options);
                }
            },

            /**
             * get the current slider slide
             * @method getCurrentSlide
             * @return
             */
            getCurrentSlide: function() {
                if (_.isFunction(this.instance[this.pluginMethods.currentSlide])) {
                    return this.instance[this.pluginMethods.currentSlide]();
                }
            },

            /**
             * get slider slide count
             * @method getSlideCount
             * @return
             */
            getSlideCount: function() {
                if (_.isFunction(this.instance[this.pluginMethods.slideCount])) {
                    return this.instance[this.pluginMethods.slideCount]();
                }
            },

            /**
             * go to slide based on index
             * @method goToSlide
             * @return
             */
            goToSlide: function(index) {
                if (_.isFunction(this.instance[this.pluginMethods.goToSlide])) {
                    return this.instance[this.pluginMethods.goToSlide](index);
                }
            },

            /**
             * get correct slide index
             * @method currentSlide
             * @return
             */
            currentSlide: function() {
                if (_.isFunction(this.instance[this.pluginMethods.currentSlide])) {
                    return this.instance[this.pluginMethods.currentSlide]();
                }
            },

            /**
             * play slider
             * @method play
             * @return
             */
            play: function() {
                if (_.isFunction(this.instance[this.pluginMethods.startAuto])) {
                    return this.instance[this.pluginMethods.startAuto]();
                }
            },

            /**
             * pause slider
             * @method pause
             * @return
             */
            pause: function() {
                if (_.isFunction(this.instance[this.pluginMethods.stopAuto])) {
                    return this.instance[this.pluginMethods.stopAuto]();
                }
            },

            /**
             * create pager for slider
             * @method _createImagePager
             * @return
             */
            _createImagePager: function() {

            },

            /**
             * register all the plugin methods into the IEA.slider service
             * @method _registerpluginMethods
             * @return
             */
            _registerpluginMethods: function() {

                for (var method in this.pluginMethods) {
                    _.extend(this, this.instance[method]);
                }
            },

            /**
             * redraw slider
             * @method _redraw
             * @return
             */
            redraw: function() {
                if (_.isFunction(this.instance[this.pluginMethods.redraw])) {
                    return this.instance[this.pluginMethods.redraw]();
                }
            }

        });

        return Slider;
    });
});

(function(c,a){var b={catchMethods:{methodreturn:[],count:0},init:function(g){var f,h,e;if(!g.originalEvent.origin.match(/vimeo/g)){return}if(!g.originalEvent.hasOwnProperty("data")){return}e=c.type(g.originalEvent.data)==="string"?c.parseJSON(g.originalEvent.data):g.originalEvent.data;if(!e){return}f=this.setPlayerID(e);h=this.setVimeoAPIurl(f);if(e.hasOwnProperty("event")){this.handleEvent(e,f,h)}if(e.hasOwnProperty("method")){this.handleMethod(e,f,h)}},setPlayerID:function(e){if(e.hasOwnProperty("player_id")){if(c("#"+e.player_id).length){return c("#"+e.player_id)}else{return c("iframe[src*="+e.player_id+"]")}}else{return c("iframe[src*='vimeo']").eq(0)}},setVimeoAPIurl:function(e){if(e.attr("src").substr(0,4)!=="http"){return a.location.protocol!=="https"?"http:"+e.attr("src").split("?")[0]:"https:"+e.attr("src").split("?")[0]}else{return e.attr("src").split("?")[0]}},handleMethod:function(g,e,f){this.catchMethods.methodreturn.push(g.value)},handleEvent:function(j,f,h){switch(j.event.toLowerCase()){case"ready":for(var k in c._data(f[0],"events")){if(k.match(/loadProgress|playProgress|play|pause|finish|seek|cuechange/)){f[0].contentWindow.postMessage(JSON.stringify({method:"addEventListener",value:k}),h)}}if(f.data("vimeoAPICall")){var e=f.data("vimeoAPICall");for(var g=0;g<e.length;g++){f[0].contentWindow.postMessage(JSON.stringify(e[g].message),e[g].api)}f.removeData("vimeoAPICall")}f.data("vimeoReady",true);f.triggerHandler("ready");break;case"seek":f.triggerHandler("seek",[j.data]);break;case"loadProgress":f.triggerHandler("loadProgress",[j.data]);break;case"playProgress":f.triggerHandler("playProgress",[j.data]);break;case"pause":f.triggerHandler("pause");break;case"finish":f.triggerHandler("finish");break;case"play":f.triggerHandler("play");break;case"cuechange":f.triggerHandler("cuechange");break}}};c(a).on("message",function(d){b.init(d)});c.vimeo=function(f,e,d){var i={},h=b.catchMethods.methodreturn.length;if(typeof e==="string"){i.method=e}if(typeof d!==undefined&&typeof d!=="function"){i.value=d}if(f.prop("tagName").toLowerCase()==="iframe"&&i.hasOwnProperty("method")){if(f.data("vimeoReady")){f[0].contentWindow.postMessage(JSON.stringify(i),b.setVimeoAPIurl(f))}else{var g=f.data("vimeoAPICall")?f.data("vimeoAPICall"):[];g.push({message:i,api:b.setVimeoAPIurl(f)});f.data("vimeoAPICall",g)}}if((e.toString().substr(0,3)==="get"||e.toString()==="paused")&&typeof d==="function"){(function(m,l,k){var j=a.setInterval(function(){if(b.catchMethods.methodreturn.length!=m){a.clearInterval(j);l(b.catchMethods.methodreturn[k])}},10)})(h,d,b.catchMethods.count);b.catchMethods.count++}return f};c.fn.vimeo=function(e,d){return c.vimeo(this,e,d)}})(jQuery,window);
define("vimeoAPI", function(){});

/**
 * jquery.brightcove-video v1.1.0 (Oct 2013)
 * Helps you create custom dynamic solutions that work with the Brightcove Video platform
 * Copyright © 2013 Carmine Olivo (carmineolivo@gmail.com)
 * Released under the (http://co.mit-license.org/) MIT license
 *
 * @requires
 * BrightcoveExperiences (http://admin.brightcove.com/js/BrightcoveExperiences.js)
 * jQuery (http://jquery.com/download/)
 *
 * @note On the Global tab of the player settings editor, under Web
 *       Settings, select Enable ActionScript/JavaScript APIs to enable
 *       the player for JavaScripting
 */
(function( $ ) {
'use strict';
var

    /**
     *
     */
    brightcoveVideo = {

        /**
         *
         */
        init: function( options, createExperiences, debug ) {
            var $that = this;

            if ( typeof brightcove === 'undefined' ) {
                $
                    .ajax({
                            url: 'http://admin.brightcove.com/js/BrightcoveExperiences.js',
                            dataType: 'script',
                            cache: true
                        })
                    .done(function(script, textStatus) {
                            brightcoveVideo.init.call( $that, options, createExperiences, debug );
                        })
                    .fail(function(jqxhr, settings, exception) {
                            if ( debug ) {
                                $.error( 'Failed to load BrightcoveExperiences. (http://admin.brightcove.com/js/BrightcoveExperiences.js)' );
                            }
                        })
                ;
                return this;
            }

            if ( typeof brightcove.JBVData === 'undefined' ) {
                brightcove.JBVData = {
                    onTemplateLoad: { },
                    onTemplateReady: { },
                    onTemplateError: { },
                    countPlayers: 0
                };
            }

            this.each( function() {
                var $container = $( this ),
                    data = $container.data( 'brightcoveVideo' ),
                    usrTemplateLoadHandler,
                    usrTemplateReadyHandler,
                    usrTemplateErrorHandler,
                    playerObject,
                    params;

                // if the player hasn't been initialized yet
                if ( ! data ) {
                    params = $.extend( {
                            /*
                            autoStart: null,
                            bgcolor: null,
                            dynamicStreaming: null,
                            experienceID: null,
                            height: null,
                            playerID: null,
                            playerKey: null,
                            secureConnections: null,
                            templateErrorHandler: null,
                            templateLoadHandler: null,
                            templateReadyHandler: null,
                            url: null,
                            '@videoPlayer': null,
                            width: null,
                            */
                            templateErrorHandler: null,
                            templateLoadHandler: null,
                            templateReadyHandler: null,
                            includeAPI: true,
                            showNoContentMessage: true,
                            isUI: true,
                            isVid: true,
                            wmode: 'transparent'
                        }, options );

                    brightcove.JBVData.onTemplateLoad[ 'player' + brightcove.JBVData.countPlayers ] = function( experienceID ) {
                        data.experienceID = experienceID;
                        data.player = brightcove.api.getExperience( experienceID );
                        if ( data.player ) {
                            data.isSmartPlayer = true;
                        } else {
                            data.player = brightcove.getExperience( experienceID );
                            data.isSmartPlayer = false;
                        }
                        data.videoPlayer = data.player.getModule( brightcove.api.modules.APIModules.VIDEO_PLAYER );
                        data.experience = data.player.getModule( brightcove.api.modules.APIModules.EXPERIENCE );

                        $container.data( 'brightcoveVideo', data );

                        if ( usrTemplateLoadHandler ) {
                            usrTemplateLoadHandler.call( data.container, experienceID );
                        }
                    };

                    brightcove.JBVData.onTemplateReady[ 'player' + brightcove.JBVData.countPlayers ] = function( event ) {
                        if ( usrTemplateReadyHandler ) {
                            usrTemplateReadyHandler.call( data.container, event );
                        }
                    };

                    brightcove.JBVData.onTemplateError[ 'player' + brightcove.JBVData.countPlayers ] = function( event ) {
                        if ( usrTemplateErrorHandler ) {
                            usrTemplateErrorHandler.call( data.container, event );
                        } else if ( debug && console && console.log ) {
                            var err = event.type + ': ' + event.errorType + ' (' + event.code + ') ' + event.info;
                            console.log( err );
                        }
                    };

                    usrTemplateLoadHandler = params.templateLoadHandler;
                    usrTemplateReadyHandler = params.templateReadyHandler;
                    usrTemplateErrorHandler = params.templateErrorHandler;
                    params.templateLoadHandler = 'brightcove.JBVData.onTemplateLoad.player' + brightcove.JBVData.countPlayers;
                    params.templateReadyHandler = 'brightcove.JBVData.onTemplateReady.player' + brightcove.JBVData.countPlayers;
                    params.templateErrorHandler = 'brightcove.JBVData.onTemplateError.player' + brightcove.JBVData.countPlayers;

                    playerObject = createPlayerObject( params );

                    data = {
                        index: brightcove.JBVData.countPlayers++,
                        container: this,
                        playerObject: playerObject,
                        target: $container
                    };
                    $container.data( 'brightcoveVideo', data );

                    $container.html( playerObject );
                }
            } );

            if ( createExperiences != false ) {
                brightcoveVideo.createExperiences( );
            }

            return this;
        },

        /**
         *
         */
        destroy: function() {

            return this.each( function() {
                var $this = $( this ),
                    data = $this.data( 'brightcoveVideo' ),
                    $experience = $( '#' + data.experienceID ),
                    isSmartPlayer = data.isSmartPlayer,
                    experience = data.experience,
                    target = data.target;

                // Namespacing FTW :)
                $( window ).unbind( '.brightcoveVideo' );
                $this.removeData( 'brightcoveVideo' );
                isSmartPlayer || experience.unload( );
                $experience.remove( );
                target.empty( );
            } );

        },

        /**
         *
         */
        createExperiences: function( ) {

            brightcove.createExperiences( );

            return this;
        },

        /**
         * Invokes the callback function with a boolean as to whether the video currently
         * displayed in the video window is playing. If a linear ad is currently playing,
         * this returns the state of the ad.
         *
         * @param {function} callback The callback function to invoke with the player state.
         */
        getIsPlaying: function( callback ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' );
                if ( data.isSmartPlayer ) {
                    data.videoPlayer.getIsPlaying( callback );
                } else {
                    callback.call( this, data.videoPlayer.isPlaying() );
                }
            } );
        },

        /**
         *
         */
        getType: function( callback ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' );
                callback.call( this, data.player.type );
            } );
        },

        /**
         * @param {string} event_name BEGIN, CHANGE, COMPLETE, ERROR, PLAY, PROGRESS, SEEK_NOTIFY, STOP
         */
        onMediaEvent: function( event_name, handler, priority ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' ),
                    events = data.isSmartPlayer ? brightcove.api.events.MediaEvent : BCMediaEvent;

                data.videoPlayer
                    .addEventListener( events[event_name], handler, priority );
            } );
        },

        /**
         * @param {string} event_name TEMPLATE_READY
         */
        onExperienceEvent: function( event_name, handler, priority ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' ),
                    events = data.isSmartPlayer ? brightcove.api.events.ExperienceEvent : BCExperienceEvent;

                data.experience
                    .addEventListener( events[event_name], handler, priority );
            } );
        },

        /**
         * @param {string} event_name CUE
         */
        onCuePointEvent: function( event_name, handler, priority ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' ),
                    events = data.isSmartPlayer ? brightcove.api.events.CuePointEvent : BCCuePointEvent;

                data.videoPlayer
                    .addEventListener( events[event_name], handler, priority );
            } );
        },

        /**
         * Returns a transparent HTML element that is positioned directly on top of the video element.
         */
        overlay: function( html ) {
            var overlays = [ ];

            this.each( function() {
                var $this = $( this ),
                    data = $this.data( 'brightcoveVideo' ),
                    $experience, position, $overlay;

                if ( ! data.overlay ) {
                    $experience = $( '#' + data.experienceID );
                    position = $experience.position( );

                    $overlay = $( '<div />' )
                        .css({
                            position: 'absolute',
                            top: position.top,
                            left: position.left,
                            height: $experience.css( 'height' ),
                            width: $experience.css( 'width' ),
                            margin: $experience.css( 'margin' ),
                            padding: $experience.css( 'padding' ),
                            border: $experience.css( 'border' ),
                            borderColor: 'transparent'
                        })
                        .append( html )
                        .appendTo( $this );

                    data.overlay = $overlay.get( )[ 0 ];
                } else if ( html ) {
                    $( data.overlay ).html( html );
                }

                overlays.push( data.overlay );
            } );

            return this.pushStack( overlays );
        },

        /**
         * Pauses or resumes playback of the current video in the video window.
         *
         * @param {boolean} pause (Passing a true value will pauses the video playback. Passing false will resume playback.)
         */
        pause: function( pause ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).videoPlayer
                    .pause( pause );
            } );
        },

        /**
         *
         */
        play: function( ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).videoPlayer
                    .play( );
            } );
        },

        /**
         * Seeks to a specified time position in the video.
         *
         * @param {number} time The time in seconds to seek to
         */
        seek: function( time ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).videoPlayer
                    .seek( time );
            } );
        },

        /**
         * Sets the pixel dimensions for the experience.
         *
         * @param {number} pixel width to set the experience to
         * @param {number} pixel height to set the experience to
         */
        setSize: function( width, height ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).experience
                    .setSize( width, height );
            } );
        }
    },

    /**
     *
     */
    createPlayerObject = function( params ) {
        var $player = $( '<object />' )
                .attr( 'class', 'BrightcoveExperience' );

        if ( params.experienceID !== null ) {
            $player.attr( 'id', params.experienceID );
        }

        $.each( params, function( n, v ) {
            if ( v !== null ) {
                $( '<param />' ).prop({ name: n, value: v }).appendTo( $player );
            }
        });

        return $player;
    };

    $.fn.brightcoveVideo = function( method ) {
        if ( brightcoveVideo[method] ) {
            return brightcoveVideo[ method ].apply( this, Array.prototype.slice.call(arguments, 1) );
        } else if ( typeof method === 'object' || ! method ) {
            return brightcoveVideo.init.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exists on jQuery.brightcoveVideo' );
        }
    };

})( jQuery );

define("brightcoveVideo", function(){});

/*

The vedio service is facade for three types of videos Youtube, Brightcove and Viemo
Usage Example

//creating new instance of video
var video = IEA.video(container, config)

//public methods
video.getVideoContainer()
video.getPlayer()
video.play()
video.pause()
video.stop()
video.destroy()
video.restart()
video.seek()
video.resize()

//Events

*/
define('video',[
    'iea',
    'vimeoAPI',
    'brightcoveVideo'

], function(
    IEA,
    VimeoAPI,
    BrightcoveVideo

) {
    'use strict';

    IEA.service('video', function(service, app, iea) {

        // Storing all the video data
        IEA.videoData = (IEA.videoData) ? IEA.videoData : {};

        /**
         * Video class
         * @method Video
         * @param {object} options
         * @return ThisExpression
         */
        var Video = function() {
            return this;
        };

        _.extend(Video.prototype, {

            container: null,
            player: null,
            type: null,
            triggerMethod: IEA.triggerMethod,

            /**
             * Initialization of the service
             * @method initialize
             * @param {} options
             * @param container
             * @return ThisExpression
             */
            initialize: function(container, options) {
                var self = this,
                    defaultSettings = {
                        'autoplay': true,
                        'autohide': true,
                        'controls': false,
                        'loopPlayback': true,
                        'showRelated': true,
                        'allowFullScreen': false,
                        'theme': '',
                        'wmode': 'transparent',
                        'videoId': ''
                    };

                this.options = _.extend(defaultSettings, options);

                this.container = container;

                this.type = this.options.viewType;
                this.type = String(this.type).toLowerCase();

                this.swfControls = false;
                this._configureVideo();
                return this;
            },

            /**
             * This method will return video container
             * @method getVideoContainer
             * @param container
             * @return
             */
            getVideoContainer: function(container) {
                var $wrapper = $('<div class="video-container"></div>');

                if(!container.children().hasClass('video-container')) {
                    container.html($wrapper);
                    return $('.video-container', container);
                } else {
                    return $('.video-container', container);
                }
            },

            /**
             * This method will return player
             * @method player
             * @return MemberExpression
             */
            getPlayer: function() {
                return this.player;
            },

            /**
             * Play the video
             * @method play
             * @return
             */
            play: function() {
                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.playVideo === 'function') {
                        //this.player.playVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.playVideo();
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('play');
                    }

                    //this.player.vimeo('play');
                    break;
                case 'brightcove':

                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('play');
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.playMedia();
                        } else {
                            this.html5Player.play();
                        }
                    }
                    break;
                }
                this.triggerMethod('video:play', this);
            },

            /**
             * Pause the vedio
             * @method pause
             * @return
             */
            pause: function() {
                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.pauseVideo === 'function') {
                        //this.player.pauseVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.pauseVideo();
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('pause');
                    }
                    break;
                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('pause');
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.pauseMedia();
                        } else {
                            this.html5Player.pause();
                        }
                    }
                    break;
                }
                this.triggerMethod('video:pause', this);
            },

            /**
             * Stop the vedio
             * @method stop
             * @return
             */
            stop: function() {
                switch (this.type) {

                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.stopVideo === 'function') {
                        //this.player.stopVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.stopVideo();
                    }
                    break;

                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('unload');
                    }
                    break;

                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('pause');
                        this.$videoNode.brightcoveVideo('seek', 0);
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.stopMedia();
                        } else {
                            this.html5Player.pause();
                            this.html5Player.currentTime = 0;
                        }
                    }
                    break;

                }
                this.triggerMethod('video:stop', this);
            },

            /**
             * Destroy the video's container
             * @method destory
             * @return
             */
            destroy: function() {
                if(this.container) {
                    this.container.html('');
                }
                this.triggerMethod('video:destroy', this);
            },

            /**
             * Restarts the video
             * @method restart
             * @return
             */
            restart: function() {
                this.seek(0);
                this.play();
                this.triggerMethod('video:restart', this);
            },

            /**
             * Resizes the container size
             * @method resize
             * @return
             */
            resize: function(width, height) {
                if(width && height) {
                    if(this.type === 'brightcove') {
                        this.$videoNode.brightcoveVideo('setSize', width, height);
                    } else {
                        $(this.container).css({width: width, height: height});
                    }
                }
                this.triggerMethod('video:resize', this);
            },

            /**
             * Description
             * @method seek
             * @return
             */
            seek: function(seconds) {

                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.seekTo === 'function') {
                        IEA.videoData[this.options.randomNumber].playerObj.seekTo(seconds);
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('seekTo', seconds);
                    }
                    break;
                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('seek', seconds);
                    }
                    break;
                case 'html5':
                    if (this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.setCurrentTime(seconds);
                        } else {
                            this.html5Player.currentTime = seconds;
                        }
                    }
                    break;
                }
                this.triggerMethod('video:seek', this);
            },

            toggleMute: function() {
                switch (this.type) {
                    case 'html5':
                        if(!this.swfControls) {
                            if (this.html5Player.muted) {
                                this.html5Player.muted = false;
                                this.triggerMethod('video:unmuted', this);
                            } else {
                                this.html5Player.muted = true;
                                this.triggerMethod('video:muted', this);
                            }
                        }
                        break;
                }
            },

            /**
             * ----------------------------------------------------------------------------- *\
             * private Methods
             * \* -----------------------------------------------------------------------------*/

             /**
             * This method is used to configure vidoes
             * @method _configureVideo
             * @return
             */
            _configureVideo: function() {
                var videoType = this.type,
                    self = this,
                    container = this.container;

                switch(videoType) {
                    case 'youtube':
                        IEA.videoData[this.options.randomNumber] = {};
                        IEA.videoData[this.options.randomNumber].playerObj = {options: this.options, container: container};
                        IEA.videoData[this.options.randomNumber].handler = this;
                        this._loadYoutubeVideo();
                        break;

                    case 'brightcove':

                        this.options = _.extend(this.options, {
                            'playerID': app.getValue('brightcovePlayerId'),
                            'playerKey': app.getValue('brightcovePlayerKey')
                        });
                        this._loadBrightcoveVideo();
                        break;

                    case 'vimeo':

                        this._loadVimeoVideo();
                        break;

                    case 'html5':

                        this._loadHtml5Video();
                        break;

                    default:
                }
            },

            /**
             * Description
             * @method _loadYoutubeVideo
             * @return
             */
            _loadYoutubeVideo: function() {
                var self = this;
                if (typeof(YT) === 'undefined' || typeof(YT.Player) === 'undefined') {
                    window.onYouTubePlayerAPIReady = function () {
                        var video = null,
                            key;

                        for(key in IEA.videoData) {
                            video = IEA.videoData[key].playerObj;
                            self._onYtAPIReady.apply(self, [video.options.randomNumber, video.container]);
                        }
                        //IEA.videoData = {};
                    };

                    $.getScript('//www.youtube.com/iframe_api');
                } else {
                    this._onYtAPIReady.apply(this, [this.options.randomNumber, this.container]);
                }

            },

            /**
             * Description
             * @return
             * @method _loadBrightcoveVideo
             * @return
             */
            _loadBrightcoveVideo: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    self = this;

                this.$videoNode = $videoNode;

                $videoNode.brightcoveVideo({
                    'playerID': config.playerID,
                    '@videoPlayer': config.videoId,
                    'autoStart': config.autoplay,

                    'templateReadyHandler': function(evt) {
                        self._onTemplateReady(evt);
                    },
                    templateErrorHandler: function(evt) {
                        self.triggerMethod('brightcove:error', evt);
                    }
                });
            },

            /**
             * Description
             * @return
             * @method _loadHtml5Video
             * @return
             */
            _loadHtml5Video: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    tagName = 'video';

                config.randomNumber = (config.randomNumber) ? config.randomNumber : Math.floor((Math.random() * 100) + 1);

                // check for html5 player
                if(document.createElement(tagName).canPlayType) {
                    this._initHtml5Player(tagName, config);
                } else {
                    // fall back option - flv player
                    this._initFlashPlayer(config);
                }
            },

            /**
             * Description
             * @method _initHtml5Player
             * @return
             */
            _initHtml5Player: function(tagName, config) {
                var videoElement = document.createElement(tagName),
                    $videoNode = this.getVideoContainer(this.container),
                    id = 'videoplayer_' + config.randomNumber,
                    sourceElements = [],
                    videoConfig = {
                        'id': id,
                        'poster':   (config.thumbnailUrl) ? config.thumbnailUrl : (config.fallbackUrl) ? config.fallbackUrl : '',
                        'preload':  'auto',
                    };


                if(typeof config.autoplay !== 'undefined' && config.autoplay) {
                    videoConfig.autoplay = '';
                }

                if(typeof config.showControls !== 'undefined' && config.showControls) {
                    videoConfig.controls = '';
                }

                if(typeof config.loopPlayback !== 'undefined' && config.loopPlayback) {
                    videoConfig.loop = '';
                }

                if(typeof config.audio !== 'undefined' && !config.audio) {
                    videoConfig.muted = '';
                }

                for(var key in videoConfig) {
                    videoElement.setAttribute(key, videoConfig[key]);
                }

                sourceElements.push({src: config.videoFormats.mp4Video, type: 'video/mp4',  codecs: 'avc1.42E01E,mp4a.40.2'});
                sourceElements.push({src: config.videoFormats.oggVideo, type: 'video/ogg',  codecs: 'theora,vorbis'});

                for(var i in sourceElements) {
                    var sourceElement = document.createElement('source');

                    for(var attr in sourceElements[i]) {
                        sourceElement.setAttribute(attr, sourceElements[i][attr]);
                    }

                    videoElement.appendChild(sourceElement);
                }

                $videoNode.append(videoElement);
                this.html5Player = videoElement;
                this.isPlayerReady = true;

                this.triggerMethod('video:loaded', this);

            },

            /**
             * Description
             * @method _initFlashPlayer
             * @return
             */
            _initFlashPlayer: function(config) {
                //randomNumber
                var videoElement = document.createElement('div'),
                    $videoNode = this.getVideoContainer(this.container),
                    src = app.getValue('flashPlayer'),
                    id = 'swfplayer_' + config.randomNumber,
                    playerVars = [
                        'id=' + id,
                        'isvideo=' + true,
                        'autoplay=' + config.autoplay,
                        'preload=' + 'none',
                        'startvolume=' + (config.audio ? '0.8' : '0'),
                        'timerrate=' + '250',
                        'pseudostreamstart=' + 'start',
                        'controls=' + config.showControls,
                        'file=' + config.videoFormats.flvVideo
                    ];
                this.swfControls = true;
                $videoNode.append(videoElement);
                videoElement.outerHTML = '<object type="application/x-shockwave-flash" id="' + id + '" data="' + src + '"' +
                'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">' +
                '<param name="movie" value="' + src + '" />' +
                '<param name="src" value="' + src + '" />' +
                '<param name="flashvars" value="' + playerVars.join('&amp;') + '" />' +
                '<param name="quality" value="high" />' +
                '<param name="bgcolor" value="#000000" />' +
                '<param name="wmode" value="transparent" />' +
                '<param name="allowScriptAccess" value="always" />' +
                '<param name="allowFullScreen" value="true" />' +
                '<param name="scale" value="default" />' +
                '<img class="video-fallback-image" src="' + config.fallbackUrl + '" alt="' + config.fallbackAlt + '">' +
                '</object>';

                this.html5Player = document.getElementById(id);
                this.isPlayerReady = true;
            },

            /**
             * Description
             * @method _loadVimeoVideo
             * @return
             */
            _loadVimeoVideo: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    self = this,
                    playerSource = '//player.vimeo.com/video/' + config.videoId + '?api=1&player_id=vimeoplayer_' + config.videoId + '&autoplay=' + config.autoplay + '&showcontrols=' + config.showControls + '&loop='+ config.loopPlayback +'&showrelated=' + config.showRelated,
                    vimeoObject = $('<iframe></iframe>').attr({
                        'src': playerSource,
                        'id': 'vimeoplayer_' + config.videoId,
                        'frameborder': 0,
                        'webkitAllowFullScreen': config.allowFullScreen,
                        'mozallowfullscreen': config.allowFullScreen,
                        'allowFullScreen': config.allowFullScreen
                    });

                $videoNode.html(vimeoObject);

                //Listen for messages from the player
                $(window).on('message onmessage', function(evt) {
                    var origin = evt.originalEvent.origin,
                        isVimeo = origin.indexOf('vimeo');
                    if(isVimeo !== -1) {
                        self._onMessageRecievedVimeo(evt, vimeoObject, playerSource);
                    }
                });
                this.triggerMethod('video:loaded', this);
            },

             /**
             * Description
             * @method _onTemplateReady
             * @returnab saile
             */
            _onTemplateReady: function(evt) {
                var self = this;

                this.player = $(this);
                this.isPlayerReady = true;

                this.triggerMethod('brightcove:templateReadyHandler', this.player, evt);

                this.$videoNode.brightcoveVideo('onMediaEvent', 'PLAY', function(evt) {
                    self.triggerMethod('brightcove:play', evt, self.player);
                });
                this.triggerMethod('video:loaded', this);

                this.$videoNode.brightcoveVideo('onMediaEvent', 'STOP', function(evt) {
                    var videoPlayer = self.$videoNode.data('brightcoveVideo').videoPlayer,
                        totalduration, currentPosition;

                    if(self.options.loopPlayback) {
                        videoPlayer.getVideoDuration(true, function(duration) {
                            totalduration = duration;
                            videoPlayer.getVideoPosition(true, function(position) {
                                currentPosition = position;

                                // logic for loop in control goes here because COMPLETE event is called only once
                                if(currentPosition === '00:00' || currentPosition === totalduration) {
                                    self.restart();
                                    self.triggerMethod('brightcove:complete', evt, self.player);
                                }
                            });
                        });
                    }
                });
                this.triggerMethod('video:loaded', this);
            },

            /**
             * Description
             * @method _onTemplateLoad
             * @return
             */
            _onTemplateLoad: function() {
                // body...
            },

            /**
             * Description
             * @method _onYtAPIReady
             * @return
             */
            _onYtAPIReady: function(playerId, container) {
                var self = this;

                if (playerId) {
                    this._loadYoutubeVideoView.apply(this, [playerId, container]);
                } else {
                    _.each(IEA.videoData, function(value, key) {
                        self._loadYoutubeVideoView.apply(self, [key, container]);
                    });
                }
            },

            /**
             * Description
             * @method _loadYoutubeVideoView
             * @return
             */
            _loadYoutubeVideoView: function(key, container) {

                var self = this,
                    videoNode = this.getVideoContainer(container),
                    config = IEA.videoData[key].playerObj.options,
                    player;

                videoNode.html($('<div>').attr('id', key));

                // setTimeout( function() {
                this.player = new YT.Player(key, {
                    videoId: config.videoId,
                    events: {
                        'onReady': function(evt) {
                            IEA.videoData[config.randomNumber].handler.triggerMethod('youtube:onReady', evt, key);
                            IEA.videoData[config.randomNumber].handler.isPlayerReady = true;
                            // IEA.videoData[config.randomNumber].playerObj = evt.target;

                            if(!config.audio) {
                                evt.target.mute();
                            }
                            else {
                                evt.target.unMute();
                            }
                        },

                        'onStateChange': function(evt) {
                            self.triggerMethod('youtube:onStateChange', evt, key);

                            switch (evt.data) {
                            case -1:
                                self.triggerMethod('youtube:unstarted', evt, key);
                                break;
                            case 0:
                                if(config.loopPlayback) {
                                    IEA.videoData[config.randomNumber].handler.restart();
                                }
                                self.triggerMethod('youtube:ended', evt, key);
                                break;
                            case 1:
                                self.triggerMethod('youtube:playing', evt, key);
                                break;
                            case 2:
                                self.triggerMethod('youtube:paused', evt, key);
                                break;
                            case 3:
                                self.triggerMethod('youtube:buffering', evt, key);
                                break;
                            case 5:
                                self.triggerMethod('youtube:videocued', evt, key);
                                break;
                            }
                        },
                        'onError': function(error) {
                            self.triggerMethod('youtube:onError', error);
                        }
                    },
                    playerVars: {
                        'autoplay': config.autoplay,
                        'autohide': config.autohide,
                        'controls': config.showControls ? 1 : 0,
                        'loop': config.loopPlayback ? 1 : 0,
                        'rel': config.showRelated,
                        'fs': false,
                        'theme': config.theme,
                        'wmode': config.wmode,
                    }
                });
                // }, 1000);
                IEA.videoData[config.randomNumber].handler.on('youtube:onReady', function(evt) {
                    IEA.videoData[config.randomNumber].handler.player = evt.target;
                    IEA.videoData[config.randomNumber].handler.isPlayerReady = true;
                    IEA.videoData[config.randomNumber].playerObj = evt.target;
                });
                this.triggerMethod('video:loaded',this);
            },

            /**
             * Description
             * @method _onVideoReady
             * @return
             */
            _onVimeoReady: function() {
                // body...
            },

            /**
             * Description
             * @method _onMessageRecievedVimeo
             * @return
             */
            _onMessageRecievedVimeo: function(evt, vimeoObject, playerSource) {

                var data = evt.originalEvent.data,
                    self = this;

                if(data) {
                    data = JSON.parse(data);
                    switch (data.event) {
                    case 'ready':
                        this.triggerMethod('vimeo:ready', evt, vimeoObject, playerSource);
                        this._post('addEventListener', 'pause', vimeoObject, playerSource);
                        this._post('addEventListener', 'finish', vimeoObject, playerSource);
                        this._post('addEventListener', 'playProgress', vimeoObject, playerSource);
                        if(!this.options.audio) {
                            this._post('setVolume', '0', vimeoObject, playerSource);
                        }
                        else {
                            this._post('setVolume', '1', vimeoObject, playerSource);
                        }

                        this.isPlayerReady = true;
                        this.player = vimeoObject;
                        break;
                    case 'playProgress':
                        this.triggerMethod('vimeo:playProgress', data.event);
                        break;
                    case 'pause':
                        this.triggerMethod('vimeo:pause', data.event);
                        break;
                    case 'finish':
                        this.triggerMethod('vimeo:finish', data.event);
                        break;
                    }

                    this.on('vimeo:ready', function(evt, id) {
                        self.isPlayerReady = true;
                        self.player = id;
                    });
                }

                this.triggerMethod('video:loaded', this);
            },

            /**
             * Description
             * @method _post
             * @return
             */
            _post: function (action, value, player, url) {
                if (url.indexOf('vimeo')) {
                    var data = {
                            method: action
                        },
                        winURL = window.location.protocol + url;

                    if (value) {
                        data.value = value;
                    }

                    if(player[0].contentWindow && player[0].contentWindow.postMessage) {
                        player[0].contentWindow.postMessage(data, winURL);
                    }
                }
            }
        });

        return Video;
    });
});

/*! Magnific Popup - v0.9.9 - 2013-11-15
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2013 Dmitry Semenov; */
(function(e){var t,n,i,o,r,a,s,l="Close",c="BeforeClose",d="AfterClose",u="BeforeAppend",p="MarkupParse",f="Open",m="Change",g="mfp",v="."+g,h="mfp-ready",C="mfp-removing",y="mfp-prevent-close",w=function(){},b=!!window.jQuery,I=e(window),x=function(e,n){t.ev.on(g+e+v,n)},k=function(t,n,i,o){var r=document.createElement("div");return r.className="mfp-"+t,i&&(r.innerHTML=i),o?n&&n.appendChild(r):(r=e(r),n&&r.appendTo(n)),r},T=function(n,i){t.ev.triggerHandler(g+n,i),t.st.callbacks&&(n=n.charAt(0).toLowerCase()+n.slice(1),t.st.callbacks[n]&&t.st.callbacks[n].apply(t,e.isArray(i)?i:[i]))},E=function(n){return n===s&&t.currTemplate.closeBtn||(t.currTemplate.closeBtn=e(t.st.closeMarkup.replace("%title%",t.st.tClose)),s=n),t.currTemplate.closeBtn},_=function(){e.magnificPopup.instance||(t=new w,t.init(),e.magnificPopup.instance=t)},S=function(){var e=document.createElement("p").style,t=["ms","O","Moz","Webkit"];if(void 0!==e.transition)return!0;for(;t.length;)if(t.pop()+"Transition"in e)return!0;return!1};w.prototype={constructor:w,init:function(){var n=navigator.appVersion;t.isIE7=-1!==n.indexOf("MSIE 7."),t.isIE8=-1!==n.indexOf("MSIE 8."),t.isLowIE=t.isIE7||t.isIE8,t.isAndroid=/android/gi.test(n),t.isIOS=/iphone|ipad|ipod/gi.test(n),t.supportsTransition=S(),t.probablyMobile=t.isAndroid||t.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),i=e(document.body),o=e(document),t.popupsCache={}},open:function(n){var i;if(n.isObj===!1){t.items=n.items.toArray(),t.index=0;var r,s=n.items;for(i=0;s.length>i;i++)if(r=s[i],r.parsed&&(r=r.el[0]),r===n.el[0]){t.index=i;break}}else t.items=e.isArray(n.items)?n.items:[n.items],t.index=n.index||0;if(t.isOpen)return t.updateItemHTML(),void 0;t.types=[],a="",t.ev=n.mainEl&&n.mainEl.length?n.mainEl.eq(0):o,n.key?(t.popupsCache[n.key]||(t.popupsCache[n.key]={}),t.currTemplate=t.popupsCache[n.key]):t.currTemplate={},t.st=e.extend(!0,{},e.magnificPopup.defaults,n),t.fixedContentPos="auto"===t.st.fixedContentPos?!t.probablyMobile:t.st.fixedContentPos,t.st.modal&&(t.st.closeOnContentClick=!1,t.st.closeOnBgClick=!1,t.st.showCloseBtn=!1,t.st.enableEscapeKey=!1),t.bgOverlay||(t.bgOverlay=k("bg").on("click"+v,function(){t.close()}),t.wrap=k("wrap").attr("tabindex",-1).on("click"+v,function(e){t._checkIfClose(e.target)&&t.close()}),t.container=k("container",t.wrap)),t.contentContainer=k("content"),t.st.preloader&&(t.preloader=k("preloader",t.container,t.st.tLoading));var l=e.magnificPopup.modules;for(i=0;l.length>i;i++){var c=l[i];c=c.charAt(0).toUpperCase()+c.slice(1),t["init"+c].call(t)}T("BeforeOpen"),t.st.showCloseBtn&&(t.st.closeBtnInside?(x(p,function(e,t,n,i){n.close_replaceWith=E(i.type)}),a+=" mfp-close-btn-in"):t.wrap.append(E())),t.st.alignTop&&(a+=" mfp-align-top"),t.fixedContentPos?t.wrap.css({overflow:t.st.overflowY,overflowX:"hidden",overflowY:t.st.overflowY}):t.wrap.css({top:I.scrollTop(),position:"absolute"}),(t.st.fixedBgPos===!1||"auto"===t.st.fixedBgPos&&!t.fixedContentPos)&&t.bgOverlay.css({height:o.height(),position:"absolute"}),t.st.enableEscapeKey&&o.on("keyup"+v,function(e){27===e.keyCode&&t.close()}),I.on("resize"+v,function(){t.updateSize()}),t.st.closeOnContentClick||(a+=" mfp-auto-cursor"),a&&t.wrap.addClass(a);var d=t.wH=I.height(),u={};if(t.fixedContentPos&&t._hasScrollBar(d)){var m=t._getScrollbarSize();m&&(u.marginRight=m)}t.fixedContentPos&&(t.isIE7?e("body, html").css("overflow","hidden"):u.overflow="hidden");var g=t.st.mainClass;return t.isIE7&&(g+=" mfp-ie7"),g&&t._addClassToMFP(g),t.updateItemHTML(),T("BuildControls"),e("html").css(u),t.bgOverlay.add(t.wrap).prependTo(document.body),t._lastFocusedEl=document.activeElement,setTimeout(function(){t.content?(t._addClassToMFP(h),t._setFocus()):t.bgOverlay.addClass(h),o.on("focusin"+v,t._onFocusIn)},16),t.isOpen=!0,t.updateSize(d),T(f),n},close:function(){t.isOpen&&(T(c),t.isOpen=!1,t.st.removalDelay&&!t.isLowIE&&t.supportsTransition?(t._addClassToMFP(C),setTimeout(function(){t._close()},t.st.removalDelay)):t._close())},_close:function(){T(l);var n=C+" "+h+" ";if(t.bgOverlay.detach(),t.wrap.detach(),t.container.empty(),t.st.mainClass&&(n+=t.st.mainClass+" "),t._removeClassFromMFP(n),t.fixedContentPos){var i={marginRight:""};t.isIE7?e("body, html").css("overflow",""):i.overflow="",e("html").css(i)}o.off("keyup"+v+" focusin"+v),t.ev.off(v),t.wrap.attr("class","mfp-wrap").removeAttr("style"),t.bgOverlay.attr("class","mfp-bg"),t.container.attr("class","mfp-container"),!t.st.showCloseBtn||t.st.closeBtnInside&&t.currTemplate[t.currItem.type]!==!0||t.currTemplate.closeBtn&&t.currTemplate.closeBtn.detach(),t._lastFocusedEl&&e(t._lastFocusedEl).focus(),t.currItem=null,t.content=null,t.currTemplate=null,t.prevHeight=0,T(d)},updateSize:function(e){if(t.isIOS){var n=document.documentElement.clientWidth/window.innerWidth,i=window.innerHeight*n;t.wrap.css("height",i),t.wH=i}else t.wH=e||I.height();t.fixedContentPos||t.wrap.css("height",t.wH),T("Resize")},updateItemHTML:function(){var n=t.items[t.index];t.contentContainer.detach(),t.content&&t.content.detach(),n.parsed||(n=t.parseEl(t.index));var i=n.type;if(T("BeforeChange",[t.currItem?t.currItem.type:"",i]),t.currItem=n,!t.currTemplate[i]){var o=t.st[i]?t.st[i].markup:!1;T("FirstMarkupParse",o),t.currTemplate[i]=o?e(o):!0}r&&r!==n.type&&t.container.removeClass("mfp-"+r+"-holder");var a=t["get"+i.charAt(0).toUpperCase()+i.slice(1)](n,t.currTemplate[i]);t.appendContent(a,i),n.preloaded=!0,T(m,n),r=n.type,t.container.prepend(t.contentContainer),T("AfterChange")},appendContent:function(e,n){t.content=e,e?t.st.showCloseBtn&&t.st.closeBtnInside&&t.currTemplate[n]===!0?t.content.find(".mfp-close").length||t.content.append(E()):t.content=e:t.content="",T(u),t.container.addClass("mfp-"+n+"-holder"),t.contentContainer.append(t.content)},parseEl:function(n){var i=t.items[n],o=i.type;if(i=i.tagName?{el:e(i)}:{data:i,src:i.src},i.el){for(var r=t.types,a=0;r.length>a;a++)if(i.el.hasClass("mfp-"+r[a])){o=r[a];break}i.src=i.el.attr("data-mfp-src"),i.src||(i.src=i.el.attr("href"))}return i.type=o||t.st.type||"inline",i.index=n,i.parsed=!0,t.items[n]=i,T("ElementParse",i),t.items[n]},addGroup:function(e,n){var i=function(i){i.mfpEl=this,t._openClick(i,e,n)};n||(n={});var o="click.magnificPopup";n.mainEl=e,n.items?(n.isObj=!0,e.off(o).on(o,i)):(n.isObj=!1,n.delegate?e.off(o).on(o,n.delegate,i):(n.items=e,e.off(o).on(o,i)))},_openClick:function(n,i,o){var r=void 0!==o.midClick?o.midClick:e.magnificPopup.defaults.midClick;if(r||2!==n.which&&!n.ctrlKey&&!n.metaKey){var a=void 0!==o.disableOn?o.disableOn:e.magnificPopup.defaults.disableOn;if(a)if(e.isFunction(a)){if(!a.call(t))return!0}else if(a>I.width())return!0;n.type&&(n.preventDefault(),t.isOpen&&n.stopPropagation()),o.el=e(n.mfpEl),o.delegate&&(o.items=i.find(o.delegate)),t.open(o)}},updateStatus:function(e,i){if(t.preloader){n!==e&&t.container.removeClass("mfp-s-"+n),i||"loading"!==e||(i=t.st.tLoading);var o={status:e,text:i};T("UpdateStatus",o),e=o.status,i=o.text,t.preloader.html(i),t.preloader.find("a").on("click",function(e){e.stopImmediatePropagation()}),t.container.addClass("mfp-s-"+e),n=e}},_checkIfClose:function(n){if(!e(n).hasClass(y)){var i=t.st.closeOnContentClick,o=t.st.closeOnBgClick;if(i&&o)return!0;if(!t.content||e(n).hasClass("mfp-close")||t.preloader&&n===t.preloader[0])return!0;if(n===t.content[0]||e.contains(t.content[0],n)){if(i)return!0}else if(o&&e.contains(document,n))return!0;return!1}},_addClassToMFP:function(e){t.bgOverlay.addClass(e),t.wrap.addClass(e)},_removeClassFromMFP:function(e){this.bgOverlay.removeClass(e),t.wrap.removeClass(e)},_hasScrollBar:function(e){return(t.isIE7?o.height():document.body.scrollHeight)>(e||I.height())},_setFocus:function(){(t.st.focus?t.content.find(t.st.focus).eq(0):t.wrap).focus()},_onFocusIn:function(n){return n.target===t.wrap[0]||e.contains(t.wrap[0],n.target)?void 0:(t._setFocus(),!1)},_parseMarkup:function(t,n,i){var o;i.data&&(n=e.extend(i.data,n)),T(p,[t,n,i]),e.each(n,function(e,n){if(void 0===n||n===!1)return!0;if(o=e.split("_"),o.length>1){var i=t.find(v+"-"+o[0]);if(i.length>0){var r=o[1];"replaceWith"===r?i[0]!==n[0]&&i.replaceWith(n):"img"===r?i.is("img")?i.attr("src",n):i.replaceWith('<img src="'+n+'" class="'+i.attr("class")+'" />'):i.attr(o[1],n)}}else t.find(v+"-"+e).html(n)})},_getScrollbarSize:function(){if(void 0===t.scrollbarSize){var e=document.createElement("div");e.id="mfp-sbm",e.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(e),t.scrollbarSize=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return t.scrollbarSize}},e.magnificPopup={instance:null,proto:w.prototype,modules:[],open:function(t,n){return _(),t=t?e.extend(!0,{},t):{},t.isObj=!0,t.index=n||0,this.instance.open(t)},close:function(){return e.magnificPopup.instance&&e.magnificPopup.instance.close()},registerModule:function(t,n){n.options&&(e.magnificPopup.defaults[t]=n.options),e.extend(this.proto,n.proto),this.modules.push(t)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},e.fn.magnificPopup=function(n){_();var i=e(this);if("string"==typeof n)if("open"===n){var o,r=b?i.data("magnificPopup"):i[0].magnificPopup,a=parseInt(arguments[1],10)||0;r.items?o=r.items[a]:(o=i,r.delegate&&(o=o.find(r.delegate)),o=o.eq(a)),t._openClick({mfpEl:o},i,r)}else t.isOpen&&t[n].apply(t,Array.prototype.slice.call(arguments,1));else n=e.extend(!0,{},n),b?i.data("magnificPopup",n):i[0].magnificPopup=n,t.addGroup(i,n);return i};var P,O,z,M="inline",B=function(){z&&(O.after(z.addClass(P)).detach(),z=null)};e.magnificPopup.registerModule(M,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){t.types.push(M),x(l+"."+M,function(){B()})},getInline:function(n,i){if(B(),n.src){var o=t.st.inline,r=e(n.src);if(r.length){var a=r[0].parentNode;a&&a.tagName&&(O||(P=o.hiddenClass,O=k(P),P="mfp-"+P),z=r.after(O).detach().removeClass(P)),t.updateStatus("ready")}else t.updateStatus("error",o.tNotFound),r=e("<div>");return n.inlineElement=r,r}return t.updateStatus("ready"),t._parseMarkup(i,{},n),i}}});var F,H="ajax",L=function(){F&&i.removeClass(F)},A=function(){L(),t.req&&t.req.abort()};e.magnificPopup.registerModule(H,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){t.types.push(H),F=t.st.ajax.cursor,x(l+"."+H,A),x("BeforeChange."+H,A)},getAjax:function(n){F&&i.addClass(F),t.updateStatus("loading");var o=e.extend({url:n.src,success:function(i,o,r){var a={data:i,xhr:r};T("ParseAjax",a),t.appendContent(e(a.data),H),n.finished=!0,L(),t._setFocus(),setTimeout(function(){t.wrap.addClass(h)},16),t.updateStatus("ready"),T("AjaxContentAdded")},error:function(){L(),n.finished=n.loadError=!0,t.updateStatus("error",t.st.ajax.tError.replace("%url%",n.src))}},t.st.ajax.settings);return t.req=e.ajax(o),""}}});var j,N=function(n){if(n.data&&void 0!==n.data.title)return n.data.title;var i=t.st.image.titleSrc;if(i){if(e.isFunction(i))return i.call(t,n);if(n.el)return n.el.attr(i)||""}return""};e.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var e=t.st.image,n=".image";t.types.push("image"),x(f+n,function(){"image"===t.currItem.type&&e.cursor&&i.addClass(e.cursor)}),x(l+n,function(){e.cursor&&i.removeClass(e.cursor),I.off("resize"+v)}),x("Resize"+n,t.resizeImage),t.isLowIE&&x("AfterChange",t.resizeImage)},resizeImage:function(){var e=t.currItem;if(e&&e.img&&t.st.image.verticalFit){var n=0;t.isLowIE&&(n=parseInt(e.img.css("padding-top"),10)+parseInt(e.img.css("padding-bottom"),10)),e.img.css("max-height",t.wH-n)}},_onImageHasSize:function(e){e.img&&(e.hasSize=!0,j&&clearInterval(j),e.isCheckingImgSize=!1,T("ImageHasSize",e),e.imgHidden&&(t.content&&t.content.removeClass("mfp-loading"),e.imgHidden=!1))},findImageSize:function(e){var n=0,i=e.img[0],o=function(r){j&&clearInterval(j),j=setInterval(function(){return i.naturalWidth>0?(t._onImageHasSize(e),void 0):(n>200&&clearInterval(j),n++,3===n?o(10):40===n?o(50):100===n&&o(500),void 0)},r)};o(1)},getImage:function(n,i){var o=0,r=function(){n&&(n.img[0].complete?(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("ready")),n.hasSize=!0,n.loaded=!0,T("ImageLoadComplete")):(o++,200>o?setTimeout(r,100):a()))},a=function(){n&&(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("error",s.tError.replace("%url%",n.src))),n.hasSize=!0,n.loaded=!0,n.loadError=!0)},s=t.st.image,l=i.find(".mfp-img");if(l.length){var c=document.createElement("img");c.className="mfp-img",n.img=e(c).on("load.mfploader",r).on("error.mfploader",a),c.src=n.src,l.is("img")&&(n.img=n.img.clone()),n.img[0].naturalWidth>0&&(n.hasSize=!0)}return t._parseMarkup(i,{title:N(n),img_replaceWith:n.img},n),t.resizeImage(),n.hasSize?(j&&clearInterval(j),n.loadError?(i.addClass("mfp-loading"),t.updateStatus("error",s.tError.replace("%url%",n.src))):(i.removeClass("mfp-loading"),t.updateStatus("ready")),i):(t.updateStatus("loading"),n.loading=!0,n.hasSize||(n.imgHidden=!0,i.addClass("mfp-loading"),t.findImageSize(n)),i)}}});var W,R=function(){return void 0===W&&(W=void 0!==document.createElement("p").style.MozTransform),W};e.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(e){return e.is("img")?e:e.find("img")}},proto:{initZoom:function(){var e,n=t.st.zoom,i=".zoom";if(n.enabled&&t.supportsTransition){var o,r,a=n.duration,s=function(e){var t=e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),i="all "+n.duration/1e3+"s "+n.easing,o={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},r="transition";return o["-webkit-"+r]=o["-moz-"+r]=o["-o-"+r]=o[r]=i,t.css(o),t},d=function(){t.content.css("visibility","visible")};x("BuildControls"+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.content.css("visibility","hidden"),e=t._getItemToZoom(),!e)return d(),void 0;r=s(e),r.css(t._getOffset()),t.wrap.append(r),o=setTimeout(function(){r.css(t._getOffset(!0)),o=setTimeout(function(){d(),setTimeout(function(){r.remove(),e=r=null,T("ZoomAnimationEnded")},16)},a)},16)}}),x(c+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.st.removalDelay=a,!e){if(e=t._getItemToZoom(),!e)return;r=s(e)}r.css(t._getOffset(!0)),t.wrap.append(r),t.content.css("visibility","hidden"),setTimeout(function(){r.css(t._getOffset())},16)}}),x(l+i,function(){t._allowZoom()&&(d(),r&&r.remove(),e=null)})}},_allowZoom:function(){return"image"===t.currItem.type},_getItemToZoom:function(){return t.currItem.hasSize?t.currItem.img:!1},_getOffset:function(n){var i;i=n?t.currItem.img:t.st.zoom.opener(t.currItem.el||t.currItem);var o=i.offset(),r=parseInt(i.css("padding-top"),10),a=parseInt(i.css("padding-bottom"),10);o.top-=e(window).scrollTop()-r;var s={width:i.width(),height:(b?i.innerHeight():i[0].offsetHeight)-a-r};return R()?s["-moz-transform"]=s.transform="translate("+o.left+"px,"+o.top+"px)":(s.left=o.left,s.top=o.top),s}}});var Z="iframe",q="//about:blank",D=function(e){if(t.currTemplate[Z]){var n=t.currTemplate[Z].find("iframe");n.length&&(e||(n[0].src=q),t.isIE8&&n.css("display",e?"block":"none"))}};e.magnificPopup.registerModule(Z,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){t.types.push(Z),x("BeforeChange",function(e,t,n){t!==n&&(t===Z?D():n===Z&&D(!0))}),x(l+"."+Z,function(){D()})},getIframe:function(n,i){var o=n.src,r=t.st.iframe;e.each(r.patterns,function(){return o.indexOf(this.index)>-1?(this.id&&(o="string"==typeof this.id?o.substr(o.lastIndexOf(this.id)+this.id.length,o.length):this.id.call(this,o)),o=this.src.replace("%id%",o),!1):void 0});var a={};return r.srcAction&&(a[r.srcAction]=o),t._parseMarkup(i,a,n),t.updateStatus("ready"),i}}});var K=function(e){var n=t.items.length;return e>n-1?e-n:0>e?n+e:e},Y=function(e,t,n){return e.replace(/%curr%/gi,t+1).replace(/%total%/gi,n)};e.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var n=t.st.gallery,i=".mfp-gallery",r=Boolean(e.fn.mfpFastClick);return t.direction=!0,n&&n.enabled?(a+=" mfp-gallery",x(f+i,function(){n.navigateByImgClick&&t.wrap.on("click"+i,".mfp-img",function(){return t.items.length>1?(t.next(),!1):void 0}),o.on("keydown"+i,function(e){37===e.keyCode?t.prev():39===e.keyCode&&t.next()})}),x("UpdateStatus"+i,function(e,n){n.text&&(n.text=Y(n.text,t.currItem.index,t.items.length))}),x(p+i,function(e,i,o,r){var a=t.items.length;o.counter=a>1?Y(n.tCounter,r.index,a):""}),x("BuildControls"+i,function(){if(t.items.length>1&&n.arrows&&!t.arrowLeft){var i=n.arrowMarkup,o=t.arrowLeft=e(i.replace(/%title%/gi,n.tPrev).replace(/%dir%/gi,"left")).addClass(y),a=t.arrowRight=e(i.replace(/%title%/gi,n.tNext).replace(/%dir%/gi,"right")).addClass(y),s=r?"mfpFastClick":"click";o[s](function(){t.prev()}),a[s](function(){t.next()}),t.isIE7&&(k("b",o[0],!1,!0),k("a",o[0],!1,!0),k("b",a[0],!1,!0),k("a",a[0],!1,!0)),t.container.append(o.add(a))}}),x(m+i,function(){t._preloadTimeout&&clearTimeout(t._preloadTimeout),t._preloadTimeout=setTimeout(function(){t.preloadNearbyImages(),t._preloadTimeout=null},16)}),x(l+i,function(){o.off(i),t.wrap.off("click"+i),t.arrowLeft&&r&&t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(),t.arrowRight=t.arrowLeft=null}),void 0):!1},next:function(){t.direction=!0,t.index=K(t.index+1),t.updateItemHTML()},prev:function(){t.direction=!1,t.index=K(t.index-1),t.updateItemHTML()},goTo:function(e){t.direction=e>=t.index,t.index=e,t.updateItemHTML()},preloadNearbyImages:function(){var e,n=t.st.gallery.preload,i=Math.min(n[0],t.items.length),o=Math.min(n[1],t.items.length);for(e=1;(t.direction?o:i)>=e;e++)t._preloadItem(t.index+e);for(e=1;(t.direction?i:o)>=e;e++)t._preloadItem(t.index-e)},_preloadItem:function(n){if(n=K(n),!t.items[n].preloaded){var i=t.items[n];i.parsed||(i=t.parseEl(n)),T("LazyLoad",i),"image"===i.type&&(i.img=e('<img class="mfp-img" />').on("load.mfploader",function(){i.hasSize=!0}).on("error.mfploader",function(){i.hasSize=!0,i.loadError=!0,T("LazyLoadError",i)}).attr("src",i.src)),i.preloaded=!0}}}});var U="retina";e.magnificPopup.registerModule(U,{options:{replaceSrc:function(e){return e.src.replace(/\.\w+$/,function(e){return"@2x"+e})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var e=t.st.retina,n=e.ratio;n=isNaN(n)?n():n,n>1&&(x("ImageHasSize."+U,function(e,t){t.img.css({"max-width":t.img[0].naturalWidth/n,width:"100%"})}),x("ElementParse."+U,function(t,i){i.src=e.replaceSrc(i,n)}))}}}}),function(){var t=1e3,n="ontouchstart"in window,i=function(){I.off("touchmove"+r+" touchend"+r)},o="mfpFastClick",r="."+o;e.fn.mfpFastClick=function(o){return e(this).each(function(){var a,s=e(this);if(n){var l,c,d,u,p,f;s.on("touchstart"+r,function(e){u=!1,f=1,p=e.originalEvent?e.originalEvent.touches[0]:e.touches[0],c=p.clientX,d=p.clientY,I.on("touchmove"+r,function(e){p=e.originalEvent?e.originalEvent.touches:e.touches,f=p.length,p=p[0],(Math.abs(p.clientX-c)>10||Math.abs(p.clientY-d)>10)&&(u=!0,i())}).on("touchend"+r,function(e){i(),u||f>1||(a=!0,e.preventDefault(),clearTimeout(l),l=setTimeout(function(){a=!1},t),o())})})}s.on("click"+r,function(){a||o()})})},e.fn.destroyMfpFastClick=function(){e(this).off("touchstart"+r+" click"+r),n&&I.off("touchmove"+r+" touchend"+r)}}(),_()})(window.jQuery||window.Zepto);
define("magnificPopup", function(){});

/*

Usage Example

// create new instance for popup
var popup = IEA.popup() // default configuraion
or
var popup = IEA.popup({type:inline}) // intialization with configuration

// open popup image
popup.open("http://path/to/image/jpg","image");

// open popup inline content
popup.open($('element'),'inline');

// open poup with IEA Model
var model = IEA.model([
      {
        src: 'path-to-image-1.jpg'
      },
      {
        src: 'http://vimeo.com/123123',
        type: 'iframe' // this overrides default type
      },
      {
        src: $('<div>Dynamically created element</div>'), // Dynamically created element
        type: 'inline'
      },
      {
        src: '<div>HTML string</div>',
        type: 'inline'
      },
      {
        src: '#my-popup', // CSS selector of an element on page that should be used as a popup
        type: 'inline'
      }
    ])
popup.open(model);

// close popup
popup.close();

//events
popup:open
popup:close
*/

define('popup',['underscore',
    'iea',
    'magnificPopup'
], function(_,
    iea,
    MagnificPopup) {
    'use strict';

    // get a new service method reference to Popup.
    IEA.service('popup', function(service, app, iea) {

        // new popup class defenition

        /**
         * Description
         * @method Popup
         * @return ThisExpression
         */
        var Popup = function() {
            return this;
        };

        // extend Popup defenition prototype
        _.extend(Popup.prototype, {

            /**
             * Description
             * @method initialize
             * @param {} options
             * @return ThisExpression
             */
            initialize: function(options) {

                var self = this,
                    defaults = {
                        type: 'inline',
                        mainClass: 'iea-popup',
                        closeOnBgClick: true,
                        closeBtnInside: true,
                        closeMarkup: '<button title="%title%" class="mfp-close"><i class="mfp-close-icn icon-close-light">&times;</i></button>',
                        showCloseBtn: true,
                        enableEscapeKey: true,
                        modal: false,
                        fixedContentPos: 'auto',
                        midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                        ajax: {
                            settings: null, // Ajax settings object that will extend default one - http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings
                            // For example:
                            // settings: {cache:false, async:false}

                            cursor: 'mfp-ajax-cur', // CSS class that will be added to body during the loading (adds "progress" cursor)
                        },
                        iframe: {
                            markup: '<div class="mfp-iframe-scaler">'+
                                    '<button class="mfp-close"><i class="mfp-close-icn icon-close-light"></i></button>'+
                                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                                    '<div class="mfp-title">Some caption</div>'+
                                    '</div>'
                        },
                        // you may add other options here, e.g.:
                        preloader: true,

                        callbacks: {
                            beforeOpen: function () {
                                self.triggerMethod('popup:beforeOpen', self.instance);
                            },
                            open: function() {
                                // Attaching close button event
                                $('.mfp-close', self.instance.container).click(function() {
                                    self.close();
                                });
                                self.triggerMethod('popup:open', self.instance);
                            },
                            close: function() {
                                self.triggerMethod('popup:close', self.instance);
                            },
                            lazyLoad: function(item) {
                                self.triggerMethod('popup:lazyload', item, self.instance);
                            },
                            change: function (item) {
                                self.triggerMethod('popup:change', item, self.instance);
                            },
                            resize: function (item) {
                                self.triggerMethod('popup:resize', item, self.instance);
                            },
                            beforeClose: function (item) {
                                self.triggerMethod('popup:beforeClose', item, self.instance);
                            },
                            afterClose: function (item) {
                                self.triggerMethod('popup:afterClose', item, self.instance);
                            },
                            buildControls: function() {
                                // re-appends controls inside the main container
                                if(self.options.type === 'gallery') {
                                    this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
                                }
                            },
                            markupParse: function(template, values, item) {
                                //values.title = item.el.attr('title');
                            }
                        }
                    };

                if(typeof options !== 'undefined' && typeof options.type !== 'undefined' && options.type === 'gallery') {
                    defaults = _.extend(defaults, {
                        gallery: {
                            enabled: true, // set to true to enable gallery
                            preload: [1, 2], // read about this option in next Lazy-loading section
                            navigateByImgClick: true,
                            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-prevent-close %dir%"><i class="icon-arrow-%dir% mfp-prevent-close"></i></button>', // markup of an arrow button
                            tPrev: 'Previous (Left arrow key)', // title for left button
                            tNext: 'Next (Right arrow key)', // title for right button
                            tCounter: '<span class="mfp-counter">%curr% of %total%</span>' // markup of counter
                        }
                    });
                }

                this.options = _.extend(defaults, options);
                this.instance = $.magnificPopup.instance;

                return this;
            },

            /**
             * Description
             * @method open
             * @param {} el
             * @param {} type
             * @param {} options
             * @return ThisExpression
             */
            open: function(el, type, options) {
                var index = 0;

                // close currently open popup
                if(typeof this.instance !== 'undefined' && this.instance.isOpen) {
                    $.magnificPopup.instance.close();
                }

                // setup configuration and open the popup
                if(typeof el !== 'undefined') {
                    if(!isNaN(parseInt(el))) {
                        index = el;
                    } else {
                        this._setPopupData(el, type, options);
                    }
                }

                $.magnificPopup.open(this.options, index);

                this.instance = $.magnificPopup.instance;

                return this;
            },

            /**
             * Description
             * @method next
             * @return
             */
            next: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    this.instance.next();
                }
            },

            /**
             * Description
             * @method prev
             * @return
             */
            prev: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    this.instance.prev();
                }
            },

            /**
             * Description
             * @method getCurrentItem
             * @return
             */
            getCurrentItem: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    return this.instance.currItem;
                }
            },

            /**
             * Description
             * @method getCurrentItemIndex
             * @return
             */
            getCurrentItemIndex: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    return this.instance.index;
                }
            },

            /**
             * Description
             * @method goTo
             * @param {} index
             * @return
             */
            goTo: function (index) {
                this.instance = $.magnificPopup.instance;
                if(!this.instance.isOpen) {
                    this.open(index);
                } else {
                    this.instance.goTo(index);
                }

            },

            /**
             * Description
             * @method close
             * @return ThisExpression
             */
            close: function() {
                this.instance = $.magnificPopup.instance;
                if(typeof this.instance !== 'undefined') {
                    this.instance.close();
                }

                return this;
            },


             /* ----------------------------------------------------------------------------- *\
                 Private Methods
             \* ----------------------------------------------------------------------------- */

             /**
             * description
             * @method _setPopupData
             * @param {} el
             * @param {} type
             * @param {} options
             * @return
             */
            _setPopupData: function(el, type, options) {

                if (typeof type === 'undefined') {
                    type = 'inline';
                }

                if (_.isArray(el)) {
                    _.extend(this.options, {
                        items: el,
                        gallery: {
                            enabled: true
                        }
                    });

                } else if (el instanceof IEA.Model || el instanceof IEA.Collection) {
                    _.extend(this.options, {
                        items: el.toJSON(),
                        gallery: {
                            enabled: true
                        }
                    });

                } else if (el instanceof IEA.View) {
                    _.extend(this.options, {
                        items: {
                            src: el.render().$el,
                            type: type
                        }
                    });
                } else if (type === 'inline') {
                    _.extend(this.options, {
                        items: {
                            src: el,
                            type: type
                        }
                    });
                } else if (type === 'image') {
                    _.extend(this.options, {
                        items: {
                            src: el,
                            type: type
                        }
                    });
                }

                this.options = _.extend(this.options, options);
            }
        });

        return Popup;
    });
});

// Backbone.Validation v0.9.1
//
// Copyright (c) 2011-2014 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license available at:
// http://thedersen.com/projects/backbone-validation
(function (factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('backbone'), require('underscore'));
  } else if (typeof define === 'function' && define.amd) {
    define('validation',['backbone', 'underscore'], factory);
  }
}(function (Backbone, _) {
  Backbone.Validation = (function(_){
    'use strict';

    // Default options
    // ---------------

    var defaultOptions = {
      forceUpdate: false,
      selector: 'name',
      labelFormatter: 'sentenceCase',
      valid: Function.prototype,
      invalid: Function.prototype
    };


    // Helper functions
    // ----------------

    // Formatting functions used for formatting error messages
    var formatFunctions = {
      // Uses the configured label formatter to format the attribute name
      // to make it more readable for the user
      formatLabel: function(attrName, model) {
        return defaultLabelFormatters[defaultOptions.labelFormatter](attrName, model);
      },

      // Replaces nummeric placeholders like {0} in a string with arguments
      // passed to the function
      format: function() {
        var args = Array.prototype.slice.call(arguments),
            text = args.shift();
        return text.replace(/\{(\d+)\}/g, function(match, number) {
          return typeof args[number] !== 'undefined' ? args[number] : match;
        });
      }
    };

    // Flattens an object
    // eg:
    //
    //     var o = {
    //       address: {
    //         street: 'Street',
    //         zip: 1234
    //       }
    //     };
    //
    // becomes:
    //
    //     var o = {
    //       'address.street': 'Street',
    //       'address.zip': 1234
    //     };
    var flatten = function (obj, into, prefix) {
      into = into || {};
      prefix = prefix || '';

      _.each(obj, function(val, key) {
        if(obj.hasOwnProperty(key)) {
          if (val && typeof val === 'object' && !(
            val instanceof Array ||
            val instanceof Date ||
            val instanceof RegExp ||
            val instanceof Backbone.Model ||
            val instanceof Backbone.Collection)
          ) {
            flatten(val, into, prefix + key + '.');
          }
          else {
            into[prefix + key] = val;
          }
        }
      });

      return into;
    };

    // Validation
    // ----------

    var Validation = (function(){

      // Returns an object with undefined properties for all
      // attributes on the model that has defined one or more
      // validation rules.
      var getValidatedAttrs = function(model) {
        return _.reduce(_.keys(_.result(model, 'validation') || {}), function(memo, key) {
          memo[key] = void 0;
          return memo;
        }, {});
      };

      // Looks on the model for validations for a specified
      // attribute. Returns an array of any validators defined,
      // or an empty array if none is defined.
      var getValidators = function(model, attr) {
        var attrValidationSet = model.validation ? _.result(model, 'validation')[attr] || {} : {};

        // If the validator is a function or a string, wrap it in a function validator
        if (_.isFunction(attrValidationSet) || _.isString(attrValidationSet)) {
          attrValidationSet = {
            fn: attrValidationSet
          };
        }

        // Stick the validator object into an array
        if(!_.isArray(attrValidationSet)) {
          attrValidationSet = [attrValidationSet];
        }

        // Reduces the array of validators into a new array with objects
        // with a validation method to call, the value to validate against
        // and the specified error message, if any
        return _.reduce(attrValidationSet, function(memo, attrValidation) {
          _.each(_.without(_.keys(attrValidation), 'msg'), function(validator) {
            memo.push({
              fn: defaultValidators[validator],
              val: attrValidation[validator],
              msg: attrValidation.msg
            });
          });
          return memo;
        }, []);
      };

      // Validates an attribute against all validators defined
      // for that attribute. If one or more errors are found,
      // the first error message is returned.
      // If the attribute is valid, an empty string is returned.
      var validateAttr = function(model, attr, value, computed) {
        // Reduces the array of validators to an error message by
        // applying all the validators and returning the first error
        // message, if any.
        return _.reduce(getValidators(model, attr), function(memo, validator){
          // Pass the format functions plus the default
          // validators as the context to the validator
          var ctx = _.extend({}, formatFunctions, defaultValidators),
              result = validator.fn.call(ctx, value, attr, validator.val, model, computed);

          if(result === false || memo === false) {
            return false;
          }
          if (result && !memo) {
            return _.result(validator, 'msg') || result;
          }
          return memo;
        }, '');
      };

      // Loops through the model's attributes and validates them all.
      // Returns and object containing names of invalid attributes
      // as well as error messages.
      var validateModel = function(model, attrs) {
        var error,
            invalidAttrs = {},
            isValid = true,
            computed = _.clone(attrs),
            flattened = flatten(attrs);

        _.each(flattened, function(val, attr) {
          error = validateAttr(model, attr, val, computed);
          if (error) {
            invalidAttrs[attr] = error;
            isValid = false;
          }
        });

        return {
          invalidAttrs: invalidAttrs,
          isValid: isValid
        };
      };

      // Contains the methods that are mixed in on the model when binding
      var mixin = function(view, options) {
        return {

          // Check whether or not a value, or a hash of values
          // passes validation without updating the model
          preValidate: function(attr, value) {
            var self = this,
                result = {},
                error;

            if(_.isObject(attr)){
              _.each(attr, function(value, key) {
                error = self.preValidate(key, value);
                if(error){
                  result[key] = error;
                }
              });

              return _.isEmpty(result) ? undefined : result;
            }
            else {
              return validateAttr(this, attr, value, _.extend({}, this.attributes));
            }
          },

          // Check to see if an attribute, an array of attributes or the
          // entire model is valid. Passing true will force a validation
          // of the model.
          isValid: function(option) {
            var flattened = flatten(this.attributes);

            if(_.isString(option)){
              return !validateAttr(this, option, flattened[option], _.extend({}, this.attributes));
            }
            if(_.isArray(option)){
              return _.reduce(option, function(memo, attr) {
                return memo && !validateAttr(this, attr, flattened[attr], _.extend({}, this.attributes));
              }, true, this);
            }
            if(option === true) {
              this.validate();
            }
            return this.validation ? this._isValid : true;
          },

          // This is called by Backbone when it needs to perform validation.
          // You can call it manually without any parameters to validate the
          // entire model.
          validate: function(attrs, setOptions){
            var model = this,
                validateAll = !attrs,
                opt = _.extend({}, options, setOptions),
                validatedAttrs = getValidatedAttrs(model),
                allAttrs = _.extend({}, validatedAttrs, model.attributes, attrs),
                changedAttrs = flatten(attrs || allAttrs),

                result = validateModel(model, allAttrs);

            model._isValid = result.isValid;

            // After validation is performed, loop through all validated attributes
            // and call the valid callbacks so the view is updated.
            _.each(validatedAttrs, function(val, attr){
              var invalid = result.invalidAttrs.hasOwnProperty(attr);
              if(!invalid){
                opt.valid(view, attr, opt.selector);
              }
            });

            // After validation is performed, loop through all validated and changed attributes
            // and call the invalid callback so the view is updated.
            _.each(validatedAttrs, function(val, attr){
              var invalid = result.invalidAttrs.hasOwnProperty(attr),
                  changed = changedAttrs.hasOwnProperty(attr);

              if(invalid && (changed || validateAll)){
                opt.invalid(view, attr, result.invalidAttrs[attr], opt.selector);
              }
            });

            // Trigger validated events.
            // Need to defer this so the model is actually updated before
            // the event is triggered.
            _.defer(function() {
              model.trigger('validated', model._isValid, model, result.invalidAttrs);
              model.trigger('validated:' + (model._isValid ? 'valid' : 'invalid'), model, result.invalidAttrs);
            });

            // Return any error messages to Backbone, unless the forceUpdate flag is set.
            // Then we do not return anything and fools Backbone to believe the validation was
            // a success. That way Backbone will update the model regardless.
            if (!opt.forceUpdate && _.intersection(_.keys(result.invalidAttrs), _.keys(changedAttrs)).length > 0) {
              return result.invalidAttrs;
            }
          }
        };
      };

      // Helper to mix in validation on a model
      var bindModel = function(view, model, options) {
        _.extend(model, mixin(view, options));
      };

      // Removes the methods added to a model
      var unbindModel = function(model) {
        delete model.validate;
        delete model.preValidate;
        delete model.isValid;
      };

      // Mix in validation on a model whenever a model is
      // added to a collection
      var collectionAdd = function(model) {
        bindModel(this.view, model, this.options);
      };

      // Remove validation from a model whenever a model is
      // removed from a collection
      var collectionRemove = function(model) {
        unbindModel(model);
      };

      // Returns the public methods on Backbone.Validation
      return {

        // Current version of the library
        version: '0.9.1',

        // Called to configure the default options
        configure: function(options) {
          _.extend(defaultOptions, options);
        },

        // Hooks up validation on a view with a model
        // or collection
        bind: function(view, options) {
          options = _.extend({}, defaultOptions, defaultCallbacks, options);

          var model = options.model || view.model,
              collection = options.collection || view.collection;

          if(typeof model === 'undefined' && typeof collection === 'undefined'){
            throw 'Before you execute the binding your view must have a model or a collection.\n' +
                  'See http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.';
          }

          if(model) {
            bindModel(view, model, options);
          }
          else if(collection) {
            collection.each(function(model){
              bindModel(view, model, options);
            });
            collection.bind('add', collectionAdd, {view: view, options: options});
            collection.bind('remove', collectionRemove);
          }
        },

        // Removes validation from a view with a model
        // or collection
        unbind: function(view, options) {
          options = _.extend({}, options);
          var model = options.model || view.model,
              collection = options.collection || view.collection;

          if(model) {
            unbindModel(model);
          }
          else if(collection) {
            collection.each(function(model){
              unbindModel(model);
            });
            collection.unbind('add', collectionAdd);
            collection.unbind('remove', collectionRemove);
          }
        },

        // Used to extend the Backbone.Model.prototype
        // with validation
        mixin: mixin(null, defaultOptions)
      };
    }());


    // Callbacks
    // ---------

    var defaultCallbacks = Validation.callbacks = {

      // Gets called when a previously invalid field in the
      // view becomes valid. Removes any error message.
      // Should be overridden with custom functionality.
      valid: function(view, attr, selector) {
        view.$('[' + selector + '~="' + attr + '"]')
            .removeClass('invalid')
            .removeAttr('data-error');
      },

      // Gets called when a field in the view becomes invalid.
      // Adds a error message.
      // Should be overridden with custom functionality.
      invalid: function(view, attr, error, selector) {
        view.$('[' + selector + '~="' + attr + '"]')
            .addClass('invalid')
            .attr('data-error', error);
      }
    };


    // Patterns
    // --------

    var defaultPatterns = Validation.patterns = {
      // Matches any digit(s) (i.e. 0-9)
      digits: /^\d+$/,

      // Matches any number (e.g. 100.000)
      number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

      // Matches a valid email address (e.g. mail@example.com)
      email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

      // Mathes any valid url (e.g. http://www.xample.com)
      url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    };


    // Error messages
    // --------------

    // Error message for the build in validators.
    // {x} gets swapped out with arguments form the validator.
    var defaultMessages = Validation.messages = {
      required: '{0} is required',
      acceptance: '{0} must be accepted',
      min: '{0} must be greater than or equal to {1}',
      max: '{0} must be less than or equal to {1}',
      range: '{0} must be between {1} and {2}',
      length: '{0} must be {1} characters',
      minLength: '{0} must be at least {1} characters',
      maxLength: '{0} must be at most {1} characters',
      rangeLength: '{0} must be between {1} and {2} characters',
      oneOf: '{0} must be one of: {1}',
      equalTo: '{0} must be the same as {1}',
      digits: '{0} must only contain digits',
      number: '{0} must be a number',
      email: '{0} must be a valid email',
      url: '{0} must be a valid url',
      inlinePattern: '{0} is invalid'
    };

    // Label formatters
    // ----------------

    // Label formatters are used to convert the attribute name
    // to a more human friendly label when using the built in
    // error messages.
    // Configure which one to use with a call to
    //
    //     Backbone.Validation.configure({
    //       labelFormatter: 'label'
    //     });
    var defaultLabelFormatters = Validation.labelFormatters = {

      // Returns the attribute name with applying any formatting
      none: function(attrName) {
        return attrName;
      },

      // Converts attributeName or attribute_name to Attribute name
      sentenceCase: function(attrName) {
        return attrName.replace(/(?:^\w|[A-Z]|\b\w)/g, function(match, index) {
          return index === 0 ? match.toUpperCase() : ' ' + match.toLowerCase();
        }).replace(/_/g, ' ');
      },

      // Looks for a label configured on the model and returns it
      //
      //      var Model = Backbone.Model.extend({
      //        validation: {
      //          someAttribute: {
      //            required: true
      //          }
      //        },
      //
      //        labels: {
      //          someAttribute: 'Custom label'
      //        }
      //      });
      label: function(attrName, model) {
        return (model.labels && model.labels[attrName]) || defaultLabelFormatters.sentenceCase(attrName, model);
      }
    };


    // Built in validators
    // -------------------

    var defaultValidators = Validation.validators = (function(){
      // Use native trim when defined
      var trim = String.prototype.trim ?
        function(text) {
          return text === null ? '' : String.prototype.trim.call(text);
        } :
        function(text) {
          var trimLeft = /^\s+/,
              trimRight = /\s+$/;

          return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
        };

      // Determines whether or not a value is a number
      var isNumber = function(value){
        return _.isNumber(value) || (_.isString(value) && value.match(defaultPatterns.number));
      };

      // Determines whether or not a value is empty
      var hasValue = function(value) {
        return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && trim(value) === '') || (_.isArray(value) && _.isEmpty(value)));
      };

      return {
        // Function validator
        // Lets you implement a custom function used for validation
        fn: function(value, attr, fn, model, computed) {
          if(_.isString(fn)){
            fn = model[fn];
          }
          return fn.call(model, value, attr, computed);
        },

        // Required validator
        // Validates if the attribute is required or not
        // This can be specified as either a boolean value or a function that returns a boolean value
        required: function(value, attr, required, model, computed) {
          var isRequired = _.isFunction(required) ? required.call(model, value, attr, computed) : required;
          if(!isRequired && !hasValue(value)) {
            return false; // overrides all other validators
          }
          if (isRequired && !hasValue(value)) {
            return this.format(defaultMessages.required, this.formatLabel(attr, model));
          }
        },

        // Acceptance validator
        // Validates that something has to be accepted, e.g. terms of use
        // `true` or 'true' are valid
        acceptance: function(value, attr, accept, model) {
          if(value !== 'true' && (!_.isBoolean(value) || value === false)) {
            return this.format(defaultMessages.acceptance, this.formatLabel(attr, model));
          }
        },

        // Min validator
        // Validates that the value has to be a number and equal to or greater than
        // the min value specified
        min: function(value, attr, minValue, model) {
          if (!isNumber(value) || value < minValue) {
            return this.format(defaultMessages.min, this.formatLabel(attr, model), minValue);
          }
        },

        // Max validator
        // Validates that the value has to be a number and equal to or less than
        // the max value specified
        max: function(value, attr, maxValue, model) {
          if (!isNumber(value) || value > maxValue) {
            return this.format(defaultMessages.max, this.formatLabel(attr, model), maxValue);
          }
        },

        // Range validator
        // Validates that the value has to be a number and equal to or between
        // the two numbers specified
        range: function(value, attr, range, model) {
          if(!isNumber(value) || value < range[0] || value > range[1]) {
            return this.format(defaultMessages.range, this.formatLabel(attr, model), range[0], range[1]);
          }
        },

        // Length validator
        // Validates that the value has to be a string with length equal to
        // the length value specified
        length: function(value, attr, length, model) {
          if (!_.isString(value) || value.length !== length) {
            return this.format(defaultMessages.length, this.formatLabel(attr, model), length);
          }
        },

        // Min length validator
        // Validates that the value has to be a string with length equal to or greater than
        // the min length value specified
        minLength: function(value, attr, minLength, model) {
          if (!_.isString(value) || value.length < minLength) {
            return this.format(defaultMessages.minLength, this.formatLabel(attr, model), minLength);
          }
        },

        // Max length validator
        // Validates that the value has to be a string with length equal to or less than
        // the max length value specified
        maxLength: function(value, attr, maxLength, model) {
          if (!_.isString(value) || value.length > maxLength) {
            return this.format(defaultMessages.maxLength, this.formatLabel(attr, model), maxLength);
          }
        },

        // Range length validator
        // Validates that the value has to be a string and equal to or between
        // the two numbers specified
        rangeLength: function(value, attr, range, model) {
          if (!_.isString(value) || value.length < range[0] || value.length > range[1]) {
            return this.format(defaultMessages.rangeLength, this.formatLabel(attr, model), range[0], range[1]);
          }
        },

        // One of validator
        // Validates that the value has to be equal to one of the elements in
        // the specified array. Case sensitive matching
        oneOf: function(value, attr, values, model) {
          if(!_.include(values, value)){
            return this.format(defaultMessages.oneOf, this.formatLabel(attr, model), values.join(', '));
          }
        },

        // Equal to validator
        // Validates that the value has to be equal to the value of the attribute
        // with the name specified
        equalTo: function(value, attr, equalTo, model, computed) {
          if(value !== computed[equalTo]) {
            return this.format(defaultMessages.equalTo, this.formatLabel(attr, model), this.formatLabel(equalTo, model));
          }
        },

        // Pattern validator
        // Validates that the value has to match the pattern specified.
        // Can be a regular expression or the name of one of the built in patterns
        pattern: function(value, attr, pattern, model) {
          if (!hasValue(value) || !value.toString().match(defaultPatterns[pattern] || pattern)) {
            return this.format(defaultMessages[pattern] || defaultMessages.inlinePattern, this.formatLabel(attr, model), pattern);
          }
        }
      };
    }());

    // Set the correct context for all validators
    // when used from within a method validator
    _.each(defaultValidators, function(validator, key){
      defaultValidators[key] = _.bind(defaultValidators[key], _.extend({}, formatFunctions, defaultValidators));
    });

    return Validation;
  }(_));
  return Backbone.Validation;
}));

/*jshint bitwise:false */

define('validator',[
    'iea',
    'validation',
], function(
    IEA,
    Validation
) {
    'use strict';

    var Validator = IEA.module('form.validator', function(module, app, iea) {

        // Validate the card number based on prefix (IIN ranges) and length
        var cards = {
            AMERICAN_EXPRESS: {
                length: [15],
                prefix: ['34', '37']
            },
            DINERS_CLUB: {
                length: [14],
                prefix: ['300', '301', '302', '303', '304', '305', '36']
            },
            DINERS_CLUB_US: {
                length: [16],
                prefix: ['54', '55']
            },
            DISCOVER: {
                length: [16],
                prefix: ['6011', '622126', '622127', '622128', '622129', '62213',
                    '62214', '62215', '62216', '62217', '62218', '62219',
                    '6222', '6223', '6224', '6225', '6226', '6227', '6228',
                    '62290', '62291', '622920', '622921', '622922', '622923',
                    '622924', '622925', '644', '645', '646', '647', '648',
                    '649', '65'
                ]
            },
            JCB: {
                length: [16],
                prefix: ['3528', '3529', '353', '354', '355', '356', '357', '358']
            },
            LASER: {
                length: [16, 17, 18, 19],
                prefix: ['6304', '6706', '6771', '6709']
            },
            MAESTRO: {
                length: [12, 13, 14, 15, 16, 17, 18, 19],
                prefix: ['5018', '5020', '5038', '6304', '6759', '6761', '6762', '6763', '6764', '6765', '6766']
            },
            MASTERCARD: {
                length: [16],
                prefix: ['51', '52', '53', '54', '55']
            },
            SOLO: {
                length: [16, 18, 19],
                prefix: ['6334', '6767']
            },
            UNIONPAY: {
                length: [16, 17, 18, 19],
                prefix: ['622126', '622127', '622128', '622129', '62213', '62214',
                    '62215', '62216', '62217', '62218', '62219', '6222', '6223',
                    '6224', '6225', '6226', '6227', '6228', '62290', '62291',
                    '622920', '622921', '622922', '622923', '622924', '622925'
                ]
            },
            VISA: {
                length: [16],
                prefix: ['4']
            }
        };

        _.extend(this, Backbone.Validation);

        Backbone.Validation.configure({
            selector: 'form-validate'
        });

        Backbone.Validation.helpers = {
            /**
             * Execute a callback function
             *
             * @param {String|Function} functionName Can be
             * - name of global function
             * - name of namespace function (such as A.B.C)
             * - a function
             * @param {Array} args The callback arguments
             */
            call: function(functionName, args) {
                if ('function' === typeof functionName) {
                    return functionName.apply(this, args);
                } else if ('string' === typeof functionName) {
                    if ('()' === functionName.substring(functionName.length - 2)) {
                        functionName = functionName.substring(0, functionName.length - 2);
                    }
                    var ns = functionName.split('.'),
                        func = ns.pop(),
                        context = window;
                    for (var i = 0; i < ns.length; i++) {
                        context = context[ns[i]];
                    }

                    return (typeof context[func] === 'undefined') ? null : context[func].apply(this, args);
                }
            },

            /**
             * Format a string
             * It's used to format the error message
             * format('The field must between %s and %s', [10, 20]) = 'The field must between 10 and 20'
             *
             * @param {String} message
             * @param {Array} parameters
             * @returns {String}
             */
            format: function(message, parameters) {
                if (!$.isArray(parameters)) {
                    parameters = [parameters];
                }

                for (var i in parameters) {
                    message = message.replace('%s', parameters[i]);
                }

                return message;
            },

            /**
             * Validate a date
             *
             * @param {Number} year The full year in 4 digits
             * @param {Number} month The month number
             * @param {Number} day The day number
             * @param {Boolean} [notInFuture] If true, the date must not be in the future
             * @returns {Boolean}
             */
            date: function(year, month, day, notInFuture) {
                if (isNaN(year) || isNaN(month) || isNaN(day)) {
                    return false;
                }
                if (day.length > 2 || month.length > 2 || year.length > 4) {
                    return false;
                }

                day = parseInt(day, 10);
                month = parseInt(month, 10);
                year = parseInt(year, 10);

                if (year < 1000 || year > 9999 || month <= 0 || month > 12) {
                    return false;
                }
                var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                // Update the number of days in Feb of leap year
                if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                    numDays[1] = 29;
                }

                // Check the day
                if (day <= 0 || day > numDays[month - 1]) {
                    return false;
                }

                if (notInFuture === true) {
                    var currentDate = new Date(),
                        currentYear = currentDate.getFullYear(),
                        currentMonth = currentDate.getMonth(),
                        currentDay = currentDate.getDate();
                    return (year < currentYear || (year === currentYear && month - 1 < currentMonth) || (year === currentYear && month - 1 === currentMonth && day < currentDay));
                }

                return true;
            },

            /**
             * Implement Luhn validation algorithm
             * Credit to https://gist.github.com/ShirtlessKirk/2134376
             *
             * @see http://en.wikipedia.org/wiki/Luhn
             * @param {String} value
             * @returns {Boolean}
             */
            luhn: function(value) {
                var length = value.length,
                    mul = 0,
                    prodArr = [
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
                    ],
                    sum = 0;

                while (length--) {
                    sum += prodArr[mul][parseInt(value.charAt(length), 10)];
                    mul ^= 1;
                }

                return (sum % 10 === 0 && sum > 0);
            },

            /**
             * Implement modulus 11, 10 (ISO 7064) algorithm
             *
             * @param {String} value
             * @returns {Boolean}
             */
            mod11And10: function(value) {
                var check = 5,
                    length = value.length;
                for (var i = 0; i < length; i++) {
                    check = (((check || 10) * 2) % 11 + parseInt(value.charAt(i), 10)) % 10;
                }
                return (check === 1);
            },

            /**
             * Implements Mod 37, 36 (ISO 7064) algorithm
             * Usages:
             * mod37And36('A12425GABC1234002M')
             * mod37And36('002006673085', '0123456789')
             *
             * @param {String} value
             * @param {String} [alphabet]
             * @returns {Boolean}
             */
            mod37And36: function(value, alphabet) {
                alphabet = alphabet || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var modulus = alphabet.length,
                    length = value.length,
                    check = Math.floor(modulus / 2);
                for (var i = 0; i < length; i++) {
                    check = (((check || modulus) * 2) % (modulus + 1) + alphabet.indexOf(value.charAt(i))) % modulus;
                }
                return (check === 1);
            }
        };

        // Extend the callbacks to work with Bootstrap, as used in this example
        // See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
        _.extend(Backbone.Validation.callbacks, {
            valid: function(view, attr, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');
                if($group.children('.multivalue').length > 0) {
                    var $parent = $('input[name='+attr+']').parents('.multivalue-field');
                    $parent.removeClass('has-error');
                    $parent.find('.help-block').html('').addClass('hidden');
                } else {
                    $group.removeClass('has-error');
                    $group.find('.help-block').html('').addClass('hidden');
                }
            },

            invalid: function(view, attr, error, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');

                if($group.children('.multivalue').length > 0) {
                    var $parent = $('input[name='+attr+']').parents('.multivalue-field');
                    $parent.addClass('has-error');
                    $parent.find('.help-block').html(error).removeClass('hidden');
                } else {
                    $group.addClass('has-error');
                    $group.find('.help-block').html(error).removeClass('hidden');
                }


            }
        });

        // add custom validators
        _.extend(Backbone.Validation.validators, {
            required: function(value, attr, required, model, computed) {

                var isCheckbox = $('[name=' + attr + ']:checkbox', model.$el);
                var isRequired = _.isFunction(required) ? required.call(model, value, attr, computed) : required;

                if (!isRequired && !value) {
                    return false;
                }

                if (isCheckbox.length && !isCheckbox.filter(':checked').length) {
                    return true;
                }

                if (isRequired && !value) {
                    return true;
                }
            },

            cvv: function(value, attr, options, model, computed) {

                if (value === '') {
                    return true;
                }

                if (!Backbone.Validation.patterns.cvv.test(value)) {
                    return true;
                }
            },

            xss: function(value, attr, options, model, computed) {

                if (Backbone.Validation.patterns.xss.test(value)) {
                    return true;
                }
            },

            creditcard: function(value, attr, options, model, computed) {
                var type, i;

                if (value === '') {
                    return true;
                }

                // Accept only digits, dashes or spaces
                if (/[^0-9-\s]+/.test(value)) {
                    return true; //error
                }

            //    value = value.replace(/\D/g, '');

                if (!Backbone.Validation.helpers.luhn(value)) {
                    return true; // error
                }

                for (type in cards) {
                    for (i in cards[type].prefix) {
                        if (value.substr(0, cards[type].prefix[i].length) === cards[type].prefix[i] && $.inArray(value.length, cards[type].length) !== -1) // and length
                        {
                            return false; // valid card
                        }
                    }
                }

                return true; //its an invalid card
            },
        });

        // application level patterns for validation added
        _.extend(Backbone.Validation.patterns, {
            cvv: /^[0-9]{3,4}$/,
            xss: /<[^<]+?>/
        });

        /* ----------------------------------------------------------------------------- *\
           Public Methods
        \* ----------------------------------------------------------------------------- */

        this.addRules = function(view, validation) {
            var model = validation.model || view.model;

            if (typeof model !== 'undefined') {

                // if the model does not have a validation object, then add it and then add the rules
                // otherwise just keep on adding new rules into the validation object.
                if (typeof model.validation === 'undefined') {
                    _.extend(model, {
                        validation: validation.rules
                    });
                } else {
                    _.extend(model.validation, validation.rules);
                }
            }
        };

        this.addValidation = function(view, options) {
            Backbone.Validation.bind(view, options);
        };

        this.removeValidation = function(view, options) {
            Backbone.Validation.bind(view, options);
        };

    });

    return Validator;
});

/* Tooltipster v3.2.6 */;(function(e,t,n){function s(t,n){this.bodyOverflowX;this.callbacks={hide:[],show:[]};this.checkInterval=null;this.Content;this.$el=e(t);this.$elProxy;this.elProxyPosition;this.enabled=true;this.options=e.extend({},i,n);this.mouseIsOverProxy=false;this.namespace="tooltipster-"+Math.round(Math.random()*1e5);this.Status="hidden";this.timerHide=null;this.timerShow=null;this.$tooltip;this.options.iconTheme=this.options.iconTheme.replace(".","");this.options.theme=this.options.theme.replace(".","");this._init()}function o(t,n){var r=true;e.each(t,function(e,i){if(typeof n[e]==="undefined"||t[e]!==n[e]){r=false;return false}});return r}function f(){return!a&&u}function l(){var e=n.body||n.documentElement,t=e.style,r="transition";if(typeof t[r]=="string"){return true}v=["Moz","Webkit","Khtml","O","ms"],r=r.charAt(0).toUpperCase()+r.substr(1);for(var i=0;i<v.length;i++){if(typeof t[v[i]+r]=="string"){return true}}return false}var r="tooltipster",i={animation:"fade",arrow:true,arrowColor:"",autoClose:true,content:null,contentAsHTML:false,contentCloning:true,debug:true,delay:200,minWidth:0,maxWidth:null,functionInit:function(e,t){},functionBefore:function(e,t){t()},functionReady:function(e,t){},functionAfter:function(e){},icon:"(?)",iconCloning:true,iconDesktop:false,iconTouch:false,iconTheme:"tooltipster-icon",interactive:false,interactiveTolerance:350,multiple:false,offsetX:0,offsetY:0,onlyOne:false,position:"top",positionTracker:false,speed:350,timer:0,theme:"tooltipster-default",touchDevices:true,trigger:"hover",updateAnimation:true};s.prototype={_init:function(){var t=this;if(n.querySelector){if(t.options.content!==null){t._content_set(t.options.content)}else{var r=t.$el.attr("title");if(typeof r==="undefined")r=null;t._content_set(r)}var i=t.options.functionInit.call(t.$el,t.$el,t.Content);if(typeof i!=="undefined")t._content_set(i);t.$el.removeAttr("title").addClass("tooltipstered");if(!u&&t.options.iconDesktop||u&&t.options.iconTouch){if(typeof t.options.icon==="string"){t.$elProxy=e('<span class="'+t.options.iconTheme+'"></span>');t.$elProxy.text(t.options.icon)}else{if(t.options.iconCloning)t.$elProxy=t.options.icon.clone(true);else t.$elProxy=t.options.icon}t.$elProxy.insertAfter(t.$el)}else{t.$elProxy=t.$el}if(t.options.trigger=="hover"){t.$elProxy.on("mouseenter."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=true;t._show()}}).on("mouseleave."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=false}});if(u&&t.options.touchDevices){t.$elProxy.on("touchstart."+t.namespace,function(){t._showNow()})}}else if(t.options.trigger=="click"){t.$elProxy.on("click."+t.namespace,function(){if(!f()||t.options.touchDevices){t._show()}})}}},_show:function(){var e=this;if(e.Status!="shown"&&e.Status!="appearing"){if(e.options.delay){e.timerShow=setTimeout(function(){if(e.options.trigger=="click"||e.options.trigger=="hover"&&e.mouseIsOverProxy){e._showNow()}},e.options.delay)}else e._showNow()}},_showNow:function(n){var r=this;r.options.functionBefore.call(r.$el,r.$el,function(){if(r.enabled&&r.Content!==null){if(n)r.callbacks.show.push(n);r.callbacks.hide=[];clearTimeout(r.timerShow);r.timerShow=null;clearTimeout(r.timerHide);r.timerHide=null;if(r.options.onlyOne){e(".tooltipstered").not(r.$el).each(function(t,n){var r=e(n),i=r.data("tooltipster-ns");e.each(i,function(e,t){var n=r.data(t),i=n.status(),s=n.option("autoClose");if(i!=="hidden"&&i!=="disappearing"&&s){n.hide()}})})}var i=function(){r.Status="shown";e.each(r.callbacks.show,function(e,t){t.call(r.$el)});r.callbacks.show=[]};if(r.Status!=="hidden"){var s=0;if(r.Status==="disappearing"){r.Status="appearing";if(l()){r.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-"+r.options.animation+"-show");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(i)}else{r.$tooltip.stop().fadeIn(i)}}else if(r.Status==="shown"){i()}}else{r.Status="appearing";var s=r.options.speed;r.bodyOverflowX=e("body").css("overflow-x");e("body").css("overflow-x","hidden");var o="tooltipster-"+r.options.animation,a="-webkit-transition-duration: "+r.options.speed+"ms; -webkit-animation-duration: "+r.options.speed+"ms; -moz-transition-duration: "+r.options.speed+"ms; -moz-animation-duration: "+r.options.speed+"ms; -o-transition-duration: "+r.options.speed+"ms; -o-animation-duration: "+r.options.speed+"ms; -ms-transition-duration: "+r.options.speed+"ms; -ms-animation-duration: "+r.options.speed+"ms; transition-duration: "+r.options.speed+"ms; animation-duration: "+r.options.speed+"ms;",f=r.options.minWidth?"min-width:"+Math.round(r.options.minWidth)+"px;":"",c=r.options.maxWidth?"max-width:"+Math.round(r.options.maxWidth)+"px;":"",h=r.options.interactive?"pointer-events: auto;":"";r.$tooltip=e('<div class="tooltipster-base '+r.options.theme+'" style="'+f+" "+c+" "+h+" "+a+'"><div class="tooltipster-content"></div></div>');if(l())r.$tooltip.addClass(o);r._content_insert();r.$tooltip.appendTo("body");r.reposition();r.options.functionReady.call(r.$el,r.$el,r.$tooltip);if(l()){r.$tooltip.addClass(o+"-show");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(i)}else{r.$tooltip.css("display","none").fadeIn(r.options.speed,i)}r._interval_set();e(t).on("scroll."+r.namespace+" resize."+r.namespace,function(){r.reposition()});if(r.options.autoClose){e("body").off("."+r.namespace);if(r.options.trigger=="hover"){if(u){setTimeout(function(){e("body").on("touchstart."+r.namespace,function(){r.hide()})},0)}if(r.options.interactive){if(u){r.$tooltip.on("touchstart."+r.namespace,function(e){e.stopPropagation()})}var p=null;r.$elProxy.add(r.$tooltip).on("mouseleave."+r.namespace+"-autoClose",function(){clearTimeout(p);p=setTimeout(function(){r.hide()},r.options.interactiveTolerance)}).on("mouseenter."+r.namespace+"-autoClose",function(){clearTimeout(p)})}else{r.$elProxy.on("mouseleave."+r.namespace+"-autoClose",function(){r.hide()})}}else if(r.options.trigger=="click"){setTimeout(function(){e("body").on("click."+r.namespace+" touchstart."+r.namespace,function(){r.hide()})},0);if(r.options.interactive){r.$tooltip.on("click."+r.namespace+" touchstart."+r.namespace,function(e){e.stopPropagation()})}}}}if(r.options.timer>0){r.timerHide=setTimeout(function(){r.timerHide=null;r.hide()},r.options.timer+s)}}})},_interval_set:function(){var t=this;t.checkInterval=setInterval(function(){if(e("body").find(t.$el).length===0||e("body").find(t.$elProxy).length===0||t.Status=="hidden"||e("body").find(t.$tooltip).length===0){if(t.Status=="shown"||t.Status=="appearing")t.hide();t._interval_cancel()}else{if(t.options.positionTracker){var n=t._repositionInfo(t.$elProxy),r=false;if(o(n.dimension,t.elProxyPosition.dimension)){if(t.$elProxy.css("position")==="fixed"){if(o(n.position,t.elProxyPosition.position))r=true}else{if(o(n.offset,t.elProxyPosition.offset))r=true}}if(!r){t.reposition()}}}},200)},_interval_cancel:function(){clearInterval(this.checkInterval);this.checkInterval=null},_content_set:function(e){if(typeof e==="object"&&e!==null&&this.options.contentCloning){e=e.clone(true)}this.Content=e},_content_insert:function(){var e=this,t=this.$tooltip.find(".tooltipster-content");if(typeof e.Content==="string"&&!e.options.contentAsHTML){t.text(e.Content)}else{t.empty().append(e.Content)}},_update:function(e){var t=this;t._content_set(e);if(t.Content!==null){if(t.Status!=="hidden"){t._content_insert();t.reposition();if(t.options.updateAnimation){if(l()){t.$tooltip.css({width:"","-webkit-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-moz-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-o-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-ms-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms",transition:"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms"}).addClass("tooltipster-content-changing");setTimeout(function(){if(t.Status!="hidden"){t.$tooltip.removeClass("tooltipster-content-changing");setTimeout(function(){if(t.Status!=="hidden"){t.$tooltip.css({"-webkit-transition":t.options.speed+"ms","-moz-transition":t.options.speed+"ms","-o-transition":t.options.speed+"ms","-ms-transition":t.options.speed+"ms",transition:t.options.speed+"ms"})}},t.options.speed)}},t.options.speed)}else{t.$tooltip.fadeTo(t.options.speed,.5,function(){if(t.Status!="hidden"){t.$tooltip.fadeTo(t.options.speed,1)}})}}}}else{t.hide()}},_repositionInfo:function(e){return{dimension:{height:e.outerHeight(false),width:e.outerWidth(false)},offset:e.offset(),position:{left:parseInt(e.css("left")),top:parseInt(e.css("top"))}}},hide:function(n){var r=this;if(n)r.callbacks.hide.push(n);r.callbacks.show=[];clearTimeout(r.timerShow);r.timerShow=null;clearTimeout(r.timerHide);r.timerHide=null;var i=function(){e.each(r.callbacks.hide,function(e,t){t.call(r.$el)});r.callbacks.hide=[]};if(r.Status=="shown"||r.Status=="appearing"){r.Status="disappearing";var s=function(){r.Status="hidden";if(typeof r.Content=="object"&&r.Content!==null){r.Content.detach()}r.$tooltip.remove();r.$tooltip=null;e(t).off("."+r.namespace);e("body").off("."+r.namespace).css("overflow-x",r.bodyOverflowX);e("body").off("."+r.namespace);r.$elProxy.off("."+r.namespace+"-autoClose");r.options.functionAfter.call(r.$el,r.$el);i()};if(l()){r.$tooltip.clearQueue().removeClass("tooltipster-"+r.options.animation+"-show").addClass("tooltipster-dying");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(s)}else{r.$tooltip.stop().fadeOut(r.options.speed,s)}}else if(r.Status=="hidden"){i()}return r},show:function(e){this._showNow(e);return this},update:function(e){return this.content(e)},content:function(e){if(typeof e==="undefined"){return this.Content}else{this._update(e);return this}},reposition:function(){var n=this;if(e("body").find(n.$tooltip).length!==0){n.$tooltip.css("width","");n.elProxyPosition=n._repositionInfo(n.$elProxy);var r=null,i=e(t).width(),s=n.elProxyPosition,o=n.$tooltip.outerWidth(false),u=n.$tooltip.innerWidth()+1,a=n.$tooltip.outerHeight(false);if(n.$elProxy.is("area")){var f=n.$elProxy.attr("shape"),l=n.$elProxy.parent().attr("name"),c=e('img[usemap="#'+l+'"]'),h=c.offset().left,p=c.offset().top,d=n.$elProxy.attr("coords")!==undefined?n.$elProxy.attr("coords").split(","):undefined;if(f=="circle"){var v=parseInt(d[0]),m=parseInt(d[1]),g=parseInt(d[2]);s.dimension.height=g*2;s.dimension.width=g*2;s.offset.top=p+m-g;s.offset.left=h+v-g}else if(f=="rect"){var v=parseInt(d[0]),m=parseInt(d[1]),y=parseInt(d[2]),b=parseInt(d[3]);s.dimension.height=b-m;s.dimension.width=y-v;s.offset.top=p+m;s.offset.left=h+v}else if(f=="poly"){var w=[],E=[],S=0,x=0,T=0,N=0,C="even";for(var k=0;k<d.length;k++){var L=parseInt(d[k]);if(C=="even"){if(L>T){T=L;if(k===0){S=T}}if(L<S){S=L}C="odd"}else{if(L>N){N=L;if(k==1){x=N}}if(L<x){x=L}C="even"}}s.dimension.height=N-x;s.dimension.width=T-S;s.offset.top=p+x;s.offset.left=h+S}else{s.dimension.height=c.outerHeight(false);s.dimension.width=c.outerWidth(false);s.offset.top=p;s.offset.left=h}}var A=0,O=0,M=0,_=parseInt(n.options.offsetY),D=parseInt(n.options.offsetX),P=n.options.position;function H(){var n=e(t).scrollLeft();if(A-n<0){r=A-n;A=n}if(A+o-n>i){r=A-(i+n-o);A=i+n-o}}function B(n,r){if(s.offset.top-e(t).scrollTop()-a-_-12<0&&r.indexOf("top")>-1){P=n}if(s.offset.top+s.dimension.height+a+12+_>e(t).scrollTop()+e(t).height()&&r.indexOf("bottom")>-1){P=n;M=s.offset.top-a-_-12}}if(P=="top"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left+D-j/2;M=s.offset.top-a-_-12;H();B("bottom","top")}if(P=="top-left"){A=s.offset.left+D;M=s.offset.top-a-_-12;H();B("bottom-left","top-left")}if(P=="top-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top-a-_-12;H();B("bottom-right","top-right")}if(P=="bottom"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left-j/2+D;M=s.offset.top+s.dimension.height+_+12;H();B("top","bottom")}if(P=="bottom-left"){A=s.offset.left+D;M=s.offset.top+s.dimension.height+_+12;H();B("top-left","bottom-left")}if(P=="bottom-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top+s.dimension.height+_+12;H();B("top-right","bottom-right")}if(P=="left"){A=s.offset.left-D-o-12;O=s.offset.left+D+s.dimension.width+12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A<0&&O+o>i){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=o+A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);A=s.offset.left-D-q-12-I;F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A<0){A=s.offset.left+D+s.dimension.width+12;r="left"}}if(P=="right"){A=s.offset.left+D+s.dimension.width+12;O=s.offset.left-D-o-12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A+o>i&&O<0){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=i-A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A+o>i){A=s.offset.left-D-o-12;r="right"}}if(n.options.arrow){var R="tooltipster-arrow-"+P;if(n.options.arrowColor.length<1){var U=n.$tooltip.css("background-color")}else{var U=n.options.arrowColor}if(!r){r=""}else if(r=="left"){R="tooltipster-arrow-right";r=""}else if(r=="right"){R="tooltipster-arrow-left";r=""}else{r="left:"+Math.round(r)+"px;"}if(P=="top"||P=="top-left"||P=="top-right"){var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}else if(P=="bottom"||P=="bottom-left"||P=="bottom-right"){var z=parseFloat(n.$tooltip.css("border-top-width")),W=n.$tooltip.css("border-top-color")}else if(P=="left"){var z=parseFloat(n.$tooltip.css("border-right-width")),W=n.$tooltip.css("border-right-color")}else if(P=="right"){var z=parseFloat(n.$tooltip.css("border-left-width")),W=n.$tooltip.css("border-left-color")}else{var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}if(z>1){z++}var X="";if(z!==0){var V="",J="border-color: "+W+";";if(R.indexOf("bottom")!==-1){V="margin-top: -"+Math.round(z)+"px;"}else if(R.indexOf("top")!==-1){V="margin-bottom: -"+Math.round(z)+"px;"}else if(R.indexOf("left")!==-1){V="margin-right: -"+Math.round(z)+"px;"}else if(R.indexOf("right")!==-1){V="margin-left: -"+Math.round(z)+"px;"}X='<span class="tooltipster-arrow-border" style="'+V+" "+J+';"></span>'}n.$tooltip.find(".tooltipster-arrow").remove();var K='<div class="'+R+' tooltipster-arrow" style="'+r+'">'+X+'<span style="border-color:'+U+';"></span></div>';n.$tooltip.append(K)}n.$tooltip.css({top:Math.round(M)+"px",left:Math.round(A)+"px"})}return n},enable:function(){this.enabled=true;return this},disable:function(){this.hide();this.enabled=false;return this},destroy:function(){var t=this;t.hide();if(t.$el[0]!==t.$elProxy[0])t.$elProxy.remove();t.$el.removeData(t.namespace).off("."+t.namespace);var n=t.$el.data("tooltipster-ns");if(n.length===1){var r=typeof t.Content==="string"?t.Content:e("<div></div>").append(t.Content).html();t.$el.removeClass("tooltipstered").attr("title",r).removeData(t.namespace).removeData("tooltipster-ns").off("."+t.namespace)}else{n=e.grep(n,function(e,n){return e!==t.namespace});t.$el.data("tooltipster-ns",n)}return t},elementIcon:function(){return this.$el[0]!==this.$elProxy[0]?this.$elProxy[0]:undefined},elementTooltip:function(){return this.$tooltip?this.$tooltip[0]:undefined},option:function(e,t){if(typeof t=="undefined")return this.options[e];else{this.options[e]=t;return this}},status:function(){return this.Status}};e.fn[r]=function(){var t=arguments;if(this.length===0){if(typeof t[0]==="string"){var n=true;switch(t[0]){case"setDefaults":e.extend(i,t[1]);break;default:n=false;break}if(n)return true;else return this}else{return this}}else{if(typeof t[0]==="string"){var r="#*$~&";this.each(function(){var n=e(this).data("tooltipster-ns"),i=n?e(this).data(n[0]):null;if(i){if(typeof i[t[0]]==="function"){var s=i[t[0]](t[1],t[2])}else{throw new Error('Unknown method .tooltipster("'+t[0]+'")')}if(s!==i){r=s;return false}}else{throw new Error("You called Tooltipster's \""+t[0]+'" method on an uninitialized element')}});return r!=="#*$~&"?r:this}else{var o=[],u=t[0]&&typeof t[0].multiple!=="undefined",a=u&&t[0].multiple||!u&&i.multiple,f=t[0]&&typeof t[0].debug!=="undefined",l=f&&t[0].debug||!f&&i.debug;this.each(function(){var n=false,r=e(this).data("tooltipster-ns"),i=null;if(!r){n=true}else if(a){n=true}else if(l){console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.')}if(n){i=new s(this,t[0]);if(!r)r=[];r.push(i.namespace);e(this).data("tooltipster-ns",r);e(this).data(i.namespace,i)}o.push(i)});if(a)return o;else return this}}};var u=!!("ontouchstart"in t);var a=false;e("body").one("mousemove",function(){a=true})})(jQuery,window,document);
define("tooltipster", function(){});

/*
Usage Example

//creating new instance of tootltip
var  tooltip = IEA.tooltip(element) // default configuration & element can be string or jQuery Object
ex. IEA.tooltip('.class-elem')
or
IEA.tooltip('#class-elem')
or
IEA.tooltip($('.class-elem')
NOTE: to use it with default config, do add 'title' attribute to your HTML element
or
var  tooltip = IEA.tooltip(element, {theme: 'my-custom-theme'}) // initialization with congiruation

//creating new instance of tootltip with content as markup
var  tooltip = IEA.tooltip(element, {content: '<div> Tooltip content as markup</div>', contentAsMarkup: true})

// creating tooltip instance with cross icon
var  tooltip = IEA.tooltip(element, {trigger: 'click'})

//public methods
tooltip.show();
tooltip.hide();
tooltip.disable();
tooltip.enable();
tooltip.destroy()
tooltip.content();
tooltip.updateContent();
tooltip.reposition();
tooltip.getTooltipElement();
tooltip.getIconElement();

//Events

*/

define('tooltip',['underscore',
    'iea',
    'tooltipster'
], function(_,
    IEA,
    Tooltipster) {

    'use strict';

    // get a new service method reference to Tooltip.
    IEA.service('tooltip', function(service, app, iea) {

        // new tooltip class defenition

        /**
        * Description
        * @method Tooltip
        * @return ThisExpression
        */
        var Tooltip = function(options) {
            return this;
        };

        // extend Tooltip defenition prototype
        _.extend(Tooltip.prototype, {

            initialize: function(element, options) {

                // Checking for the type of element to make it compatible
                if($.type(element) === 'string') {
                    this.element  = $(element);
                } else {
                    this.element  = element;
                }

                var self = this;
                var defaults = {
                    animation: 'fade',
                    arrow: true,
                    arrowColor: '',
                    autoClose: true,
                    content: null,
                    contentAsHTML: false,
                    contentCloning: true,
                    debug: true,
                    delay: 200,
                    minWidth: 0,
                    maxWidth: null,
                    icon: '(?)',
                    //If you provide a jQuery object to the 'icon' option, this sets if it is a clone of this object that should actually be used.
                    iconCloning: true,
                    //Generate an icon next to your content that is responsible for activating the tooltip on non-touch devices
                    iconDesktop: false,
                    iconTheme: 'tooltipster-icon',
                    iconTouch: false,
                    interactive: false,
                    interactiveTolerance: 350,
                    multiple: false,
                    offsetX: 0,
                    offsetY: 0,
                    onlyOne: false,
                    position: 'bottom',
                    speed: 350,
                    timer: 0,
                    theme: 'tooltipster-default',
                    touchDevices: true,
                    trigger: 'hover',
                    updateAnimation: true,
                    contentAsMarkup: false,

                    //Create a custom function to be fired only once at instantiation
                    functionInit: function(origin, content) {
                        self.triggerMethod('tooltip:init', origin, content);
                    },
                    //Create a custom function to be fired before the tooltip opens
                    functionBefore: function(origin, continueTooltip) {
                        continueTooltip();
                        self.triggerMethod('tooltip:before', origin, self);
                    },
                    //Create a custom function to be fired once the tooltip has been closed and removed from the DOM
                    functionAfter: function(origin) {
                        self.triggerMethod('tooltip:after', origin);
                    },
                    //Create a custom function to be fired when the tooltip and its contents have been added to the DOM
                    functionReady: function(origin, tooltip) {
                        self.triggerMethod('tooltip:ready', origin, tooltip, self);
                    }

                };

                this.options = _.extend(defaults, options);

                // If content is markup
                if(this.options.contentAsMarkup) {
                    this.options.content = $(this.options.content);
                }

                this._checkForCrossIcon();
                this.instance = this.element.tooltipster(this.options);

                return this;
            },


            /**
             * Checks for the trigger option if it is click then only add the icon
             * @method show
             * @return
             */
            _checkForCrossIcon: function() {
                var self = this;
                //If trigger is click add closs icon to let it close
                if(this.options.trigger === 'click') {
                    var crossIcon = $('<span class="cross-icon-tooltip"><i class="icon-close-light"></i></span>');

                    this.options.content.append(crossIcon);

                    // attaching event to cross icon
                    this.options.content.find('.cross-icon-tooltip').click(function() {
                        self.hide();
                    });

                    this.options.autoClose = false;
                    this.options.interactive = true;
                }
            },

            /**
             * Displays tooltip and callback is called
             * @method show
             * @return
             */
            show: function(callback) {
                this.element.tooltipster('show', callback);
                this.triggerMethod('tooltip:show');
            },

            /**
             * Hides tooltip and callback is called
             * @method hide
             * @return
             */
            hide: function(callback) {
                this.element.tooltipster('hide', callback);
                this.triggerMethod('tooltip:hide');
            },

            /**
             * Temporarily disable a tooltip from being able to open
             * @method disable
             * @return
             */
            disable: function() {
                this.element.tooltipster('disable');
                this.triggerMethod('tooltip:disable');
            },

            /**
             * If a tooltip was disabled from opening, reenable its previous functionality
             * @method enable
             * @return
             */
            enable: function() {
                this.element.tooltipster('enable');
                this.triggerMethod('tooltip:enable');
            },

            /**
             * Hide and destroy tooltip functionality
             * @method destroy
             * @return
             */
            destroy: function() {
                this.element.tooltipster('destroy');
                this.triggerMethod('tooltip:destroy');
            },

            /**
             * Return a tooltip's current content (if selector contains multiple origins, only the value of the first will be returned)
             * @method content
             * @return String
             */
            content: function() {
                return this.element.tooltipster('content');
            },

            /**
             * Update tooltip content
             * @method updateContent
             * @return
             */
            updateContent: function(newContent) {
                this.element.tooltipster('content', newContent);
                this.triggerMethod('tooltip:updateContent');
            },

            /**
             * Reposition and resize the tooltip
             * @method reposition
             * @return
             */
            reposition: function() {
                this.element.tooltipster('reposition');
                this.triggerMethod('tooltip:reposition');
            },

            /**
             * Return the HTML root element of the tooltip
             * @method getTooltipElement
             * @return HTML Element
             */
            getTooltipElement: function() {
                return this.element.tooltipster('elementTooltip');
            },

            /**
             * Return the HTML root element of the icon if there is one, 'undefined' otherwise
             * @method getIconElement
             * @return HTML Element
             */
            getIconElement: function() {
                return this.element.tooltipster('elementIcon');
            }
        });

        return Tooltip;
    });

});


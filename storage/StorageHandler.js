// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  var goLabLocalStorageKey, localStorage,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.golab = window.golab || {};

  window.golab.ils = window.golab.ils || {};

  window.golab.ils.storage = window.golab.ils.storage || {};

  window.golab.ils.storage.memory = window.golab.ils.storage.memory || {};

  /*
    Superclass for all storage handlers.
    A resource has the structure { id, content: {}, metadata: {} }.
  */


  window.golab.ils.storage.StorageHandler = (function() {
    function StorageHandler(metadataHandler, _filterForResourceType, _filterForUser, _filterForProvider) {
      var error;
      this._filterForResourceType = _filterForResourceType != null ? _filterForResourceType : true;
      this._filterForUser = _filterForUser != null ? _filterForUser : false;
      this._filterForProvider = _filterForProvider != null ? _filterForProvider : true;
      this.createResource = __bind(this.createResource, this);
      this.readLatestResource = __bind(this.readLatestResource, this);
      this.getResourceBundle = __bind(this.getResourceBundle, this);
      this.applyFilters = __bind(this.applyFilters, this);
      console.log("Initializing StorageHandler.");
      this._debug = false;
      this._lastResourceId = void 0;
      try {
        metadataHandler.getMetadata();
        this.metadataHandler = metadataHandler;
      } catch (_error) {
        error = _error;
        throw "StorageHandler needs a MetadataHandler at construction!";
      }
    }

    StorageHandler.prototype.configureFilters = function(filterForResourceType, filterForUser, filterForProvider) {
      this._filterForResourceType = filterForResourceType;
      this._filterForUser = filterForUser;
      return this._filterForProvider = filterForProvider;
    };

    StorageHandler.prototype.getMetadataHandler = function() {
      return this.metadataHandler;
    };

    StorageHandler.prototype.getResourceDescription = function(resource) {
      return {
        id: resource.metadata.id,
        title: resource.metadata.target.displayName,
        type: resource.metadata.target.objectType,
        tool: resource.metadata.generator.displayName,
        author: resource.metadata.actor.displayName,
        modified: new Date(resource.metadata.published)
      };
    };

    StorageHandler.prototype.applyFilters = function(metadatas) {
      var _this = this;
      if (this._debug) {
        console.log("StorageHandler.applyFilters:");
        console.log("filter for type, user, provider:");
        console.log(this._filterForResourceType, this._filterForUser, this._filterForProvider);
        console.log(metadatas);
      }
      if (this._filterForResourceType) {
        metadatas = metadatas.filter(function(entry) {
          return entry.metadata.target.objectType === _this.metadataHandler.getTarget().objectType;
        });
      }
      if (this._filterForProvider) {
        metadatas = metadatas.filter(function(entry) {
          return entry.metadata.provider.id === _this.metadataHandler.getProvider().id;
        });
      }
      if (this._filterForUser) {
        metadatas = metadatas.filter(function(entry) {
          return entry.metadata.actor.displayName === _this.metadataHandler.getActor().displayName;
        });
      }
      if (this._debug) {
        console.log("after: ");
        console.log(metadatas);
      }
      return metadatas;
    };

    StorageHandler.prototype.getResourceBundle = function(content, id) {
      var metadata, thisContent;
      if (id == null) {
        id = ut.commons.utils.generateUUID();
      }
      thisContent = JSON.parse(JSON.stringify(content));
      metadata = JSON.parse(JSON.stringify(this.metadataHandler.getMetadata()));
      metadata.published = (new Date()).toISOString();
      metadata.id = id;
      return {
        metadata: metadata,
        content: thisContent
      };
    };

    StorageHandler.prototype.readLatestResource = function(objectType, cb) {
      var _this = this;
      if (this._debug) {
        console.log("StorageHandler: searching for latest resource of type '" + objectType + "'");
      }
      return this.listResourceMetaDatas(function(error, metadatas) {
        var date, entry, latestDate, latestId, _i, _len;
        if (error != null) {
          return setTimeout(function() {
            return cb(error, void 0);
          }, 0);
        } else {
          latestDate = new Date(1970, 0, 1);
          latestId = void 0;
          for (_i = 0, _len = metadatas.length; _i < _len; _i++) {
            entry = metadatas[_i];
            if ((objectType != null) && objectType !== entry.metadata.target.objectType) {
              continue;
            }
            if (entry.metadata.published != null) {
              date = new Date(entry.metadata.published);
              if (date > latestDate) {
                latestDate = date;
                latestId = entry.id;
              }
            }
          }
          if (latestId != null) {
            return _this.readResource(latestId, cb);
          } else {
            error = new Error("StorageHandler: no matching latest resource found.");
            return setTimeout(function() {
              return cb(error, void 0);
            }, 0);
          }
        }
      });
    };

    /*
      Reads a resource with a given id.
      Takes a callback with (err, resource). err is null or contains the error if
      any error occured. It is an error if there is no resource with given id.
    */


    StorageHandler.prototype.readResource = function(resourceId, cb) {
      throw "Abstract function readResource - implement in subclass.";
    };

    /*
      Checks if there is a resource with given id.
      Takes a callback with (err, exists), where exists is true when there is a
      resource with given id, and false otherwise. err is null or contains the
      error if any error occured.
    */


    StorageHandler.prototype.resourceExists = function(resourceId, cb) {
      throw "Abstract function resourceExists - implement in subclass.";
    };

    /*
      Creates a resource with the given content.
      Takes a callback with (err, resource), where resource is the newly created
      resource. err is null or contains the error if any error occured.
    */


    StorageHandler.prototype.createResource = function(content, cb) {
      throw "Abstract function createResource - implement in subclass.";
    };

    /*
      Updates an existing resource with new content.
      Takes a callback with(err, resource), where resource is the updated
      resource. err is null or contains the error if any error occured.
    */


    StorageHandler.prototype.updateResource = function(resourceId, content, cb) {
      throw "Abstract function updateResource - implement in subclass.";
    };

    /*
      Deletes an existing resource.
      Requires the resourceId of the resource to be deleted,
      and a callback that returns an error if something went wrong,
      or is null on success.
      resource. err is null or contains the error if any error occured.
    */


    StorageHandler.prototype.deleteResource = function(resourceId, cb) {
      throw "Abstract function deleteResource - implement in subclass.";
    };

    /*
      Calls back with the ids of all existing resources.
      Takes a callback with (err, ids). err is null or contains the error if any
      error occured.
    */


    StorageHandler.prototype.listResourceIds = function(cb) {
      throw "Abstract function listResourceIds - implement in subclass.";
    };

    /*
      Calls back with the metadata of all existing resources.
      Takes a callback with (err, metadatas), where metadatas is an Array of
      { id, metadata: {} } objects. err is null or contains the error if any error
      occured. The metadatas are (potentially) filtered for username, resource type, and provider id.
    */


    StorageHandler.prototype.listResourceMetaDatas = function(cb) {
      throw "Abstract function listResourceMetaDatas - implement in subclass.";
    };

    return StorageHandler;

  })();

  /*
    Implementation of an object storage handler
  */


  window.golab.ils.storage.ObjectStorageHandler = (function(_super) {
    __extends(ObjectStorageHandler, _super);

    function ObjectStorageHandler(metadataHandler, storeObject) {
      this.listResourceMetaDatas = __bind(this.listResourceMetaDatas, this);
      this.createResource = __bind(this.createResource, this);
      ObjectStorageHandler.__super__.constructor.apply(this, arguments);
      if (typeof storeObject !== "object") {
        throw "you must pass on an object to store the resources";
      }
      this.storeObject = storeObject;
      console.log("Initializing ObjectStorageHandler.");
      this;
    }

    ObjectStorageHandler.prototype.readResource = function(resourceId, cb) {
      var error;
      if (this.storeObject[resourceId]) {
        if (this._debug) {
          console.log("MemoryStorage: readResource " + resourceId);
        }
        return setTimeout(function() {
          return cb(null, JSON.parse(JSON.stringify(this.storeObject[resourceId])));
        }, 0);
      } else {
        error = new Error("MemoryStorage: readResource " + resourceId + " not found.");
        if (this._debug) {
          console.log(error);
        }
        return setTimeout(function() {
          return cb(error);
        }, 0);
      }
    };

    ObjectStorageHandler.prototype.resourceExists = function(resourceId, cb) {
      var exists;
      exists = this.storeObject[resourceId] !== void 0;
      return cb(null, exists);
    };

    ObjectStorageHandler.prototype.createResource = function(content, cb) {
      var error, resource;
      try {
        resource = this.getResourceBundle(content);
        if (this.storeObject[resource.metadata.id]) {
          error = new Error("MemoryStorage: resource already exists! " + resource.metadata.id);
          if (this._debug) {
            console.log(error);
          }
          return setTimeout(function() {
            return cb(error);
          }, 0);
        } else {
          this.storeObject[resource.metadata.id] = resource;
          if (this._debug) {
            console.log("MemoryStorage: resource created: " + resource);
          }
          if (this._debug) {
            console.log(resource);
          }
          return setTimeout(function() {
            return cb(null, resource);
          }, 0);
        }
      } catch (_error) {
        error = _error;
        error = new Error("MemoryStorage: resource NOT created: " + error);
        if (this._debug) {
          console.log(error);
        }
        return setTimeout(function() {
          return cb(error);
        }, 0);
      }
    };

    ObjectStorageHandler.prototype.updateResource = function(resourceId, content, cb) {
      var error, resource;
      if (this.storeObject[resourceId]) {
        resource = this.getResourceBundle(content, resourceId);
        this.storeObject[resourceId] = resource;
        console.log("MemoryStorage: updateResource " + resourceId);
        return setTimeout(function() {
          return cb(null, resource);
        }, 0);
      } else {
        error = new Error("MemoryStorage: updateResource failed, resource doesn't exist: " + resourceId);
        console.log(error);
        return setTimeout(function() {
          return cb(error);
        }, 0);
      }
    };

    ObjectStorageHandler.prototype.listResourceIds = function(cb) {
      var id, ids, resource;
      ids = (function() {
        var _ref, _results;
        _ref = this.storeObject;
        _results = [];
        for (id in _ref) {
          resource = _ref[id];
          _results.push(id);
        }
        return _results;
      }).call(this);
      return setTimeout(function() {
        return cb(null, ids);
      }, 0);
    };

    ObjectStorageHandler.prototype.listResourceMetaDatas = function(cb) {
      var id, metadatas, resource, _ref;
      metadatas = [];
      _ref = this.storeObject;
      for (id in _ref) {
        resource = _ref[id];
        metadatas.push({
          id: id,
          metadata: JSON.parse(JSON.stringify(resource.metadata))
        });
      }
      metadatas = this.applyFilters(metadatas);
      return setTimeout(function() {
        return cb(null, metadatas);
      }, 0);
    };

    return ObjectStorageHandler;

  })(window.golab.ils.storage.StorageHandler);

  /*
    Implementation of a memory storage handler, which is a subclass of the object storage handler.
  */


  window.golab.ils.storage.MemoryStorageHandler = (function(_super) {
    __extends(MemoryStorageHandler, _super);

    function MemoryStorageHandler(metadataHandler) {
      MemoryStorageHandler.__super__.constructor.call(this, metadataHandler, {});
      console.log("Initializing MemoryStorageHandler, debug: " + this._debug + ".");
      this;
    }

    return MemoryStorageHandler;

  })(window.golab.ils.storage.ObjectStorageHandler);

  /*
    Implementation of a local (browser) storage handler.
  */


  if (false) {
    localStorage = localStorage || {};
  }

  goLabLocalStorageKey = "_goLab_";

  window.golab.ils.storage.LocalStorageHandler = (function(_super) {
    __extends(LocalStorageHandler, _super);

    function LocalStorageHandler(metadataHandler) {
      this.listResourceMetaDatas = __bind(this.listResourceMetaDatas, this);
      this.createResource = __bind(this.createResource, this);
      LocalStorageHandler.__super__.constructor.apply(this, arguments);
      console.log("Initializing LocalStorageHandler.");
      this.localStorage = window.localStorage;
      this;
    }

    LocalStorageHandler.prototype.readResource = function(resourceId, cb) {
      var error;
      if (this.localStorage[goLabLocalStorageKey + resourceId]) {
        if (this._debug) {
          console.log("LocalStorageHandler: readResource " + resourceId);
        }
        return setTimeout(function() {
          return cb(null, JSON.parse(this.localStorage[goLabLocalStorageKey + resourceId]));
        }, 0);
      } else {
        error = new Error("LocalStorageHandler: readResource " + resourceId + " not found.");
        if (this._debug) {
          console.log(error);
        }
        return setTimeout(function() {
          return cb(error);
        }, 0);
      }
    };

    LocalStorageHandler.prototype.resourceExists = function(resourceId, cb) {
      var exists;
      exists = this.localStorage[goLabLocalStorageKey + resourceId] !== void 0;
      return setTimeout(function() {
        return cb(null, exists);
      }, 0);
    };

    LocalStorageHandler.prototype.deleteResource = function(resourceId, cb) {
      if (this.localStorage[goLabLocalStorageKey + resourceId] != null) {
        delete this.localStorage[goLabLocalStorageKey + resourceId];
        return setTimeout(function() {
          return cb(null);
        }, 0);
      } else {
        return setTimeout(function() {
          return cb("Can't delete resource - doesn't exist.");
        }, 0);
      }
    };

    LocalStorageHandler.prototype.createResource = function(content, cb) {
      var error, resource, resourceId;
      try {
        resource = this.getResourceBundle(content);
        resourceId = resource.metadata.id;
        if (this.localStorage[goLabLocalStorageKey + resourceId]) {
          error = new Error("LocalStorageHandler: resource already exists! " + resourceId);
          if (this._debug) {
            console.log(error);
          }
          return setTimeout(function() {
            return cb(error);
          }, 0);
        } else {
          this.localStorage[goLabLocalStorageKey + resourceId] = JSON.stringify(resource);
          if (this._debug) {
            console.log("LocalStorageHandler: resource created: " + resource);
          }
          if (this._debug) {
            console.log(resource);
          }
          return setTimeout(function() {
            return cb(null, resource);
          }, 0);
        }
      } catch (_error) {
        error = _error;
        error = new Error("LocalStorageHandler: resource NOT created: " + error);
        if (this._debug) {
          console.log(error);
        }
        return setTimeout(function() {
          return cb(error);
        }, 0);
      }
    };

    LocalStorageHandler.prototype.updateResource = function(resourceId, content, cb) {
      var error, resource;
      if (this.localStorage[goLabLocalStorageKey + resourceId]) {
        resource = this.getResourceBundle(content, resourceId);
        this.localStorage[goLabLocalStorageKey + resourceId] = JSON.stringify(resource);
        console.log("LocalStorageHandler: updateResource " + resourceId);
        return setTimeout(function() {
          return cb(null, resource);
        }, 0);
      } else {
        error = new Error("LocalStorageHandler: updateResource failed, resource doesn't exist: " + resourceId);
        console.log(error);
        return setTimeout(function() {
          return cb(error);
        }, 0);
      }
    };

    LocalStorageHandler.prototype.isGoLabKey = function(key) {
      return key.indexOf(goLabLocalStorageKey) === 0;
    };

    LocalStorageHandler.prototype.listResourceIds = function(cb) {
      var id, ids, resourceString, stripPrefix;
      stripPrefix = function(id) {
        return id.substr(goLabLocalStorageKey.length);
      };
      ids = (function() {
        var _ref, _results;
        _ref = this.localStorage;
        _results = [];
        for (id in _ref) {
          resourceString = _ref[id];
          if (this.isGoLabKey(id)) {
            _results.push(stripPrefix(id));
          }
        }
        return _results;
      }).call(this);
      return setTimeout(function() {
        return cb(null, ids);
      }, 0);
    };

    LocalStorageHandler.prototype.listResourceMetaDatas = function(cb) {
      var id, metadatas, resource, resourceString, _ref;
      metadatas = [];
      _ref = this.localStorage;
      for (id in _ref) {
        resourceString = _ref[id];
        if (!(this.isGoLabKey(id))) {
          continue;
        }
        resource = JSON.parse(resourceString);
        metadatas.push({
          id: resource.metadata.id,
          metadata: resource.metadata
        });
      }
      metadatas = this.applyFilters(metadatas);
      return setTimeout(function() {
        return cb(null, metadatas);
      }, 0);
    };

    return LocalStorageHandler;

  })(window.golab.ils.storage.StorageHandler);

  /*
    Implementation of a Vault (Graasp/ILS) storage handler.
  */


  window.golab.ils.storage.VaultStorageHandler = (function(_super) {
    __extends(VaultStorageHandler, _super);

    function VaultStorageHandler(metadataHandler) {
      this.createResource = __bind(this.createResource, this);
      VaultStorageHandler.__super__.constructor.apply(this, arguments);
      console.log("Initializing VaultStorageHandler.");
      if (typeof ils === "undefined" || ils === null) {
        throw "The ILS library needs to be present for the VaultStorageHandler";
      } else {
        return this;
      }
    }

    VaultStorageHandler.prototype.readResource = function(resourceId, cb) {
      var error,
        _this = this;
      try {
        return ils.readResource(resourceId, function(error, result) {
          if (error != null) {
            return cb(error);
          } else {
            return cb(null, result);
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when trying to load from the vault:");
        console.warn(error);
        return cb(error);
      }
    };

    VaultStorageHandler.prototype.resourceExists = function(resourceId, cb) {
      throw "Not yet implemented.";
    };

    VaultStorageHandler.prototype.createResource = function(content, cb) {
      var error, resource,
        _this = this;
      try {
        resource = this.getResourceBundle(content);
        resource.metadata.id = "";
        return ils.createResource(resource, function(error, result) {
          if (error != null) {
            return cb(error);
          } else {
            resource.metadata.id = result.id;
            return cb(null, resource);
          }
        });
      } catch (_error) {
        error = _error;
        console.log("Vault resource creation unsuccessful: ");
        console.error(error);
        return cb(error);
      }
    };

    VaultStorageHandler.prototype.updateResource = function(resourceId, content, cb) {
      throw "Not yet implemented.";
    };

    VaultStorageHandler.prototype.listResourceIds = function(cb) {
      throw "Not yet implemented.";
    };

    VaultStorageHandler.prototype.listResourceMetaDatas = function(callback) {
      var _this = this;
      return ils.listVault(function(error, result) {
        if (error != null) {
          return callback(error);
        } else {
          console.log("listResourceMetaDatas:");
          console.log(result);
          return callback(null, result);
        }
      });
    };

    return VaultStorageHandler;

  })(window.golab.ils.storage.StorageHandler);

  /*
    Implementation of a MongoDB storage handler.
  */


  window.golab.ils.storage.MongoStorageHandler = (function(_super) {
    __extends(MongoStorageHandler, _super);

    function MongoStorageHandler(metadataHandler, urlPrefix) {
      this.urlPrefix = urlPrefix;
      this.listResourceMetaDatas = __bind(this.listResourceMetaDatas, this);
      this.createResource = __bind(this.createResource, this);
      MongoStorageHandler.__super__.constructor.call(this, metadataHandler, true, false, true);
      if (this.urlPrefix != null) {
        console.log("Initializing MongoStorageHandler.");
        this;
      } else {
        console.error("I need an urlPrefix as second parameter.");
      }
    }

    MongoStorageHandler.prototype.readResource = function(resourceId, cb) {
      var error;
      try {
        return $.ajax({
          type: "GET",
          url: ("" + this.urlPrefix + "/readResource/") + resourceId,
          contentType: "text/plain",
          crossDomain: true,
          success: function(resource) {
            console.log("GET readResource success, response:");
            console.log(resource);
            return cb(null, resource);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("GET readResource failed, response:");
            console.warn(errorThrown);
            return cb(errorThrown);
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when retrieving the resource:");
        console.warn(error);
        return cb(error);
      }
    };

    MongoStorageHandler.prototype.deleteResource = function(resourceId, cb) {
      var error;
      try {
        return $.ajax({
          type: "POST",
          url: ("" + this.urlPrefix + "/deleteResource/") + resourceId,
          crossDomain: true,
          success: function(response) {
            console.log("POST deleteResource success, response:");
            console.log(response);
            return cb(null);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("POST deleteResource failed, response:");
            console.warn(errorThrown);
            return cb(errorThrown);
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when deleting the resource:");
        console.warn(error);
        return cb(error);
      }
    };

    MongoStorageHandler.prototype.resourceExists = function(resourceId, cb) {
      var error;
      try {
        return $.ajax({
          type: "GET",
          url: ("" + this.urlPrefix + "/resourceExists/") + resourceId,
          crossDomain: true,
          contentType: "text/plain",
          success: function(result) {
            console.log("GET resourceExists success, response:");
            console.log(result);
            return cb(void 0, true);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("GET resourceExists failed, response:");
            console.warn(responseData);
            if (responseData.status === 500) {
              return cb(errorThrown);
            } else if (responseData.status === 410) {
              return cb(void 0, false);
            }
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when retrieving the resource:");
        console.warn(error);
        return cb(error);
      }
    };

    MongoStorageHandler.prototype.createResource = function(content, cb) {
      var error, resource;
      try {
        resource = this.getResourceBundle(content);
        resource._id = resource.metadata.id;
        return $.ajax({
          type: "POST",
          url: "" + this.urlPrefix + "/storeResource",
          data: JSON.stringify(resource),
          contentType: "text/plain",
          crossDomain: true,
          success: function(responseData, textStatus, jqXHR) {
            console.log("POST createResource success, response:");
            console.log(responseData);
            delete resource._id;
            return cb(void 0, resource);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("POST createResource failed, response:");
            console.warn(responseData);
            return cb(responseData);
          }
        });
      } catch (_error) {
        error = _error;
        console.log("Something went wrong when writing to Mongo:");
        console.error(error);
        return cb(error);
      }
    };

    MongoStorageHandler.prototype.updateResource = function(resourceId, content, cb) {
      var error,
        _this = this;
      try {
        return this.resourceExists(resourceId, function(error, result) {
          var resource;
          if (error != null) {
            return cb(error);
          } else {
            resource = _this.getResourceBundle(content, resourceId);
            resource._id = resource.metadata.id;
            return $.ajax({
              type: "POST",
              url: "" + _this.urlPrefix + "/updateResource",
              data: JSON.stringify(resource),
              contentType: "text/plain",
              crossDomain: true,
              success: function(responseData, textStatus, jqXHR) {
                console.log("POST updateResource success, response:");
                console.log(responseData);
                delete resource._id;
                return cb(null, resource);
              },
              error: function(responseData, textStatus, errorThrown) {
                console.warn("POST updateResource failed, response:");
                console.warn(responseData);
                return cb(responseData);
              }
            });
          }
        });
      } catch (_error) {
        error = _error;
        console.log("Something went wrong when updating to Mongo:");
        console.error(error);
        return cb(error);
      }
    };

    MongoStorageHandler.prototype.listResourceMetaDatas = function(cb) {
      var error,
        _this = this;
      try {
        $.support.cors = true;
        return $.ajax({
          type: "GET",
          crossDomain: true,
          contentType: "text/plain",
          url: "" + this.urlPrefix + "/listResourceMetaDatas",
          success: function(responseData) {
            console.log("GET listResourceMetaDatas success, response (before filters):");
            console.log(responseData);
            responseData = _this.applyFilters(responseData);
            return cb(void 0, responseData);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("GET listResourceMetaDatas failed, response:");
            console.warn(JSON.stringify(responseData));
            return cb(responseData);
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when retrieving the metedatas:");
        console.warn(error);
        return cb(error);
      }
    };

    MongoStorageHandler.prototype.listResourceIds = function(cb) {
      throw "Not yet implemented.";
    };

    return MongoStorageHandler;

  })(window.golab.ils.storage.StorageHandler);

  /*
    Implementation of a MongoDB-IIS storage handler.
  */


  window.golab.ils.storage.MongoIISStorageHandler = (function(_super) {
    __extends(MongoIISStorageHandler, _super);

    function MongoIISStorageHandler(metadataHandler, urlPrefix) {
      this.urlPrefix = urlPrefix;
      this.listResourceMetaDatas = __bind(this.listResourceMetaDatas, this);
      this.createResource = __bind(this.createResource, this);
      MongoIISStorageHandler.__super__.constructor.call(this, metadataHandler, true, false, true);
      if (this.urlPrefix != null) {
        console.log("Initializing MongoStorageHandler.");
        this;
      } else {
        console.error("I need an urlPrefix as second parameter.");
      }
    }

    MongoIISStorageHandler.prototype.createResource = function(content, cb) {
      var error, resource;
      try {
        resource = this.getResourceBundle(content);
        resource._id = resource.metadata.id;
        return $.ajax({
          type: "POST",
          url: "" + this.urlPrefix + "/storeResource.js",
          contentType: "text/plain",
          data: JSON.stringify(resource),
          crossDomain: true,
          success: function(responseData, textStatus, jqXHR) {
            console.log("POST createResource success, response:");
            console.log(responseData);
            delete resource._id;
            return cb(void 0, resource);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("POST createResource failed, response:");
            console.warn(responseData);
            return cb(responseData);
          }
        });
      } catch (_error) {
        error = _error;
        console.log("Something went wrong when writing to Mongo:");
        console.error(error);
        return cb(error);
      }
    };

    MongoIISStorageHandler.prototype.updateResource = function(resourceId, content, cb) {
      var error,
        _this = this;
      try {
        return this.resourceExists(resourceId, function(error, result) {
          var resource;
          if (error != null) {
            return cb(error);
          } else {
            resource = _this.getResourceBundle(content, resourceId);
            resource._id = resource.metadata.id;
            return $.ajax({
              type: "POST",
              url: "" + _this.urlPrefix + "/updateResource.js",
              data: JSON.stringify(resource),
              crossDomain: true,
              success: function(responseData, textStatus, jqXHR) {
                console.log("POST updateResource success, response:");
                console.log(responseData);
                console.log(textStatus);
                console.log(jqXHR);
                delete resource._id;
                return cb(null, resource);
              },
              error: function(responseData, textStatus, errorThrown) {
                console.warn("POST updateResource failed, response:");
                console.warn(responseData);
                return cb(responseData);
              }
            });
          }
        });
      } catch (_error) {
        error = _error;
        console.log("Something went wrong when updating to Mongo:");
        console.error(error);
        return cb(error);
      }
    };

    MongoIISStorageHandler.prototype.listResourceMetaDatas = function(cb) {
      var error,
        _this = this;
      try {
        return $.ajax({
          type: "GET",
          crossDomain: true,
          contentType: "text/plain",
          url: "" + this.urlPrefix + "/listMetadatas.js",
          success: function(responseData) {
            var metadatas;
            console.log("GET listResourceMetaDatas success, response (before filters):");
            console.log(responseData);
            metadatas = _this.applyFilters(responseData);
            return cb(void 0, metadatas);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("GET listResourceMetaDatas failed, response:");
            console.warn(JSON.stringify(responseData));
            return cb(responseData);
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when retrieving the metedatas:");
        console.warn(error);
        return cb(error);
      }
    };

    MongoIISStorageHandler.prototype.readResource = function(resourceId, cb) {
      var error;
      try {
        return $.ajax({
          type: "GET",
          url: ("" + this.urlPrefix + "/readResource.js?id=") + resourceId,
          crossDomain: true,
          success: function(resource) {
            console.log("GET readResource success, response:");
            console.log(resource);
            return cb(null, resource);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("GET readResource failed, response:");
            console.warn(errorThrown);
            return cb(errorThrown);
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when retrieving the resource:");
        console.warn(error);
        return cb(error);
      }
    };

    MongoIISStorageHandler.prototype.deleteResource = function(resourceId, cb) {
      var error;
      try {
        return $.ajax({
          type: "POST",
          url: ("" + this.urlPrefix + "/deleteResource.js?id=") + resourceId,
          crossDomain: true,
          success: function(response) {
            console.log("POST deleteResource success, response:");
            console.log(response);
            return cb(null);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("POST deleteResource failed, response:");
            console.warn(errorThrown);
            return cb(errorThrown);
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when deleting the resource:");
        console.warn(error);
        return cb(error);
      }
    };

    MongoIISStorageHandler.prototype.resourceExists = function(resourceId, cb) {
      var error;
      try {
        return $.ajax({
          type: "GET",
          url: ("" + this.urlPrefix + "/resourceExists.js?id=") + resourceId,
          crossDomain: true,
          success: function(result) {
            console.log("GET resourceExists success, response:");
            console.log(result);
            return cb(void 0, true);
          },
          error: function(responseData, textStatus, errorThrown) {
            console.warn("GET resourceExists failed, response:");
            console.warn(responseData);
            if (responseData.status === 500) {
              return cb(errorThrown);
            } else if (responseData.status === 410) {
              return cb(void 0, false);
            }
          }
        });
      } catch (_error) {
        error = _error;
        console.warn("Something went wrong when retrieving the resource:");
        console.warn(error);
        return cb(error);
      }
    };

    return MongoIISStorageHandler;

  })(window.golab.ils.storage.StorageHandler);

}).call(this);

/*
//@ sourceMappingURL=StorageHandler.map
*/

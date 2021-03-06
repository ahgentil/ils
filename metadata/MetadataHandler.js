// Generated by CoffeeScript 1.9.0

/* example metadata
  {
    "id": "f25d7eff-8859-49ed-85e9-e7c1f92bc111",
    "published": "2014-06-05T13:15:30Z",
    "actor":
    {
      "objectType": "person",
      "id": "f25d7eff-8859-49ed-85e9-e7c1f92bc334",
      "displayName": "anonymized"
    },
    "target":
    {
      "objectType": "conceptMap",
      "id": "9383fbbe-e071-49b2-9770-46ddc4f8cd6e",
      "displayName": "unnamed concept map"
    },
    "generator":
    {
      "objectType": "application",
      "url": document.URL,
      "id": "04123e9e-14d0-447b-a851-805b9262d9a6",
      "displayName": "ut.tools.conceptmapper"
    },
    "provider":
    {
      "objectType": "ils",
      "url": "http://graasp.epfl.ch/metawidget/1/b387b6f...",
      "id": "0f8184db-53ba-4868-9208-896c3d7c25bb",
      "inquiryPhase": "Orientation"
      "inquiryPhaseId": "543e7058ab0f540000e5821c"
      "inquiryPhaseName": "MyOrientation"
      "displayName": "name-of-ils"
    }
  }
 */


/* example ils and space data
old graasp
//////////
ils:
	description: ""
	displayName: "ILS test"
	id: "19122"
	metadata: null
	objectId: 19122
	parentId: 934
	parentType: "@person"
	profileUrl: "http://graasp.epfl.ch/#item=space_19122"
	spacetype: "ils"
	updated: "2014-10-16T11:33:33+02:00"
	visibilityLevel: "public"

phase:
	description: "<div id="hypo-graasp-ch" class="wiki_widget"><iframe name="9190" src="http://graasp.epfl.ch/sharedapp/fb3f1a00319782d2b306b7d3920dbc62c83ae21c" width="800" height="600"></iframe></div>
	"displayName: "MyOrientation"
	id: "19123"
  // metadata might be null if it's a manually added space
	metadata: "{"type":"Orientation"}"
	objectId: 19123
	parentId: 19122
	parentType: "@space"
	profileUrl: "http://graasp.epfl.ch/#item=space_19123"
	spacetype: "folder"
	updated: "2014-10-16T11:33:33+02:00"
	visibilityLevel: "public"


new graasp
//////////
ils:
	created: "2014-10-15T13:02:16.612Z"
	description: ""
	displayName: "test graasp-eu-library"
	id: "543e7058ab0f540000e58217"
	ilsRef: Object
		__v: 0
		_id: "543e70582e2c55fc49b62595"
		lang: "en"
		modified: "2014-10-15T13:02:16.680Z"
		spaceRef: "543e7058ab0f540000e58217"
		userRef: "5405e1e0da3a95cf9050e5f2"
  metadata: Object
		type: "ils"
	parentId: "5405e1ada5ecce255b4a7222"
	parentType: "@space"
	profileUrl: "http://graasp.eu/spaces/543e7058ab0f540000e58217"
	spaceType: "ils"
	updated: "2014-10-15T13:02:16.865Z"
	visibilityLevel: "public"

phase:
	created: "2014-10-15T13:02:16.678Z"
	description: "Welcome to the Orientation phase. You can describe here what students have to do in the Orientation phase."
	displayName: "MyOrientation"
	id: "543e7058ab0f540000e5821c"
	// metadata might be missing if it's a manually added phase space
  metadata:
		type: "Orientation"
	parentId: "543e7058ab0f540000e58217"
	parentType: "@space"
	profileUrl: "http://graasp.eu/spaces/543e7058ab0f540000e5821c"
	spaceType: "folder"
	updated: "2014-10-15T13:02:45.001Z"
	visibilityLevel: "public"
 */

(function() {
  "use strict";
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  window.golab = window.golab || {};

  window.golab.ils = window.golab.ils || {};

  window.golab.ils.metadata = window.golab.ils.metadata || {};

  window.golab.ils.context = window.golab.ils.context || {};

  window.golab.ils.context.graasp = "graasp";

  window.golab.ils.context.ils = "ils";

  window.golab.ils.context.preview = "preview";

  window.golab.ils.context.direct = "direct";

  window.golab.ils.context.standalone = "standalone";

  window.golab.ils.context.unknown = "unknown";

  window.golab.ils.metadata.MetadataHandler = (function() {
    var getParameterFromUrl;

    function MetadataHandler(metadata, cb) {
      this.getILSStructure = __bind(this.getILSStructure, this);
      this.getContext = __bind(this.getContext, this);
      this.identifyContext = __bind(this.identifyContext, this);
      this._debug = true;
      if (this._debug) {
        console.log("Initializing MetadataHandler.");
      }
      this._context = this._context || this.identifyContext();
      if (metadata) {
        this._metadata = JSON.parse(JSON.stringify(metadata));
      } else {
        throw "MetadataHandler needs an initial set of metadata at construction!";
      }
      setTimeout((function(_this) {
        return function() {
          if (cb) {
            return cb(null, _this);
          }
        };
      })(this), 0);
      if (this._debug) {
        console.log("MetadataHandler construction for " + this._metadata.generator.displayName + " complete. Using the following metadata:");
        console.log(this._metadata);
        console.log("context: " + (this.getContext()));
      }
      this;
    }

    MetadataHandler.prototype.generateUUID = function() {
      var d, uuid;
      d = new Date().getTime();
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
        var r;
        r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        if (char === 'x') {
          return r.toString(16);
        } else {
          return (r & 0x7 | 0x8).toString(16);
        }
      });
      return uuid;
    };

    MetadataHandler.prototype.identifyContext = function() {
      var contextURLParameter, ilsContext, previewUrlParameter;
      this._context = null;
      contextURLParameter = getParameterFromUrl("context");
      if (contextURLParameter) {
        switch (contextURLParameter.toLowerCase()) {
          case window.golab.ils.context.graasp:
          case window.golab.ils.context.ils:
          case window.golab.ils.context.preview:
          case window.golab.ils.context.direct:
          case window.golab.ils.context.standalone:
          case window.golab.ils.context.unknown:
            this._context = contextURLParameter.toLowerCase();
            break;
          default:
            console.warn("unknown url context parameter value: " + contextURLParameter);
        }
      } else {
        previewUrlParameter = getParameterFromUrl("preview");
        if (previewUrlParameter === "") {
          this._context = window.golab.ils.context.preview;
        }
      }
      if (!this._context) {
        ilsContext = ils.identifyContext();
        if (this._debug) {
          console.log("MetadataHandler.identifyContext. ils.identifyContext() returned:");
          console.log(ilsContext);
        }
        switch (ilsContext) {
          case "graasp":
            this._context = window.golab.ils.context.graasp;
            break;
          case "preview":
            this._context = window.golab.ils.context.preview;
            break;
          case "standalone_ils":
            this._context = window.golab.ils.context.ils;
            break;
          case "standalone_html":
            this._context = window.golab.ils.context.standalone;
            break;
          default:
            this._context = window.golab.ils.context.unknown;
        }
      }

      /* the old style
        if not osapi?
          @_context = window.golab.ils.context.standalone
        else if document.referrer.indexOf("golabz.eu") isnt -1
          @_context = window.golab.ils.context.preview
          #else if document.referrer.indexOf("ils_metawidget") isnt -1
        else if document.referrer.indexOf("ils") isnt -1
          @_context = window.golab.ils.context.ils
        else if document.referrer.indexOf("graasp.eu") isnt -1
          @_context = window.golab.ils.context.graasp
        else if document.referrer is ""
          @_context = window.golab.ils.context.direct
        else
          @_context = window.golab.ils.context.unknown
       */
      if (this._debug) {
        console.log("identified context:");
        return console.log(this._context);
      }
    };

    MetadataHandler.prototype.getContext = function() {
      return this._context;
    };

    getParameterFromUrl = function(key) {
      var parameter, part, partParts, parts, queryPart, _i, _len;
      key = key.toLowerCase();
      parameter = null;
      queryPart = location.search.trim().toLowerCase();
      if (queryPart && queryPart[0] === "?") {
        parts = queryPart.substring(1).split("&");
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          partParts = part.split("=");
          if (parts.length && partParts[0] === key) {
            if (partParts.length === 2) {
              parameter = partParts[1];
            } else if (partParts.length === 1) {
              parameter = "";
            }
          }
        }
      }
      return parameter;
    };

    MetadataHandler.prototype.setId = function(newId) {
      this._metadata.id = newId;
      return this;
    };

    MetadataHandler.prototype.getId = function() {
      return this._metadata.id;
    };

    MetadataHandler.prototype.setMetadata = function(newMetadata) {
      this._metadata = JSON.parse(JSON.stringify(newMetadata));
      return this;
    };

    MetadataHandler.prototype.getMetadata = function() {
      return this._metadata;
    };

    MetadataHandler.prototype.setActor = function(newActor) {
      return this._metadata.actor = newActor;
    };

    MetadataHandler.prototype.getActor = function() {
      return this._metadata.actor;
    };

    MetadataHandler.prototype.getTarget = function() {
      return this._metadata.target;
    };

    MetadataHandler.prototype.setTarget = function(newTarget) {
      return this._metadata.target = JSON.parse(JSON.stringify(newTarget));
    };

    MetadataHandler.prototype.getGenerator = function() {
      return this._metadata.generator;
    };

    MetadataHandler.prototype.getProvider = function() {
      return this._metadata.provider;
    };

    MetadataHandler.prototype.getTargetDisplayName = function() {
      return this._metadata.target.displayName;
    };

    MetadataHandler.prototype.setTargetDisplayName = function(newName) {
      return this._metadata.target.displayName = newName;
    };

    MetadataHandler.prototype.getTargetId = function() {
      return this._metadata.target.id;
    };

    MetadataHandler.prototype.setTargetId = function(newId) {
      return this._metadata.target.id = newId;
    };

    MetadataHandler.prototype.setMetadataFlag = function(flag, value) {
      this._metadata.flags = this._metadata.flags || {};
      return this._metadata.flags[flag] = value;
    };

    MetadataHandler.prototype.getMetadataFlag = function(flag) {
      this._metadata.flags = this._metadata.flags || {};
      return this._metadata.flags[flag];
    };

    MetadataHandler.prototype.getILSStructure = function(callback) {
      if (window.ils != null) {
        return window.ils.getIls((function(_this) {
          return function(ils) {
            var ilsStructure;
            if (ils.error != null) {
              return callback({
                error: "ils.getIls failed, cannot get ILS structure.",
                detail: ils.error
              }, null);
            } else {
              ilsStructure = {};
              ilsStructure.id = ils.id;
              ilsStructure.url = ils.profileUrl;
              ilsStructure.displayName = ils.displayName;
              ilsStructure.phases = [];
              ilsStructure.apps = [];
              return window.ils.getItemsBySpaceId(ils.id, function(phases) {
                var deferredPhaseReads, index, phase, phaseReadPromise, type, _i, _len;
                if (phases.error != null) {
                  return callback({
                    error: 'ils.getItemsBySpaceId failed, cannot get ILS structure.',
                    detail: phases.error
                  }, null);
                } else {
                  phaseReadPromise = (function(_this) {
                    return function(phase, phaseIndex) {
                      var deferred;
                      deferred = new $.Deferred();
                      window.ils.getAppsBySpaceId(phase.id, function(apps) {
                        var app, appIndex, appList, _i, _len;
                        if (apps.error != null) {
                          return deferred.fail();
                        } else {
                          appList = [];
                          for (appIndex = _i = 0, _len = apps.length; _i < _len; appIndex = ++_i) {
                            app = apps[appIndex];
                            appList.push({
                              id: app.id,
                              displayName: app.displayName,
                              url: app.appUrl,
                              itemType: app.itemType,
                              appType: app.appType
                            });
                          }
                          ilsStructure.phases[phaseIndex] = {
                            id: phase.id,
                            type: phase.metadata.type,
                            displayName: phase.displayName,
                            visibilityLevel: phase.visibilityLevel,
                            apps: appList
                          };
                          return deferred.resolve();
                        }
                      });
                      return deferred.promise();
                    };
                  })(this);
                  deferredPhaseReads = [];
                  for (index = _i = 0, _len = phases.length; _i < _len; index = ++_i) {
                    phase = phases[index];
                    if (phase.metadata != null) {
                      type = phase.metadata.type;
                    } else {
                      type = 'User defined';
                      phase.metadata = {};
                      phase.metadata.type = 'User defined';
                    }
                    if (type === 'Vault' || type === 'About') {
                      continue;
                    }
                    if (phase.itemType === "Application") {
                      ilsStructure.apps.push(phase);
                      continue;
                    } else {
                      deferredPhaseReads.push(phaseReadPromise(phase, index));
                    }
                  }
                  $.when.apply($, deferredPhaseReads).done(function() {
                    ilsStructure.phases = ilsStructure.phases.filter(function(phase) {
                      return typeof phase !== "undefined";
                    });
                    return callback(null, ilsStructure);
                  });
                  return $.when.apply($, deferredPhaseReads).fail(function() {
                    return callback({
                      error: 'getILSStructure failed when retrieving phase information.'
                    }, null);
                  });
                }
              });
            }
          };
        })(this));
      } else {
        return callback({
          error: "ILS library not present, cannot get ILS structure."
        }, null);
      }
    };

    MetadataHandler.prototype.updateIdsAfterImporting = function() {
      this.setId(this.generateUUID());
      return this.setTargetId(this.generateUUID());
    };

    return MetadataHandler;

  })();

  window.golab.ils.metadata.GoLabMetadataHandler = (function(_super) {
    __extends(GoLabMetadataHandler, _super);

    function GoLabMetadataHandler(metadata, cb) {
      var error;
      this.identifyContext();
      if (typeof osapi !== "undefined" && osapi !== null) {
        try {
          if (!ils) {
            throw "ILS library needs to be present before using the (GoLab)MetadataHandler.";
          }
          ils.getAppContextParameters((function(_this) {
            return function(context) {
              console.log("received appContextParameters from ILS library:");
              console.log(context);
              metadata.actor.displayName = context.actor.displayName;
              metadata.actor.id = context.actor.id;
              metadata.actor.objectType = context.actor.objectType;
              if (context.contextualActor != null) {
                metadata.contextualActor = context.contextualActor;
              }
              metadata.provider.displayName = context.provider.displayName;
              metadata.provider.id = context.provider.id;
              metadata.provider.objectType = context.provider.objectType;
              metadata.provider.inquiryPhase = context.provider.inquiryPhase;
              metadata.provider.inquiryPhaseId = context.provider.inquiryPhaseId;
              metadata.provider.inquiryPhaseName = context.provider.inquiryPhaseName;
              metadata.provider.url = context.provider.url;
              if (context.provider.id === void 0 || context.provider.id === "unknown") {
                console.log("MetadataHandler: preview context");
                metadata.provider.objectType = "unknown";
                metadata.provider.id = "unknown";
                metadata.provider.displayName = "unknown";
                metadata.provider.url = window.location.href;
                metadata.generator.url = gadgets.util.getUrlParameters().url;
                metadata.provider.inquiryPhase = void 0;
                metadata.provider.inquiryPhaseId = void 0;
                metadata.provider.inquiryPhaseName = void 0;
              } else if (context.provider.inquiryPhaseId === void 0 || context.provider.inquiryPhaseId === "unknown") {
                console.log("MetadataHandler: ILS metawidget context");
                metadata.provider.inquiryPhase = "ils";
                metadata.provider.inquiryPhaseId = void 0;
                metadata.provider.inquiryPhaseName = void 0;
                metadata.generator.displayName = metadata.provider.displayName;
                metadata.generator.id = metadata.provider.id;
                metadata.generator.objectType = "ils";
                metadata.generator.url = metadata.provider.url;
              } else {
                console.log("MetadataHandler: application context");
                metadata.generator.id = context.generator.id;
                metadata.generator.objectType = context.generator.objectType;
                metadata.generator.url = context.generator.url;
              }
              metadata.storageId = context.storageId;
              metadata.storageType = context.storageType;
              GoLabMetadataHandler.__super__.constructor.call(_this, metadata);
              return cb(null, _this);
            };
          })(this));
        } catch (_error) {
          error = _error;
          console.warn("error during metadata retrieval:");
          console.warn(error);
          console.log("metadata so far:");
          console.log(metadata);
        }
      } else {
        if (this._debug) {
          console.log("Running outside osapi/ils, using given metadata.");
        }
        GoLabMetadataHandler.__super__.constructor.call(this, metadata);
        cb(null, this);
      }
    }

    return GoLabMetadataHandler;

  })(window.golab.ils.metadata.MetadataHandler);

  window.golab.ils.metadata.LocalMetadataHandler = (function(_super) {
    __extends(LocalMetadataHandler, _super);

    function LocalMetadataHandler(metadata, cb) {
      var actorId, getIdentifyingUrl, removeQueryAndFragmentFromUrl, userNickname, windowTitle;
      this.identifyContext();
      getIdentifyingUrl = function() {
        var path, subPaths;
        path = window.location.pathname;
        subPaths = window.location.pathname.split("/");
        if (subPaths.length > 1) {
          switch (subPaths[1].toLocaleLowerCase()) {
            case "production":
              path = subPaths[1];
              break;
            case "experiments":
              path = subPaths[1];
              if (subPaths.length > 2) {
                path += "/" + subPaths[2];
              }
              break;
            default:
              path = "";
          }
        }
        return (window.location.protocol + "//" + window.location.host + "/" + path).toLowerCase();
      };
      metadata.provider.id = getIdentifyingUrl();
      if ((this.getParameterFromUrl("provider") != null)) {
        metadata.provider.id = this.getParameterFromUrl("provider");
      }
      if (document.title != null) {
        metadata.provider.displayName = document.title;
      } else {
        metadata.provider.displayName = "unnamed";
      }
      if (this._context === window.golab.ils.context.standalone) {
        if (this.getParameterFromUrl("author") === "true") {
          metadata.actor.objectType = "html_author";
        } else {
          metadata.actor.objectType = "html_student";
        }
      } else {
        metadata.actor.objectType = "person";
      }
      if ((this.getParameterFromUrl("username") != null)) {
        userNickname = this.getParameterFromUrl("username");
      } else if (this.getContext() === window.golab.ils.context.preview) {
        userNickname = "Preview";
      } else {
        userNickname = localStorage.getItem('goLabNickName');
        if (!userNickname) {
          while (!userNickname) {
            userNickname = prompt("Please enter nick name:");
            if (userNickname) {
              userNickname = userNickname.trim();
            }
          }
          localStorage.setItem('goLabNickName', userNickname);
        }
      }
      userNickname = userNickname.trim();
      windowTitle = window.document.title;
      if (!windowTitle || windowTitle[0] !== "[") {
        window.document.title = "[" + userNickname + "] " + windowTitle;
      }
      metadata.actor.displayName = userNickname;
      actorId = userNickname.toLowerCase() + "@" + metadata.provider.id;
      metadata.actor.id = actorId;
      removeQueryAndFragmentFromUrl = function(url) {
        var removePart, urlString;
        urlString = "" + url;
        removePart = function(character) {
          var lastIndex;
          lastIndex = urlString.lastIndexOf(character);
          if (lastIndex >= 0) {
            return urlString = urlString.substr(0, lastIndex);
          }
        };
        removePart("?");
        removePart("#");
        return urlString;
      };
      metadata.generator.id = metadata.generator.displayName + "@" + removeQueryAndFragmentFromUrl(metadata.provider.url);
      LocalMetadataHandler.__super__.constructor.call(this, metadata);
      cb(null, this);
    }

    LocalMetadataHandler.prototype.getParameterFromUrl = function(key) {
      var parameter, part, partParts, parts, queryPart, _i, _len;
      key = key.toLowerCase();
      parameter = null;
      queryPart = location.search.trim().toLowerCase();
      if (queryPart && queryPart[0] === "?") {
        parts = queryPart.substring(1).split("&");
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          partParts = part.split("=");
          if (partParts.length === 2 && partParts[0] === key) {
            parameter = partParts[1];
          }
        }
      }
      return parameter;
    };

    return LocalMetadataHandler;

  })(window.golab.ils.metadata.MetadataHandler);

}).call(this);

//# sourceMappingURL=MetadataHandler.js.map

/*
ILS Library for Go-Lab
author: María Jesús Rodríguez-Triana, Wissam Halimi
contact: maria.rodrigueztriana@epfl.ch
requirements: this library uses jquery
*/


(function() {
  var ils;
  var context_graasp = "graasp";
  var context_preview = "preview";
  var context_standalone_ils = "standalone_ils";
  var context_standalone_html = "standalone_html";
  var context_unknown = "unknown";

  ils = {
    // get the nickname of the student who is currently using the ils
    getCurrentUser: function(cb) {
      var username;
      var error = {"error" : "The username couldn't be obtained."};

      ils.identifyContext(function (context) {
        if (context == context_standalone_ils) {
          if (typeof(Storage) !== "undefined") {
            username = localStorage.getItem("graasp_user");
            if (username) {
              return cb(username.toLowerCase());
            } else {
              return cb(error);
            }
          } else {
            username = $.cookie('graasp_user');
            if (username) {
              return cb(username.toLowerCase());
            } else {
              return cb(error);
            }
          }
        } else if (context == context_graasp) {
          osapi.people.get({userId: '@viewer'}).execute(function(viewer) {
            username = viewer.displayName;
            if (username) {
              return cb(username.toLowerCase());
            } else if (viewer.error){
              return cb(error);
            } else {
              error = {
                "error" : "he username couldn't be obtained.",
                "log" : viewer.error
              };
            }
          });
        } else {
          return cb(error);
        }
     });
    },

    identifyContext: function(cb) {
      if (typeof osapi === "undefined" || osapi === null){
        return cb(context_standalone_html);

      // http://www.golabz.eu/apps/ OR  http://composer.golabz.eu/
      } else if (document.referrer.indexOf("golabz.eu") > -1 || document.referrer == "") {
        return cb(context_preview);
           
      // http://localhost:9091/ils/ OR http://graasp.eu/ils/
      } else if (document.referrer.indexOf("ils") > -1) {
        return cb(context_standalone_ils);
           
      // http://localhost:9091/applications/    http://localhost:9091/spaces/
      // http://graasp.eu/spaces/applications/  http://graasp.eu/spaces/spaces/
      } else if (document.referrer.indexOf("graasp.eu") > -1 || document.referrer.indexOf("localhost") > -1) {
        return cb(context_graasp);

      } else {
        return cb(context_unknown);
      }
    },

    // get the parent space of the widget 
    getParent: function(cb) {
      var error = {"error" : "The parent space couldn't be obtained."};
      osapi.context.get().execute(function(context_space) {
        if (context_space != undefined && context_space != null) {
          if (!context_space.error) {
            osapi.spaces.get({contextId: context_space.contextId}).execute(function (parent) {
              if (!parent.error) {
                return cb(parent);
              } else {
                error = {
                  "error" : "The parent space couldn't be obtained.",
                  "log" : context_space.error
                };
                return cb(error);
              }
            });
          } else {
            error = {
              "error" : "The parent space couldn't be obtained.",
              "log" : context_space.error
            };
            return cb(error);
        }
      }else{
        return cb(error);
      }
      });
    },

    // delete a resource by the resourceId, the result is true if the resource has been successfully deleted
    deleteResource: function(resourceId, cb) {
      var error = {};
      ils.existResource(resourceId, function (exists) {
        if (exists) {
          ils.getVault(function (vault) {
            ils.getCurrentUser(function (username) {
              osapi.documents.delete({contextId: resourceId}).execute(function (deleteResponse) {
                if (deleteResponse){
                  if (deleteResponse.error) {
                    ils.getApp(function (app) {
                      //log the action of adding this resource
                      ils.logAction(username, vault, resourceId, app, "remove", function (logResponse) {
                        if (!logResponse.error) {
                          return cb(true);
                        } else {
                          error = {
                            "error": "The resource removal couldn't be logged.",
                            "log": logResponse.error
                          };
                          return cb(error);
                       }
                     });
                    });
                  } else {
                    error = {
                      "error": "The resource couldn't be removed.",
                      "log": deleteResponse.error
                    };
                    return cb(error);
                  }
                } else {
                  error = {"error": "The resource couldn't be removed."};
                  return cb(error);
                }
              });
            });
          });
        } else {
          error = {"error": "The resource to be deleted is not available. The resource couldn't be removed."};
          return cb(error);
        }
      });
    },

    // verifies whether there is a resource by the resourceId, the result is true/false
    existResource: function(resourceId, cb) {
      var error = {};
      if (resourceId && resourceId != "") {
        osapi.documents.get({contextId: resourceId, size: "-1"}).execute(function(resource){
          if (resource && !resource.error && resource.url) {
            return cb(true);
          } else {
            return cb(false);
          }
        });
      } else {
        error = {"error" : "The resourceId cannot be empty. The resource couldn't be obtained."};
        return cb(error);
      }
    },

    // read a resource by the resourceId, the result is the combination of resource content and the metadata
    readResource: function(resourceId, cb) {
      var error = {};
      if (resourceId && resourceId != "") {
        osapi.documents.get({contextId: resourceId, size: "-1"}).execute(function(resource){
          if (!resource.error && resource.id) {
            ils.getIls(function(parentIls) {
              // get the associated activity of this resource
              // e.g. student mario has added a concept map via the app Concept Mapper in ILS 1000
              ils.getAction(resource.parentId, resourceId, function(action) {
                var metadata = "";
                if (resource.metadata) {
                  metadata = resource.metadata;
                }
                // append the metadata to the resource object
                resource["metadata"] = metadata;
                return cb(resource);
              });
            });
          } else {
            error = {
              "error" : "The resource is not available.",
              "log": resource.error
            };
            return cb(error);
          }
        });
      } else {
        error = {"error" : "The resourceId cannot be empty. The resource couldn't be read."};
        return cb(error);
      }
    },

    // returns the metadata related to a resource by the resourceId
    getMetadata: function(resourceId, cb) {
      var error = {};
      if (resourceId && resourceId != "") {
        osapi.documents.get({contextId: resourceId, size: "-1"}).execute(function(resource){
          if (!resource.error) {
            ils.getIls(function(parentIls) {
              // get the associated activity of this resource
              // e.g. student mario has added a concept map via the app Concept Mapper in ILS 1000
              ils.getAction(resource.parentId, resourceId, function(action) {
                if(resource.metadata) {
                  return cb(resource.metadata);
                } else {
                  error = {"error": "The resource has no metadata."};
                  return cb(error);
                }
              });
            });
          } else {
            error = {
              "error" : "The resource is not available.",
              "log": resource.error
            };
            return cb(error);
          }
        });
      } else {
        error = {"error" : "The resourceId cannot be empty. The metadata couldn't be obtained."};
        return cb(error);
      }
    },

    // returns the basic metadata inferred from the history
    obtainMetadataFromAction: function(metadata, action, parentIls) {
        var extendedMetadata = "";
        if(metadata){
          extendedMetadata= JSON.parse(metadata);
        }else{
          extendedMetadata = {};
        }
        if (action.actor) {
          extendedMetadata.actor = action.actor;
        }
        if (action.object) {
          extendedMetadata.target = {
            objectType: action.object.objectType,
            id: action.object.id,
            displayName: action.object.displayName
          };
        }
        if (action.generator) {
          extendedMetadata.generator = {
            objectType: action.generator.objectType,
            url: action.generator.url,
            id: action.generator.id,
            displayName: action.generator.displayName
          };
        }
        if(parentIls) {
          extendedMetadata.provider = {
            url: parentIls.profileUrl,
            id: parentIls.id,
            displayName: parentIls.displayName
          };
        }
        return (extendedMetadata);
    },

    // create a resource in the Vault, resourceName and content need to be passed
    // resourceName should be in string format, content should be in JSON format
    createResource: function(resourceName, content, metadata, cb) {
      var error = {};
      if (resourceName != null && resourceName != undefined) {
        ils.getVault(function(vault) {
          ils.listVaultNames(function(nameList){
            if(nameList.indexOf(resourceName)==-1) {
              ils.getCurrentUser(function(username){
                var creator = username;
                if (username.error) {
                  creator = "unknown";
                }
                var params = {
                  "document": {
                    "parentType": "@space",
                    "parentSpaceId": vault.id,
                    "mimeType": "txt",
                    "fileName": resourceName,
                    "content": JSON.stringify(content),
                    "metadata": metadata
                  }
                };

                osapi.documents.create(params).execute(function(resource){
                  if (resource && !resource.error && resource.id ) {
                    ils.getApp(function(app){
                      //log the action of adding this resource
                      ils.logAction(username, vault, resource.id, app, "add", function(response){
                        if (!response.error) {
                          return cb(resource);
                        }else{
                          error = {
                            "error" : "The resource creation couldn't be logged.",
                            "log" : response.error
                          };
                          return cb(error);
                        }
                      });
                    });
                  } else {
                    error = {
                      "error" : "The resource couldn't be created.",
                      "log" : resource.error
                    };
                    return cb(error);
                  }
                });
              });
            }else{
              error = {"error" : "The resourceName already exists in the space."};
              return cb(error);
            }
          });
        });
      } else {
        error = {"error" : "The resourceName cannot be empty. The resource couldn't be created."};
        return cb(error);
      }
    },

  // updates a resource in the Vault, resourceId, content and metadata need to be passed
  // content should be in JSON format
  updateResource: function(resourceId, content, metadata, cb) {
    var error = {};
    if (resourceId && resourceId != "") {
      osapi.documents.get({contextId: resourceId, size: "-1"}).execute(function(resource){
        if (!resource.error && resource.id) {
          ils.getCurrentUser(function(username){
            var newContent;
            var newMetadata;

            if(content && content!=""){
              newContent = JSON.stringify(content);
            }else{
              newContent = resource.content;
            }

            if(metadata && metadata!=""){
              newMetadata = metadata;
            }else{
              newMetadata = resource.metadata;
            }

            var params = {
              "contextId": resource.id,
              "document": {
                "parentType": resource.parentType,
                "parentSpaceId": resource.parentId,
                "mimeType": resource.mimeType,
                "fileName": resource.displayName,
                "content": newContent,
                "metadata": newMetadata
              }
            };

            osapi.documents.update(params).execute(function(resource){
              if (resource && !resource.error && resource.id ) {
                ils.getApp(function(app){
                  //log the action of adding this resource
                  ils.getVault(function(vault) {
                      ils.logAction(username, vault, resource.id, app, "add", function(response){
                        if (!response.error) {
                          return cb(resource);
                        }else{
                          error = {
                            "error": "The resource update couldn't be logged.",
                            "log": response.error
                          };
                          return cb(error);
                        }
                      });
                  });
                });

              } else {
                error = {
                  "error" : "The resource couldn't be updated.",
                  "log" : resource.error
                };
                return cb(error);
              }
            });
          });
        } else {
          error = {
            "error" : "The resource is not available.",
            "log" : resource.error
          };
          return cb(error);
        }
      });
    } else {
      error = {"error" : "The resourceName cannot be null. The resource couldn't be updated."};
      return cb(error);
    }
  },


  // get a list of all resources in the Vault
    listVault: function(cb) {
      var error = {"error" : "No resource available in the Vault."};
      ils.getVault(function(vault) {
        if(!vault.error) {
          osapi.documents.get({contextId: vault.id, contextType: "@space"}).execute(function (resources) {
            if (resources.list)
              return cb(resources.list);
            else
              return cb(error);
          });
        }else{
          return cb(vault.error);
        }
      });
    },

    // get a list of all resources in the Vault
    listVaultNames: function(cb) {
      var nameList = [];
      ils.listVault(function(resourceList) {
        if(!resourceList.error){
          for (i = 0; i < resourceList.length; i++) {
            nameList.push(resourceList[i].displayName);
          }
          return cb(nameList);
      }else{
          return cb(resourceList.error);
      }
      });
    },

    // get a list of all resources in the Vault including all the metadata extracted from the actions
    listVaultExtended: function(cb) {
      var error = {"error" : "No resource available in the Vault."};
      ils.getVault(function(vault) {
        osapi.documents.get({contextId: vault.id, contextType: "@space"}).execute(function(resources) {
          if (resources.list) {
           if (resources.list.length > 0) {
            ils.getIls(function (parentIls) {
              $.each(resources.list, function(index, value) {
                // get the associated activity of this resource
                // e.g. student mario has added a concept map via the app Concept Mapper in ILS 1000
                ils.getAction(vault.id, value.id, function (action) {
                  var metadata = "";
                  if (value.metadata) {
                    metadata = value.metadata;
                  }
                  // append the metadata to the resource object
                  value["metadata"] = metadata;
                });
              });
            });
          }
          return cb(resources.list);
        }else{
          return cb(error);
        }
        });
      });
    },

    // get the current ILS of the app
    getIls: function(cb) {
      var error;
      osapi.context.get().execute(function(space) {
        if (!space.error) {
          osapi.spaces.get({contextId: space.contextId}).execute(function (parentSpace) {
            if (!parentSpace.error) {
              //app at the ils level
              if(parentSpace.spaceType === 'ils'){
                return cb(parentSpace, parentSpace);
              }else{
                osapi.spaces.get({contextId: parentSpace.parentId}).execute(function (parentIls){
                  if (!parentIls.error) {
                    //app at the phase level
                     if (parentIls.spaceType === 'ils') {
                       return cb(parentIls, parentSpace);
                     } else {
                       error = {"error" : "The app is not located in an ILS or in one of its phases."};
                       return cb(error);
                     }
                  } else {
                    error = {
                      "error" : "The ils where the app is located is not available.",
                      "log" : parentIls.error
                    };
                    return cb(error);
                  }
                });
              }
            } else {
              error = {
                "error" : "The space where the app is located is not available.",
                "log" : parentSpace.error
              };
              return cb(error);

            }
          });
        } else {
          error = {
            "error" : "The id of the space where the app is located is not available.",
            "log" : space.error
          };
          return cb(error);
        }
      });
    },



    // get the Vault of the current ILS
    getVault: function(cb) {
      var error = {};
      ils.getIls(function(parentIls) {
        if (!parentIls.error) {
        osapi.spaces.get({contextId: parentIls.id, contextType: "@space"}).execute(
          function(subspaces) {
            if (subspaces.totalResults != 0) {
              var item, vault;
              vault = (function() {
                var i, len, ref, results;
                ref = subspaces.list;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                  item = ref[i];
                   if (item.hasOwnProperty("metadata") && item.metadata != undefined) {
                    if (item.metadata.type === "Vault") {
                      results.push(item);
                  }
                }
              }
              return results;
            })();
            return cb(vault[0]);
          } else {
            error = {"error" : "No subspaces in current ILS."};
            return cb(error);
          }
        });
      } else {
        error = {
          "error" : "The space is not available.",
          "log" : parentIls.error
        };
        return cb(error);
      }
    });
    },

    // get the info of the current app
    getApp: function(cb) {
      osapi.apps.get({contextId: "@self"}).execute(function(response){
        if (!response.error) {
          return cb(response);
        } else {
          var error = {
            "error": "The app couldn't be obtained.",
            "log": response.error
          };
          return cb(error);
        }
      });
    },

    // get the current appId
    getAppId: function(cb) {
      var error;
      osapi.apps.get({contextId: "@self"}).execute(function(response){
        if (!response.error){
          if (response.id) { //for os apps
            return cb(response.id);
          } else {
            ils.getIls(function(space) {
              if(space.id){ //for metawidget
                return cb(space.id);
              }else{
                error = {"error": "The appId couldn't be obtained. No App or metawidget was found."};
                return cb(error);
              }
            });
          }
        }else{
            error = {
              "error": "The appId couldn't be obtained.",
              "log": response.error
            };
            return cb(error);
        }
      });
    },

    // log the action of adding a resource in the Vault
    logAction: function(userName, vault, resourceId, app, actionType, cb) {
      var params = {
        "userId": "@viewer",
        "groupId": "@self",
        "activity": {
        "verb": actionType
        }
      };
      params.activity.actor = {
        "id": userName + "@" + vault.parentId.toString(), //the id of the ILS
        "objectType": "person",
        "name": userName
      };
      params.activity.object = {
        "id": resourceId.toString(),
        "objectType": "Asset",
        "graasp_object": "true"
      };
      params.activity.target = {
        "id": vault.id.toString(),
        "objectType": "Space",
        "graasp_object": "true"
      };
      params.activity.generator = {
        "id": app.id.toString(),
        "objectType": "Widget",
        "url": app.appUrl,
        "graasp_object": "true"
      };

      ils.getIls(function(parentSpace) {
        params.activity.provider = {
          "objectType": "ils",
          "url": parentSpace.profileUrl,
          "id": parentSpace.id.toString(),
          "displayName": parentSpace.displayName
        };
      });


      osapi.activitystreams.create(params).execute(function(response){
        if (!response.error) {
          return cb(response);
        } else {
          var error = {
            "error": "The activity couldn't be created.",
            "log": response.error
          };
          return cb(error);
        }
      });

    },

    // get the action of adding the resource in the Vault based on resourceId and vaultId
    getAction: function(vaultId, resourceId, cb) {
      var error;
      var params = {
        contextId: vaultId,
        contextType: "@space",
        count: 1,
        fields: "id,actor,verb,object,target,published,updated,generator",
        filterBy: "object.id",
        filterOp: "contains",
        filterValue: "assets/" + resourceId.toString(),
        ext: true
      };
      osapi.activitystreams.get(params).execute(function(response){
        if (!response.error) {
          if (response.totalResults > 0) {
            return cb(response.list[0]);
          } else {
            error = {"error": "The activity couldn't be obtained."};
            return cb(error);
          }
        } else {
          error = {
            "error": "The activity couldn't be obtained.",
            "log": response.error
          };
          return cb(error);
        }
      });
    },

  // get the type of inquiry phase where the app is running in
    getParentInquiryPhase: function(cb) {
      var error;
      this.getParent(function(parent) {
        if (!parent.error) {
          if (parent.hasOwnProperty("metadata") && parent.metadata.hasOwnProperty("type")) {
            return cb(parent.metadata.type);
          } else {
            error = {"error" : "The parent inquiry phase couldn't be obtained."}
            return cb(error);
          }
        }else{
          error = {
            "error": "The parent inquiry phase couldn't be obtained.",
            "log": parent.error
          };
          return cb(error);
        }
      });
    }
  };

  window.ils = ils;

}).call(this);

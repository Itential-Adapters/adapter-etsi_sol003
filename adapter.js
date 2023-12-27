/* @copyright Itential, LLC 2019 (pre-modifications) */

/* eslint import/no-dynamic-require: warn */
/* eslint object-curly-newline: warn */

// Set globals
/* global log */

/* Required libraries.  */
const path = require('path');

/* Fetch in the other needed components for the this Adaptor */
const AdapterBaseCl = require(path.join(__dirname, 'adapterBase.js'));

/**
 * This is the adapter/interface into Etsi_sol003
 */

/* GENERAL ADAPTER FUNCTIONS */
class EtsiSol003 extends AdapterBaseCl {
  /**
   * EtsiSol003 Adapter
   * @constructor
   */
  /* Working on changing the way we do Emit methods due to size and time constrainsts
  constructor(prongid, properties) {
    // Instantiate the AdapterBase super class
    super(prongid, properties);

    const restFunctionNames = this.getWorkflowFunctions();

    // Dynamically bind emit functions
    for (let i = 0; i < restFunctionNames.length; i += 1) {
      // Bind function to have name fnNameEmit for fnName
      const version = restFunctionNames[i].match(/__v[0-9]+/);
      const baseFnName = restFunctionNames[i].replace(/__v[0-9]+/, '');
      const fnNameEmit = version ? `${baseFnName}Emit${version}` : `${baseFnName}Emit`;
      this[fnNameEmit] = function (...args) {
        // extract the callback
        const callback = args[args.length - 1];
        // slice the callback from args so we can insert our own
        const functionArgs = args.slice(0, args.length - 1);
        // create a random name for the listener
        const eventName = `${restFunctionNames[i]}:${Math.random().toString(36)}`;
        // tell the calling class to start listening
        callback({ event: eventName, status: 'received' });
        // store parent for use of this context later
        const parent = this;
        // store emission function
        const func = function (val, err) {
          parent.removeListener(eventName, func);
          parent.emit(eventName, val, err);
        };
        // Use apply to call the function in a specific context
        this[restFunctionNames[i]].apply(this, functionArgs.concat([func])); // eslint-disable-line prefer-spread
      };
    }

    // Uncomment if you have things to add to the constructor like using your own properties.
    // Otherwise the constructor in the adapterBase will be used.
    // Capture my own properties - they need to be defined in propertiesSchema.json
    // if (this.allProps && this.allProps.myownproperty) {
    //   mypropvariable = this.allProps.myownproperty;
    // }
  }
  */

  /**
   * @callback healthCallback
   * @param {Object} reqObj - the request to send into the healthcheck
   * @param {Callback} callback - The results of the call
   */
  healthCheck(reqObj, callback) {
    // you can modify what is passed into the healthcheck by changing things in the newReq
    let newReq = null;
    if (reqObj) {
      newReq = Object.assign(...reqObj);
    }
    super.healthCheck(newReq, callback);
  }

  /**
   * @iapGetAdapterWorkflowFunctions
   */
  iapGetAdapterWorkflowFunctions(inIgnore) {
    let myIgnore = [
      'healthCheck',
      'iapGetAdapterWorkflowFunctions',
      'hasEntities',
      'getAuthorization'
    ];
    if (!inIgnore && Array.isArray(inIgnore)) {
      myIgnore = inIgnore;
    } else if (!inIgnore && typeof inIgnore === 'string') {
      myIgnore = [inIgnore];
    }

    // The generic adapter functions should already be ignored (e.g. healthCheck)
    // you can add specific methods that you do not want to be workflow functions to ignore like below
    // myIgnore.push('myMethodNotInWorkflow');

    return super.iapGetAdapterWorkflowFunctions(myIgnore);
  }

  /**
   * iapUpdateAdapterConfiguration is used to update any of the adapter configuration files. This
   * allows customers to make changes to adapter configuration without having to be on the
   * file system.
   *
   * @function iapUpdateAdapterConfiguration
   * @param {string} configFile - the name of the file being updated (required)
   * @param {Object} changes - an object containing all of the changes = formatted like the configuration file (required)
   * @param {string} entity - the entity to be changed, if an action, schema or mock data file (optional)
   * @param {string} type - the type of entity file to change, (action, schema, mock) (optional)
   * @param {string} action - the action to be changed, if an action, schema or mock data file (optional)
   * @param {boolean} replace - true to replace entire mock data, false to merge/append
   * @param {Callback} callback - The results of the call
   */
  iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, replace, callback) {
    const meth = 'adapter-iapUpdateAdapterConfiguration';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    super.iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, replace, callback);
  }

  /**
    * @summary Suspends adapter
    *
    * @function iapSuspendAdapter
    * @param {Callback} callback - callback function
    */
  iapSuspendAdapter(mode, callback) {
    const meth = 'adapter-iapSuspendAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapSuspendAdapter(mode, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Unsuspends adapter
    *
    * @function iapUnsuspendAdapter
    * @param {Callback} callback - callback function
    */
  iapUnsuspendAdapter(callback) {
    const meth = 'adapter-iapUnsuspendAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapUnsuspendAdapter(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Get the Adapter Queue
    *
    * @function iapGetAdapterQueue
    * @param {Callback} callback - callback function
    */
  iapGetAdapterQueue(callback) {
    const meth = 'adapter-iapGetAdapterQueue';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapGetAdapterQueue(callback);
  }

  /* SCRIPT CALLS */
  /**
   * See if the API path provided is found in this adapter
   *
   * @function iapFindAdapterPath
   * @param {string} apiPath - the api path to check on
   * @param {Callback} callback - The results of the call
   */
  iapFindAdapterPath(apiPath, callback) {
    const meth = 'adapter-iapFindAdapterPath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    super.iapFindAdapterPath(apiPath, callback);
  }

  /**
  * @summary Runs troubleshoot scripts for adapter
  *
  * @function iapTroubleshootAdapter
  * @param {Object} props - the connection, healthcheck and authentication properties
  *
  * @param {boolean} persistFlag - whether the adapter properties should be updated
  * @param {Callback} callback - The results of the call
  */
  iapTroubleshootAdapter(props, persistFlag, callback) {
    const meth = 'adapter-iapTroubleshootAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapTroubleshootAdapter(props, persistFlag, this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs healthcheck script for adapter
    *
    * @function iapRunAdapterHealthcheck
    * @param {Adapter} adapter - adapter instance to troubleshoot
    * @param {Callback} callback - callback function
    */
  iapRunAdapterHealthcheck(callback) {
    const meth = 'adapter-iapRunAdapterHealthcheck';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterHealthcheck(this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs connectivity check script for adapter
    *
    * @function iapRunAdapterConnectivity
    * @param {Callback} callback - callback function
    */
  iapRunAdapterConnectivity(callback) {
    const meth = 'adapter-iapRunAdapterConnectivity';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterConnectivity(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs basicGet script for adapter
    *
    * @function iapRunAdapterBasicGet
    * @param {Callback} callback - callback function
    */
  iapRunAdapterBasicGet(callback) {
    const meth = 'adapter-iapRunAdapterBasicGet';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterBasicGet(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
   * @summary moves entites into Mongo DB
   *
   * @function iapMoveAdapterEntitiesToDB
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                                  or the error
   */
  iapMoveAdapterEntitiesToDB(callback) {
    const meth = 'adapter-iapMoveAdapterEntitiesToDB';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapMoveAdapterEntitiesToDB(callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Deactivate adapter tasks
   *
   * @function iapDeactivateTasks
   *
   * @param {Array} tasks - List of tasks to deactivate
   * @param {Callback} callback
   */
  iapDeactivateTasks(tasks, callback) {
    const meth = 'adapter-iapDeactivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapDeactivateTasks(tasks, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Activate adapter tasks that have previously been deactivated
   *
   * @function iapActivateTasks
   *
   * @param {Array} tasks - List of tasks to activate
   * @param {Callback} callback
   */
  iapActivateTasks(tasks, callback) {
    const meth = 'adapter-iapActivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapActivateTasks(tasks, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* CACHE CALLS */
  /**
   * @summary Populate the cache for the given entities
   *
   * @function iapPopulateEntityCache
   * @param {String/Array of Strings} entityType - the entity type(s) to populate
   * @param {Callback} callback - whether the cache was updated or not for each entity type
   *
   * @returns status of the populate
   */
  iapPopulateEntityCache(entityTypes, callback) {
    const meth = 'adapter-iapPopulateEntityCache';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapPopulateEntityCache(entityTypes, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Retrieves data from cache for specified entity type
   *
   * @function iapRetrieveEntitiesCache
   * @param {String} entityType - entity of which to retrieve
   * @param {Object} options - settings of which data to return and how to return it
   * @param {Callback} callback - the data if it was retrieved
   */
  iapRetrieveEntitiesCache(entityType, options, callback) {
    const meth = 'adapter-iapCheckEiapRetrieveEntitiesCachentityCached';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRetrieveEntitiesCache(entityType, options, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* BROKER CALLS */
  /**
   * @summary Determines if this adapter supports any in a list of entities
   *
   * @function hasEntities
   * @param {String} entityType - the entity type to check for
   * @param {Array} entityList - the list of entities we are looking for
   *
   * @param {Callback} callback - A map where the entity is the key and the
   *                              value is true or false
   */
  hasEntities(entityType, entityList, callback) {
    const meth = 'adapter-hasEntities';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.hasEntities(entityType, entityList, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Get Appliance that match the deviceName
   *
   * @function getDevice
   * @param {String} deviceName - the deviceName to find (required)
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliance) or the error
   */
  getDevice(deviceName, callback) {
    const meth = 'adapter-getDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getDevice(deviceName, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Get Appliances that match the filter
   *
   * @function getDevicesFiltered
   * @param {Object} options - the data to use to filter the appliances (optional)
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliances) or the error
   */
  getDevicesFiltered(options, callback) {
    const meth = 'adapter-getDevicesFiltered';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getDevicesFiltered(options, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Gets the status for the provided appliance
   *
   * @function isAlive
   * @param {String} deviceName - the deviceName of the appliance. (required)
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance isAlive) or the error
   */
  isAlive(deviceName, callback) {
    const meth = 'adapter-isAlive';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.isAlive(deviceName, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Gets a config for the provided Appliance
   *
   * @function getConfig
   * @param {String} deviceName - the deviceName of the appliance. (required)
   * @param {String} format - the desired format of the config. (optional)
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance config) or the error
   */
  getConfig(deviceName, format, callback) {
    const meth = 'adapter-getConfig';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getConfig(deviceName, format, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Gets the device count from the system
   *
   * @function iapGetDeviceCount
   *
   * @param {getCallback} callback - callback function to return the result
   *                                    (count) or the error
   */
  iapGetDeviceCount(callback) {
    const meth = 'adapter-iapGetDeviceCount';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapGetDeviceCount(callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* GENERIC ADAPTER REQUEST - allows extension of adapter without new calls being added */
  /**
   * Makes the requested generic call
   *
   * @function iapExpandedGenericAdapterRequest
   * @param {Object} metadata - metadata for the call (optional).
   *                 Can be a stringified Object.
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (optional)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (optional)
   * @param {Object} pathVars - the parameters to be put within the url path (optional).
   *                 Can be a stringified Object.
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-iapExpandedGenericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * Makes the requested generic call
   *
   * @function genericAdapterRequest
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-genericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * Makes the requested generic call with no base path or version
   *
   * @function genericAdapterRequestNoBasePath
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-genericAdapterRequestNoBasePath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* INVENTORY CALLS */
  /**
   * @summary run the adapter lint script to return the results.
   *
   * @function iapRunAdapterLint
   * @param {Callback} callback - callback function
   */
  iapRunAdapterLint(callback) {
    const meth = 'adapter-iapRunAdapterLint';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapRunAdapterLint(callback);
  }

  /**
   * @summary run the adapter test scripts (baseunit and unit) to return the results.
   *    can not run integration as there can be implications with that.
   *
   * @function iapRunAdapterTests
   * @param {Callback} callback - callback function
   */
  iapRunAdapterTests(callback) {
    const meth = 'adapter-iapRunAdapterTests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapRunAdapterTests(callback);
  }

  /**
   * @summary provide inventory information abbout the adapter
   *
   * @function iapGetAdapterInventory
   * @param {Callback} callback - callback function
   */
  iapGetAdapterInventory(callback) {
    const meth = 'adapter-iapGetAdapterInventory';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapGetAdapterInventory(callback);
  }

  /**
   * @callback healthCallback
   * @param {Object} result - the result of the get request (contains an id and a status)
   */
  /**
   * @callback getCallback
   * @param {Object} result - the result of the get request (entity/ies)
   * @param {String} error - any error that occurred
   */
  /**
   * @callback createCallback
   * @param {Object} item - the newly created entity
   * @param {String} error - any error that occurred
   */
  /**
   * @callback updateCallback
   * @param {String} status - the status of the update action
   * @param {String} error - any error that occurred
   */
  /**
   * @callback deleteCallback
   * @param {String} status - the status of the delete action
   * @param {String} error - any error that occurred
   */

  /**
   * @function getApiVersions
   * @pronghornType method
   * @name getApiVersions
   * @summary Retrieve API version information
   *
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {GET} /getApiVersions
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getApiVersions(callback) {
    const meth = 'adapter-getApiVersions';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ApiVersions', 'getApiVersions', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getApiVersions'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postSubscriptions
   * @pronghornType method
   * @name postSubscriptions
   * @summary Subscribe.
The POST method creates a new subscription.
This method shall follow the provisions specified in the tables 11.4.2.3.1-1 and 11.4.2.3.1-2
for URI query parameters, request and response data structures, and response codes.
As the result of successfully executing this method, a new &#34;Individual subscription&#34;
resource as defined in clause 11.4.3 shall have been created. This method shall not
trigger any notification.
Creation of two &#34;Individual subscription&#34; resources with the same callba...(description truncated)
   *
   * @param {object} body - Details of the subscription to be created.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postSubscriptions
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postSubscriptions(body, callback) {
    const meth = 'adapter-postSubscriptions';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '', accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Subscriptions', 'postSubscriptions', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postSubscriptions'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSubscriptions
   * @pronghornType method
   * @name getSubscriptions
   * @summary Query Subscription Information.
The GET method queries the list of active subscriptions of the functional block that invokes the method.
It can be used e.g. for resynchronization after error situations.
This method shall follow the provisions specified in the tables 11.4.2.3.2-1 and 11.4.2.3.2-2
for URI query parameters, request and response data structures, and response codes.
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSubscriptions
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSubscriptions(filter, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getSubscriptions';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Subscriptions', 'getSubscriptions', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSubscriptions'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getSubscriptionsSubscriptionId
   * @pronghornType method
   * @name getSubscriptionsSubscriptionId
   * @summary Query Subscription Information.
The GET method reads an individual subscription.
This method shall follow the provisions specified in the tables 11.4.3.3.2-1 and 11.4.3.3.2-2
for URI query parameters, request and response data structures, and response codes.
   *
   * @param {string} subscriptionId - Identifier of this subscription.
This identifier can be retrieved from the resource referenced by the
&#34;Location&#34; HTTP header in the response to a POST request creating a
...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getSubscriptionsSubscriptionId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSubscriptionsSubscriptionId(subscriptionId, callback) {
    const meth = 'adapter-getSubscriptionsSubscriptionId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (subscriptionId === undefined || subscriptionId === null || subscriptionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subscriptionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [subscriptionId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Subscriptions', 'getSubscriptionsSubscriptionId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSubscriptionsSubscriptionId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteSubscriptionsSubscriptionId
   * @pronghornType method
   * @name deleteSubscriptionsSubscriptionId
   * @summary Terminate subscription.
The DELETE method terminates an individual subscription.
This method shall follow the provisions specified in the tables 11.4.3.3.5-1 and 11.4.3.3.5-2
for URI query parameters, request and response data structures, and response codes.
As the result of successfully executing this method, the &#34;Individual subscription&#34; resource
shall not exist any longer. This means that no notifications for that subscription shall be
sent to the formerly-subscribed API consumer.
NOTE: Due t...(description truncated)
   *
   * @param {string} subscriptionId - Identifier of this subscription.
This identifier can be retrieved from the resource referenced by the
&#34;Location&#34; HTTP header in the response to a POST request creating a
...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteSubscriptionsSubscriptionId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteSubscriptionsSubscriptionId(subscriptionId, callback) {
    const meth = 'adapter-deleteSubscriptionsSubscriptionId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (subscriptionId === undefined || subscriptionId === null || subscriptionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subscriptionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [subscriptionId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Subscriptions', 'deleteSubscriptionsSubscriptionId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteSubscriptionsSubscriptionId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getAlarms
   * @pronghornType method
   * @name getAlarms
   * @summary Get Alarm List.\nThe API consumer can use this method to retrieve information about the alarm list.\n
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getAlarms
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAlarms(filter, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getAlarms';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Alarms', 'getAlarms', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAlarms'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getAlarmsAlarmId
   * @pronghornType method
   * @name getAlarmsAlarmId
   * @summary The API consumer can use this method to read an individual alarm.\nThis method shall follow the prov
   *
   * @param {string} alarmId - Identifier of the alarm.\nThis identifier can be retrieved from the \&#34;id\&#34; attribute of the \&#34;alarm\&#34; attribute in the AlarmNotification or\nAlarmClearedNotification. It can al...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getAlarmsAlarmId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAlarmsAlarmId(alarmId, callback) {
    const meth = 'adapter-getAlarmsAlarmId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (alarmId === undefined || alarmId === null || alarmId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['alarmId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [alarmId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Alarms', 'getAlarmsAlarmId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAlarmsAlarmId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function patchAlarmsAlarmId
   * @pronghornType method
   * @name patchAlarmsAlarmId
   * @summary Acknowledge Alarm.\nThis method modifies an \&#34;Individual alarm\&#34; resource.\nThis method shall follow th
   *
   * @param {string} alarmId - Identifier of the alarm.\nThis identifier can be retrieved from the \&#34;id\&#34; attribute of the \&#34;alarm\&#34; attribute in the AlarmNotification or\nAlarmClearedNotification. It can al...(description truncated)
   * @param {object} body - The VNF creation parameters
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /patchAlarmsAlarmId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  patchAlarmsAlarmId(alarmId, body, callback) {
    const meth = 'adapter-patchAlarmsAlarmId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (alarmId === undefined || alarmId === null || alarmId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['alarmId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [alarmId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Alarms', 'patchAlarmsAlarmId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['patchAlarmsAlarmId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIndicators
   * @pronghornType method
   * @name getIndicators
   * @summary Get Indicator Value.\nThe GET method queries multiple VNF indicators.\nThis method shall follow the p
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getIndicators
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIndicators(filter, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getIndicators';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Indicators', 'getIndicators', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIndicators'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIndicatorsVnfInstanceId
   * @pronghornType method
   * @name getIndicatorsVnfInstanceId
   * @summary Get Indicator Value.\nThe GET method queries multiple VNF indicators related to a VNF instance.\nThis
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance to which the VNF indicator applies.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the resp...(description truncated)
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getIndicatorsVnfInstanceId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIndicatorsVnfInstanceId(vnfInstanceId, filter, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getIndicatorsVnfInstanceId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Indicators', 'getIndicatorsVnfInstanceId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIndicatorsVnfInstanceId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIndicatorsVnfInstanceIdIndicatorId
   * @pronghornType method
   * @name getIndicatorsVnfInstanceIdIndicatorId
   * @summary Get Indicator Value.\nThe GET method reads a VNF indicator.\nThis method shall follow the provisions
   *
   * @param {string} indicatorId - Identifier of the VNF indicator.\nThis identifier can be retrieved from the resource referenced by the\npayload body in the response to a POST request creating a new \&#34;Indiv...(description truncated)
   * @param {string} vnfInstanceId - Identifier of the VNF instance to which the VNF indicator applies.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the resp...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getIndicatorsVnfInstanceIdIndicatorId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIndicatorsVnfInstanceIdIndicatorId(indicatorId, vnfInstanceId, callback) {
    const meth = 'adapter-getIndicatorsVnfInstanceIdIndicatorId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (indicatorId === undefined || indicatorId === null || indicatorId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['indicatorId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [indicatorId, vnfInstanceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', contentType: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Indicators', 'getIndicatorsVnfInstanceIdIndicatorId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIndicatorsVnfInstanceIdIndicatorId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getIndicatorsSubscriptionsSubscriptionId
   * @pronghornType method
   * @name getIndicatorsSubscriptionsSubscriptionId
   * @summary Query Subscription Information.\nThe GET method reads an individual subscription.\nThis method shall
   *
   * @param {string} subscriptionId - Identifier of this subscription.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\n...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getIndicatorsSubscriptionsSubscriptionId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIndicatorsSubscriptionsSubscriptionId(subscriptionId, callback) {
    const meth = 'adapter-getIndicatorsSubscriptionsSubscriptionId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (subscriptionId === undefined || subscriptionId === null || subscriptionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subscriptionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [subscriptionId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', authorization: '', version: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Indicators', 'getIndicatorsSubscriptionsSubscriptionId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIndicatorsSubscriptionsSubscriptionId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteIndicatorsSubscriptionsSubscriptionId
   * @pronghornType method
   * @name deleteIndicatorsSubscriptionsSubscriptionId
   * @summary Terminate Subscription.\nThe DELETE method terminates an individual subscription.\nThis method shall
   *
   * @param {string} subscriptionId - Identifier of this subscription.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\n...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteIndicatorsSubscriptionsSubscriptionId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteIndicatorsSubscriptionsSubscriptionId(subscriptionId, callback) {
    const meth = 'adapter-deleteIndicatorsSubscriptionsSubscriptionId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (subscriptionId === undefined || subscriptionId === null || subscriptionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subscriptionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [subscriptionId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Indicators', 'deleteIndicatorsSubscriptionsSubscriptionId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteIndicatorsSubscriptionsSubscriptionId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstances
   * @pronghornType method
   * @name postVnfInstances
   * @summary The POST method creates a new VNF instance resource based on a VNF package that is onboarded and in
   *
   * @param {object} body - The VNF creation parameters
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstances
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstances(body, callback) {
    const meth = 'adapter-postVnfInstances';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstances', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstances'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfInstances
   * @pronghornType method
   * @name getVnfInstances
   * @summary Query VNF.\nThe GET method queries information about multiple VNF instances.\n
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [allFields] - Include all complex attributes in the response. See clause 5.3 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support this parameter.\n
   * @param {string} [fields] - Complex attributes to be included into the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeFields] - Complex attributes to be excluded from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeDefault] - Indicates to exclude the following complex attributes from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity shall support t...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfInstances
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfInstances(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getVnfInstances';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'getVnfInstances', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfInstances'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfInstancesVnfInstanceId
   * @pronghornType method
   * @name getVnfInstancesVnfInstanceId
   * @summary Query VNF.\n\nThe GET method retrieves information about a VNF instance by reading an \&#34;Individual VNF
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfInstancesVnfInstanceId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfInstancesVnfInstanceId(vnfInstanceId, callback) {
    const meth = 'adapter-getVnfInstancesVnfInstanceId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'getVnfInstancesVnfInstanceId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfInstancesVnfInstanceId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function patchVnfInstancesVnfInstanceId
   * @pronghornType method
   * @name patchVnfInstancesVnfInstanceId
   * @summary Modify VNF Information.\nThis method modifies an \&#34;Individual VNF instance\&#34; resource.\nChanges to the
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the VNF modification, as defined in clause 5.5.2.12.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /patchVnfInstancesVnfInstanceId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  patchVnfInstancesVnfInstanceId(vnfInstanceId, body, callback) {
    const meth = 'adapter-patchVnfInstancesVnfInstanceId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'patchVnfInstancesVnfInstanceId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['patchVnfInstancesVnfInstanceId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteVnfInstancesVnfInstanceId
   * @pronghornType method
   * @name deleteVnfInstancesVnfInstanceId
   * @summary Delete VNF Identifier.\nThis method deletes an \&#34;Individual VNF instance\&#34; resource.\nThis method shall
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteVnfInstancesVnfInstanceId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteVnfInstancesVnfInstanceId(vnfInstanceId, callback) {
    const meth = 'adapter-deleteVnfInstancesVnfInstanceId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'deleteVnfInstancesVnfInstanceId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteVnfInstancesVnfInstanceId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdInstantiate
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdInstantiate
   * @summary Instantiate VNF.\nThe POST method instantiates a VNF instance.\nThis method shall follow the provisio
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the VNF instantiation.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdInstantiate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdInstantiate(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdInstantiate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdInstantiate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdInstantiate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdScale
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdScale
   * @summary Scale VNF.\nThe POST method requests to scale a VNF instance resource incrementally.\nThis method sha
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the scale VNF operation.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdScale
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdScale(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdScale';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdScale', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdScale'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdScaleToLevel
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdScaleToLevel
   * @summary Scale VNF to Level.\nThe POST method requests to scale a VNF instance resource to a target level.\nTh
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the scale VNF to Level operation.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdScaleToLevel
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdScaleToLevel(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdScaleToLevel';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdScaleToLevel', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdScaleToLevel'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdChangeFlavour
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdChangeFlavour
   * @summary Change VNF Flavour.\nThis method shall follow the provisions specified in the tables 5.4.7.3.1-1 and
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the Change VNF Flavour operation.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdChangeFlavour
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdChangeFlavour(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdChangeFlavour';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdChangeFlavour', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdChangeFlavour'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdTerminate
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdTerminate
   * @summary Terminate VNF.\nThe POST method triggers the VNFM to terminate a VNF instance and to request to the
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the VNF termination.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdTerminate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdTerminate(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdTerminate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdTerminate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdTerminate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdHeal
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdHeal
   * @summary Heal VNF.\nThe POST method requests to heal a VNF instance.\nThis method shall follow the provisions
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the Heal VNF operation.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdHeal
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdHeal(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdHeal';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdHeal', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdHeal'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdOperate
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdOperate
   * @summary Operate VNF.\nThe POST method changes the operational state of a VNF instance resource.\nThis method
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the Operate VNF operation.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdOperate
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdOperate(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdOperate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdOperate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdOperate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdChangeExtConn
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdChangeExtConn
   * @summary Change External VNF Connectivity.\nThe POST method changes the external connectivity of a VNF instan
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the Change external VNF connectivity operation.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdChangeExtConn
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdChangeExtConn(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdChangeExtConn';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdChangeExtConn', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdChangeExtConn'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdChangeVnfpkg
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdChangeVnfpkg
   * @summary The POST method changes the current VNF package on which the VNF instance is based.\nThis method sha
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the Change current VNF package operation, as defined in clause 5.5.2.11a.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdChangeVnfpkg
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdChangeVnfpkg(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdChangeVnfpkg';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdChangeVnfpkg', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdChangeVnfpkg'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdCreateSnapshot
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdCreateSnapshot
   * @summary The POST method requests taking a snapshot a VNF instance and populating a \npreviously created VNF
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the \&#34;Create VNF Snapshot\&#34; operation, as defined in clause 5.5.2.21.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdCreateSnapshot
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdCreateSnapshot(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdCreateSnapshot';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdCreateSnapshot', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdCreateSnapshot'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfInstancesVnfInstanceIdRevertToSnapshot
   * @pronghornType method
   * @name postVnfInstancesVnfInstanceIdRevertToSnapshot
   * @summary The POST method requests reverting a VNF instance to a VNF snapshot.\nThis method shall follow the p
   *
   * @param {string} vnfInstanceId - Identifier of the VNF instance for the VNF snapshot to be reverted to. This identifier can be retrieved from the resource \nreferenced by the \&#34;Location\&#34; HTTP header in the...(description truncated)
   * @param {object} body - Parameters for the Revert to VNF snapshot operation, as defined in clause 5.5.2.26.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfInstancesVnfInstanceIdRevertToSnapshot
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfInstancesVnfInstanceIdRevertToSnapshot(vnfInstanceId, body, callback) {
    const meth = 'adapter-postVnfInstancesVnfInstanceIdRevertToSnapshot';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfInstanceId === undefined || vnfInstanceId === null || vnfInstanceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfInstanceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfInstanceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfInstances', 'postVnfInstancesVnfInstanceIdRevertToSnapshot', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfInstancesVnfInstanceIdRevertToSnapshot'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfLcmOpOccs
   * @pronghornType method
   * @name getVnfLcmOpOccs
   * @summary Get Operation Status.\nThe API consumer can use this method to query status information about multip
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [allFields] - Include all complex attributes in the response. See clause 5.3 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support this parameter.\n
   * @param {string} [fields] - Complex attributes to be included into the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeFields] - Complex attributes to be excluded from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeDefault] - Indicates to exclude the following complex attributes from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity shall support t...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfLcmOpOccs
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfLcmOpOccs(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getVnfLcmOpOccs';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfLcmOpOccs', 'getVnfLcmOpOccs', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfLcmOpOccs'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfLcmOpOccsVnfLcmOpOccId
   * @pronghornType method
   * @name getVnfLcmOpOccsVnfLcmOpOccId
   * @summary Get Operation Status.\nThe API consumer can use this method to retrieve status information about a V
   *
   * @param {string} vnfLcmOpOccId - Identifier of a VNF lifecycle management operation occurrence. This identifier can be retrieved from the resource\nreferenced by the \&#34;Location\&#34; HTTP header in the response...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfLcmOpOccsVnfLcmOpOccId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfLcmOpOccsVnfLcmOpOccId(vnfLcmOpOccId, callback) {
    const meth = 'adapter-getVnfLcmOpOccsVnfLcmOpOccId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfLcmOpOccId === undefined || vnfLcmOpOccId === null || vnfLcmOpOccId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfLcmOpOccId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfLcmOpOccId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfLcmOpOccs', 'getVnfLcmOpOccsVnfLcmOpOccId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfLcmOpOccsVnfLcmOpOccId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfLcmOpOccsVnfLcmOpOccIdRetry
   * @pronghornType method
   * @name postVnfLcmOpOccsVnfLcmOpOccIdRetry
   * @summary The POST method initiates retrying a VNF lifecycle operation if that operation\nhas experienced a te
   *
   * @param {string} vnfLcmOpOccId - Identifier of a VNF lifecycle management operation occurrence. This identifier can be retrieved from the resource\nreferenced by the \&#34;Location\&#34; HTTP header in the response...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfLcmOpOccsVnfLcmOpOccIdRetry
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfLcmOpOccsVnfLcmOpOccIdRetry(vnfLcmOpOccId, callback) {
    const meth = 'adapter-postVnfLcmOpOccsVnfLcmOpOccIdRetry';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfLcmOpOccId === undefined || vnfLcmOpOccId === null || vnfLcmOpOccId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfLcmOpOccId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfLcmOpOccId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdRetry', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfLcmOpOccsVnfLcmOpOccIdRetry'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfLcmOpOccsVnfLcmOpOccIdRollback
   * @pronghornType method
   * @name postVnfLcmOpOccsVnfLcmOpOccIdRollback
   * @summary The POST method initiates rolling back a VNF lifecycle operation if that operation\nhas experienced
   *
   * @param {string} vnfLcmOpOccId - Identifier of a VNF lifecycle management operation occurrence. This identifier can be retrieved from the resource\nreferenced by the \&#34;Location\&#34; HTTP header in the response...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfLcmOpOccsVnfLcmOpOccIdRollback
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfLcmOpOccsVnfLcmOpOccIdRollback(vnfLcmOpOccId, callback) {
    const meth = 'adapter-postVnfLcmOpOccsVnfLcmOpOccIdRollback';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfLcmOpOccId === undefined || vnfLcmOpOccId === null || vnfLcmOpOccId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfLcmOpOccId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfLcmOpOccId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdRollback', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfLcmOpOccsVnfLcmOpOccIdRollback'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfLcmOpOccsVnfLcmOpOccIdFail
   * @pronghornType method
   * @name postVnfLcmOpOccsVnfLcmOpOccIdFail
   * @summary The POST method marks a VNF lifecycle management operation occurrence as \&#34;finally failed\&#34;\nif that o
   *
   * @param {string} vnfLcmOpOccId - Identifier of a VNF lifecycle management operation occurrence. This identifier can be retrieved from the resource\nreferenced by the \&#34;Location\&#34; HTTP header in the response...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfLcmOpOccsVnfLcmOpOccIdFail
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfLcmOpOccsVnfLcmOpOccIdFail(vnfLcmOpOccId, callback) {
    const meth = 'adapter-postVnfLcmOpOccsVnfLcmOpOccIdFail';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfLcmOpOccId === undefined || vnfLcmOpOccId === null || vnfLcmOpOccId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfLcmOpOccId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfLcmOpOccId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdFail', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfLcmOpOccsVnfLcmOpOccIdFail'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfLcmOpOccsVnfLcmOpOccIdCancel
   * @pronghornType method
   * @name postVnfLcmOpOccsVnfLcmOpOccIdCancel
   * @summary The POST method initiates cancelling an ongoing VNF lifecycle operation while\nit is being executed
   *
   * @param {string} vnfLcmOpOccId - Identifier of a VNF lifecycle management operation occurrence. This identifier can be retrieved from the resource\nreferenced by the \&#34;Location\&#34; HTTP header in the response...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfLcmOpOccsVnfLcmOpOccIdCancel
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfLcmOpOccsVnfLcmOpOccIdCancel(vnfLcmOpOccId, callback) {
    const meth = 'adapter-postVnfLcmOpOccsVnfLcmOpOccIdCancel';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfLcmOpOccId === undefined || vnfLcmOpOccId === null || vnfLcmOpOccId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfLcmOpOccId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfLcmOpOccId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdCancel', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfLcmOpOccsVnfLcmOpOccIdCancel'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postVnfSnapshots
   * @pronghornType method
   * @name postVnfSnapshots
   * @summary The POST method creates a new \&#34;Individual VNF snapshot\&#34; resource.\n\nAs a result of successfully exec
   *
   * @param {object} body - The VNF snapshot resource creation parameters, as defined in clause 5.5.2.20.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postVnfSnapshots
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postVnfSnapshots(body, callback) {
    const meth = 'adapter-postVnfSnapshots';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshots', 'postVnfSnapshots', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postVnfSnapshots'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfSnapshots
   * @pronghornType method
   * @name getVnfSnapshots
   * @summary The GET method queries information about multiple VNF snapshots. This method shall follow the provi
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [allFields] - Include all complex attributes in the response. See clause 5.3 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support this parameter.\n
   * @param {string} [fields] - Complex attributes to be included into the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeFields] - Complex attributes to be excluded from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeDefault] - Indicates to exclude the following complex attributes from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity shall support t...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfSnapshots
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfSnapshots(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getVnfSnapshots';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshots', 'getVnfSnapshots', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfSnapshots'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfSnapshotsVnfSnapshotInfoId
   * @pronghornType method
   * @name getVnfSnapshotsVnfSnapshotInfoId
   * @summary The GET method retrieves information about a VNF snapshot by reading an \&#34;Individual VNF snapshot\&#34; \n
   *
   * @param {string} vnfSnapshotInfoId - Identifier of the \&#34;Individual VNF snapshot\&#34; resource. This identifier can be retrieved \nfrom the resource referenced by the \&#34;Location\&#34; HTTP header in the response to a PO...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfSnapshotsVnfSnapshotInfoId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfSnapshotsVnfSnapshotInfoId(vnfSnapshotInfoId, callback) {
    const meth = 'adapter-getVnfSnapshotsVnfSnapshotInfoId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfSnapshotInfoId === undefined || vnfSnapshotInfoId === null || vnfSnapshotInfoId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfSnapshotInfoId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfSnapshotInfoId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshots', 'getVnfSnapshotsVnfSnapshotInfoId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfSnapshotsVnfSnapshotInfoId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function patchVnfSnapshotsVnfSnapshotInfoId
   * @pronghornType method
   * @name patchVnfSnapshotsVnfSnapshotInfoId
   * @summary This method modifies an \&#34;Individual VNF snapshot\&#34; resource.\n\nChanges are applied to the VNF snapsho
   *
   * @param {string} vnfSnapshotInfoId - Identifier of the \&#34;Individual VNF snapshot\&#34; resource. This identifier can be retrieved \nfrom the resource referenced by the \&#34;Location\&#34; HTTP header in the response to a PO...(description truncated)
   * @param {object} body - Parameters for the VNF snapshot information modification, as defined in clause 5.5.2.24.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /patchVnfSnapshotsVnfSnapshotInfoId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  patchVnfSnapshotsVnfSnapshotInfoId(vnfSnapshotInfoId, body, callback) {
    const meth = 'adapter-patchVnfSnapshotsVnfSnapshotInfoId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfSnapshotInfoId === undefined || vnfSnapshotInfoId === null || vnfSnapshotInfoId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfSnapshotInfoId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfSnapshotInfoId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '', accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshots', 'patchVnfSnapshotsVnfSnapshotInfoId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['patchVnfSnapshotsVnfSnapshotInfoId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteVnfSnapshotsVnfSnapshotInfoId
   * @pronghornType method
   * @name deleteVnfSnapshotsVnfSnapshotInfoId
   * @summary This method deletes an \&#34;Individual VNF snapshot\&#34; resource and the associated VNF snapshot \ninformat
   *
   * @param {string} vnfSnapshotInfoId - Identifier of the \&#34;Individual VNF snapshot\&#34; resource. This identifier can be retrieved \nfrom the resource referenced by the \&#34;Location\&#34; HTTP header in the response to a PO...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteVnfSnapshotsVnfSnapshotInfoId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteVnfSnapshotsVnfSnapshotInfoId(vnfSnapshotInfoId, callback) {
    const meth = 'adapter-deleteVnfSnapshotsVnfSnapshotInfoId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfSnapshotInfoId === undefined || vnfSnapshotInfoId === null || vnfSnapshotInfoId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfSnapshotInfoId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfSnapshotInfoId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshots', 'deleteVnfSnapshotsVnfSnapshotInfoId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteVnfSnapshotsVnfSnapshotInfoId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot
   * @pronghornType method
   * @name getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot
   * @summary The GET method fetches the content of the VNF state snapshot. \nThis method shall follow the provisi
   *
   * @param {string} vnfSnapshotInfoId - Identifier of the \&#34;Individual VNF snapshot\&#34; resource. This identifier can be retrieved \nfrom the resource referenced by the \&#34;Location\&#34; HTTP header in the response to a PO...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot(vnfSnapshotInfoId, callback) {
    const meth = 'adapter-getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfSnapshotInfoId === undefined || vnfSnapshotInfoId === null || vnfSnapshotInfoId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfSnapshotInfoId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfSnapshotInfoId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '', accept: '', range: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshots', 'getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postGrants
   * @pronghornType method
   * @name postGrants
   * @summary Grant Lifecycle Operation.\nThe POST method requests a grant for a particular VNF lifecycle operatio
   *
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postGrants
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postGrants(body, callback) {
    const meth = 'adapter-postGrants';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Grants', 'postGrants', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postGrants'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getGrantsGrantId
   * @pronghornType method
   * @name getGrantsGrantId
   * @summary Grant Lifecycle Operation.\nThe GET method reads a grant.\nThis method shall follow the provisions sp
   *
   * @param {string} grantId - Identifier of the grant.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request granting a\nnew VNF ...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getGrantsGrantId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getGrantsGrantId(grantId, callback) {
    const meth = 'adapter-getGrantsGrantId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (grantId === undefined || grantId === null || grantId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['grantId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [grantId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Grants', 'getGrantsGrantId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getGrantsGrantId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getOnboardedVnfPackages
   * @pronghornType method
   * @name getOnboardedVnfPackages
   * @summary Query VNF Package Info.\nThe GET method queries the information of the VNF packages matching the fil
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [allFields] - Include all complex attributes in the response. See clause 5.3 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support this parameter.\n
   * @param {string} [fields] - Complex attributes to be included into the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeFields] - Complex attributes to be excluded from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeDefault] - Indicates to exclude the following complex attributes from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity shall support t...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getOnboardedVnfPackages
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getOnboardedVnfPackages(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getOnboardedVnfPackages';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('OnboardedVnfPackages', 'getOnboardedVnfPackages', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getOnboardedVnfPackages'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getOnboardedVnfPackagesVnfdId
   * @pronghornType method
   * @name getOnboardedVnfPackagesVnfdId
   * @summary Query VNF Package Info.\nThe GET method reads the information of an individual VNF package.\nThis met
   *
   * @param {string} vnfdId - Identifier of the VNFD and the VNF package.\nThe identifier is allocated by the VNF provider.\nThis identifier can be retrieved from the \&#34;vnfdId\&#34; attribute\nin the VnfPackag...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getOnboardedVnfPackagesVnfdId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getOnboardedVnfPackagesVnfdId(vnfdId, callback) {
    const meth = 'adapter-getOnboardedVnfPackagesVnfdId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfdId === undefined || vnfdId === null || vnfdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getOnboardedVnfPackagesVnfdId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getOnboardedVnfPackagesVnfdIdVnfd
   * @pronghornType method
   * @name getOnboardedVnfPackagesVnfdIdVnfd
   * @summary Query VNF Package Info\n\nThe GET method reads the content of the VNFD within a VNF package.\nThe VNFD
   *
   * @param {string} vnfdId - Identifier of the VNFD and the VNF package.\nThe identifier is allocated by the VNF provider.\nThis identifier can be retrieved from the \&#34;vnfdId\&#34; attribute\nin the VnfPackag...(description truncated)
   * @param {string} [includeSignature] - If this parameter is provided, the NFVO shall include in the ZIP\narchive the security information as specified above.\nThis URI query parameter is a flag, i.e. it shall ha...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getOnboardedVnfPackagesVnfdIdVnfd
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getOnboardedVnfPackagesVnfdIdVnfd(vnfdId, includeSignature, callback) {
    const meth = 'adapter-getOnboardedVnfPackagesVnfdIdVnfd';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfdId === undefined || vnfdId === null || vnfdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { includeSignature };
    const queryParams = {};
    const pathVars = [vnfdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdVnfd', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getOnboardedVnfPackagesVnfdIdVnfd'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getOnboardedVnfPackagesVnfdIdManifest
   * @pronghornType method
   * @name getOnboardedVnfPackagesVnfdIdManifest
   * @summary Query VNF Package Manifest\n\nThe GET method reads the content of the manifest within a VNF package.\n
   *
   * @param {string} vnfdId - Identifier of the VNFD and the VNF package.\nThe identifier is allocated by the VNF provider.\nThis identifier can be retrieved from the \&#34;vnfdId\&#34; attribute\nin the VnfPackag...(description truncated)
   * @param {string} [includeSignature] - If this parameter is provided, the NFVO shall include in the ZIP\narchive the security information as specified above.\nThis URI query parameter is a flag, i.e. it shall ha...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getOnboardedVnfPackagesVnfdIdManifest
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getOnboardedVnfPackagesVnfdIdManifest(vnfdId, includeSignature, callback) {
    const meth = 'adapter-getOnboardedVnfPackagesVnfdIdManifest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfdId === undefined || vnfdId === null || vnfdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { includeSignature };
    const queryParams = {};
    const pathVars = [vnfdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdManifest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getOnboardedVnfPackagesVnfdIdManifest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getOnboardedVnfPackagesVnfdIdPackageContent
   * @pronghornType method
   * @name getOnboardedVnfPackagesVnfdIdPackageContent
   * @summary Fetch VNF Package.\nThe GET method fetches the content of a VNF package identified by the\nVNF packag
   *
   * @param {string} vnfdId - Identifier of the VNFD and the VNF package.\nThe identifier is allocated by the VNF provider.\nThis identifier can be retrieved from the \&#34;vnfdId\&#34; attribute\nin the VnfPackag...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getOnboardedVnfPackagesVnfdIdPackageContent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getOnboardedVnfPackagesVnfdIdPackageContent(vnfdId, callback) {
    const meth = 'adapter-getOnboardedVnfPackagesVnfdIdPackageContent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfdId === undefined || vnfdId === null || vnfdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', range: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdPackageContent', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getOnboardedVnfPackagesVnfdIdPackageContent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getOnboardedVnfPackagesVnfdIdArtifacts
   * @pronghornType method
   * @name getOnboardedVnfPackagesVnfdIdArtifacts
   * @summary Fetch VNF Package Artifacts.\n\nThe GET method shall return an archive that contains a set of artifac
   *
   * @param {string} vnfdId - Identifier of the VNFD and the VNF package.\nThe identifier is allocated by the VNF provider.\nThis identifier can be retrieved from the \&#34;vnfdId\&#34; attribute\nin the VnfPackag...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getOnboardedVnfPackagesVnfdIdArtifacts
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getOnboardedVnfPackagesVnfdIdArtifacts(vnfdId, callback) {
    const meth = 'adapter-getOnboardedVnfPackagesVnfdIdArtifacts';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfdId === undefined || vnfdId === null || vnfdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', range: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdArtifacts', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getOnboardedVnfPackagesVnfdIdArtifacts'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath
   * @pronghornType method
   * @name getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath
   * @summary Fetch VNF Package Artifacts.\nThe GET method fetches the content of an artifact within a VNF package
   *
   * @param {string} artifactPath - SequenceFor an artifact contained as a file in the VNF package,\nthis variable shall contain a sequence of one or more path segments\nrepresenting the path of the artifact ...(description truncated)
   * @param {string} vnfdId - Identifier of the VNFD and the VNF package.\nThe identifier is allocated by the VNF provider.\nThis identifier can be retrieved from the \&#34;vnfdId\&#34; attribute\nin the VnfPackag...(description truncated)
   * @param {string} [includeSignature] - If this parameter is provided, the NFVO shall include in the ZIP\narchive the security information as specified above.\nThis URI query parameter is a flag, i.e. it shall ha...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath(artifactPath, vnfdId, includeSignature, callback) {
    const meth = 'adapter-getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (artifactPath === undefined || artifactPath === null || artifactPath === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['artifactPath'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (vnfdId === undefined || vnfdId === null || vnfdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { includeSignature };
    const queryParams = {};
    const pathVars = [artifactPath, vnfdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', range: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfPackagesVnfPkgId
   * @pronghornType method
   * @name getVnfPackagesVnfPkgId
   * @summary Query VNF Package Info.\nThe GET method reads the information of an individual VNF package.\nThis met
   *
   * @param {string} vnfPkgId - Identifier of the VNF package. The identifier is allocated by the\nNFVO.\nThis identifier can be retrieved from the \&#34;vnfPkgId\&#34; attribute in\nthe VnfPackageOnboardingNotifica...(description truncated)
   * @param {string} [includeSignature] - If this parameter is provided, the NFVO shall include in the ZIP\narchive the security information as specified above.\nThis URI query parameter is a flag, i.e. it shall ha...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfPackagesVnfPkgId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfPackagesVnfPkgId(vnfPkgId, includeSignature, callback) {
    const meth = 'adapter-getVnfPackagesVnfPkgId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfPkgId === undefined || vnfPkgId === null || vnfPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { includeSignature };
    const queryParams = {};
    const pathVars = [vnfPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfPackages', 'getVnfPackagesVnfPkgId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfPackagesVnfPkgId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfPackagesVnfPkgIdVnfd
   * @pronghornType method
   * @name getVnfPackagesVnfPkgIdVnfd
   * @summary Query VNF Package Info\n\nThe GET method reads the content of the VNFD within a VNF package.\nThe VNFD
   *
   * @param {string} vnfPkgId - Identifier of the VNF package. The identifier is allocated by the\nNFVO.\nThis identifier can be retrieved from the \&#34;vnfPkgId\&#34; attribute in\nthe VnfPackageOnboardingNotifica...(description truncated)
   * @param {string} [includeSignature] - If this parameter is provided, the NFVO shall include in the ZIP\narchive the security information as specified above.\nThis URI query parameter is a flag, i.e. it shall ha...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfPackagesVnfPkgIdVnfd
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfPackagesVnfPkgIdVnfd(vnfPkgId, includeSignature, callback) {
    const meth = 'adapter-getVnfPackagesVnfPkgIdVnfd';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfPkgId === undefined || vnfPkgId === null || vnfPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { includeSignature };
    const queryParams = {};
    const pathVars = [vnfPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfPackages', 'getVnfPackagesVnfPkgIdVnfd', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfPackagesVnfPkgIdVnfd'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfPackagesVnfPkgIdManifest
   * @pronghornType method
   * @name getVnfPackagesVnfPkgIdManifest
   * @summary Query VNF Package Manifest\n\nThe GET method reads the content of the manifest within a VNF package.\n
   *
   * @param {string} vnfPkgId - Identifier of the VNF package. The identifier is allocated by the\nNFVO.\nThis identifier can be retrieved from the \&#34;vnfPkgId\&#34; attribute in\nthe VnfPackageOnboardingNotifica...(description truncated)
   * @param {string} [includeSignature] - If this parameter is provided, the NFVO shall include in the ZIP\narchive the security information as specified above.\nThis URI query parameter is a flag, i.e. it shall ha...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfPackagesVnfPkgIdManifest
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfPackagesVnfPkgIdManifest(vnfPkgId, includeSignature, callback) {
    const meth = 'adapter-getVnfPackagesVnfPkgIdManifest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfPkgId === undefined || vnfPkgId === null || vnfPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { includeSignature };
    const queryParams = {};
    const pathVars = [vnfPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfPackages', 'getVnfPackagesVnfPkgIdManifest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfPackagesVnfPkgIdManifest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfPackagesVnfPkgIdPackageContent
   * @pronghornType method
   * @name getVnfPackagesVnfPkgIdPackageContent
   * @summary Fetch VNF Package.\nThe GET method fetches the content of a VNF package identified by the\nVNF packag
   *
   * @param {string} vnfPkgId - Identifier of the VNF package. The identifier is allocated by the\nNFVO.\nThis identifier can be retrieved from the \&#34;vnfPkgId\&#34; attribute in\nthe VnfPackageOnboardingNotifica...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfPackagesVnfPkgIdPackageContent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfPackagesVnfPkgIdPackageContent(vnfPkgId, callback) {
    const meth = 'adapter-getVnfPackagesVnfPkgIdPackageContent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfPkgId === undefined || vnfPkgId === null || vnfPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', range: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfPackages', 'getVnfPackagesVnfPkgIdPackageContent', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfPackagesVnfPkgIdPackageContent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfPackagesVnfPkgIdArtifacts
   * @pronghornType method
   * @name getVnfPackagesVnfPkgIdArtifacts
   * @summary Fetch VNF Package Artifacts.\n\nThe GET method shall return an archive that contains a set of artifac
   *
   * @param {string} vnfPkgId - Identifier of the VNF package. The identifier is allocated by the\nNFVO.\nThis identifier can be retrieved from the \&#34;vnfPkgId\&#34; attribute in\nthe VnfPackageOnboardingNotifica...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfPackagesVnfPkgIdArtifacts
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfPackagesVnfPkgIdArtifacts(vnfPkgId, callback) {
    const meth = 'adapter-getVnfPackagesVnfPkgIdArtifacts';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfPkgId === undefined || vnfPkgId === null || vnfPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', range: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfPackages', 'getVnfPackagesVnfPkgIdArtifacts', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfPackagesVnfPkgIdArtifacts'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfPackagesVnfPkgIdArtifactsArtifactPath
   * @pronghornType method
   * @name getVnfPackagesVnfPkgIdArtifactsArtifactPath
   * @summary Fetch VNF Package Artifacts.\nThe GET method fetches the content of an artifact within a VNF package
   *
   * @param {string} artifactPath - SequenceFor an artifact contained as a file in the VNF package,\nthis variable shall contain a sequence of one or more path segments\nrepresenting the path of the artifact ...(description truncated)
   * @param {string} vnfPkgId - Identifier of the VNF package. The identifier is allocated by the\nNFVO.\nThis identifier can be retrieved from the \&#34;vnfPkgId\&#34; attribute in\nthe VnfPackageOnboardingNotifica...(description truncated)
   * @param {string} [includeSignature] - If this parameter is provided, the NFVO shall include in the ZIP\narchive the security information as specified above.\nThis URI query parameter is a flag, i.e. it shall ha...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfPackagesVnfPkgIdArtifactsArtifactPath
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfPackagesVnfPkgIdArtifactsArtifactPath(artifactPath, vnfPkgId, includeSignature, callback) {
    const meth = 'adapter-getVnfPackagesVnfPkgIdArtifactsArtifactPath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (artifactPath === undefined || artifactPath === null || artifactPath === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['artifactPath'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (vnfPkgId === undefined || vnfPkgId === null || vnfPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { includeSignature };
    const queryParams = {};
    const pathVars = [artifactPath, vnfPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', range: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfPackages', 'getVnfPackagesVnfPkgIdArtifactsArtifactPath', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfPackagesVnfPkgIdArtifactsArtifactPath'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postPmJobs
   * @pronghornType method
   * @name postPmJobs
   * @summary Create PM Job.\nThe POST method creates a PM job.\nThis method shall follow the provisions specified
   *
   * @param {object} body - The VNF creation parameters
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postPmJobs
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postPmJobs(body, callback) {
    const meth = 'adapter-postPmJobs';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PmJobs', 'postPmJobs', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postPmJobs'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getPmJobs
   * @pronghornType method
   * @name getPmJobs
   * @summary Query PM Job.\nThe API consumer can use this method to retrieve information about PM jobs.\nThis meth
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [allFields] - Include all complex attributes in the response. See clause 5.3 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support this parameter.\n
   * @param {string} [fields] - Complex attributes to be included into the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeFields] - Complex attributes to be excluded from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity should support this parameter.\n
   * @param {string} [excludeDefault] - Indicates to exclude the following complex attributes from the response. See clause 5.3 of ETSI GS NFV-SOL 013 for details. The NFV-MANO functional entity shall support t...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getPmJobs
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPmJobs(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getPmJobs';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PmJobs', 'getPmJobs', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPmJobs'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getPmJobsPmJobId
   * @pronghornType method
   * @name getPmJobsPmJobId
   * @summary Query PM Job.\nThe API consumer can use this method for reading an individual PM job.\nThis method sh
   *
   * @param {string} pmJobId - Identifier of the PM job.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\nnew \&#34;In...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getPmJobsPmJobId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPmJobsPmJobId(pmJobId, callback) {
    const meth = 'adapter-getPmJobsPmJobId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (pmJobId === undefined || pmJobId === null || pmJobId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['pmJobId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [pmJobId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PmJobs', 'getPmJobsPmJobId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPmJobsPmJobId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function patchPmJobsPmJobId
   * @pronghornType method
   * @name patchPmJobsPmJobId
   * @summary This method allows to modify an \&#34;Individual PM job\&#34; resource.\nThis method shall follow the provisio
   *
   * @param {string} pmJobId - Identifier of the PM job.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\nnew \&#34;In...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /patchPmJobsPmJobId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  patchPmJobsPmJobId(pmJobId, callback) {
    const meth = 'adapter-patchPmJobsPmJobId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (pmJobId === undefined || pmJobId === null || pmJobId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['pmJobId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [pmJobId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PmJobs', 'patchPmJobsPmJobId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['patchPmJobsPmJobId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deletePmJobsPmJobId
   * @pronghornType method
   * @name deletePmJobsPmJobId
   * @summary Delete PM Job.\nThis method terminates an individual PM job.\nThis method shall follow the provisions
   *
   * @param {string} pmJobId - Identifier of the PM job.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\nnew \&#34;In...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deletePmJobsPmJobId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deletePmJobsPmJobId(pmJobId, callback) {
    const meth = 'adapter-deletePmJobsPmJobId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (pmJobId === undefined || pmJobId === null || pmJobId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['pmJobId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [pmJobId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PmJobs', 'deletePmJobsPmJobId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deletePmJobsPmJobId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getPmJobsPmJobIdReportsReportId
   * @pronghornType method
   * @name getPmJobsPmJobIdReportsReportId
   * @summary The API consumer can use this method for reading an individual performance report.\nThis method shal
   *
   * @param {string} pmJobId - Identifier of the PM job.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\nnew \&#34;In...(description truncated)
   * @param {string} reportId - Identifier of the performance report.\n
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getPmJobsPmJobIdReportsReportId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPmJobsPmJobIdReportsReportId(pmJobId, reportId, callback) {
    const meth = 'adapter-getPmJobsPmJobIdReportsReportId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (pmJobId === undefined || pmJobId === null || pmJobId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['pmJobId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (reportId === undefined || reportId === null || reportId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['reportId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [pmJobId, reportId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PmJobs', 'getPmJobsPmJobIdReportsReportId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPmJobsPmJobIdReportsReportId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function postThresholds
   * @pronghornType method
   * @name postThresholds
   * @summary Create Threshold.\nThe POST method can be used by the API consumer to create a threshold.\nThis metho
   *
   * @param {object} body - Request parameters to create a threshold resource.
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /postThresholds
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  postThresholds(body, callback) {
    const meth = 'adapter-postThresholds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Thresholds', 'postThresholds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['postThresholds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getThresholds
   * @pronghornType method
   * @name getThresholds
   * @summary Query Threshold.\nThe API consumer can use this method to query information about thresholds.\nThis m
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getThresholds
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getThresholds(filter, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getThresholds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { accept: '', authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Thresholds', 'getThresholds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getThresholds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getThresholdsThresholdId
   * @pronghornType method
   * @name getThresholdsThresholdId
   * @summary Query Threshold.\nThe API consumer can use this method for reading an individual threshold\nThis meth
   *
   * @param {string} thresholdId - Identifier of the threshold.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\nnew ...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getThresholdsThresholdId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getThresholdsThresholdId(thresholdId, callback) {
    const meth = 'adapter-getThresholdsThresholdId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (thresholdId === undefined || thresholdId === null || thresholdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['thresholdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [thresholdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '', accept: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Thresholds', 'getThresholdsThresholdId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getThresholdsThresholdId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function patchThresholdsThresholdId
   * @pronghornType method
   * @name patchThresholdsThresholdId
   * @summary This method allows to modify an \&#34;Individual threshold\&#34; resource.\nThis method shall follow the provi
   *
   * @param {string} thresholdId - Identifier of the threshold.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\nnew ...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /patchThresholdsThresholdId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  patchThresholdsThresholdId(thresholdId, callback) {
    const meth = 'adapter-patchThresholdsThresholdId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (thresholdId === undefined || thresholdId === null || thresholdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['thresholdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [thresholdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Thresholds', 'patchThresholdsThresholdId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['patchThresholdsThresholdId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function deleteThresholdsThresholdId
   * @pronghornType method
   * @name deleteThresholdsThresholdId
   * @summary Delete Threshold.\nThis method allows to delete a threshold.\nThis method shall follow the provisions
   *
   * @param {string} thresholdId - Identifier of the threshold.\nThis identifier can be retrieved from the resource referenced by the\n\&#34;Location\&#34; HTTP header in the response to a POST request creating a\nnew ...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /deleteThresholdsThresholdId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteThresholdsThresholdId(thresholdId, callback) {
    const meth = 'adapter-deleteThresholdsThresholdId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (thresholdId === undefined || thresholdId === null || thresholdId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['thresholdId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [thresholdId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { authorization: '', version: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Thresholds', 'deleteThresholdsThresholdId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteThresholdsThresholdId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfSnapshotPackages
   * @pronghornType method
   * @name getVnfSnapshotPackages
   * @summary The GET method queries the information of the VNF packages matching the filter.\n
   *
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfSnapshotPackages
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfSnapshotPackages(filter, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getVnfSnapshotPackages';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '', accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshotPackages', 'getVnfSnapshotPackages', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfSnapshotPackages'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfSnapshotPackagesVnfSnapshotPkgId
   * @pronghornType method
   * @name getVnfSnapshotPackagesVnfSnapshotPkgId
   * @summary The GET method reads the information of an individual VNF snapshot package.\n
   *
   * @param {string} vnfSnapshotPkgId - Identifier of the VNF snapshot package. The identifier is allocated by the NFVO.\nThis identifier can be retrieved from the \&#34;id\&#34; attribute of the applicable \&#34;VnfSnapshotPk...(description truncated)
   * @param {string} [filter] - Attribute-based filtering expression according to clause 5.2 of ETSI GS NFV-SOL 013. The NFV-MANO functional entity shall support receiving this parameter as part of the ...(description truncated)
   * @param {string} [nextpageOpaqueMarker] - Marker to obtain the next page of a paged response. Shall be supported by the NFV-MANO functional entity if the entity supports alternative 2 (paging) according to clause...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfSnapshotPackagesVnfSnapshotPkgId
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfSnapshotPackagesVnfSnapshotPkgId(vnfSnapshotPkgId, filter, nextpageOpaqueMarker, callback) {
    const meth = 'adapter-getVnfSnapshotPackagesVnfSnapshotPkgId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfSnapshotPkgId === undefined || vnfSnapshotPkgId === null || vnfSnapshotPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfSnapshotPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { filter, nextpageOpaqueMarker };
    const queryParams = {};
    const pathVars = [vnfSnapshotPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '', accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshotPackages', 'getVnfSnapshotPackagesVnfSnapshotPkgId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfSnapshotPackagesVnfSnapshotPkgId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent
   * @pronghornType method
   * @name getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent
   * @summary The GET method fetches the content of a VNF snapshot package.\n
   *
   * @param {string} vnfSnapshotPkgId - Identifier of the VNF snapshot package. The identifier is allocated by the NFVO.\nThis identifier can be retrieved from the \&#34;id\&#34; attribute of the applicable \&#34;VnfSnapshotPk...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent(vnfSnapshotPkgId, callback) {
    const meth = 'adapter-getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfSnapshotPkgId === undefined || vnfSnapshotPkgId === null || vnfSnapshotPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfSnapshotPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfSnapshotPkgId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '', accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshotPackages', 'getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @function getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath
   * @pronghornType method
   * @name getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath
   * @summary The GET method fetches the content of an artifact within the VNF snapshot package.\n
   *
   * @param {string} vnfSnapshotPkgId - Identifier of the VNF snapshot package. The identifier is allocated by the NFVO.\nThis identifier can be retrieved from the \&#34;id\&#34; attribute of the applicable \&#34;VnfSnapshotPk...(description truncated)
   * @param {string} artifactPath - For an artifact contained as a file in the VNF snapshot package, this variable shall contain a sequence \nof one or path segments representing the path of the artifact wit...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   * @return {object} results - An object containing the response of the action
   *
   * @route {POST} /getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath
   * @roles admin
   * @task true
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath(vnfSnapshotPkgId, artifactPath, callback) {
    const meth = 'adapter-getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (vnfSnapshotPkgId === undefined || vnfSnapshotPkgId === null || vnfSnapshotPkgId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['vnfSnapshotPkgId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (artifactPath === undefined || artifactPath === null || artifactPath === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['artifactPath'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [vnfSnapshotPkgId, artifactPath];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;
    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { version: '', authorization: '', accept: '', contentType: '' };
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders, authData, callProperties, filter, priority, event
    // see adapter code documentation for more information on the request object's fields
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('VnfSnapshotPackages', 'getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }
}

module.exports = EtsiSol003;

/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint no-unused-vars: warn */
/* eslint no-underscore-dangle: warn */

// include required items for testing & logging
const assert = require('assert');
const fs = require('fs');
const mocha = require('mocha');
const path = require('path');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');
const util = require('util');
const pronghorn = require('../../pronghorn.json');

pronghorn.methodsByName = pronghorn.methods.reduce((result, meth) => ({ ...result, [meth.name]: meth }), {});
const anything = td.matchers.anything();

// stub and attemptTimeout are used throughout the code so set them here
let logLevel = 'none';
const stub = true;
const isRapidFail = false;
const isSaveMockData = false;
const attemptTimeout = 5000;

// these variables can be changed to run in integrated mode so easier to set them here
// always check these in with bogus data!!!
const host = 'replace.hostorip.here';
const username = 'username';
const password = 'password';
const protocol = 'http';
const port = 80;
const sslenable = false;
const sslinvalid = false;

// these are the adapter properties. You generally should not need to alter
// any of these after they are initially set up
global.pronghornProps = {
  pathProps: {
    encrypted: false
  },
  adapterProps: {
    adapters: [{
      id: 'Test-etsi_sol003',
      type: 'EtsiSol003',
      properties: {
        host,
        port,
        base_path: '/',
        version: '',
        cache_location: 'none',
        encode_pathvars: true,
        save_metric: false,
        stub,
        protocol,
        authentication: {
          auth_method: 'request_token',
          username,
          password,
          token: '',
          invalid_token_error: 401,
          token_timeout: 1800000,
          token_cache: 'local',
          auth_field: 'header.headers.Authorization',
          auth_field_format: 'Bearer {token}',
          auth_logging: false,
          client_id: '',
          client_secret: '',
          grant_type: ''
        },
        healthcheck: {
          type: 'none',
          frequency: 60000,
          query_object: {}
        },
        throttle: {
          throttle_enabled: false,
          number_pronghorns: 1,
          sync_async: 'sync',
          max_in_queue: 1000,
          concurrent_max: 1,
          expire_timeout: 0,
          avg_runtime: 200,
          priorities: [
            {
              value: 0,
              percent: 100
            }
          ]
        },
        request: {
          number_redirects: 0,
          number_retries: 3,
          limit_retry_error: [0],
          failover_codes: [],
          attempt_timeout: attemptTimeout,
          global_request: {
            payload: {},
            uriOptions: {},
            addlHeaders: {},
            authData: {}
          },
          healthcheck_on_timeout: true,
          return_raw: true,
          archiving: false,
          return_request: false
        },
        proxy: {
          enabled: false,
          host: '',
          port: 1,
          protocol: 'http',
          username: '',
          password: ''
        },
        ssl: {
          ecdhCurve: '',
          enabled: sslenable,
          accept_invalid_cert: sslinvalid,
          ca_file: '',
          key_file: '',
          cert_file: '',
          secure_protocol: '',
          ciphers: ''
        },
        mongo: {
          host: '',
          port: 0,
          database: '',
          username: '',
          password: '',
          replSet: '',
          db_ssl: {
            enabled: false,
            accept_invalid_cert: false,
            ca_file: '',
            key_file: '',
            cert_file: ''
          }
        }
      }
    }]
  }
};

global.$HOME = `${__dirname}/../..`;

// set the log levels that Pronghorn uses, spam and trace are not defaulted in so without
// this you may error on log.trace calls.
const myCustomLevels = {
  levels: {
    spam: 6,
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    none: 0
  }
};

// need to see if there is a log level passed in
process.argv.forEach((val) => {
  // is there a log level defined to be passed in?
  if (val.indexOf('--LOG') === 0) {
    // get the desired log level
    const inputVal = val.split('=')[1];

    // validate the log level is supported, if so set it
    if (Object.hasOwnProperty.call(myCustomLevels.levels, inputVal)) {
      logLevel = inputVal;
    }
  }
});

// need to set global logging
global.log = winston.createLogger({
  level: logLevel,
  levels: myCustomLevels.levels,
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * Runs the common asserts for test
 */
function runCommonAsserts(data, error) {
  assert.equal(undefined, error);
  assert.notEqual(undefined, data);
  assert.notEqual(null, data);
  assert.notEqual(undefined, data.response);
  assert.notEqual(null, data.response);
}

/**
 * Runs the error asserts for the test
 */
function runErrorAsserts(data, error, code, origin, displayStr) {
  assert.equal(null, data);
  assert.notEqual(undefined, error);
  assert.notEqual(null, error);
  assert.notEqual(undefined, error.IAPerror);
  assert.notEqual(null, error.IAPerror);
  assert.notEqual(undefined, error.IAPerror.displayString);
  assert.notEqual(null, error.IAPerror.displayString);
  assert.equal(code, error.icode);
  assert.equal(origin, error.IAPerror.origin);
  assert.equal(displayStr, error.IAPerror.displayString);
}

/**
 * @function saveMockData
 * Attempts to take data from responses and place them in MockDataFiles to help create Mockdata.
 * Note, this was built based on entity file structure for Adapter-Engine 1.6.x
 * @param {string} entityName - Name of the entity saving mock data for
 * @param {string} actionName -  Name of the action saving mock data for
 * @param {string} descriptor -  Something to describe this test (used as a type)
 * @param {string or object} responseData - The data to put in the mock file.
 */
function saveMockData(entityName, actionName, descriptor, responseData) {
  // do not need to save mockdata if we are running in stub mode (already has mock data) or if told not to save
  if (stub || !isSaveMockData) {
    return false;
  }

  // must have a response in order to store the response
  if (responseData && responseData.response) {
    let data = responseData.response;

    // if there was a raw response that one is better as it is untranslated
    if (responseData.raw) {
      data = responseData.raw;

      try {
        const temp = JSON.parse(data);
        data = temp;
      } catch (pex) {
        // do not care if it did not parse as we will just use data
      }
    }

    try {
      const base = path.join(__dirname, `../../entities/${entityName}/`);
      const mockdatafolder = 'mockdatafiles';
      const filename = `mockdatafiles/${actionName}-${descriptor}.json`;

      if (!fs.existsSync(base + mockdatafolder)) {
        fs.mkdirSync(base + mockdatafolder);
      }

      // write the data we retrieved
      fs.writeFile(base + filename, JSON.stringify(data, null, 2), 'utf8', (errWritingMock) => {
        if (errWritingMock) throw errWritingMock;

        // update the action file to reflect the changes. Note: We're replacing the default object for now!
        fs.readFile(`${base}action.json`, (errRead, content) => {
          if (errRead) throw errRead;

          // parse the action file into JSON
          const parsedJson = JSON.parse(content);

          // The object update we'll write in.
          const responseObj = {
            type: descriptor,
            key: '',
            mockFile: filename
          };

          // get the object for method we're trying to change.
          const currentMethodAction = parsedJson.actions.find((obj) => obj.name === actionName);

          // if the method was not found - should never happen but...
          if (!currentMethodAction) {
            throw Error('Can\'t find an action for this method in the provided entity.');
          }

          // if there is a response object, we want to replace the Response object. Otherwise we'll create one.
          const actionResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === descriptor);

          // Add the action responseObj back into the array of response objects.
          if (!actionResponseObj) {
            // if there is a default response object, we want to get the key.
            const defaultResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === 'default');

            // save the default key into the new response object
            if (defaultResponseObj) {
              responseObj.key = defaultResponseObj.key;
            }

            // save the new response object
            currentMethodAction.responseObjects = [responseObj];
          } else {
            // update the location of the mock data file
            actionResponseObj.mockFile = responseObj.mockFile;
          }

          // Save results
          fs.writeFile(`${base}action.json`, JSON.stringify(parsedJson, null, 2), (err) => {
            if (err) throw err;
          });
        });
      });
    } catch (e) {
      log.debug(`Failed to save mock data for ${actionName}. ${e.message}`);
      return false;
    }
  }

  // no response to save
  log.debug(`No data passed to save into mockdata for ${actionName}`);
  return false;
}

// require the adapter that we are going to be using
const EtsiSol003 = require('../../adapter');

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[integration] Etsi_sol003 Adapter Test', () => {
  describe('EtsiSol003 Class Tests', () => {
    const a = new EtsiSol003(
      pronghornProps.adapterProps.adapters[0].id,
      pronghornProps.adapterProps.adapters[0].properties
    );

    if (isRapidFail) {
      const state = {};
      state.passed = true;

      mocha.afterEach(function x() {
        state.passed = state.passed
        && (this.currentTest.state === 'passed');
      });
      mocha.beforeEach(function x() {
        if (!state.passed) {
          return this.currentTest.skip();
        }
        return true;
      });
    }

    describe('#class instance created', () => {
      it('should be a class with properties', (done) => {
        try {
          assert.notEqual(null, a);
          assert.notEqual(undefined, a);
          const checkId = global.pronghornProps.adapterProps.adapters[0].id;
          assert.equal(checkId, a.id);
          assert.notEqual(null, a.allProps);
          const check = global.pronghornProps.adapterProps.adapters[0].properties.healthcheck.type;
          assert.equal(check, a.healthcheckType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#connect', () => {
      it('should get connected - no healthcheck', (done) => {
        try {
          a.healthcheckType = 'none';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
      it('should get connected - startup healthcheck', (done) => {
        try {
          a.healthcheckType = 'startup';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should be healthy', (done) => {
        try {
          a.healthCheck(null, (data) => {
            try {
              assert.equal(true, a.healthy);
              saveMockData('system', 'healthcheck', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    /*
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    *** All code above this comment will be replaced during a migration ***
    ******************* DO NOT REMOVE THIS COMMENT BLOCK ******************
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    */
    let skipCount = 0;

    describe('#getApiVersions - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getApiVersions.task) {
          try {
            a.getApiVersions((data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.uriPrefix);
                  assert.equal(true, Array.isArray(data.response.apiVersions));
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('ApiVersions', 'getApiVersions', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getApiVersions task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    let subscriptionsSubscriptionId = 'fakedata';
    const subscriptionsPostSubscriptionsBodyParam = {
      callbackUri: 'string'
    };
    describe('#postSubscriptions - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.postSubscriptions.task) {
          try {
            a.postSubscriptions(subscriptionsPostSubscriptionsBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('object', typeof data.response.filter);
                  assert.equal('string', data.response.callbackUri);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                subscriptionsSubscriptionId = data.response.id;
                saveMockData('Subscriptions', 'postSubscriptions', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postSubscriptions task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getSubscriptions - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getSubscriptions.task) {
          try {
            a.getSubscriptions(null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                  assert.equal('object', typeof data.response[1]);
                  assert.equal('object', typeof data.response[2]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Subscriptions', 'getSubscriptions', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getSubscriptions task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getSubscriptionsSubscriptionId.task) {
          try {
            a.getSubscriptionsSubscriptionId(subscriptionsSubscriptionId, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('object', typeof data.response.filter);
                  assert.equal('string', data.response.callbackUri);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Subscriptions', 'getSubscriptionsSubscriptionId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getSubscriptionsSubscriptionId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#deleteSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.deleteSubscriptionsSubscriptionId.task) {
          try {
            a.deleteSubscriptionsSubscriptionId(subscriptionsSubscriptionId, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Subscriptions', 'deleteSubscriptionsSubscriptionId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('deleteSubscriptionsSubscriptionId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getAlarms - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getAlarms.task) {
          try {
            a.getAlarms(null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.managedObjectId);
                  assert.equal('object', typeof data.response.rootCauseFaultyResource);
                  assert.equal('string', data.response.alarmRaisedTime);
                  assert.equal('string', data.response.alarmChangedTime);
                  assert.equal('string', data.response.alarmClearedTime);
                  assert.equal('string', data.response.alarmAcknowledgedTime);
                  assert.equal('ACKNOWLEDGED', data.response.ackState);
                  assert.equal('WARNING', data.response.perceivedSeverity);
                  assert.equal('string', data.response.eventTime);
                  assert.equal('COMMUNICATIONS_ALARM', data.response.eventType);
                  assert.equal('string', data.response.faultType);
                  assert.equal('string', data.response.probableCause);
                  assert.equal(true, data.response.isRootCause);
                  assert.equal(true, Array.isArray(data.response.correlatedAlarmIds));
                  assert.equal(true, Array.isArray(data.response.faultDetails));
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Alarms', 'getAlarms', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getAlarms task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getAlarmsAlarmId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getAlarmsAlarmId.task) {
          try {
            a.getAlarmsAlarmId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.managedObjectId);
                  assert.equal('object', typeof data.response.rootCauseFaultyResource);
                  assert.equal('string', data.response.alarmRaisedTime);
                  assert.equal('string', data.response.alarmChangedTime);
                  assert.equal('string', data.response.alarmClearedTime);
                  assert.equal('string', data.response.alarmAcknowledgedTime);
                  assert.equal('UNACKNOWLEDGED', data.response.ackState);
                  assert.equal('WARNING', data.response.perceivedSeverity);
                  assert.equal('string', data.response.eventTime);
                  assert.equal('ENVIRONMENTAL_ALARM', data.response.eventType);
                  assert.equal('string', data.response.faultType);
                  assert.equal('string', data.response.probableCause);
                  assert.equal(true, data.response.isRootCause);
                  assert.equal(true, Array.isArray(data.response.correlatedAlarmIds));
                  assert.equal(true, Array.isArray(data.response.faultDetails));
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Alarms', 'getAlarmsAlarmId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getAlarmsAlarmId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const alarmsPatchAlarmsAlarmIdBodyParam = {
      ackState: 'UNACKNOWLEDGED'
    };
    describe('#patchAlarmsAlarmId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.patchAlarmsAlarmId.task) {
          try {
            a.patchAlarmsAlarmId('fakedata', alarmsPatchAlarmsAlarmIdBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('success', data.response);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Alarms', 'patchAlarmsAlarmId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('patchAlarmsAlarmId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getIndicators - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getIndicators.task) {
          try {
            a.getIndicators(null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                  assert.equal('object', typeof data.response[1]);
                  assert.equal('object', typeof data.response[2]);
                  assert.equal('object', typeof data.response[3]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Indicators', 'getIndicators', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getIndicators task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorsVnfInstanceId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getIndicatorsVnfInstanceId.task) {
          try {
            a.getIndicatorsVnfInstanceId('fakedata', null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Indicators', 'getIndicatorsVnfInstanceId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getIndicatorsVnfInstanceId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorsVnfInstanceIdIndicatorId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getIndicatorsVnfInstanceIdIndicatorId.task) {
          try {
            a.getIndicatorsVnfInstanceIdIndicatorId('fakedata', 'fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.name);
                  assert.equal('object', typeof data.response.value);
                  assert.equal('string', data.response.vnfInstanceId);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Indicators', 'getIndicatorsVnfInstanceIdIndicatorId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getIndicatorsVnfInstanceIdIndicatorId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorsSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getIndicatorsSubscriptionsSubscriptionId.task) {
          try {
            a.getIndicatorsSubscriptionsSubscriptionId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('object', typeof data.response.filter);
                  assert.equal('string', data.response.callbackUri);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Indicators', 'getIndicatorsSubscriptionsSubscriptionId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getIndicatorsSubscriptionsSubscriptionId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#deleteIndicatorsSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.deleteIndicatorsSubscriptionsSubscriptionId.task) {
          try {
            a.deleteIndicatorsSubscriptionsSubscriptionId('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Indicators', 'deleteIndicatorsSubscriptionsSubscriptionId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('deleteIndicatorsSubscriptionsSubscriptionId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesBodyParam = {
      vnfdId: 'string'
    };
    describe('#postVnfInstances - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.postVnfInstances.task) {
          try {
            a.postVnfInstances(vnfInstancesPostVnfInstancesBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfInstanceName);
                  assert.equal('string', data.response.vnfInstanceDescription);
                  assert.equal('string', data.response.vnfdId);
                  assert.equal('string', data.response.vnfProvider);
                  assert.equal('string', data.response.vnfProductName);
                  assert.equal('string', data.response.vnfSoftwareVersion);
                  assert.equal('string', data.response.vnfdVersion);
                  assert.equal('object', typeof data.response.vnfConfigurableProperties);
                  assert.equal('object', typeof data.response.vimConnectionInfo);
                  assert.equal('NOT_INSTANTIATED', data.response.instantiationState);
                  assert.equal('object', typeof data.response.instantiatedVnfInfo);
                  assert.equal('object', typeof data.response.metadata);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstances', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstances task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfInstances - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfInstances.task) {
          try {
            a.getVnfInstances(null, null, null, null, null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                  assert.equal('object', typeof data.response[1]);
                  assert.equal('object', typeof data.response[2]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'getVnfInstances', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfInstances task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfInstancesVnfInstanceId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfInstancesVnfInstanceId.task) {
          try {
            a.getVnfInstancesVnfInstanceId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfInstanceName);
                  assert.equal('string', data.response.vnfInstanceDescription);
                  assert.equal('string', data.response.vnfdId);
                  assert.equal('string', data.response.vnfProvider);
                  assert.equal('string', data.response.vnfProductName);
                  assert.equal('string', data.response.vnfSoftwareVersion);
                  assert.equal('string', data.response.vnfdVersion);
                  assert.equal('object', typeof data.response.vnfConfigurableProperties);
                  assert.equal('object', typeof data.response.vimConnectionInfo);
                  assert.equal('INSTANTIATED', data.response.instantiationState);
                  assert.equal('object', typeof data.response.instantiatedVnfInfo);
                  assert.equal('object', typeof data.response.metadata);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'getVnfInstancesVnfInstanceId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfInstancesVnfInstanceId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPatchVnfInstancesVnfInstanceIdBodyParam = {
      vnfInstanceName: 'string',
      vnfInstanceDescription: 'string',
      vnfPkgId: 'string',
      vnfConfigurableProperties: {},
      metadata: {},
      extensions: {},
      vimConnectionInfo: {}
    };
    describe('#patchVnfInstancesVnfInstanceId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.patchVnfInstancesVnfInstanceId.task) {
          try {
            a.patchVnfInstancesVnfInstanceId('fakedata', vnfInstancesPatchVnfInstancesVnfInstanceIdBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('success', data.response);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'patchVnfInstancesVnfInstanceId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('patchVnfInstancesVnfInstanceId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#deleteVnfInstancesVnfInstanceId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.deleteVnfInstancesVnfInstanceId.task) {
          try {
            a.deleteVnfInstancesVnfInstanceId('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'deleteVnfInstancesVnfInstanceId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('deleteVnfInstancesVnfInstanceId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdInstantiateBodyParam = {
      flavourId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdInstantiate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdInstantiate.task) {
          try {
            a.postVnfInstancesVnfInstanceIdInstantiate('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdInstantiateBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdInstantiate', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdInstantiate task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdScaleBodyParam = {
      type: 'SCALE_IN',
      aspectId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdScale - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdScale.task) {
          try {
            a.postVnfInstancesVnfInstanceIdScale('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdScaleBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdScale', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdScale task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdScaleToLevelBodyParam = {
      instantiationLevelId: 'string',
      scaleInfo: [
        {
          aspectId: 'string',
          vnfdId: 'string',
          scaleLevel: 4
        }
      ],
      additionalParams: {}
    };
    describe('#postVnfInstancesVnfInstanceIdScaleToLevel - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdScaleToLevel.task) {
          try {
            a.postVnfInstancesVnfInstanceIdScaleToLevel('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdScaleToLevelBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdScaleToLevel', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdScaleToLevel task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdChangeFlavourBodyParam = {
      newFlavourId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdChangeFlavour - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdChangeFlavour.task) {
          try {
            a.postVnfInstancesVnfInstanceIdChangeFlavour('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdChangeFlavourBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdChangeFlavour', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdChangeFlavour task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdTerminateBodyParam = {
      terminationType: 'GRACEFUL'
    };
    describe('#postVnfInstancesVnfInstanceIdTerminate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdTerminate.task) {
          try {
            a.postVnfInstancesVnfInstanceIdTerminate('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdTerminateBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdTerminate', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdTerminate task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdHealBodyParam = {
      cause: 'string',
      additionalParams: {}
    };
    describe('#postVnfInstancesVnfInstanceIdHeal - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdHeal.task) {
          try {
            a.postVnfInstancesVnfInstanceIdHeal('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdHealBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdHeal', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdHeal task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdOperateBodyParam = {
      changeStateTo: 'STOPPED'
    };
    describe('#postVnfInstancesVnfInstanceIdOperate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdOperate.task) {
          try {
            a.postVnfInstancesVnfInstanceIdOperate('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdOperateBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdOperate', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdOperate task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdChangeExtConnBodyParam = {
      extVirtualLinks: [
        {}
      ]
    };
    describe('#postVnfInstancesVnfInstanceIdChangeExtConn - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdChangeExtConn.task) {
          try {
            a.postVnfInstancesVnfInstanceIdChangeExtConn('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdChangeExtConnBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdChangeExtConn', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdChangeExtConn task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdChangeVnfpkgBodyParam = {
      vnfdId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdChangeVnfpkg - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdChangeVnfpkg.task) {
          try {
            a.postVnfInstancesVnfInstanceIdChangeVnfpkg('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdChangeVnfpkgBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdChangeVnfpkg', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdChangeVnfpkg task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdCreateSnapshotBodyParam = {};
    describe('#postVnfInstancesVnfInstanceIdCreateSnapshot - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdCreateSnapshot.task) {
          try {
            a.postVnfInstancesVnfInstanceIdCreateSnapshot('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdCreateSnapshotBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdCreateSnapshot', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdCreateSnapshot task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdRevertToSnapshotBodyParam = {
      vnfSnapshotInfoId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdRevertToSnapshot - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfInstancesVnfInstanceIdRevertToSnapshot.task) {
          try {
            a.postVnfInstancesVnfInstanceIdRevertToSnapshot('fakedata', vnfInstancesPostVnfInstancesVnfInstanceIdRevertToSnapshotBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfInstances', 'postVnfInstancesVnfInstanceIdRevertToSnapshot', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfInstancesVnfInstanceIdRevertToSnapshot task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfLcmOpOccs - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfLcmOpOccs.task) {
          try {
            a.getVnfLcmOpOccs(null, null, null, null, null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('COMPLETED', data.response.operationState);
                  assert.equal('string', data.response.stateEnteredTime);
                  assert.equal('string', data.response.startTime);
                  assert.equal('string', data.response.vnfInstanceId);
                  assert.equal('string', data.response.grantId);
                  assert.equal('OPERATE', data.response.operation);
                  assert.equal(false, data.response.isAutomaticInvocation);
                  assert.equal('object', typeof data.response.operationParams);
                  assert.equal(false, data.response.isCancelPending);
                  assert.equal('GRACEFUL', data.response.cancelMode);
                  assert.equal('object', typeof data.response.error);
                  assert.equal('object', typeof data.response.resourceChanges);
                  assert.equal('object', typeof data.response.changedInfo);
                  assert.equal(true, Array.isArray(data.response.changedExtConnectivity));
                  assert.equal('object', typeof data.response.modificationsTriggeredByVnfPkgChange);
                  assert.equal('string', data.response.vnfSnapshotInfoId);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfLcmOpOccs', 'getVnfLcmOpOccs', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfLcmOpOccs task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfLcmOpOccsVnfLcmOpOccId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfLcmOpOccsVnfLcmOpOccId.task) {
          try {
            a.getVnfLcmOpOccsVnfLcmOpOccId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('STARTING', data.response.operationState);
                  assert.equal('string', data.response.stateEnteredTime);
                  assert.equal('string', data.response.startTime);
                  assert.equal('string', data.response.vnfInstanceId);
                  assert.equal('string', data.response.grantId);
                  assert.equal('REVERT_TO_SNAPSHOT', data.response.operation);
                  assert.equal(true, data.response.isAutomaticInvocation);
                  assert.equal('object', typeof data.response.operationParams);
                  assert.equal(false, data.response.isCancelPending);
                  assert.equal('GRACEFUL', data.response.cancelMode);
                  assert.equal('object', typeof data.response.error);
                  assert.equal('object', typeof data.response.resourceChanges);
                  assert.equal('object', typeof data.response.changedInfo);
                  assert.equal(true, Array.isArray(data.response.changedExtConnectivity));
                  assert.equal('object', typeof data.response.modificationsTriggeredByVnfPkgChange);
                  assert.equal('string', data.response.vnfSnapshotInfoId);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfLcmOpOccs', 'getVnfLcmOpOccsVnfLcmOpOccId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfLcmOpOccsVnfLcmOpOccId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdRetry - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfLcmOpOccsVnfLcmOpOccIdRetry.task) {
          try {
            a.postVnfLcmOpOccsVnfLcmOpOccIdRetry('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdRetry', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfLcmOpOccsVnfLcmOpOccIdRetry task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdRollback - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfLcmOpOccsVnfLcmOpOccIdRollback.task) {
          try {
            a.postVnfLcmOpOccsVnfLcmOpOccIdRollback('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdRollback', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfLcmOpOccsVnfLcmOpOccIdRollback task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdFail - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.postVnfLcmOpOccsVnfLcmOpOccIdFail.task) {
          try {
            a.postVnfLcmOpOccsVnfLcmOpOccIdFail('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('STARTING', data.response.operationState);
                  assert.equal('string', data.response.stateEnteredTime);
                  assert.equal('string', data.response.startTime);
                  assert.equal('string', data.response.vnfInstanceId);
                  assert.equal('string', data.response.grantId);
                  assert.equal('SCALE', data.response.operation);
                  assert.equal(false, data.response.isAutomaticInvocation);
                  assert.equal('object', typeof data.response.operationParams);
                  assert.equal(false, data.response.isCancelPending);
                  assert.equal('FORCEFUL', data.response.cancelMode);
                  assert.equal('object', typeof data.response.error);
                  assert.equal('object', typeof data.response.resourceChanges);
                  assert.equal('object', typeof data.response.changedInfo);
                  assert.equal(true, Array.isArray(data.response.changedExtConnectivity));
                  assert.equal('object', typeof data.response.modificationsTriggeredByVnfPkgChange);
                  assert.equal('string', data.response.vnfSnapshotInfoId);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdFail', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfLcmOpOccsVnfLcmOpOccIdFail task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdCancel - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.postVnfLcmOpOccsVnfLcmOpOccIdCancel.task) {
          try {
            a.postVnfLcmOpOccsVnfLcmOpOccIdCancel('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfLcmOpOccs', 'postVnfLcmOpOccsVnfLcmOpOccIdCancel', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfLcmOpOccsVnfLcmOpOccIdCancel task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfSnapshotsPostVnfSnapshotsBodyParam = {
      vnfSnapshotPkgId: 'string',
      vnfSnapshot: {
        id: 'string',
        vnfInstanceId: 'string',
        creationStartedAt: 'string',
        creationFinishedAt: 'string',
        vnfdId: 'string',
        vnfInstance: {
          id: 'string',
          vnfInstanceName: 'string',
          vnfInstanceDescription: 'string',
          vnfdId: 'string',
          vnfProvider: 'string',
          vnfProductName: 'string',
          vnfSoftwareVersion: 'string',
          vnfdVersion: 'string',
          vnfConfigurableProperties: {},
          vimConnectionInfo: {},
          instantiationState: 'INSTANTIATED',
          instantiatedVnfInfo: {
            flavourId: 'string',
            vnfState: 'STARTED',
            scaleStatus: [
              {
                aspectId: 'string',
                vnfdId: 'string',
                scaleLevel: 2
              }
            ],
            maxScaleLevels: [
              {
                aspectId: 'string',
                vnfdId: 'string',
                scaleLevel: 10
              }
            ],
            extCpInfo: [
              {
                id: 'string',
                cpdId: 'string',
                cpConfigId: 'string',
                vnfdId: 'string',
                cpProtocolInfo: [
                  {
                    layerProtocol: 'IP_OVER_ETHERNET',
                    ipOverEthernet: {
                      macAddress: 'string',
                      segmentationId: 'string',
                      ipAddresses: [
                        {
                          type: 'IPV6',
                          addresses: [
                            'string'
                          ],
                          isDynamic: true,
                          addressRange: {
                            minAddress: 'string',
                            maxAddress: 'string'
                          },
                          subnetId: 'string'
                        }
                      ]
                    }
                  }
                ],
                extLinkPortId: 'string',
                metadata: {},
                associatedVnfcCpId: 'string',
                associatedVnfVirtualLinkId: 'string'
              }
            ],
            extVirtualLinkInfo: [
              {
                id: 'string',
                resourceHandle: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                extLinkPorts: [
                  {
                    id: 'string',
                    resourceHandle: {
                      vimConnectionId: 'string',
                      resourceProviderId: 'string',
                      resourceId: 'string',
                      vimLevelResourceType: 'string'
                    },
                    cpInstanceId: 'string'
                  }
                ],
                currentVnfExtCpData: [
                  {
                    cpdId: 'string',
                    cpConfig: {}
                  }
                ]
              }
            ],
            extManagedVirtualLinkInfo: [
              {
                id: 'string',
                vnfVirtualLinkDescId: 'string',
                vnfdId: 'string',
                networkResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                vnfLinkPorts: [
                  {
                    id: 'string',
                    resourceHandle: {
                      vimConnectionId: 'string',
                      resourceProviderId: 'string',
                      resourceId: 'string',
                      vimLevelResourceType: 'string'
                    },
                    cpInstanceId: 'string',
                    cpInstanceType: 'VNFC_CP'
                  }
                ],
                extManagedMultisiteVirtualLinkId: 'string'
              }
            ],
            monitoringParameters: [
              {
                id: 'string',
                vnfdId: 'string',
                name: 'string',
                performanceMetric: 'string'
              }
            ],
            localizationLanguage: 'string',
            vnfcResourceInfo: [
              {
                id: 'string',
                vduId: 'string',
                vnfdId: 'string',
                computeResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                zoneId: 'string',
                storageResourceIds: [
                  'string'
                ],
                reservationId: 'string',
                vnfcCpInfo: [
                  {
                    id: 'string',
                    cpdId: 'string',
                    vnfExtCpId: 'string',
                    cpProtocolInfo: [
                      {
                        layerProtocol: 'IP_OVER_ETHERNET',
                        ipOverEthernet: {
                          macAddress: 'string',
                          segmentationId: 'string',
                          ipAddresses: [
                            {
                              type: 'IPV6',
                              addresses: [
                                'string'
                              ],
                              isDynamic: false,
                              addressRange: {
                                minAddress: 'string',
                                maxAddress: 'string'
                              },
                              subnetId: 'string'
                            }
                          ]
                        }
                      }
                    ],
                    vnfLinkPortId: 'string',
                    metadata: {}
                  }
                ],
                metadata: {}
              }
            ],
            virtualLinkResourceInfo: [
              {
                id: 'string',
                vnfVirtualLinkDescId: 'string',
                vnfdId: 'string',
                networkResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                zoneId: 'string',
                reservationId: 'string',
                vnfLinkPorts: [
                  {
                    id: 'string',
                    resourceHandle: {
                      vimConnectionId: 'string',
                      resourceProviderId: 'string',
                      resourceId: 'string',
                      vimLevelResourceType: 'string'
                    },
                    cpInstanceId: 'string',
                    cpInstanceType: 'EXT_CP'
                  }
                ],
                metadata: {}
              }
            ],
            virtualStorageResourceInfo: [
              {
                id: 'string',
                virtualStorageDescId: 'string',
                vnfdId: 'string',
                storageResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                zoneId: 'string',
                reservationId: 'string',
                metadata: {}
              }
            ]
          },
          metadata: {},
          extensions: null,
          _links: {
            self: {
              href: 'string'
            },
            indicators: {
              href: 'string'
            },
            instantiate: {
              href: 'string'
            },
            terminate: {
              href: 'string'
            },
            scale: {
              href: 'string'
            },
            scaleToLevel: {
              href: 'string'
            },
            changeFlavour: {
              href: 'string'
            },
            heal: {
              href: 'string'
            },
            operate: {
              href: 'string'
            },
            changeExtConn: {
              href: 'string'
            },
            createSnapshot: {
              href: 'string'
            },
            revertToSnapshot: {
              href: 'string'
            }
          }
        },
        vnfcSnapshots: [
          {
            id: 'string',
            vnfcInstanceId: 'string',
            creationStartedAt: 'string',
            creationFinishedAt: 'string',
            vnfcResourceInfoId: 'string',
            computeSnapshotResource: {
              vimConnectionId: 'string',
              resourceProviderId: 'string',
              resourceId: 'string',
              vimLevelResourceType: 'string'
            },
            storageSnapshotResources: [
              {
                storageResourceId: 'string',
                storageSnapshotResource: {}
              }
            ],
            userDefinedData: {}
          }
        ],
        vnfStateSnapshotInfo: {
          checksum: null,
          isEncrypted: null,
          metadata: null
        },
        userDefinedData: {},
        _links: {
          self: {
            href: 'string'
          },
          vnfStateSnapshot: {
            href: 'string'
          }
        }
      }
    };
    describe('#postVnfSnapshots - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.postVnfSnapshots.task) {
          try {
            a.postVnfSnapshots(vnfSnapshotsPostVnfSnapshotsBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfSnapshotPkgId);
                  assert.equal('object', typeof data.response.vnfSnapshot);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshots', 'postVnfSnapshots', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postVnfSnapshots task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshots - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfSnapshots.task) {
          try {
            a.getVnfSnapshots(null, null, null, null, null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshots', 'getVnfSnapshots', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfSnapshots task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotsVnfSnapshotInfoId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfSnapshotsVnfSnapshotInfoId.task) {
          try {
            a.getVnfSnapshotsVnfSnapshotInfoId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                  assert.equal('object', typeof data.response[1]);
                  assert.equal('object', typeof data.response[2]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshots', 'getVnfSnapshotsVnfSnapshotInfoId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfSnapshotsVnfSnapshotInfoId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const vnfSnapshotsPatchVnfSnapshotsVnfSnapshotInfoIdBodyParam = {
      vnfSnapshotPkgId: 'string',
      vnfSnapshot: {
        id: 'string',
        vnfInstanceId: 'string',
        creationStartedAt: 'string',
        creationFinishedAt: 'string',
        vnfdId: 'string',
        vnfInstance: {
          id: 'string',
          vnfInstanceName: 'string',
          vnfInstanceDescription: 'string',
          vnfdId: 'string',
          vnfProvider: 'string',
          vnfProductName: 'string',
          vnfSoftwareVersion: 'string',
          vnfdVersion: 'string',
          vnfConfigurableProperties: {},
          vimConnectionInfo: {},
          instantiationState: 'NOT_INSTANTIATED',
          instantiatedVnfInfo: {
            flavourId: 'string',
            vnfState: 'STOPPED',
            scaleStatus: [
              {
                aspectId: 'string',
                vnfdId: 'string',
                scaleLevel: 9
              }
            ],
            maxScaleLevels: [
              {
                aspectId: 'string',
                vnfdId: 'string',
                scaleLevel: 4
              }
            ],
            extCpInfo: [
              {
                id: 'string',
                cpdId: 'string',
                cpConfigId: 'string',
                vnfdId: 'string',
                cpProtocolInfo: [
                  {
                    layerProtocol: 'IP_OVER_ETHERNET',
                    ipOverEthernet: {
                      macAddress: 'string',
                      segmentationId: 'string',
                      ipAddresses: [
                        {
                          type: 'IPV4',
                          addresses: [
                            'string'
                          ],
                          isDynamic: false,
                          addressRange: {
                            minAddress: 'string',
                            maxAddress: 'string'
                          },
                          subnetId: 'string'
                        }
                      ]
                    }
                  }
                ],
                extLinkPortId: 'string',
                metadata: {},
                associatedVnfcCpId: 'string',
                associatedVnfVirtualLinkId: 'string'
              }
            ],
            extVirtualLinkInfo: [
              {
                id: 'string',
                resourceHandle: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                extLinkPorts: [
                  {
                    id: 'string',
                    resourceHandle: {
                      vimConnectionId: 'string',
                      resourceProviderId: 'string',
                      resourceId: 'string',
                      vimLevelResourceType: 'string'
                    },
                    cpInstanceId: 'string'
                  }
                ],
                currentVnfExtCpData: [
                  {
                    cpdId: 'string',
                    cpConfig: {}
                  }
                ]
              }
            ],
            extManagedVirtualLinkInfo: [
              {
                id: 'string',
                vnfVirtualLinkDescId: 'string',
                vnfdId: 'string',
                networkResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                vnfLinkPorts: [
                  {
                    id: 'string',
                    resourceHandle: {
                      vimConnectionId: 'string',
                      resourceProviderId: 'string',
                      resourceId: 'string',
                      vimLevelResourceType: 'string'
                    },
                    cpInstanceId: 'string',
                    cpInstanceType: 'VNFC_CP'
                  }
                ],
                extManagedMultisiteVirtualLinkId: 'string'
              }
            ],
            monitoringParameters: [
              {
                id: 'string',
                vnfdId: 'string',
                name: 'string',
                performanceMetric: 'string'
              }
            ],
            localizationLanguage: 'string',
            vnfcResourceInfo: [
              {
                id: 'string',
                vduId: 'string',
                vnfdId: 'string',
                computeResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                zoneId: 'string',
                storageResourceIds: [
                  'string'
                ],
                reservationId: 'string',
                vnfcCpInfo: [
                  {
                    id: 'string',
                    cpdId: 'string',
                    vnfExtCpId: 'string',
                    cpProtocolInfo: [
                      {
                        layerProtocol: 'IP_OVER_ETHERNET',
                        ipOverEthernet: {
                          macAddress: 'string',
                          segmentationId: 'string',
                          ipAddresses: [
                            {
                              type: 'IPV6',
                              addresses: [
                                'string'
                              ],
                              isDynamic: false,
                              addressRange: {
                                minAddress: 'string',
                                maxAddress: 'string'
                              },
                              subnetId: 'string'
                            }
                          ]
                        }
                      }
                    ],
                    vnfLinkPortId: 'string',
                    metadata: {}
                  }
                ],
                metadata: {}
              }
            ],
            virtualLinkResourceInfo: [
              {
                id: 'string',
                vnfVirtualLinkDescId: 'string',
                vnfdId: 'string',
                networkResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                zoneId: 'string',
                reservationId: 'string',
                vnfLinkPorts: [
                  {
                    id: 'string',
                    resourceHandle: {
                      vimConnectionId: 'string',
                      resourceProviderId: 'string',
                      resourceId: 'string',
                      vimLevelResourceType: 'string'
                    },
                    cpInstanceId: 'string',
                    cpInstanceType: 'EXT_CP'
                  }
                ],
                metadata: {}
              }
            ],
            virtualStorageResourceInfo: [
              {
                id: 'string',
                virtualStorageDescId: 'string',
                vnfdId: 'string',
                storageResource: {
                  vimConnectionId: 'string',
                  resourceProviderId: 'string',
                  resourceId: 'string',
                  vimLevelResourceType: 'string'
                },
                zoneId: 'string',
                reservationId: 'string',
                metadata: {}
              }
            ]
          },
          metadata: {},
          extensions: null,
          _links: {
            self: {
              href: 'string'
            },
            indicators: {
              href: 'string'
            },
            instantiate: {
              href: 'string'
            },
            terminate: {
              href: 'string'
            },
            scale: {
              href: 'string'
            },
            scaleToLevel: {
              href: 'string'
            },
            changeFlavour: {
              href: 'string'
            },
            heal: {
              href: 'string'
            },
            operate: {
              href: 'string'
            },
            changeExtConn: {
              href: 'string'
            },
            createSnapshot: {
              href: 'string'
            },
            revertToSnapshot: {
              href: 'string'
            }
          }
        },
        vnfcSnapshots: [
          {
            id: 'string',
            vnfcInstanceId: 'string',
            creationStartedAt: 'string',
            creationFinishedAt: 'string',
            vnfcResourceInfoId: 'string',
            computeSnapshotResource: {
              vimConnectionId: 'string',
              resourceProviderId: 'string',
              resourceId: 'string',
              vimLevelResourceType: 'string'
            },
            storageSnapshotResources: [
              {
                storageResourceId: 'string',
                storageSnapshotResource: {}
              }
            ],
            userDefinedData: {}
          }
        ],
        vnfStateSnapshotInfo: {
          checksum: null,
          isEncrypted: null,
          metadata: null
        },
        userDefinedData: {},
        _links: {
          self: {
            href: 'string'
          },
          vnfStateSnapshot: {
            href: 'string'
          }
        }
      }
    };
    describe('#patchVnfSnapshotsVnfSnapshotInfoId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.patchVnfSnapshotsVnfSnapshotInfoId.task) {
          try {
            a.patchVnfSnapshotsVnfSnapshotInfoId('fakedata', vnfSnapshotsPatchVnfSnapshotsVnfSnapshotInfoIdBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('success', data.response);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshots', 'patchVnfSnapshotsVnfSnapshotInfoId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('patchVnfSnapshotsVnfSnapshotInfoId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#deleteVnfSnapshotsVnfSnapshotInfoId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.deleteVnfSnapshotsVnfSnapshotInfoId.task) {
          try {
            a.deleteVnfSnapshotsVnfSnapshotInfoId('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshots', 'deleteVnfSnapshotsVnfSnapshotInfoId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('deleteVnfSnapshotsVnfSnapshotInfoId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot.task) {
          try {
            a.getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshots', 'getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const grantsPostGrantsBodyParam = {
      vnfInstanceId: 'string',
      vnfLcmOpOccId: 'string',
      vnfdId: 'string',
      operation: 'OPERATE',
      isAutomaticInvocation: true,
      _links: {}
    };
    describe('#postGrants - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.postGrants.task) {
          try {
            a.postGrants(grantsPostGrantsBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfInstanceId);
                  assert.equal('string', data.response.vnfLcmOpOccId);
                  assert.equal('object', typeof data.response.vimConnectionInfo);
                  assert.equal(true, Array.isArray(data.response.zones));
                  assert.equal(true, Array.isArray(data.response.zoneGroups));
                  assert.equal(true, Array.isArray(data.response.addResources));
                  assert.equal(true, Array.isArray(data.response.tempResources));
                  assert.equal(true, Array.isArray(data.response.removeResources));
                  assert.equal(true, Array.isArray(data.response.updateResources));
                  assert.equal('object', typeof data.response.vimAssets);
                  assert.equal(true, Array.isArray(data.response.extVirtualLinks));
                  assert.equal(true, Array.isArray(data.response.extManagedVirtualLinks));
                  assert.equal('object', typeof data.response.additionalParams);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Grants', 'postGrants', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postGrants task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getGrantsGrantId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getGrantsGrantId.task) {
          try {
            a.getGrantsGrantId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfInstanceId);
                  assert.equal('string', data.response.vnfLcmOpOccId);
                  assert.equal('object', typeof data.response.vimConnectionInfo);
                  assert.equal(true, Array.isArray(data.response.zones));
                  assert.equal(true, Array.isArray(data.response.zoneGroups));
                  assert.equal(true, Array.isArray(data.response.addResources));
                  assert.equal(true, Array.isArray(data.response.tempResources));
                  assert.equal(true, Array.isArray(data.response.removeResources));
                  assert.equal(true, Array.isArray(data.response.updateResources));
                  assert.equal('object', typeof data.response.vimAssets);
                  assert.equal(true, Array.isArray(data.response.extVirtualLinks));
                  assert.equal(true, Array.isArray(data.response.extManagedVirtualLinks));
                  assert.equal('object', typeof data.response.additionalParams);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Grants', 'getGrantsGrantId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getGrantsGrantId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackages - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getOnboardedVnfPackages.task) {
          try {
            a.getOnboardedVnfPackages(null, null, null, null, null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('OnboardedVnfPackages', 'getOnboardedVnfPackages', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getOnboardedVnfPackages task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getOnboardedVnfPackagesVnfdId.task) {
          try {
            a.getOnboardedVnfPackagesVnfdId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfdId);
                  assert.equal('string', data.response.vnfProvider);
                  assert.equal('string', data.response.vnfProductName);
                  assert.equal('string', data.response.vnfSoftwareVersion);
                  assert.equal('string', data.response.vnfdVersion);
                  assert.equal(true, Array.isArray(data.response.compatibleSpecificationVersions));
                  assert.equal('string', data.response.checksum);
                  assert.equal('OPTION_1', data.response.packageSecurityOption);
                  assert.equal('string', data.response.signingCertificate);
                  assert.equal(true, Array.isArray(data.response.softwareImages));
                  assert.equal(true, Array.isArray(data.response.additionalArtifacts));
                  assert.equal('UPLOADING', data.response.onboardingState);
                  assert.equal('DISABLED', data.response.operationalState);
                  assert.equal('IN_USE', data.response.usageState);
                  assert.equal('string', data.response.vnfmInfo);
                  assert.equal('object', typeof data.response.userDefinedData);
                  assert.equal('object', typeof data.response.onboardingFailureDetails);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getOnboardedVnfPackagesVnfdId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdVnfd - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getOnboardedVnfPackagesVnfdIdVnfd.task) {
          try {
            a.getOnboardedVnfPackagesVnfdIdVnfd('fakedata', null, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdVnfd', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getOnboardedVnfPackagesVnfdIdVnfd task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdManifest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getOnboardedVnfPackagesVnfdIdManifest.task) {
          try {
            a.getOnboardedVnfPackagesVnfdIdManifest('fakedata', null, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdManifest', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getOnboardedVnfPackagesVnfdIdManifest task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdPackageContent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getOnboardedVnfPackagesVnfdIdPackageContent.task) {
          try {
            a.getOnboardedVnfPackagesVnfdIdPackageContent('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdPackageContent', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getOnboardedVnfPackagesVnfdIdPackageContent task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdArtifacts - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getOnboardedVnfPackagesVnfdIdArtifacts.task) {
          try {
            a.getOnboardedVnfPackagesVnfdIdArtifacts('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdArtifacts', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getOnboardedVnfPackagesVnfdIdArtifacts task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath.task) {
          try {
            a.getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath('fakedata', 'fakedata', null, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('OnboardedVnfPackages', 'getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfPackagesVnfPkgId.task) {
          try {
            a.getVnfPackagesVnfPkgId('fakedata', null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfdId);
                  assert.equal('string', data.response.vnfProvider);
                  assert.equal('string', data.response.vnfProductName);
                  assert.equal('string', data.response.vnfSoftwareVersion);
                  assert.equal('string', data.response.vnfdVersion);
                  assert.equal(true, Array.isArray(data.response.compatibleSpecificationVersions));
                  assert.equal('string', data.response.checksum);
                  assert.equal('OPTION_1', data.response.packageSecurityOption);
                  assert.equal('string', data.response.signingCertificate);
                  assert.equal(true, Array.isArray(data.response.softwareImages));
                  assert.equal(true, Array.isArray(data.response.additionalArtifacts));
                  assert.equal('UPLOADING', data.response.onboardingState);
                  assert.equal('DISABLED', data.response.operationalState);
                  assert.equal('NOT_IN_USE', data.response.usageState);
                  assert.equal('string', data.response.vnfmInfo);
                  assert.equal('object', typeof data.response.userDefinedData);
                  assert.equal('object', typeof data.response.onboardingFailureDetails);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfPackages', 'getVnfPackagesVnfPkgId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfPackagesVnfPkgId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdVnfd - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfPackagesVnfPkgIdVnfd.task) {
          try {
            a.getVnfPackagesVnfPkgIdVnfd('fakedata', null, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfPackages', 'getVnfPackagesVnfPkgIdVnfd', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfPackagesVnfPkgIdVnfd task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdManifest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfPackagesVnfPkgIdManifest.task) {
          try {
            a.getVnfPackagesVnfPkgIdManifest('fakedata', null, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfPackages', 'getVnfPackagesVnfPkgIdManifest', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfPackagesVnfPkgIdManifest task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdPackageContent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfPackagesVnfPkgIdPackageContent.task) {
          try {
            a.getVnfPackagesVnfPkgIdPackageContent('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfPackages', 'getVnfPackagesVnfPkgIdPackageContent', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfPackagesVnfPkgIdPackageContent task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdArtifacts - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfPackagesVnfPkgIdArtifacts.task) {
          try {
            a.getVnfPackagesVnfPkgIdArtifacts('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfPackages', 'getVnfPackagesVnfPkgIdArtifacts', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfPackagesVnfPkgIdArtifacts task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdArtifactsArtifactPath - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfPackagesVnfPkgIdArtifactsArtifactPath.task) {
          try {
            a.getVnfPackagesVnfPkgIdArtifactsArtifactPath('fakedata', 'fakedata', null, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfPackages', 'getVnfPackagesVnfPkgIdArtifactsArtifactPath', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfPackagesVnfPkgIdArtifactsArtifactPath task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const pmJobsPostPmJobsBodyParam = {
      objectType: 'string',
      objectInstanceIds: [
        'string'
      ],
      criteria: {},
      callbackUri: 'string'
    };
    describe('#postPmJobs - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.postPmJobs.task) {
          try {
            a.postPmJobs(pmJobsPostPmJobsBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.objectType);
                  assert.equal(true, Array.isArray(data.response.objectInstanceIds));
                  assert.equal(true, Array.isArray(data.response.subObjectInstanceIds));
                  assert.equal('object', typeof data.response.criteria);
                  assert.equal('string', data.response.callbackUri);
                  assert.equal('object', typeof data.response.reports);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PmJobs', 'postPmJobs', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postPmJobs task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getPmJobs - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getPmJobs.task) {
          try {
            a.getPmJobs(null, null, null, null, null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                  assert.equal('object', typeof data.response[1]);
                  assert.equal('object', typeof data.response[2]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PmJobs', 'getPmJobs', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getPmJobs task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getPmJobsPmJobId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getPmJobsPmJobId.task) {
          try {
            a.getPmJobsPmJobId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.objectType);
                  assert.equal(true, Array.isArray(data.response.objectInstanceIds));
                  assert.equal(true, Array.isArray(data.response.subObjectInstanceIds));
                  assert.equal('object', typeof data.response.criteria);
                  assert.equal('string', data.response.callbackUri);
                  assert.equal('object', typeof data.response.reports);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PmJobs', 'getPmJobsPmJobId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getPmJobsPmJobId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#patchPmJobsPmJobId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.patchPmJobsPmJobId.task) {
          try {
            a.patchPmJobsPmJobId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('success', data.response);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PmJobs', 'patchPmJobsPmJobId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('patchPmJobsPmJobId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#deletePmJobsPmJobId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.deletePmJobsPmJobId.task) {
          try {
            a.deletePmJobsPmJobId('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PmJobs', 'deletePmJobsPmJobId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('deletePmJobsPmJobId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getPmJobsPmJobIdReportsReportId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getPmJobsPmJobIdReportsReportId.task) {
          try {
            a.getPmJobsPmJobIdReportsReportId('fakedata', 'fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal(true, Array.isArray(data.response.entries));
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PmJobs', 'getPmJobsPmJobIdReportsReportId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getPmJobsPmJobIdReportsReportId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    const thresholdsPostThresholdsBodyParam = {
      objectType: 'string',
      objectInstanceId: 'string',
      criteria: {},
      callbackUri: 'string'
    };
    describe('#postThresholds - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.postThresholds.task) {
          try {
            a.postThresholds(thresholdsPostThresholdsBodyParam, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.objectType);
                  assert.equal('string', data.response.objectInstanceId);
                  assert.equal(true, Array.isArray(data.response.subObjectInstanceIds));
                  assert.equal('object', typeof data.response.criteria);
                  assert.equal('string', data.response.callbackUri);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Thresholds', 'postThresholds', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('postThresholds task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getThresholds - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getThresholds.task) {
          try {
            a.getThresholds(null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                  assert.equal('object', typeof data.response[1]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Thresholds', 'getThresholds', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getThresholds task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getThresholdsThresholdId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getThresholdsThresholdId.task) {
          try {
            a.getThresholdsThresholdId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.objectType);
                  assert.equal('string', data.response.objectInstanceId);
                  assert.equal(true, Array.isArray(data.response.subObjectInstanceIds));
                  assert.equal('object', typeof data.response.criteria);
                  assert.equal('string', data.response.callbackUri);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Thresholds', 'getThresholdsThresholdId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getThresholdsThresholdId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#patchThresholdsThresholdId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.patchThresholdsThresholdId.task) {
          try {
            a.patchThresholdsThresholdId('fakedata', (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('success', data.response);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Thresholds', 'patchThresholdsThresholdId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('patchThresholdsThresholdId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#deleteThresholdsThresholdId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.deleteThresholdsThresholdId.task) {
          try {
            a.deleteThresholdsThresholdId('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Thresholds', 'deleteThresholdsThresholdId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('deleteThresholdsThresholdId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackages - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfSnapshotPackages.task) {
          try {
            a.getVnfSnapshotPackages(null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('object', typeof data.response[0]);
                  assert.equal('object', typeof data.response[1]);
                  assert.equal('object', typeof data.response[2]);
                  assert.equal('object', typeof data.response[3]);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshotPackages', 'getVnfSnapshotPackages', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfSnapshotPackages task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackagesVnfSnapshotPkgId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        if (pronghorn.methodsByName.getVnfSnapshotPackagesVnfSnapshotPkgId.task) {
          try {
            a.getVnfSnapshotPackagesVnfSnapshotPkgId('fakedata', null, null, (data, error) => {
              try {
                if (stub) {
                  runCommonAsserts(data, error);
                  assert.equal('string', data.response.id);
                  assert.equal('string', data.response.vnfSnapshotPkgUniqueId);
                  assert.equal('string', data.response.name);
                  assert.equal('string', data.response.checksum);
                  assert.equal('string', data.response.createdAt);
                  assert.equal('string', data.response.vnfSnapshotId);
                  assert.equal('object', typeof data.response.vnfcSnapshotInfoIds);
                  assert.equal(false, data.response.isFullSnapshot);
                  assert.equal('object', typeof data.response.vnfdInfo);
                  assert.equal('object', typeof data.response.vnfsr);
                  assert.equal('object', typeof data.response.vnfcSnapshotImages);
                  assert.equal('object', typeof data.response.additionalArtifacts);
                  assert.equal('BUILDING', data.response.state);
                  assert.equal(true, data.response.isCancelPending);
                  assert.equal('object', typeof data.response.failureDetails);
                  assert.equal('object', typeof data.response.userDefinedData);
                  assert.equal('object', typeof data.response._links);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshotPackages', 'getVnfSnapshotPackagesVnfSnapshotPkgId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfSnapshotPackagesVnfSnapshotPkgId task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent.task) {
          try {
            a.getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent('fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshotPackages', 'getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        if (pronghorn.methodsByName.getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath.task) {
          try {
            a.getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath('fakedata', 'fakedata', (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('VnfSnapshotPackages', 'getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        } else {
          log.error('getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath task is false, skipping test');
          skipCount += 1;
          done();
        }// end if task
      }).timeout(attemptTimeout);
    });

    describe('#Skipped test count', () => {
      it('count skipped tests', (done) => {
        console.log(`skipped ${skipCount} tests because \x1b[33mtask: false\x1b[0m`);
        done();
      });
    });
  });
});

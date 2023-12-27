/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint no-unused-vars: warn */
/* eslint no-underscore-dangle: warn  */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');
const mocha = require('mocha');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');

const anything = td.matchers.anything();

// stub and attemptTimeout are used throughout the code so set them here
let logLevel = 'none';
const isRapidFail = false;
const isSaveMockData = false;

// read in the properties from the sampleProperties files
let adaptdir = __dirname;
if (adaptdir.endsWith('/test/integration')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 17);
} else if (adaptdir.endsWith('/test/unit')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 10);
}
const samProps = require(`${adaptdir}/sampleProperties.json`).properties;

// these variables can be changed to run in integrated mode so easier to set them here
// always check these in with bogus data!!!
samProps.stub = true;
samProps.host = 'replace.hostorip.here';
samProps.authentication.username = 'username';
samProps.authentication.password = 'password';
samProps.protocol = 'http';
samProps.port = 80;
samProps.ssl.enabled = false;
samProps.ssl.accept_invalid_cert = false;
if (samProps.request.attempt_timeout < 30000) {
  samProps.request.attempt_timeout = 30000;
}
const attemptTimeout = samProps.request.attempt_timeout;
const { stub } = samProps;

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
      properties: samProps
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

    // broker tests
    describe('#getDevicesFiltered - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          const opts = {
            filter: {
              name: 'deviceName'
            }
          };
          a.getDevicesFiltered(opts, (data, error) => {
            try {
              if (stub) {
                if (samProps.devicebroker.getDevicesFiltered[0].handleFailure === 'ignore') {
                  assert.equal(null, error);
                  assert.notEqual(undefined, data);
                  assert.notEqual(null, data);
                  assert.equal(0, data.total);
                  assert.equal(0, data.list.length);
                } else {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                }
              } else {
                runCommonAsserts(data, error);
              }
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

    describe('#iapGetDeviceCount - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          const opts = {
            filter: {
              name: 'deviceName'
            }
          };
          a.iapGetDeviceCount((data, error) => {
            try {
              if (stub) {
                if (samProps.devicebroker.getDevicesFiltered[0].handleFailure === 'ignore') {
                  assert.equal(null, error);
                  assert.notEqual(undefined, data);
                  assert.notEqual(null, data);
                  assert.equal(0, data.count);
                } else {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-etsi_sol003-connectorRest-handleEndResponse', displayE);
                }
              } else {
                runCommonAsserts(data, error);
              }
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

    // exposed cache tests
    describe('#iapPopulateEntityCache - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.iapPopulateEntityCache('Device', (data, error) => {
            try {
              if (stub) {
                assert.equal(null, data);
                assert.notEqual(undefined, error);
                assert.notEqual(null, error);
                done();
              } else {
                assert.equal(undefined, error);
                assert.equal('success', data[0]);
                done();
              }
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

    describe('#iapRetrieveEntitiesCache - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.iapRetrieveEntitiesCache('Device', {}, (data, error) => {
            try {
              if (stub) {
                assert.equal(null, data);
                assert.notEqual(null, error);
                assert.notEqual(undefined, error);
              } else {
                assert.equal(undefined, error);
                assert.notEqual(null, data);
                assert.notEqual(undefined, data);
              }
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
    describe('#getApiVersions - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    let subscriptionsSubscriptionId = 'fakedata';
    const subscriptionsPostSubscriptionsBodyParam = {
      callbackUri: 'string'
    };
    describe('#postSubscriptions - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getSubscriptions - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#deleteSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getAlarms - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getAlarmsAlarmId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const alarmsPatchAlarmsAlarmIdBodyParam = {
      ackState: 'UNACKNOWLEDGED'
    };
    describe('#patchAlarmsAlarmId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getIndicators - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorsVnfInstanceId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorsVnfInstanceIdIndicatorId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorsSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#deleteIndicatorsSubscriptionsSubscriptionId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesBodyParam = {
      vnfdId: 'string'
    };
    describe('#postVnfInstances - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfInstances - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfInstancesVnfInstanceId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#deleteVnfInstancesVnfInstanceId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdInstantiateBodyParam = {
      flavourId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdInstantiate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdScaleBodyParam = {
      type: 'SCALE_IN',
      aspectId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdScale - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdChangeFlavourBodyParam = {
      newFlavourId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdChangeFlavour - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdTerminateBodyParam = {
      terminationType: 'GRACEFUL'
    };
    describe('#postVnfInstancesVnfInstanceIdTerminate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdHealBodyParam = {
      cause: 'string',
      additionalParams: {}
    };
    describe('#postVnfInstancesVnfInstanceIdHeal - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdOperateBodyParam = {
      changeStateTo: 'STOPPED'
    };
    describe('#postVnfInstancesVnfInstanceIdOperate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdChangeExtConnBodyParam = {
      extVirtualLinks: [
        {}
      ]
    };
    describe('#postVnfInstancesVnfInstanceIdChangeExtConn - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdChangeVnfpkgBodyParam = {
      vnfdId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdChangeVnfpkg - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdCreateSnapshotBodyParam = {};
    describe('#postVnfInstancesVnfInstanceIdCreateSnapshot - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    const vnfInstancesPostVnfInstancesVnfInstanceIdRevertToSnapshotBodyParam = {
      vnfSnapshotInfoId: 'string'
    };
    describe('#postVnfInstancesVnfInstanceIdRevertToSnapshot - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfLcmOpOccs - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfLcmOpOccsVnfLcmOpOccId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdRetry - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdRollback - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdFail - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#postVnfLcmOpOccsVnfLcmOpOccIdCancel - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshots - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotsVnfSnapshotInfoId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#deleteVnfSnapshotsVnfSnapshotInfoId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getGrantsGrantId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackages - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdVnfd - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdManifest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdPackageContent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdArtifacts - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdVnfd - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdManifest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdPackageContent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdArtifacts - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfPackagesVnfPkgIdArtifactsArtifactPath - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getPmJobs - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getPmJobsPmJobId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#patchPmJobsPmJobId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#deletePmJobsPmJobId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getPmJobsPmJobIdReportsReportId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getThresholds - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getThresholdsThresholdId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#patchThresholdsThresholdId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#deleteThresholdsThresholdId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackages - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackagesVnfSnapshotPkgId - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
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
      }).timeout(attemptTimeout);
    });
  });
});

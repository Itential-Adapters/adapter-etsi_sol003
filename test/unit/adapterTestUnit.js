/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint global-require: warn */
/* eslint no-unused-vars: warn */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const path = require('path');
const util = require('util');
const execute = require('child_process').execSync;
const fs = require('fs-extra');
const mocha = require('mocha');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');
const Ajv = require('ajv');
const log = require('../../utils/logger');

const ajv = new Ajv({ strictSchema: false, allErrors: true, allowUnionTypes: true });
const anything = td.matchers.anything();
const isRapidFail = false;

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

// uncomment if connecting
// samProps.host = 'replace.hostorip.here';
// samProps.authentication.username = 'username';
// samProps.authentication.password = 'password';
// samProps.authentication.token = 'password';
// samProps.protocol = 'http';
// samProps.port = 80;
// samProps.ssl.enabled = false;
// samProps.ssl.accept_invalid_cert = false;

samProps.request.attempt_timeout = 1200000;
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

// require the adapter that we are going to be using
const EtsiSol003 = require('../../adapter');

// delete the .DS_Store directory in entities -- otherwise this will cause errors
const dirPath = path.join(__dirname, '../../entities/.DS_Store');
if (fs.existsSync(dirPath)) {
  try {
    fs.removeSync(dirPath);
    console.log('.DS_Store deleted');
  } catch (e) {
    console.log('Error when deleting .DS_Store:', e);
  }
}

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[unit] Etsi_sol003 Adapter Test', () => {
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

    describe('adapterBase.js', () => {
      it('should have an adapterBase.js', (done) => {
        try {
          fs.exists('adapterBase.js', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    let wffunctions = [];
    describe('#iapGetAdapterWorkflowFunctions', () => {
      it('should retrieve workflow functions', (done) => {
        try {
          wffunctions = a.iapGetAdapterWorkflowFunctions([]);

          try {
            assert.notEqual(0, wffunctions.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('package.json', () => {
      it('should have a package.json', (done) => {
        try {
          fs.exists('package.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json should be validated', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          // Define the JSON schema for package.json
          const packageJsonSchema = {
            type: 'object',
            properties: {
              name: { type: 'string' },
              version: { type: 'string' }
              // May need to add more properties as needed
            },
            required: ['name', 'version']
          };
          const validate = ajv.compile(packageJsonSchema);
          const isValid = validate(packageDotJson);

          if (isValid === false) {
            log.error('The package.json contains errors');
            assert.equal(true, isValid);
          } else {
            assert.equal(true, isValid);
          }

          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json standard fields should be customized', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(-1, packageDotJson.name.indexOf('etsi_sol003'));
          assert.notEqual(undefined, packageDotJson.version);
          assert.notEqual(null, packageDotJson.version);
          assert.notEqual('', packageDotJson.version);
          assert.notEqual(undefined, packageDotJson.description);
          assert.notEqual(null, packageDotJson.description);
          assert.notEqual('', packageDotJson.description);
          assert.equal('adapter.js', packageDotJson.main);
          assert.notEqual(undefined, packageDotJson.wizardVersion);
          assert.notEqual(null, packageDotJson.wizardVersion);
          assert.notEqual('', packageDotJson.wizardVersion);
          assert.notEqual(undefined, packageDotJson.engineVersion);
          assert.notEqual(null, packageDotJson.engineVersion);
          assert.notEqual('', packageDotJson.engineVersion);
          assert.equal('http', packageDotJson.adapterType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper scripts should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.scripts);
          assert.notEqual(null, packageDotJson.scripts);
          assert.notEqual('', packageDotJson.scripts);
          assert.equal('node utils/setup.js', packageDotJson.scripts.preinstall);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js', packageDotJson.scripts.lint);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js --quiet', packageDotJson.scripts['lint:errors']);
          assert.equal('mocha test/unit/adapterBaseTestUnit.js --LOG=error', packageDotJson.scripts['test:baseunit']);
          assert.equal('mocha test/unit/adapterTestUnit.js --LOG=error', packageDotJson.scripts['test:unit']);
          assert.equal('mocha test/integration/adapterTestIntegration.js --LOG=error', packageDotJson.scripts['test:integration']);
          assert.equal('npm run test:baseunit && npm run test:unit && npm run test:integration', packageDotJson.scripts.test);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper directories should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.repository);
          assert.notEqual(null, packageDotJson.repository);
          assert.notEqual('', packageDotJson.repository);
          assert.equal('git', packageDotJson.repository.type);
          assert.equal('git@gitlab.com:itentialopensource/adapters/', packageDotJson.repository.url.substring(0, 43));
          assert.equal('https://gitlab.com/itentialopensource/adapters/', packageDotJson.homepage.substring(0, 47));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.dependencies);
          assert.notEqual(null, packageDotJson.dependencies);
          assert.notEqual('', packageDotJson.dependencies);
          assert.equal('8.17.1', packageDotJson.dependencies.ajv);
          assert.equal('1.12.2', packageDotJson.dependencies.axios);
          assert.equal('11.1.0', packageDotJson.dependencies.commander);
          assert.equal('11.3.0', packageDotJson.dependencies['fs-extra']);
          assert.equal('10.8.2', packageDotJson.dependencies.mocha);
          assert.equal('2.0.1', packageDotJson.dependencies['mocha-param']);
          assert.equal('0.4.4', packageDotJson.dependencies.ping);
          assert.equal('1.4.10', packageDotJson.dependencies['readline-sync']);
          assert.equal('7.7.2', packageDotJson.dependencies.semver);
          assert.equal('3.17.0', packageDotJson.dependencies.winston);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dev dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.devDependencies);
          assert.notEqual(null, packageDotJson.devDependencies);
          assert.notEqual('', packageDotJson.devDependencies);
          assert.equal('4.5.0', packageDotJson.devDependencies.chai);
          assert.equal('8.57.0', packageDotJson.devDependencies.eslint);
          assert.equal('15.0.0', packageDotJson.devDependencies['eslint-config-airbnb-base']);
          assert.equal('2.31.0', packageDotJson.devDependencies['eslint-plugin-import']);
          assert.equal('3.1.0', packageDotJson.devDependencies['eslint-plugin-json']);
          assert.equal('3.18.0', packageDotJson.devDependencies.testdouble);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('pronghorn.json', () => {
      it('should have a pronghorn.json', (done) => {
        try {
          fs.exists('pronghorn.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should be customized', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(-1, pronghornDotJson.id.indexOf('etsi_sol003'));
          assert.equal('Adapter', pronghornDotJson.type);
          assert.equal('EtsiSol003', pronghornDotJson.export);
          assert.equal('Etsi_sol003', pronghornDotJson.title);
          assert.equal('adapter.js', pronghornDotJson.src);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should contain generic adapter methods', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(undefined, pronghornDotJson.methods);
          assert.notEqual(null, pronghornDotJson.methods);
          assert.notEqual('', pronghornDotJson.methods);
          assert.equal(true, Array.isArray(pronghornDotJson.methods));
          assert.notEqual(0, pronghornDotJson.methods.length);
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUpdateAdapterConfiguration'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapSuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUnsuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterQueue'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapFindAdapterPath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapTroubleshootAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterHealthcheck'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterConnectivity'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterBasicGet'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapMoveAdapterEntitiesToDB'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapDeactivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapActivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapPopulateEntityCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRetrieveEntitiesCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevice'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevicesFiltered'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'isAlive'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getConfig'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetDeviceCount'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapExpandedGenericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequestNoBasePath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterLint'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterTests'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterInventory'));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should only expose workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');

          for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
            let found = false;
            let paramissue = false;

            for (let w = 0; w < wffunctions.length; w += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                const methLine = execute(`grep "  ${wffunctions[w]}(" adapter.js | grep "callback) {"`).toString();
                let wfparams = [];

                if (methLine && methLine.indexOf('(') >= 0 && methLine.indexOf(')') >= 0) {
                  const temp = methLine.substring(methLine.indexOf('(') + 1, methLine.lastIndexOf(')'));
                  wfparams = temp.split(',');

                  for (let t = 0; t < wfparams.length; t += 1) {
                    // remove default value from the parameter name
                    wfparams[t] = wfparams[t].substring(0, wfparams[t].search(/=/) > 0 ? wfparams[t].search(/#|\?|=/) : wfparams[t].length);
                    // remove spaces
                    wfparams[t] = wfparams[t].trim();

                    if (wfparams[t] === 'callback') {
                      wfparams.splice(t, 1);
                    }
                  }
                }

                // if there are inputs defined but not on the method line
                if (wfparams.length === 0 && (pronghornDotJson.methods[m].input
                    && pronghornDotJson.methods[m].input.length > 0)) {
                  paramissue = true;
                } else if (wfparams.length > 0 && (!pronghornDotJson.methods[m].input
                    || pronghornDotJson.methods[m].input.length === 0)) {
                  // if there are no inputs defined but there are on the method line
                  paramissue = true;
                } else {
                  for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                    let pfound = false;
                    for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                  for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                    let pfound = false;
                    for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                }

                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} not found in workflow functions`);
            }
            if (paramissue) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} has a parameter mismatch`);
            }
            assert.equal(true, found);
            assert.equal(false, paramissue);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('pronghorn.json should expose all workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          for (let w = 0; w < wffunctions.length; w += 1) {
            let found = false;

            for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${wffunctions[w]} not found in pronghorn.json`);
            }
            assert.equal(true, found);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json verify input/output schema objects', (done) => {
        const verifySchema = (methodName, schema) => {
          try {
            ajv.compile(schema);
          } catch (error) {
            const errorMessage = `Invalid schema found in '${methodName}' method.
          Schema => ${JSON.stringify(schema)}.
          Details => ${error.message}`;
            throw new Error(errorMessage);
          }
        };

        try {
          const pronghornDotJson = require('../../pronghorn.json');
          const { methods } = pronghornDotJson;
          for (let i = 0; i < methods.length; i += 1) {
            for (let j = 0; j < methods[i].input.length; j += 1) {
              const inputSchema = methods[i].input[j].schema;
              if (inputSchema) {
                verifySchema(methods[i].name, inputSchema);
              }
            }
            const outputSchema = methods[i].output.schema;
            if (outputSchema) {
              verifySchema(methods[i].name, outputSchema);
            }
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('propertiesSchema.json', () => {
      it('should have a propertiesSchema.json', (done) => {
        try {
          fs.exists('propertiesSchema.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should be customized', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.equal('adapter-etsi_sol003', propertiesDotJson.$id);
          assert.equal('object', propertiesDotJson.type);
          assert.equal('http://json-schema.org/draft-07/schema#', propertiesDotJson.$schema);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should contain generic adapter properties', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.notEqual(undefined, propertiesDotJson.properties);
          assert.notEqual(null, propertiesDotJson.properties);
          assert.notEqual('', propertiesDotJson.properties);
          assert.equal('string', propertiesDotJson.properties.host.type);
          assert.equal('integer', propertiesDotJson.properties.port.type);
          assert.equal('boolean', propertiesDotJson.properties.stub.type);
          assert.equal('string', propertiesDotJson.properties.protocol.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.authentication);
          assert.notEqual(null, propertiesDotJson.definitions.authentication);
          assert.notEqual('', propertiesDotJson.definitions.authentication);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.auth_method.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.invalid_token_error.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.token_timeout.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token_cache.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field.type));
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field_format.type));
          assert.equal('boolean', propertiesDotJson.definitions.authentication.properties.auth_logging.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_id.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_secret.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.grant_type.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.auth_request_datatype.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.auth_response_datatype.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token_response_placement.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.ssl);
          assert.notEqual(null, propertiesDotJson.definitions.ssl);
          assert.notEqual('', propertiesDotJson.definitions.ssl);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ecdhCurve.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.cert_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.secure_protocol.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ciphers.type);
          assert.equal('string', propertiesDotJson.properties.base_path.type);
          assert.equal('string', propertiesDotJson.properties.version.type);
          assert.equal('string', propertiesDotJson.properties.cache_location.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_pathvars.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_queryvars.type);
          assert.equal(true, Array.isArray(propertiesDotJson.properties.save_metric.type));
          assert.notEqual(undefined, propertiesDotJson.definitions);
          assert.notEqual(null, propertiesDotJson.definitions);
          assert.notEqual('', propertiesDotJson.definitions);
          assert.notEqual(undefined, propertiesDotJson.definitions.healthcheck);
          assert.notEqual(null, propertiesDotJson.definitions.healthcheck);
          assert.notEqual('', propertiesDotJson.definitions.healthcheck);
          assert.equal('string', propertiesDotJson.definitions.healthcheck.properties.type.type);
          assert.equal('integer', propertiesDotJson.definitions.healthcheck.properties.frequency.type);
          assert.equal('object', propertiesDotJson.definitions.healthcheck.properties.query_object.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.throttle);
          assert.notEqual(null, propertiesDotJson.definitions.throttle);
          assert.notEqual('', propertiesDotJson.definitions.throttle);
          assert.equal('boolean', propertiesDotJson.definitions.throttle.properties.throttle_enabled.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.number_pronghorns.type);
          assert.equal('string', propertiesDotJson.definitions.throttle.properties.sync_async.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.max_in_queue.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.concurrent_max.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.expire_timeout.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.avg_runtime.type);
          assert.equal('array', propertiesDotJson.definitions.throttle.properties.priorities.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.request);
          assert.notEqual(null, propertiesDotJson.definitions.request);
          assert.notEqual('', propertiesDotJson.definitions.request);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_redirects.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_retries.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.request.properties.limit_retry_error.type));
          assert.equal('array', propertiesDotJson.definitions.request.properties.failover_codes.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.attempt_timeout.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.payload.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.uriOptions.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.addlHeaders.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.authData.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.healthcheck_on_timeout.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_raw.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.archiving.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_request.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.proxy);
          assert.notEqual(null, propertiesDotJson.definitions.proxy);
          assert.notEqual('', propertiesDotJson.definitions.proxy);
          assert.equal('boolean', propertiesDotJson.definitions.proxy.properties.enabled.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.proxy.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.protocol.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.password.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.mongo);
          assert.notEqual(null, propertiesDotJson.definitions.mongo);
          assert.notEqual('', propertiesDotJson.definitions.mongo);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.mongo.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.database.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.replSet.type);
          assert.equal('object', propertiesDotJson.definitions.mongo.properties.db_ssl.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.cert_file.type);
          assert.notEqual('', propertiesDotJson.definitions.devicebroker);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevice.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevicesFiltered.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.isAlive.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getConfig.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getCount.type);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('error.json', () => {
      it('should have an error.json', (done) => {
        try {
          fs.exists('error.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('error.json should have standard adapter errors', (done) => {
        try {
          const errorDotJson = require('../../error.json');
          assert.notEqual(undefined, errorDotJson.errors);
          assert.notEqual(null, errorDotJson.errors);
          assert.notEqual('', errorDotJson.errors);
          assert.equal(true, Array.isArray(errorDotJson.errors));
          assert.notEqual(0, errorDotJson.errors.length);
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.100'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.101'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.102'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.110'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.111'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.112'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.113'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.114'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.115'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.116'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.300'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.301'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.302'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.303'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.304'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.305'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.310'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.311'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.312'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.320'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.321'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.400'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.401'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.402'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.500'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.501'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.502'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.503'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.600'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.900'));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('sampleProperties.json', () => {
      it('should have a sampleProperties.json', (done) => {
        try {
          fs.exists('sampleProperties.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('sampleProperties.json should contain generic adapter properties', (done) => {
        try {
          const sampleDotJson = require('../../sampleProperties.json');
          assert.notEqual(-1, sampleDotJson.id.indexOf('etsi_sol003'));
          assert.equal('EtsiSol003', sampleDotJson.type);
          assert.notEqual(undefined, sampleDotJson.properties);
          assert.notEqual(null, sampleDotJson.properties);
          assert.notEqual('', sampleDotJson.properties);
          assert.notEqual(undefined, sampleDotJson.properties.host);
          assert.notEqual(undefined, sampleDotJson.properties.port);
          assert.notEqual(undefined, sampleDotJson.properties.stub);
          assert.notEqual(undefined, sampleDotJson.properties.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.authentication);
          assert.notEqual(null, sampleDotJson.properties.authentication);
          assert.notEqual('', sampleDotJson.properties.authentication);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_method);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.username);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.password);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.invalid_token_error);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_cache);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field_format);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_logging);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_id);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_secret);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.grant_type);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_request_datatype);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_response_datatype);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_response_placement);
          assert.notEqual(undefined, sampleDotJson.properties.ssl);
          assert.notEqual(null, sampleDotJson.properties.ssl);
          assert.notEqual('', sampleDotJson.properties.ssl);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ecdhCurve);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.secure_protocol);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ciphers);
          assert.notEqual(undefined, sampleDotJson.properties.base_path);
          assert.notEqual(undefined, sampleDotJson.properties.version);
          assert.notEqual(undefined, sampleDotJson.properties.cache_location);
          assert.notEqual(undefined, sampleDotJson.properties.encode_pathvars);
          assert.notEqual(undefined, sampleDotJson.properties.encode_queryvars);
          assert.notEqual(undefined, sampleDotJson.properties.save_metric);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck);
          assert.notEqual(null, sampleDotJson.properties.healthcheck);
          assert.notEqual('', sampleDotJson.properties.healthcheck);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.type);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.frequency);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.query_object);
          assert.notEqual(undefined, sampleDotJson.properties.throttle);
          assert.notEqual(null, sampleDotJson.properties.throttle);
          assert.notEqual('', sampleDotJson.properties.throttle);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.throttle_enabled);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.number_pronghorns);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.sync_async);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.max_in_queue);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.concurrent_max);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.expire_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.avg_runtime);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.priorities);
          assert.notEqual(undefined, sampleDotJson.properties.request);
          assert.notEqual(null, sampleDotJson.properties.request);
          assert.notEqual('', sampleDotJson.properties.request);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_redirects);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_retries);
          assert.notEqual(undefined, sampleDotJson.properties.request.limit_retry_error);
          assert.notEqual(undefined, sampleDotJson.properties.request.failover_codes);
          assert.notEqual(undefined, sampleDotJson.properties.request.attempt_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.payload);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.uriOptions);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.addlHeaders);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.authData);
          assert.notEqual(undefined, sampleDotJson.properties.request.healthcheck_on_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_raw);
          assert.notEqual(undefined, sampleDotJson.properties.request.archiving);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_request);
          assert.notEqual(undefined, sampleDotJson.properties.proxy);
          assert.notEqual(null, sampleDotJson.properties.proxy);
          assert.notEqual('', sampleDotJson.properties.proxy);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.host);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.port);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.username);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo);
          assert.notEqual(null, sampleDotJson.properties.mongo);
          assert.notEqual('', sampleDotJson.properties.mongo);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.host);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.port);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.database);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.username);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.replSet);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevice);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevicesFiltered);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.isAlive);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getConfig);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getCount);
          assert.notEqual(undefined, sampleDotJson.properties.cache);
          assert.notEqual(undefined, sampleDotJson.properties.cache.entities);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkProperties', () => {
      it('should have a checkProperties function', (done) => {
        try {
          assert.equal(true, typeof a.checkProperties === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the sample properties should be good - if failure change the log level', (done) => {
        try {
          const samplePropsJson = require('../../sampleProperties.json');
          const clean = a.checkProperties(samplePropsJson.properties);

          try {
            assert.notEqual(0, Object.keys(clean));
            assert.equal(undefined, clean.exception);
            assert.notEqual(undefined, clean.host);
            assert.notEqual(null, clean.host);
            assert.notEqual('', clean.host);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('README.md', () => {
      it('should have a README', (done) => {
        try {
          fs.exists('README.md', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('README.md should be customized', (done) => {
        try {
          fs.readFile('README.md', 'utf8', (err, data) => {
            assert.equal(-1, data.indexOf('[System]'));
            assert.equal(-1, data.indexOf('[system]'));
            assert.equal(-1, data.indexOf('[version]'));
            assert.equal(-1, data.indexOf('[namespace]'));
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#connect', () => {
      it('should have a connect function', (done) => {
        try {
          assert.equal(true, typeof a.connect === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should have a healthCheck function', (done) => {
        try {
          assert.equal(true, typeof a.healthCheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapUpdateAdapterConfiguration', () => {
      it('should have a iapUpdateAdapterConfiguration function', (done) => {
        try {
          assert.equal(true, typeof a.iapUpdateAdapterConfiguration === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapSuspendAdapter', () => {
      it('should have a iapSuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapSuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapUnsuspendAdapter', () => {
      it('should have a iapUnsuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapUnsuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterQueue', () => {
      it('should have a iapGetAdapterQueue function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterQueue === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapFindAdapterPath', () => {
      it('should have a iapFindAdapterPath function', (done) => {
        try {
          assert.equal(true, typeof a.iapFindAdapterPath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('iapFindAdapterPath should find atleast one path that matches', (done) => {
        try {
          a.iapFindAdapterPath('{base_path}/{version}', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.equal(true, data.found);
              assert.notEqual(undefined, data.foundIn);
              assert.notEqual(null, data.foundIn);
              assert.notEqual(0, data.foundIn.length);
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

    describe('#iapTroubleshootAdapter', () => {
      it('should have a iapTroubleshootAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapTroubleshootAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterHealthcheck', () => {
      it('should have a iapRunAdapterHealthcheck function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterHealthcheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterConnectivity', () => {
      it('should have a iapRunAdapterConnectivity function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterConnectivity === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterBasicGet', () => {
      it('should have a iapRunAdapterBasicGet function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterBasicGet === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapMoveAdapterEntitiesToDB', () => {
      it('should have a iapMoveAdapterEntitiesToDB function', (done) => {
        try {
          assert.equal(true, typeof a.iapMoveAdapterEntitiesToDB === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkActionFiles', () => {
      it('should have a checkActionFiles function', (done) => {
        try {
          assert.equal(true, typeof a.checkActionFiles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the action files should be good - if failure change the log level as most issues are warnings', (done) => {
        try {
          const clean = a.checkActionFiles();

          try {
            for (let c = 0; c < clean.length; c += 1) {
              log.error(clean[c]);
            }
            assert.equal(0, clean.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#encryptProperty', () => {
      it('should have a encryptProperty function', (done) => {
        try {
          assert.equal(true, typeof a.encryptProperty === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('should get base64 encoded property', (done) => {
        try {
          a.encryptProperty('testing', 'base64', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{code}'));
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
      it('should get encrypted property', (done) => {
        try {
          a.encryptProperty('testing', 'encrypt', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{crypt}'));
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

    describe('#iapDeactivateTasks', () => {
      it('should have a iapDeactivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapDeactivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapActivateTasks', () => {
      it('should have a iapActivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapActivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapPopulateEntityCache', () => {
      it('should have a iapPopulateEntityCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapPopulateEntityCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRetrieveEntitiesCache', () => {
      it('should have a iapRetrieveEntitiesCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapRetrieveEntitiesCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#hasEntities', () => {
      it('should have a hasEntities function', (done) => {
        try {
          assert.equal(true, typeof a.hasEntities === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevice', () => {
      it('should have a getDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevicesFiltered', () => {
      it('should have a getDevicesFiltered function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesFiltered === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#isAlive', () => {
      it('should have a isAlive function', (done) => {
        try {
          assert.equal(true, typeof a.isAlive === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getConfig', () => {
      it('should have a getConfig function', (done) => {
        try {
          assert.equal(true, typeof a.getConfig === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetDeviceCount', () => {
      it('should have a iapGetDeviceCount function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetDeviceCount === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapExpandedGenericAdapterRequest', () => {
      it('should have a iapExpandedGenericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.iapExpandedGenericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequest', () => {
      it('should have a genericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequestNoBasePath', () => {
      it('should have a genericAdapterRequestNoBasePath function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequestNoBasePath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterLint', () => {
      it('should have a iapRunAdapterLint function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterLint === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the lint results', (done) => {
        try {
          a.iapRunAdapterLint((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.status);
              assert.notEqual(null, data.status);
              assert.equal('SUCCESS', data.status);
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

    describe('#iapRunAdapterTests', () => {
      it('should have a iapRunAdapterTests function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterTests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterInventory', () => {
      it('should have a iapGetAdapterInventory function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterInventory === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the inventory', (done) => {
        try {
          a.iapGetAdapterInventory((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
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
    describe('metadata.json', () => {
      it('should have a metadata.json', (done) => {
        try {
          fs.exists('metadata.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json is customized', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.equal('adapter-etsi_sol003', metadataDotJson.name);
          assert.notEqual(undefined, metadataDotJson.webName);
          assert.notEqual(null, metadataDotJson.webName);
          assert.notEqual('', metadataDotJson.webName);
          assert.equal('Adapter', metadataDotJson.type);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json contains accurate documentation', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.documentation);
          assert.equal('https://www.npmjs.com/package/@itentialopensource/adapter-etsi_sol003', metadataDotJson.documentation.npmLink);
          assert.equal('https://docs.itential.com/opensource/docs/troubleshooting-an-adapter', metadataDotJson.documentation.faqLink);
          assert.equal('https://gitlab.com/itentialopensource/adapters/contributing-guide', metadataDotJson.documentation.contributeLink);
          assert.equal('https://itential.atlassian.net/servicedesk/customer/portals', metadataDotJson.documentation.issueLink);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json has related items', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.relatedItems);
          assert.notEqual(undefined, metadataDotJson.relatedItems.adapters);
          assert.notEqual(undefined, metadataDotJson.relatedItems.integrations);
          assert.notEqual(undefined, metadataDotJson.relatedItems.ecosystemApplications);
          assert.notEqual(undefined, metadataDotJson.relatedItems.workflowProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.transformationProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.exampleProjects);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
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
      it('should have a getApiVersions function', (done) => {
        try {
          assert.equal(true, typeof a.getApiVersions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#postSubscriptions - errors', () => {
      it('should have a postSubscriptions function', (done) => {
        try {
          assert.equal(true, typeof a.postSubscriptions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.postSubscriptions(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postSubscriptions', displayE);
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
      it('should have a getSubscriptions function', (done) => {
        try {
          assert.equal(true, typeof a.getSubscriptions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSubscriptionsSubscriptionId - errors', () => {
      it('should have a getSubscriptionsSubscriptionId function', (done) => {
        try {
          assert.equal(true, typeof a.getSubscriptionsSubscriptionId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subscriptionId', (done) => {
        try {
          a.getSubscriptionsSubscriptionId(null, (data, error) => {
            try {
              const displayE = 'subscriptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getSubscriptionsSubscriptionId', displayE);
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
      it('should have a deleteSubscriptionsSubscriptionId function', (done) => {
        try {
          assert.equal(true, typeof a.deleteSubscriptionsSubscriptionId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subscriptionId', (done) => {
        try {
          a.deleteSubscriptionsSubscriptionId(null, (data, error) => {
            try {
              const displayE = 'subscriptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-deleteSubscriptionsSubscriptionId', displayE);
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
      it('should have a getAlarms function', (done) => {
        try {
          assert.equal(true, typeof a.getAlarms === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAlarmsAlarmId - errors', () => {
      it('should have a getAlarmsAlarmId function', (done) => {
        try {
          assert.equal(true, typeof a.getAlarmsAlarmId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing alarmId', (done) => {
        try {
          a.getAlarmsAlarmId(null, (data, error) => {
            try {
              const displayE = 'alarmId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getAlarmsAlarmId', displayE);
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

    describe('#patchAlarmsAlarmId - errors', () => {
      it('should have a patchAlarmsAlarmId function', (done) => {
        try {
          assert.equal(true, typeof a.patchAlarmsAlarmId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing alarmId', (done) => {
        try {
          a.patchAlarmsAlarmId(null, null, (data, error) => {
            try {
              const displayE = 'alarmId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchAlarmsAlarmId', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.patchAlarmsAlarmId('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchAlarmsAlarmId', displayE);
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
      it('should have a getIndicators function', (done) => {
        try {
          assert.equal(true, typeof a.getIndicators === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIndicatorsVnfInstanceId - errors', () => {
      it('should have a getIndicatorsVnfInstanceId function', (done) => {
        try {
          assert.equal(true, typeof a.getIndicatorsVnfInstanceId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.getIndicatorsVnfInstanceId(null, null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getIndicatorsVnfInstanceId', displayE);
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
      it('should have a getIndicatorsVnfInstanceIdIndicatorId function', (done) => {
        try {
          assert.equal(true, typeof a.getIndicatorsVnfInstanceIdIndicatorId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing indicatorId', (done) => {
        try {
          a.getIndicatorsVnfInstanceIdIndicatorId(null, null, (data, error) => {
            try {
              const displayE = 'indicatorId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getIndicatorsVnfInstanceIdIndicatorId', displayE);
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
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.getIndicatorsVnfInstanceIdIndicatorId('fakeparam', null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getIndicatorsVnfInstanceIdIndicatorId', displayE);
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
      it('should have a getIndicatorsSubscriptionsSubscriptionId function', (done) => {
        try {
          assert.equal(true, typeof a.getIndicatorsSubscriptionsSubscriptionId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subscriptionId', (done) => {
        try {
          a.getIndicatorsSubscriptionsSubscriptionId(null, (data, error) => {
            try {
              const displayE = 'subscriptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getIndicatorsSubscriptionsSubscriptionId', displayE);
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
      it('should have a deleteIndicatorsSubscriptionsSubscriptionId function', (done) => {
        try {
          assert.equal(true, typeof a.deleteIndicatorsSubscriptionsSubscriptionId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing subscriptionId', (done) => {
        try {
          a.deleteIndicatorsSubscriptionsSubscriptionId(null, (data, error) => {
            try {
              const displayE = 'subscriptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-deleteIndicatorsSubscriptionsSubscriptionId', displayE);
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

    describe('#postVnfInstances - errors', () => {
      it('should have a postVnfInstances function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstances === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstances(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstances', displayE);
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
      it('should have a getVnfInstances function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfInstances === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getVnfInstancesVnfInstanceId - errors', () => {
      it('should have a getVnfInstancesVnfInstanceId function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfInstancesVnfInstanceId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.getVnfInstancesVnfInstanceId(null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfInstancesVnfInstanceId', displayE);
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

    describe('#patchVnfInstancesVnfInstanceId - errors', () => {
      it('should have a patchVnfInstancesVnfInstanceId function', (done) => {
        try {
          assert.equal(true, typeof a.patchVnfInstancesVnfInstanceId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.patchVnfInstancesVnfInstanceId(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchVnfInstancesVnfInstanceId', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.patchVnfInstancesVnfInstanceId('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchVnfInstancesVnfInstanceId', displayE);
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
      it('should have a deleteVnfInstancesVnfInstanceId function', (done) => {
        try {
          assert.equal(true, typeof a.deleteVnfInstancesVnfInstanceId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.deleteVnfInstancesVnfInstanceId(null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-deleteVnfInstancesVnfInstanceId', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdInstantiate - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdInstantiate function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdInstantiate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdInstantiate(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdInstantiate', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdInstantiate('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdInstantiate', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdScale - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdScale function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdScale === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdScale(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdScale', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdScale('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdScale', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdScaleToLevel - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdScaleToLevel function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdScaleToLevel === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdScaleToLevel(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdScaleToLevel', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdScaleToLevel('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdScaleToLevel', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdChangeFlavour - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdChangeFlavour function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdChangeFlavour === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdChangeFlavour(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdChangeFlavour', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdChangeFlavour('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdChangeFlavour', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdTerminate - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdTerminate function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdTerminate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdTerminate(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdTerminate', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdTerminate('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdTerminate', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdHeal - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdHeal function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdHeal === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdHeal(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdHeal', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdHeal('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdHeal', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdOperate - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdOperate function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdOperate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdOperate(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdOperate', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdOperate('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdOperate', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdChangeExtConn - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdChangeExtConn function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdChangeExtConn === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdChangeExtConn(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdChangeExtConn', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdChangeExtConn('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdChangeExtConn', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdChangeVnfpkg - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdChangeVnfpkg function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdChangeVnfpkg === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdChangeVnfpkg(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdChangeVnfpkg', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdChangeVnfpkg('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdChangeVnfpkg', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdCreateSnapshot - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdCreateSnapshot function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdCreateSnapshot === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdCreateSnapshot(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdCreateSnapshot', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdCreateSnapshot('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdCreateSnapshot', displayE);
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

    describe('#postVnfInstancesVnfInstanceIdRevertToSnapshot - errors', () => {
      it('should have a postVnfInstancesVnfInstanceIdRevertToSnapshot function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfInstancesVnfInstanceIdRevertToSnapshot === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfInstanceId', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdRevertToSnapshot(null, null, (data, error) => {
            try {
              const displayE = 'vnfInstanceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdRevertToSnapshot', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.postVnfInstancesVnfInstanceIdRevertToSnapshot('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfInstancesVnfInstanceIdRevertToSnapshot', displayE);
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
      it('should have a getVnfLcmOpOccs function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfLcmOpOccs === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getVnfLcmOpOccsVnfLcmOpOccId - errors', () => {
      it('should have a getVnfLcmOpOccsVnfLcmOpOccId function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfLcmOpOccsVnfLcmOpOccId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfLcmOpOccId', (done) => {
        try {
          a.getVnfLcmOpOccsVnfLcmOpOccId(null, (data, error) => {
            try {
              const displayE = 'vnfLcmOpOccId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfLcmOpOccsVnfLcmOpOccId', displayE);
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
      it('should have a postVnfLcmOpOccsVnfLcmOpOccIdRetry function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfLcmOpOccsVnfLcmOpOccIdRetry === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfLcmOpOccId', (done) => {
        try {
          a.postVnfLcmOpOccsVnfLcmOpOccIdRetry(null, (data, error) => {
            try {
              const displayE = 'vnfLcmOpOccId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfLcmOpOccsVnfLcmOpOccIdRetry', displayE);
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
      it('should have a postVnfLcmOpOccsVnfLcmOpOccIdRollback function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfLcmOpOccsVnfLcmOpOccIdRollback === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfLcmOpOccId', (done) => {
        try {
          a.postVnfLcmOpOccsVnfLcmOpOccIdRollback(null, (data, error) => {
            try {
              const displayE = 'vnfLcmOpOccId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfLcmOpOccsVnfLcmOpOccIdRollback', displayE);
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
      it('should have a postVnfLcmOpOccsVnfLcmOpOccIdFail function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfLcmOpOccsVnfLcmOpOccIdFail === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfLcmOpOccId', (done) => {
        try {
          a.postVnfLcmOpOccsVnfLcmOpOccIdFail(null, (data, error) => {
            try {
              const displayE = 'vnfLcmOpOccId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfLcmOpOccsVnfLcmOpOccIdFail', displayE);
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
      it('should have a postVnfLcmOpOccsVnfLcmOpOccIdCancel function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfLcmOpOccsVnfLcmOpOccIdCancel === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfLcmOpOccId', (done) => {
        try {
          a.postVnfLcmOpOccsVnfLcmOpOccIdCancel(null, (data, error) => {
            try {
              const displayE = 'vnfLcmOpOccId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfLcmOpOccsVnfLcmOpOccIdCancel', displayE);
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

    describe('#postVnfSnapshots - errors', () => {
      it('should have a postVnfSnapshots function', (done) => {
        try {
          assert.equal(true, typeof a.postVnfSnapshots === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.postVnfSnapshots(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postVnfSnapshots', displayE);
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
      it('should have a getVnfSnapshots function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfSnapshots === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotsVnfSnapshotInfoId - errors', () => {
      it('should have a getVnfSnapshotsVnfSnapshotInfoId function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfSnapshotsVnfSnapshotInfoId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfSnapshotInfoId', (done) => {
        try {
          a.getVnfSnapshotsVnfSnapshotInfoId(null, (data, error) => {
            try {
              const displayE = 'vnfSnapshotInfoId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfSnapshotsVnfSnapshotInfoId', displayE);
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

    describe('#patchVnfSnapshotsVnfSnapshotInfoId - errors', () => {
      it('should have a patchVnfSnapshotsVnfSnapshotInfoId function', (done) => {
        try {
          assert.equal(true, typeof a.patchVnfSnapshotsVnfSnapshotInfoId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfSnapshotInfoId', (done) => {
        try {
          a.patchVnfSnapshotsVnfSnapshotInfoId(null, null, (data, error) => {
            try {
              const displayE = 'vnfSnapshotInfoId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchVnfSnapshotsVnfSnapshotInfoId', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.patchVnfSnapshotsVnfSnapshotInfoId('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchVnfSnapshotsVnfSnapshotInfoId', displayE);
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
      it('should have a deleteVnfSnapshotsVnfSnapshotInfoId function', (done) => {
        try {
          assert.equal(true, typeof a.deleteVnfSnapshotsVnfSnapshotInfoId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfSnapshotInfoId', (done) => {
        try {
          a.deleteVnfSnapshotsVnfSnapshotInfoId(null, (data, error) => {
            try {
              const displayE = 'vnfSnapshotInfoId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-deleteVnfSnapshotsVnfSnapshotInfoId', displayE);
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
      it('should have a getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfSnapshotInfoId', (done) => {
        try {
          a.getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot(null, (data, error) => {
            try {
              const displayE = 'vnfSnapshotInfoId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot', displayE);
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

    describe('#postGrants - errors', () => {
      it('should have a postGrants function', (done) => {
        try {
          assert.equal(true, typeof a.postGrants === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.postGrants(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postGrants', displayE);
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
      it('should have a getGrantsGrantId function', (done) => {
        try {
          assert.equal(true, typeof a.getGrantsGrantId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing grantId', (done) => {
        try {
          a.getGrantsGrantId(null, (data, error) => {
            try {
              const displayE = 'grantId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getGrantsGrantId', displayE);
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
      it('should have a getOnboardedVnfPackages function', (done) => {
        try {
          assert.equal(true, typeof a.getOnboardedVnfPackages === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getOnboardedVnfPackagesVnfdId - errors', () => {
      it('should have a getOnboardedVnfPackagesVnfdId function', (done) => {
        try {
          assert.equal(true, typeof a.getOnboardedVnfPackagesVnfdId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfdId', (done) => {
        try {
          a.getOnboardedVnfPackagesVnfdId(null, (data, error) => {
            try {
              const displayE = 'vnfdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getOnboardedVnfPackagesVnfdId', displayE);
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
      it('should have a getOnboardedVnfPackagesVnfdIdVnfd function', (done) => {
        try {
          assert.equal(true, typeof a.getOnboardedVnfPackagesVnfdIdVnfd === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfdId', (done) => {
        try {
          a.getOnboardedVnfPackagesVnfdIdVnfd(null, null, (data, error) => {
            try {
              const displayE = 'vnfdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getOnboardedVnfPackagesVnfdIdVnfd', displayE);
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
      it('should have a getOnboardedVnfPackagesVnfdIdManifest function', (done) => {
        try {
          assert.equal(true, typeof a.getOnboardedVnfPackagesVnfdIdManifest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfdId', (done) => {
        try {
          a.getOnboardedVnfPackagesVnfdIdManifest(null, null, (data, error) => {
            try {
              const displayE = 'vnfdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getOnboardedVnfPackagesVnfdIdManifest', displayE);
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
      it('should have a getOnboardedVnfPackagesVnfdIdPackageContent function', (done) => {
        try {
          assert.equal(true, typeof a.getOnboardedVnfPackagesVnfdIdPackageContent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfdId', (done) => {
        try {
          a.getOnboardedVnfPackagesVnfdIdPackageContent(null, (data, error) => {
            try {
              const displayE = 'vnfdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getOnboardedVnfPackagesVnfdIdPackageContent', displayE);
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
      it('should have a getOnboardedVnfPackagesVnfdIdArtifacts function', (done) => {
        try {
          assert.equal(true, typeof a.getOnboardedVnfPackagesVnfdIdArtifacts === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfdId', (done) => {
        try {
          a.getOnboardedVnfPackagesVnfdIdArtifacts(null, (data, error) => {
            try {
              const displayE = 'vnfdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getOnboardedVnfPackagesVnfdIdArtifacts', displayE);
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
      it('should have a getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath function', (done) => {
        try {
          assert.equal(true, typeof a.getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing artifactPath', (done) => {
        try {
          a.getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath(null, null, null, (data, error) => {
            try {
              const displayE = 'artifactPath is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath', displayE);
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
      it('should error if - missing vnfdId', (done) => {
        try {
          a.getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'vnfdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath', displayE);
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
      it('should have a getVnfPackagesVnfPkgId function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfPackagesVnfPkgId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfPkgId', (done) => {
        try {
          a.getVnfPackagesVnfPkgId(null, null, (data, error) => {
            try {
              const displayE = 'vnfPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfPackagesVnfPkgId', displayE);
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
      it('should have a getVnfPackagesVnfPkgIdVnfd function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfPackagesVnfPkgIdVnfd === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfPkgId', (done) => {
        try {
          a.getVnfPackagesVnfPkgIdVnfd(null, null, (data, error) => {
            try {
              const displayE = 'vnfPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfPackagesVnfPkgIdVnfd', displayE);
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
      it('should have a getVnfPackagesVnfPkgIdManifest function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfPackagesVnfPkgIdManifest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfPkgId', (done) => {
        try {
          a.getVnfPackagesVnfPkgIdManifest(null, null, (data, error) => {
            try {
              const displayE = 'vnfPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfPackagesVnfPkgIdManifest', displayE);
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
      it('should have a getVnfPackagesVnfPkgIdPackageContent function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfPackagesVnfPkgIdPackageContent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfPkgId', (done) => {
        try {
          a.getVnfPackagesVnfPkgIdPackageContent(null, (data, error) => {
            try {
              const displayE = 'vnfPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfPackagesVnfPkgIdPackageContent', displayE);
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
      it('should have a getVnfPackagesVnfPkgIdArtifacts function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfPackagesVnfPkgIdArtifacts === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfPkgId', (done) => {
        try {
          a.getVnfPackagesVnfPkgIdArtifacts(null, (data, error) => {
            try {
              const displayE = 'vnfPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfPackagesVnfPkgIdArtifacts', displayE);
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
      it('should have a getVnfPackagesVnfPkgIdArtifactsArtifactPath function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfPackagesVnfPkgIdArtifactsArtifactPath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing artifactPath', (done) => {
        try {
          a.getVnfPackagesVnfPkgIdArtifactsArtifactPath(null, null, null, (data, error) => {
            try {
              const displayE = 'artifactPath is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfPackagesVnfPkgIdArtifactsArtifactPath', displayE);
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
      it('should error if - missing vnfPkgId', (done) => {
        try {
          a.getVnfPackagesVnfPkgIdArtifactsArtifactPath('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'vnfPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfPackagesVnfPkgIdArtifactsArtifactPath', displayE);
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

    describe('#postPmJobs - errors', () => {
      it('should have a postPmJobs function', (done) => {
        try {
          assert.equal(true, typeof a.postPmJobs === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.postPmJobs(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postPmJobs', displayE);
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
      it('should have a getPmJobs function', (done) => {
        try {
          assert.equal(true, typeof a.getPmJobs === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPmJobsPmJobId - errors', () => {
      it('should have a getPmJobsPmJobId function', (done) => {
        try {
          assert.equal(true, typeof a.getPmJobsPmJobId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing pmJobId', (done) => {
        try {
          a.getPmJobsPmJobId(null, (data, error) => {
            try {
              const displayE = 'pmJobId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getPmJobsPmJobId', displayE);
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
      it('should have a patchPmJobsPmJobId function', (done) => {
        try {
          assert.equal(true, typeof a.patchPmJobsPmJobId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing pmJobId', (done) => {
        try {
          a.patchPmJobsPmJobId(null, (data, error) => {
            try {
              const displayE = 'pmJobId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchPmJobsPmJobId', displayE);
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
      it('should have a deletePmJobsPmJobId function', (done) => {
        try {
          assert.equal(true, typeof a.deletePmJobsPmJobId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing pmJobId', (done) => {
        try {
          a.deletePmJobsPmJobId(null, (data, error) => {
            try {
              const displayE = 'pmJobId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-deletePmJobsPmJobId', displayE);
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
      it('should have a getPmJobsPmJobIdReportsReportId function', (done) => {
        try {
          assert.equal(true, typeof a.getPmJobsPmJobIdReportsReportId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing pmJobId', (done) => {
        try {
          a.getPmJobsPmJobIdReportsReportId(null, null, (data, error) => {
            try {
              const displayE = 'pmJobId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getPmJobsPmJobIdReportsReportId', displayE);
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
      it('should error if - missing reportId', (done) => {
        try {
          a.getPmJobsPmJobIdReportsReportId('fakeparam', null, (data, error) => {
            try {
              const displayE = 'reportId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getPmJobsPmJobIdReportsReportId', displayE);
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

    describe('#postThresholds - errors', () => {
      it('should have a postThresholds function', (done) => {
        try {
          assert.equal(true, typeof a.postThresholds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.postThresholds(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-postThresholds', displayE);
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
      it('should have a getThresholds function', (done) => {
        try {
          assert.equal(true, typeof a.getThresholds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getThresholdsThresholdId - errors', () => {
      it('should have a getThresholdsThresholdId function', (done) => {
        try {
          assert.equal(true, typeof a.getThresholdsThresholdId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing thresholdId', (done) => {
        try {
          a.getThresholdsThresholdId(null, (data, error) => {
            try {
              const displayE = 'thresholdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getThresholdsThresholdId', displayE);
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
      it('should have a patchThresholdsThresholdId function', (done) => {
        try {
          assert.equal(true, typeof a.patchThresholdsThresholdId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing thresholdId', (done) => {
        try {
          a.patchThresholdsThresholdId(null, (data, error) => {
            try {
              const displayE = 'thresholdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-patchThresholdsThresholdId', displayE);
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
      it('should have a deleteThresholdsThresholdId function', (done) => {
        try {
          assert.equal(true, typeof a.deleteThresholdsThresholdId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing thresholdId', (done) => {
        try {
          a.deleteThresholdsThresholdId(null, (data, error) => {
            try {
              const displayE = 'thresholdId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-deleteThresholdsThresholdId', displayE);
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
      it('should have a getVnfSnapshotPackages function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfSnapshotPackages === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getVnfSnapshotPackagesVnfSnapshotPkgId - errors', () => {
      it('should have a getVnfSnapshotPackagesVnfSnapshotPkgId function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfSnapshotPackagesVnfSnapshotPkgId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfSnapshotPkgId', (done) => {
        try {
          a.getVnfSnapshotPackagesVnfSnapshotPkgId(null, null, null, (data, error) => {
            try {
              const displayE = 'vnfSnapshotPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfSnapshotPackagesVnfSnapshotPkgId', displayE);
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
      it('should have a getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfSnapshotPkgId', (done) => {
        try {
          a.getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent(null, (data, error) => {
            try {
              const displayE = 'vnfSnapshotPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent', displayE);
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
      it('should have a getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath function', (done) => {
        try {
          assert.equal(true, typeof a.getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vnfSnapshotPkgId', (done) => {
        try {
          a.getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath(null, null, (data, error) => {
            try {
              const displayE = 'vnfSnapshotPkgId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath', displayE);
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
      it('should error if - missing artifactPath', (done) => {
        try {
          a.getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath('fakeparam', null, (data, error) => {
            try {
              const displayE = 'artifactPath is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-etsi_sol003-adapter-getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath', displayE);
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

# ETSI Standard sol003

## Table of Contents 

  - [Getting Started](#getting-started)
    - [Helpful Background Information](#helpful-background-information)
    - [Prerequisites](#prerequisites)
    - [How to Install](#how-to-install)
    - [Testing](#testing)
  - [Configuration](#configuration)
    - [Example Properties](#example-properties)
    - [Connection Properties](#connection-properties)
    - [Authentication Properties](#authentication-properties)
    - [Healthcheck Properties](#healthcheck-properties)
    - [Request Properties](#request-properties)
    - [SSL Properties](#ssl-properties)
    - [Throttle Properties](#throttle-properties)
    - [Proxy Properties](#proxy-properties)
    - [Mongo Properties](#mongo-properties)
    - [Device Broker Properties](#device-broker-properties)
  - [Using this Adapter](#using-this-adapter)
    - [Generic Adapter Calls](#generic-adapter-calls)
    - [Adapter Broker Calls](#adapter-broker-calls)
    - [Specific Adapter Calls](#specific-adapter-calls)
    - [Authentication](#authentication)
  - [Additional Information](#additional-information)
    - [Enhancements](#enhancements)
    - [Contributing](#contributing)
    - [Helpful Links](#helpful-links)
    - [Node Scripts](#node-scripts)
  - [Troubleshoot](#troubleshoot)
    - [Connectivity Issues](#connectivity-issues)
    - [Functional Issues](#functional-issues)

## Getting Started

These instructions will help you get a copy of the project on your local machine for development and testing. Reading this section is also helpful for deployments as it provides you with pertinent information on prerequisites and properties.

### Helpful Background Information

There is <a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter documentation available on the Itential Documentation Site</a>. This documentation includes information and examples that are helpful for:

```text
Authentication
IAP Service Instance Configuration
Code Files
Endpoint Configuration (Action & Schema)
Mock Data
Adapter Generic Methods
Headers
Security
Linting and Testing
Build an Adapter
Troubleshooting an Adapter
```

Others will be added over time.
Want to build a new adapter? Use the <a href="https://adapters.itential.io" target="_blank">Itential Adapter Builder</a>

### Prerequisites

The following is a list of required packages for installation on the system the adapter will run on:

```text
Node.js
npm
Git
```

The following list of packages are required for Itential opensource adapters or custom adapters that have been built utilizing the Itential Adapter Builder. You can install these packages by running npm install inside the adapter directory.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Package</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">@itentialopensource/adapter-utils</td>
    <td style="padding:15px">Runtime library classes for all adapters;  includes request handling, connection, authentication throttling, and translation.</td>
  </tr>
  <tr>
    <td style="padding:15px">ajv</td>
    <td style="padding:15px">Required for validation of adapter properties to integrate with Etsi_sol003.</td>
  </tr>
  <tr>
    <td style="padding:15px">axios</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">commander</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">dns-lookup-promise</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">fs-extra</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">mocha</td>
    <td style="padding:15px">Testing library that is utilized by some of the node scripts that are included with the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">mocha-param</td>
    <td style="padding:15px">Testing library that is utilized by some of the node scripts that are included with the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">mongodb</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">nyc</td>
    <td style="padding:15px">Testing coverage library that is utilized by some of the node scripts that are included with the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">ping</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">readline-sync</td>
    <td style="padding:15px">Utilized by the node script that comes with the adapter;  helps to test unit and integration functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">semver</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">winston</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
</table>
<br>

If you are developing and testing a custom adapter, or have testing capabilities on an Itential opensource adapter, you will need to install these packages as well.

```text
chai
eslint
eslint-config-airbnb-base
eslint-plugin-import
eslint-plugin-json
testdouble
```

### How to Install

1. Set up the name space location in your IAP node_modules.

```bash
cd /opt/pronghorn/current/node_modules (* could be in a different place)
if the @itentialopensource directory does not exist, create it:
    mkdir @itentialopensource
```

2. Clone/unzip/tar the adapter into your IAP environment.

```bash
cd \@itentialopensource
git clone git@gitlab.com:\@itentialopensource/adapters/adapter-etsi_sol003
or
unzip adapter-etsi_sol003.zip
or
tar -xvf adapter-etsi_sol003.tar
```

3. Run the adapter install script.

```bash
cd adapter-etsi_sol003
npm install
npm run lint:errors
npm run test
```

4. Restart IAP

```bash
systemctl restart pronghorn
```

5. Create an adapter service instance configuration in IAP Admin Essentials GUI

6. Copy the properties from the sampleProperties.json and paste them into the service instance configuration in the inner/second properties field.

7. Change the adapter service instance configuration (host, port, credentials, etc) in IAP Admin Essentials GUI


For an easier install of the adapter use npm run adapter:install, it will install the adapter in IAP. Please note that it can be dependent on where the adapter is installed and on the version of IAP so it is subject to fail. If using this, you can replace step 3-5 above with these:

3. Install adapter dependencies and check the adapter.

```bash
cd adapter-etsi_sol003
npm run adapter:install
```

4. Restart IAP

```bash
systemctl restart pronghorn
```

5. Change the adapter service instance configuration (host, port, credentials, etc) in IAP Admin Essentials GUI


### Testing

Mocha is generally used to test all Itential Opensource Adapters. There are unit tests as well as integration tests performed. Integration tests can generally be run as standalone using mock data and running the adapter in stub mode, or as integrated. When running integrated, every effort is made to prevent environmental failures, however there is still a possibility.

#### Unit Testing

Unit Testing includes testing basic adapter functionality as well as error conditions that are triggered in the adapter prior to any integration. There are two ways to run unit tests. The prefered method is to use the testRunner script; however, both methods are provided here.

```bash
node utils/testRunner --unit

npm run test:unit
npm run test:baseunit
```

To add new unit tests, edit the `test/unit/adapterTestUnit.js` file. The tests that are already in this file should provide guidance for adding additional tests.

#### Integration Testing - Standalone

Standalone Integration Testing requires mock data to be provided with the entities. If this data is not provided, standalone integration testing will fail. When the adapter is set to run in stub mode (setting the stub property to true), the adapter will run through its code up to the point of making the request. It will then retrieve the mock data and return that as if it had received that data as the response from Etsi_sol003. It will then translate the data so that the adapter can return the expected response to the rest of the Itential software. Standalone is the default integration test.

Similar to unit testing, there are two ways to run integration tests. Using the testRunner script is better because it prevents you from having to edit the test script; it will also resets information after testing is complete so that credentials are not saved in the file.

```bash
node utils/testRunner
  answer no at the first prompt

npm run test:integration
```

To add new integration tests, edit the `test/integration/adapterTestIntegration.js` file. The tests that are already in this file should provide guidance for adding additional tests.

#### Integration Testing

Integration Testing requires connectivity to Etsi_sol003. By using the testRunner script it prevents you from having to edit the integration test. It also resets the integration test after the test is complete so that credentials are not saved in the file.

> **Note**: These tests have been written as a best effort to make them work in most environments. However, the Adapter Builder often does not have the necessary information that is required to set up valid integration tests. For example, the order of the requests can be very important and data is often required for `creates` and `updates`. Hence, integration tests may have to be enhanced before they will work (integrate) with Etsi_sol003. Even after tests have been set up properly, it is possible there are environmental constraints that could result in test failures. Some examples of possible environmental issues are customizations that have been made within Etsi_sol003 which change order dependencies or required data.

```bash
node utils/testRunner
answer yes at the first prompt
answer all other questions on connectivity and credentials
```

Test should also be written to clean up after themselves. However, it is important to understand that in some cases this may not be possible. In addition, whenever exceptions occur, test execution may be stopped, which will prevent cleanup actions from running. It is recommended that tests be utilized in dev and test labs only.

> **Reminder**: Do not check in code with actual credentials to systems.

## Configuration

This section defines **all** the properties that are available for the adapter, including detailed information on what each property is for. If you are not using certain capabilities with this adapter, you do not need to define all of the properties. An example of how the properties for this adapter can be used with tests or IAP are provided in the sampleProperties.

### Example Properties

```json
  "properties": {
    "host": "localhost",
    "port": 443,
    "choosepath": "",
    "base_path": "/",
    "version": "",
    "cache_location": "none",
    "encode_pathvars": true,
    "encode_queryvars": true,
    "save_metric": false,
    "stub": true,
    "protocol": "https",
    "authentication": {
      "auth_method": "request_token",
      "username": "username",
      "password": "password",
      "token": "token",
      "token_timeout": 1800000,
      "token_cache": "local",
      "invalid_token_error": 401,
      "auth_field": "header.headers.Authorization",
      "auth_field_format": "Bearer {token}",
      "auth_logging": false,
      "client_id": "",
      "client_secret": "",
      "grant_type": "",
      "sensitive": [],
      "sso": {
        "protocol": "",
        "host": "",
        "port": 0
      },
      "multiStepAuthCalls": [
        {
          "name": "",
          "requestFields": {},
          "responseFields": {},
          "successfullResponseCode": 200
        }
      ]
    },
    "healthcheck": {
      "type": "none",
      "frequency": 60000,
      "query_object": {},
      "addlHeaders": {}
    },
    "throttle": {
      "throttle_enabled": false,
      "number_pronghorns": 1,
      "sync_async": "sync",
      "max_in_queue": 1000,
      "concurrent_max": 1,
      "expire_timeout": 0,
      "avg_runtime": 200,
      "priorities": [
        {
          "value": 0,
          "percent": 100
        }
      ]
    },
    "request": {
      "number_redirects": 0,
      "number_retries": 3,
      "limit_retry_error": [
        0
      ],
      "failover_codes": [],
      "attempt_timeout": 5000,
      "global_request": {
        "payload": {},
        "uriOptions": {},
        "addlHeaders": {},
        "authData": {}
      },
      "healthcheck_on_timeout": true,
      "return_raw": false,
      "archiving": false,
      "return_request": false
    },
    "proxy": {
      "enabled": false,
      "host": "",
      "port": 1,
      "protocol": "http",
      "username": "",
      "password": ""
    },
    "ssl": {
      "ecdhCurve": "",
      "enabled": false,
      "accept_invalid_cert": false,
      "ca_file": "",
      "key_file": "",
      "cert_file": "",
      "secure_protocol": "",
      "ciphers": ""
    },
    "mongo": {
      "host": "",
      "port": 0,
      "database": "",
      "username": "",
      "password": "",
      "replSet": "",
      "db_ssl": {
        "enabled": false,
        "accept_invalid_cert": false,
        "ca_file": "",
        "key_file": "",
        "cert_file": ""
      }
    },
    "devicebroker": {
      "getDevice": [
        {
          "path": "/get/devices/{id}",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {
            "id": "name"
          },
          "responseDatakey": "",
          "responseFields": {
            "name": "host",
            "ostype": "os",
            "ostypePrefix": "system-",
            "ipaddress": "attributes.ipaddr",
            "port": "443"
          }
        }
      ],
      "getDevicesFiltered": [
        {
          "path": "/get/devices",
          "method": "GET",
          "pagination": {
            "offsetVar": "",
            "limitVar": "",
            "incrementBy": "limit",
            "requestLocation": "query"
          },
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {},
          "responseDatakey": "",
          "responseFields": {
            "name": "host",
            "ostype": "os",
            "ostypePrefix": "system-",
            "ipaddress": "attributes.ipaddr",
            "port": "443"
          }
        }
      ],
      "isAlive": [
        {
          "path": "/get/devices/{id}/status",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {
            "id": "name"
          },
          "responseDatakey": "",
          "responseFields": {
            "status": "status",
            "statusValue": "online"
          }
        }
      ],
      "getConfig": [
        {
          "path": "/get/devices/{id}/configPart1",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {
            "id": "name"
          },
          "responseDatakey": "",
          "responseFields": {}
        }
      ],
      "getCount": [
        {
          "path": "/get/devices",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {},
          "responseDatakey": "",
          "responseFields": {}
        }
      ]
    },
    "cache": {
      "enabled": false,
      "entities": [
        {
          "entityType": "",
          "frequency": 1440,
          "flushOnFail": false,
          "limit": 1000,
          "retryAttempts": 5,
          "sort": true,
          "populate": [
            {
              "path": "",
              "method": "GET",
              "pagination": {
                "offsetVar": "",
                "limitVar": "",
                "incrementBy": "limit",
                "requestLocation": "query"
              },
              "query": {},
              "body": {},
              "headers": {},
              "handleFailure": "ignore",
              "requestFields": {},
              "responseDatakey": "",
              "responseFields": {}
            }
          ],
          "cachedTasks": [
            {
              "name": "",
              "filterField": "",
              "filterLoc": ""
            }
          ]
        }
      ]
    }
  }
```

### Connection Properties

These base properties are used to connect to Etsi_sol003 upon the adapter initially coming up. It is important to set these properties appropriately.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">host</td>
    <td style="padding:15px">Required. A fully qualified domain name or IP address.</td>
  </tr>
  <tr>
    <td style="padding:15px">port</td>
    <td style="padding:15px">Required. Used to connect to the server.</td>
  </tr>
  <tr>
    <td style="padding:15px">base_path</td>
    <td style="padding:15px">Optional. Used to define part of a path that is consistent for all or most endpoints. It makes the URIs easier to use and maintain but can be overridden on individual calls. An example **base_path** might be `/rest/api`. Default is ``.</td>
  </tr>
  <tr>
    <td style="padding:15px">version</td>
    <td style="padding:15px">Optional. Used to set a global version for action endpoints. This makes it faster to update the adapter when endpoints change. As with the base-path, version can be overridden on individual endpoints. Default is ``.</td>
  </tr>
  <tr>
    <td style="padding:15px">cache_location</td>
    <td style="padding:15px">Optional. Used to define where the adapter cache is located. The cache is used to maintain an entity list to improve performance. Storage locally is lost when the adapter is restarted. Storage in Redis is preserved upon adapter restart. Default is none which means no caching of the entity list.</td>
  </tr>
  <tr>
    <td style="padding:15px">encode_pathvars</td>
    <td style="padding:15px">Optional. Used to tell the adapter to encode path variables or not. The default behavior is to encode them so this property can be used to stop that behavior.</td>
  </tr>
  <tr>
    <td style="padding:15px">encode_queryvars</td>
    <td style="padding:15px">Optional. Used to tell the adapter to encode query parameters or not. The default behavior is to encode them so this property can be used to stop that behavior.</td>
  </tr>
  <tr>
    <td style="padding:15px">save_metric</td>
    <td style="padding:15px">Optional. Used to tell the adapter to save metric information (this does not impact metrics returned on calls). This allows the adapter to gather metrics over time. Metric data can be stored in a database or on the file system.</td>
  </tr>
  <tr>
    <td style="padding:15px">stub</td>
    <td style="padding:15px">Optional. Indicates whether the stub should run instead of making calls to Etsi_sol003 (very useful during basic testing). Default is false (which means connect to Etsi_sol003).</td>
  </tr>
  <tr>
    <td style="padding:15px">protocol</td>
    <td style="padding:15px">Optional. Notifies the adapter whether to use HTTP or HTTPS. Default is HTTP.</td>
  </tr>
</table>
<br>

A connectivity check tells IAP the adapter has loaded successfully.

### Authentication Properties

The following properties are used to define the authentication process to Etsi_sol003.

>**Note**: Depending on the method that is used to authenticate with Etsi_sol003, you may not need to set all of the authentication properties.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">auth_method</td>
    <td style="padding:15px">Required. Used to define the type of authentication currently supported. Authentication methods currently supported are: `basic user_password`, `static_token`, `request_token`, and `no_authentication`.</td>
  </tr>
  <tr>
    <td style="padding:15px">username</td>
    <td style="padding:15px">Used to authenticate with Etsi_sol003 on every request or when pulling a token that will be used in subsequent requests.</td>
  </tr>
  <tr>
    <td style="padding:15px">password</td>
    <td style="padding:15px">Used to authenticate with Etsi_sol003 on every request or when pulling a token that will be used in subsequent requests.</td>
  </tr>
  <tr>
    <td style="padding:15px">token</td>
    <td style="padding:15px">Defines a static token that can be used on all requests. Only used with `static_token` as an authentication method (auth\_method).</td>
  </tr>
  <tr>
    <td style="padding:15px">invalid_token_error</td>
    <td style="padding:15px">Defines the HTTP error that is received when the token is invalid. Notifies the adapter to pull a new token and retry the request. Default is 401.</td>
  </tr>
  <tr>
    <td style="padding:15px">token_timeout</td>
    <td style="padding:15px">Defines how long a token is valid. Measured in milliseconds. Once a dynamic token is no longer valid, the adapter has to pull a new token. If the token_timeout is set to -1, the adapter will pull a token on every request to Etsi_sol003. If the timeout_token is 0, the adapter will use the expiration from the token response to determine when the token is no longer valid.</td>
  </tr>
  <tr>
    <td style="padding:15px">token_cache</td>
    <td style="padding:15px">Used to determine where the token should be stored (local memory or in Redis).</td>
  </tr>
  <tr>
    <td style="padding:15px">auth_field</td>
    <td style="padding:15px">Defines the request field the authentication (e.g., token are basic auth credentials) needs to be placed in order for the calls to work.</td>
  </tr>
  <tr>
    <td style="padding:15px">auth_field_format</td>
    <td style="padding:15px">Defines the format of the auth\_field. See examples below. Items enclosed in {} inform the adapter to perofrm an action prior to sending the data. It may be to replace the item with a value or it may be to encode the item.</td>
  </tr>
  <tr>
    <td style="padding:15px">auth_logging</td>
    <td style="padding:15px">Setting this true will add some additional logs but this should only be done when trying to debug an issue as certain credential information may be logged out when this is true.</td>
  </tr>
  <tr>
    <td style="padding:15px">client_id</td>
    <td style="padding:15px">Provide a client id when needed, this is common on some types of OAuth.</td>
  </tr>
  <tr>
    <td style="padding:15px">client_secret</td>
    <td style="padding:15px">Provide a client secret when needed, this is common on some types of OAuth.</td>
  </tr>
  <tr>
    <td style="padding:15px">grant_type</td>
    <td style="padding:15px">Provide a grant type when needed, this is common on some types of OAuth.</td>
  </tr>
</table>
<br>

#### Examples of authentication field format

```json
"{token}"
"Token {token}"
"{username}:{password}"
"Basic {b64}{username}:{password}{/b64}"
```

### Healthcheck Properties

The healthcheck properties defines the API that runs the healthcheck to tell the adapter that it can reach Etsi_sol003. There are currently three types of healthchecks.

- None - Not recommended. Adapter will not run a healthcheck. Consequently, unable to determine before making a request if the adapter can reach Etsi_sol003.
- Startup - Adapter will check for connectivity when the adapter initially comes up, but it will not check afterwards.
- Intermittent - Adapter will check connectivity to Etsi_sol003 at a frequency defined in the `frequency` property.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">type</td>
    <td style="padding:15px">Required. The type of health check to run.</td>
  </tr>
  <tr>
    <td style="padding:15px">frequency</td>
    <td style="padding:15px">Required if intermittent. Defines how often the health check should run. Measured in milliseconds. Default is 300000.</td>
  </tr>
  <tr>
    <td style="padding:15px">query_object</td>
    <td style="padding:15px">Query parameters to be added to the adapter healthcheck call.</td>
  </tr>
</table>
<br>

### Request Properties

The request section defines properties to help handle requests.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">number_redirects</td>
    <td style="padding:15px">Optional. Tells the adapter that the request may be redirected and gives it a maximum number of redirects to allow before returning an error. Default is 0 - no redirects.</td>
  </tr>
  <tr>
    <td style="padding:15px">number_retries</td>
    <td style="padding:15px">Tells the adapter how many times to retry a request that has either aborted or reached a limit error before giving up and returning an error.</td>
  </tr>
  <tr>
    <td style="padding:15px">limit_retry_error</td>
    <td style="padding:15px">Optional. Can be either an integer or an array. Indicates the http error status number to define that no capacity was available and, after waiting a short interval, the adapter can retry the request. If an array is provvided, the array can contain integers or strings. Strings in the array are used to define ranges (e.g. "502-506"). Default is [0].</td>
  </tr>
  <tr>
    <td style="padding:15px">failover_codes</td>
    <td style="padding:15px">An array of error codes for which the adapter will send back a failover flag to IAP so that the Platform can attempt the action in another adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">attempt_timeout</td>
    <td style="padding:15px">Optional. Tells how long the adapter should wait before aborting the attempt. On abort, the adapter will do one of two things: 1) return the error; or 2) if **healthcheck\_on\_timeout** is set to true, it will abort the request and run a Healthcheck until it re-establishes connectivity to Etsi_sol003, and then will re-attempt the request that aborted. Default is 5000 milliseconds.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request</td>
    <td style="padding:15px">Optional. This is information that the adapter can include in all requests to the other system. This is easier to define and maintain than adding this information in either the code (adapter.js) or the action files.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> payload</td>
    <td style="padding:15px">Optional. Defines any information that should be included on all requests sent to the other system that have a payload/body.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> uriOptions</td>
    <td style="padding:15px">Optional. Defines any information that should be sent as untranslated  query options (e.g. page, size) on all requests to the other system.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> addlHeaders</td>
    <td style="padding:15px">Optioonal. Defines any headers that should be sent on all requests to the other system.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> authData</td>
    <td style="padding:15px">Optional. Defines any additional authentication data used to authentice with the other system. This authData needs to be consistent on every request.</td>
  </tr>
  <tr>
    <td style="padding:15px">healthcheck_on_timeout</td>
    <td style="padding:15px">Required. Defines if the adapter should run a health check on timeout. If set to true, the adapter will abort the request and run a health check until it re-establishes connectivity and then it will re-attempt the request.</td>
  </tr>
  <tr>
    <td style="padding:15px">return_raw</td>
    <td style="padding:15px">Optional. Tells the adapter whether the raw response should be returned as well as the IAP response. This is helpful when running integration tests to save mock data. It does add overhead to the response object so it is not ideal from production.</td>
  </tr>
  <tr>
    <td style="padding:15px">archiving</td>
    <td style="padding:15px">Optional flag. Default is false. It archives the request, the results and the various times (wait time, Etsi_sol003 time and overall time) in the `adapterid_results` collection in MongoDB. Although archiving might be desirable, be sure to develop a strategy before enabling this capability. Consider how much to archive and what strategy to use for cleaning up the collection in the database so that it does not become too large, especially if the responses are large.</td>
  </tr>
  <tr>
    <td style="padding:15px">return_request</td>
    <td style="padding:15px">Optional flag. Default is false. Will return the actual request that is made including headers. This should only be used during debugging issues as there could be credentials in the actual request.</td>
  </tr>
</table>
<br>

### SSL Properties

The SSL section defines the properties utilized for ssl authentication with Etsi_sol003. SSL can work two different ways: set the `accept\_invalid\_certs` flag to true (only recommended for lab environments), or provide a `ca\_file`.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">enabled</td>
    <td style="padding:15px">If SSL is required, set to true.</td>
  </tr>
  <tr>
    <td style="padding:15px">accept_invalid_certs</td>
    <td style="padding:15px">Defines if the adapter should accept invalid certificates (only recommended for lab environments). Required if SSL is enabled. Default is false.</td>
  </tr>
  <tr>
    <td style="padding:15px">ca_file</td>
    <td style="padding:15px">Defines the path name to the CA file used for SSL. If SSL is enabled and the accept invalid certifications is false, then ca_file is required.</td>
  </tr>
  <tr>
    <td style="padding:15px">key_file</td>
    <td style="padding:15px">Defines the path name to the Key file used for SSL. The key_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
  <tr>
    <td style="padding:15px">cert_file</td>
    <td style="padding:15px">Defines the path name to the Certificate file used for SSL. The cert_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
  <tr>
    <td style="padding:15px">secure_protocol</td>
    <td style="padding:15px">Defines the protocol (e.g., SSLv3_method) to use on the SSL request.</td>
  </tr>
  <tr>
    <td style="padding:15px">ciphers</td>
    <td style="padding:15px">Required if SSL enabled. Specifies a list of SSL ciphers to use.</td>
  </tr>
  <tr>
    <td style="padding:15px">ecdhCurve</td>
    <td style="padding:15px">During testing on some Node 8 environments, you need to set `ecdhCurve` to auto. If you do not, you will receive PROTO errors when attempting the calls. This is the only usage of this property and to our knowledge it only impacts Node 8 and 9.</td>
  </tr>
</table>
<br>

### Throttle Properties

The throttle section is used when requests to Etsi_sol003 must be queued (throttled). All of the properties in this section are optional.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">throttle_enabled</td>
    <td style="padding:15px">Default is false. Defines if the adapter should use throttling or not.</td>
  </tr>
  <tr>
    <td style="padding:15px">number_pronghorns</td>
    <td style="padding:15px">Default is 1. Defines if throttling is done in a single Itential instance or whether requests are being throttled across multiple Itential instances (minimum = 1, maximum = 20). Throttling in a single Itential instance uses an in-memory queue so there is less overhead. Throttling across multiple Itential instances requires placing the request and queue information into a shared resource (e.g. database) so that each instance can determine what is running and what is next to run. Throttling across multiple instances requires additional I/O overhead.</td>
  </tr>
  <tr>
    <td style="padding:15px">sync-async</td>
    <td style="padding:15px">This property is not used at the current time (it is for future expansion of the throttling engine).</td>
  </tr>
  <tr>
    <td style="padding:15px">max_in_queue</td>
    <td style="padding:15px">Represents the maximum number of requests the adapter should allow into the queue before rejecting requests (minimum = 1, maximum = 5000). This is not a limit on what the adapter can handle but more about timely responses to requests. The default is currently 1000.</td>
  </tr>
  <tr>
    <td style="padding:15px">concurrent_max</td>
    <td style="padding:15px">Defines the number of requests the adapter can send to Etsi_sol003 at one time (minimum = 1, maximum = 1000). The default is 1 meaning each request must be sent to Etsi_sol003 in a serial manner.</td>
  </tr>
  <tr>
    <td style="padding:15px">expire_timeout</td>
    <td style="padding:15px">Default is 0. Defines a graceful timeout of the request session. After a request has completed, the adapter will wait additional time prior to sending the next request. Measured in milliseconds (minimum = 0, maximum = 60000).</td>
  </tr>
  <tr>
    <td style="padding:15px">average_runtime</td>
    <td style="padding:15px">Represents the approximate average of how long it takes Etsi_sol003 to handle each request. Measured in milliseconds (minimum = 50, maximum = 60000). Default is 200. This metric has performance implications. If the runtime number is set too low, it puts extra burden on the CPU and memory as the requests will continually try to run. If the runtime number is set too high, requests may wait longer than they need to before running. The number does not need to be exact but your throttling strategy depends heavily on this number being within reason. If averages range from 50 to 250 milliseconds you might pick an average run-time somewhere in the middle so that when Etsi_sol003 performance is exceptional you might run a little slower than you might like, but when it is poor you still run efficiently.</td>
  </tr>
  <tr>
    <td style="padding:15px">priorities</td>
    <td style="padding:15px">An array of priorities and how to handle them in relation to the throttle queue. Array of objects that include priority value and percent of queue to put the item ex { value: 1, percent: 10 }</td>
  </tr>
</table>
<br>

### Proxy Properties

The proxy section defines the properties to utilize when Etsi_sol003 is behind a proxy server.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">enabled</td>
    <td style="padding:15px">Required. Default is false. If Etsi_sol003 is behind a proxy server, set enabled flag to true.</td>
  </tr>
  <tr>
    <td style="padding:15px">host</td>
    <td style="padding:15px">Host information for the proxy server. Required if `enabled` is true.</td>
  </tr>
  <tr>
    <td style="padding:15px">port</td>
    <td style="padding:15px">Port information for the proxy server. Required if `enabled` is true.</td>
  </tr>
  <tr>
    <td style="padding:15px">protocol</td>
    <td style="padding:15px">The protocol (i.e., http, https, etc.) used to connect to the proxy. Default is http.</td>
  </tr>
  <tr>
    <td style="padding:15px">username</td>
    <td style="padding:15px">If there is authentication for the proxy, provide the username here.</td>
  </tr>
  <tr>
    <td style="padding:15px">password</td>
    <td style="padding:15px">If there is authentication for the proxy, provide the password here.</td>
  </tr>
</table>
<br>

### Mongo Properties

The mongo section defines the properties used to connect to a Mongo database. Mongo can be used for throttling as well as to persist metric data. If not provided, metrics will be stored in the file system.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">host</td>
    <td style="padding:15px">Optional. Host information for the mongo server.</td>
  </tr>
  <tr>
    <td style="padding:15px">port</td>
    <td style="padding:15px">Optional. Port information for the mongo server.</td>
  </tr>
  <tr>
    <td style="padding:15px">database</td>
    <td style="padding:15px">Optional. The database for the adapter to use for its data.</td>
  </tr>
  <tr>
    <td style="padding:15px">username</td>
    <td style="padding:15px">Optional. If credentials are required to access mongo, this is the user to login as.</td>
  </tr>
  <tr>
    <td style="padding:15px">password</td>
    <td style="padding:15px">Optional. If credentials are required to access mongo, this is the password to login with.</td>
  </tr>
  <tr>
    <td style="padding:15px">replSet</td>
    <td style="padding:15px">Optional. If the database is set up to use replica sets, define it here so it can be added to the database connection.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl</td>
    <td style="padding:15px">Optional. Contains information for SSL connectivity to the database.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> enabled</td>
    <td style="padding:15px">If SSL is required, set to true.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> accept_invalid_cert</td>
    <td style="padding:15px">Defines if the adapter should accept invalid certificates (only recommended for lab environments). Required if SSL is enabled. Default is false.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> ca_file</td>
    <td style="padding:15px">Defines the path name to the CA file used for SSL. If SSL is enabled and the accept invalid certifications is false, then ca_file is required.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> key_file</td>
    <td style="padding:15px">Defines the path name to the Key file used for SSL. The key_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> cert_file</td>
    <td style="padding:15px">Defines the path name to the Certificate file used for SSL. The cert_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
</table>
<br>

### Device Broker Properties

The device broker section defines the properties used integrate Etsi_sol003 to the device broker. Each broker call is represented and has an array of calls that can be used to build the response. This describes the calls and then the fields which are available in the calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">getDevice</td>
    <td style="padding:15px">The array of calls used to get device details for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesFiltered</td>
    <td style="padding:15px">The array of calls used to get devices for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive</td>
    <td style="padding:15px">The array of calls used to get device status for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfig</td>
    <td style="padding:15px">The array of calls used to get device configuration for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getCount</td>
    <td style="padding:15px">The array of calls used to get device configuration for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> path</td>
    <td style="padding:15px">The path, not including the base_path and version, for making this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> method</td>
    <td style="padding:15px">The rest method for making this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> query</td>
    <td style="padding:15px">Query object containing and query parameters and their values for this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> body</td>
    <td style="padding:15px">Body object containing the payload for this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> headers</td>
    <td style="padding:15px">Header object containing the headers for this call.</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> handleFailure</td>
    <td style="padding:15px">Tells the adapter whether to "fail" or "ignore" failures if they occur.</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive -> statusValue</td>
    <td style="padding:15px">Tells the adapter what value to look for in the status field to determine if the device is alive.</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig -> requestFields</td>
    <td style="padding:15px">Object containing fields the adapter should send on the request and where it should get the data. The where can be from a response to a getDevicesFiltered or a static value.</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig -> responseFields</td>
    <td style="padding:15px">Object containing fields the adapter should set to send back to iap and where the value should come from in the response or request data.</td>
  </tr>
</table>
<br>


## Using this Adapter

The `adapter.js` file contains the calls the adapter makes available to the rest of the Itential Platform. The API detailed for these calls should be available through JSDOC. The following is a brief summary of the calls.

### Generic Adapter Calls

These are adapter methods that IAP or you might use. There are some other methods not shown here that might be used for internal adapter functionality.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">connect()</td>
    <td style="padding:15px">This call is run when the Adapter is first loaded by he Itential Platform. It validates the properties have been provided correctly.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">healthCheck(callback)</td>
    <td style="padding:15px">This call ensures that the adapter can communicate with ETSI Standard sol003. The actual call that is used is defined in the adapter properties and .system entities action.json file.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">refreshProperties(properties)</td>
    <td style="padding:15px">This call provides the adapter the ability to accept property changes without having to restart the adapter.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">encryptProperty(property, technique, callback)</td>
    <td style="padding:15px">This call will take the provided property and technique, and return the property encrypted with the technique. This allows the property to be used in the adapterProps section for the credential password so that the password does not have to be in clear text. The adapter will decrypt the property as needed for communications with ETSI Standard sol003.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, callback)</td>
    <td style="padding:15px">This call provides the ability to update the adapter configuration from IAP - includes actions, schema, mockdata and other configurations.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapFindAdapterPath(apiPath, callback)</td>
    <td style="padding:15px">This call provides the ability to see if a particular API path is supported by the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapSuspendAdapter(mode, callback)</td>
    <td style="padding:15px">This call provides the ability to suspend the adapter and either have requests rejected or put into a queue to be processed after the adapter is resumed.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUnsuspendAdapter(callback)</td>
    <td style="padding:15px">This call provides the ability to resume a suspended adapter. Any requests in queue will be processed before new requests.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetAdapterQueue(callback)</td>
    <td style="padding:15px">This call will return the requests that are waiting in the queue if throttling is enabled.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapTroubleshootAdapter(props, persistFlag, adapter, callback)</td>
    <td style="padding:15px">This call can be used to check on the performance of the adapter - it checks connectivity, healthcheck and basic get calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>

  <tr>
    <td style="padding:15px">iapRunAdapterHealthcheck(adapter, callback)</td>
    <td style="padding:15px">This call will return the results of a healthcheck.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterConnectivity(callback)</td>
    <td style="padding:15px">This call will return the results of a connectivity check.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterBasicGet(callback)</td>
    <td style="padding:15px">This call will return the results of running basic get API calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapMoveAdapterEntitiesToDB(callback)</td>
    <td style="padding:15px">This call will push the adapter configuration from the entities directory into the Adapter or IAP Database.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call allows you to provide the path to have the adapter call. It is an easy way to incorporate paths that have not been built into the adapter yet.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call is the same as the genericAdapterRequest only it does not add a base_path or version to the call.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapHasAdapterEntity(entityType, entityId, callback)</td>
    <td style="padding:15px">This call verifies the adapter has the specific entity.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapVerifyAdapterCapability(entityType, actionType, entityId, callback)</td>
    <td style="padding:15px">This call verifies the adapter can perform the provided action on the specific entity.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUpdateAdapterEntityCache()</td>
    <td style="padding:15px">This call will update the entity cache.</td>
    <td style="padding:15px">No</td>
  </tr>
</table>
<br>
  
### Adapter Broker Calls

These are adapter methods that are used to integrate to IAP Brokers. This adapter currently supports the following broker calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">hasEntities(entityType, entityList, callback)</td>
    <td style="padding:15px">This call is utilized by the IAP Device Broker to determine if the adapter has a specific entity and item of the entity.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice(deviceName, callback)</td>
    <td style="padding:15px">This call returns the details of the requested device.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesFiltered(options, callback)</td>
    <td style="padding:15px">This call returns the list of devices that match the criteria provided in the options filter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive(deviceName, callback)</td>
    <td style="padding:15px">This call returns whether the device status is active</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfig(deviceName, format, callback)</td>
    <td style="padding:15px">This call returns the configuration for the selected device.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetDeviceCount(callback)</td>
    <td style="padding:15px">This call returns the count of devices.</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>

### Specific Adapter Calls

Specific adapter calls are built based on the API of the ETSI Standard sol003. The Adapter Builder creates the proper method comments for generating JS-DOC for the adapter. This is the best way to get information on the calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Path</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">getApiVersions(callback)</td>
    <td style="padding:15px">Retrieve API version information</td>
    <td style="padding:15px">{base_path}/{version}/vrqan/v1/api_versions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postSubscriptions(body, callback)</td>
    <td style="padding:15px">Subscribe.
The POST method creates a new subscription.
This method shall follow the provisions spec</td>
    <td style="padding:15px">{base_path}/{version}/vrqan/v1/subscriptions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSubscriptions(filter, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Query Subscription Information.
The GET method queries the list of active subscriptions of the func</td>
    <td style="padding:15px">{base_path}/{version}/vrqan/v1/subscriptions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSubscriptionsSubscriptionId(subscriptionId, callback)</td>
    <td style="padding:15px">Query Subscription Information.
The GET method reads an individual subscription.
This method shall</td>
    <td style="padding:15px">{base_path}/{version}/vrqan/v1/subscriptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteSubscriptionsSubscriptionId(subscriptionId, callback)</td>
    <td style="padding:15px">Terminate subscription.
The DELETE method terminates an individual subscription.
This method shall</td>
    <td style="padding:15px">{base_path}/{version}/vrqan/v1/subscriptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAlarms(filter, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Get Alarm List.
The API consumer can use this method to retrieve information about the alarm list.
</td>
    <td style="padding:15px">{base_path}/{version}/vnffm/v1/alarms?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAlarmsAlarmId(alarmId, callback)</td>
    <td style="padding:15px">The API consumer can use this method to read an individual alarm.
This method shall follow the prov</td>
    <td style="padding:15px">{base_path}/{version}/vnffm/v1/alarms/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">patchAlarmsAlarmId(alarmId, body, callback)</td>
    <td style="padding:15px">Acknowledge Alarm.
This method modifies an "Individual alarm" resource.
This method shall follow th</td>
    <td style="padding:15px">{base_path}/{version}/vnffm/v1/alarms/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIndicators(filter, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Get Indicator Value.
The GET method queries multiple VNF indicators.
This method shall follow the p</td>
    <td style="padding:15px">{base_path}/{version}/vnfind/v1/indicators?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIndicatorsVnfInstanceId(vnfInstanceId, filter, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Get Indicator Value.
The GET method queries multiple VNF indicators related to a VNF instance.
This</td>
    <td style="padding:15px">{base_path}/{version}/vnfind/v1/indicators/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIndicatorsVnfInstanceIdIndicatorId(indicatorId, vnfInstanceId, callback)</td>
    <td style="padding:15px">Get Indicator Value.
The GET method reads a VNF indicator.
This method shall follow the provisions</td>
    <td style="padding:15px">{base_path}/{version}/vnfind/v1/indicators/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIndicatorsSubscriptionsSubscriptionId(subscriptionId, callback)</td>
    <td style="padding:15px">Query Subscription Information.
The GET method reads an individual subscription.
This method shall</td>
    <td style="padding:15px">{base_path}/{version}/vnfind/v1/indicators/subscriptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteIndicatorsSubscriptionsSubscriptionId(subscriptionId, callback)</td>
    <td style="padding:15px">Terminate Subscription.
The DELETE method terminates an individual subscription.
This method shall</td>
    <td style="padding:15px">{base_path}/{version}/vnfind/v1/indicators/subscriptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstances(body, callback)</td>
    <td style="padding:15px">The POST method creates a new VNF instance resource based on a VNF package that is onboarded and in</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfInstances(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Query VNF.
The GET method queries information about multiple VNF instances.
</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfInstancesVnfInstanceId(vnfInstanceId, callback)</td>
    <td style="padding:15px">Query VNF.

The GET method retrieves information about a VNF instance by reading an "Individual VNF</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">patchVnfInstancesVnfInstanceId(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Modify VNF Information.
This method modifies an "Individual VNF instance" resource.
Changes to the</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteVnfInstancesVnfInstanceId(vnfInstanceId, callback)</td>
    <td style="padding:15px">Delete VNF Identifier.
This method deletes an "Individual VNF instance" resource.
This method shall</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdInstantiate(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Instantiate VNF.
The POST method instantiates a VNF instance.
This method shall follow the provisio</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/instantiate?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdScale(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Scale VNF.
The POST method requests to scale a VNF instance resource incrementally.
This method sha</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/scale?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdScaleToLevel(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Scale VNF to Level.
The POST method requests to scale a VNF instance resource to a target level.
Th</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/scale_to_level?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdChangeFlavour(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Change VNF Flavour.
This method shall follow the provisions specified in the tables 5.4.7.3.1-1 and</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/change_flavour?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdTerminate(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Terminate VNF.
The POST method triggers the VNFM to terminate a VNF instance and to request to the</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/terminate?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdHeal(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Heal VNF.
The POST method requests to heal a VNF instance.
This method shall follow the provisions</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/heal?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdOperate(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Operate VNF.
The POST method changes the operational state of a VNF instance resource.
This method</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/operate?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdChangeExtConn(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">Change External VNF Connectivity.
The POST method changes the external connectivity of a VNF instan</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/change_ext_conn?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdChangeVnfpkg(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">The POST method changes the current VNF package on which the VNF instance is based.
This method sha</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/change_vnfpkg?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdCreateSnapshot(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">The POST method requests taking a snapshot a VNF instance and populating a 
previously created VNF</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/create_snapshot?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfInstancesVnfInstanceIdRevertToSnapshot(vnfInstanceId, body, callback)</td>
    <td style="padding:15px">The POST method requests reverting a VNF instance to a VNF snapshot.
This method shall follow the p</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_instances/{pathv1}/revert_to_snapshot?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfLcmOpOccs(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Get Operation Status.
The API consumer can use this method to query status information about multip</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_lcm_op_occs?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfLcmOpOccsVnfLcmOpOccId(vnfLcmOpOccId, callback)</td>
    <td style="padding:15px">Get Operation Status.
The API consumer can use this method to retrieve status information about a V</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_lcm_op_occs/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfLcmOpOccsVnfLcmOpOccIdRetry(vnfLcmOpOccId, callback)</td>
    <td style="padding:15px">The POST method initiates retrying a VNF lifecycle operation if that operation
has experienced a te</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_lcm_op_occs/{pathv1}/retry?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfLcmOpOccsVnfLcmOpOccIdRollback(vnfLcmOpOccId, callback)</td>
    <td style="padding:15px">The POST method initiates rolling back a VNF lifecycle operation if that operation
has experienced</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_lcm_op_occs/{pathv1}/rollback?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfLcmOpOccsVnfLcmOpOccIdFail(vnfLcmOpOccId, callback)</td>
    <td style="padding:15px">The POST method marks a VNF lifecycle management operation occurrence as "finally failed"
if that o</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_lcm_op_occs/{pathv1}/fail?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfLcmOpOccsVnfLcmOpOccIdCancel(vnfLcmOpOccId, callback)</td>
    <td style="padding:15px">The POST method initiates cancelling an ongoing VNF lifecycle operation while
it is being executed</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_lcm_op_occs/{pathv1}/cancel?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postVnfSnapshots(body, callback)</td>
    <td style="padding:15px">The POST method creates a new "Individual VNF snapshot" resource.

As a result of successfully exec</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_snapshots?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfSnapshots(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">The GET method queries information about multiple VNF snapshots. This method shall follow the provi</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_snapshots?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfSnapshotsVnfSnapshotInfoId(vnfSnapshotInfoId, callback)</td>
    <td style="padding:15px">The GET method retrieves information about a VNF snapshot by reading an "Individual VNF snapshot" 
</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_snapshots/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">patchVnfSnapshotsVnfSnapshotInfoId(vnfSnapshotInfoId, body, callback)</td>
    <td style="padding:15px">This method modifies an "Individual VNF snapshot" resource.

Changes are applied to the VNF snapsho</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_snapshots/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteVnfSnapshotsVnfSnapshotInfoId(vnfSnapshotInfoId, callback)</td>
    <td style="padding:15px">This method deletes an "Individual VNF snapshot" resource and the associated VNF snapshot 
informat</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_snapshots/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfSnapshotsVnfSnapshotInfoIdVnfStateSnapshot(vnfSnapshotInfoId, callback)</td>
    <td style="padding:15px">The GET method fetches the content of the VNF state snapshot. 
This method shall follow the provisi</td>
    <td style="padding:15px">{base_path}/{version}/vnflcm/v1/vnf_snapshots/{pathv1}/vnf_state_snapshot?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postGrants(body, callback)</td>
    <td style="padding:15px">Grant Lifecycle Operation.
The POST method requests a grant for a particular VNF lifecycle operatio</td>
    <td style="padding:15px">{base_path}/{version}/grant/v1/grants?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGrantsGrantId(grantId, callback)</td>
    <td style="padding:15px">Grant Lifecycle Operation.
The GET method reads a grant.
This method shall follow the provisions sp</td>
    <td style="padding:15px">{base_path}/{version}/grant/v1/grants/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getOnboardedVnfPackages(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Query VNF Package Info.
The GET method queries the information of the VNF packages matching the fil</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/onboarded_vnf_packages?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getOnboardedVnfPackagesVnfdId(vnfdId, callback)</td>
    <td style="padding:15px">Query VNF Package Info.
The GET method reads the information of an individual VNF package.
This met</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/onboarded_vnf_packages/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getOnboardedVnfPackagesVnfdIdVnfd(vnfdId, includeSignature, callback)</td>
    <td style="padding:15px">Query VNF Package Info

The GET method reads the content of the VNFD within a VNF package.
The VNFD</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/onboarded_vnf_packages/{pathv1}/vnfd?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getOnboardedVnfPackagesVnfdIdManifest(vnfdId, includeSignature, callback)</td>
    <td style="padding:15px">Query VNF Package Manifest

The GET method reads the content of the manifest within a VNF package.
</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/onboarded_vnf_packages/{pathv1}/manifest?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getOnboardedVnfPackagesVnfdIdPackageContent(vnfdId, callback)</td>
    <td style="padding:15px">Fetch VNF Package.
The GET method fetches the content of a VNF package identified by the
VNF packag</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/onboarded_vnf_packages/{pathv1}/package_content?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getOnboardedVnfPackagesVnfdIdArtifacts(vnfdId, callback)</td>
    <td style="padding:15px">Fetch VNF Package Artifacts.

The GET method shall return an archive that contains a set of artifac</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/onboarded_vnf_packages/{pathv1}/artifacts?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getOnboardedVnfPackagesVnfdIdArtifactsArtifactPath(artifactPath, vnfdId, includeSignature, callback)</td>
    <td style="padding:15px">Fetch VNF Package Artifacts.
The GET method fetches the content of an artifact within a VNF package</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/onboarded_vnf_packages/{pathv1}/artifacts/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfPackagesVnfPkgId(vnfPkgId, includeSignature, callback)</td>
    <td style="padding:15px">Query VNF Package Info.
The GET method reads the information of an individual VNF package.
This met</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/vnf_packages/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfPackagesVnfPkgIdVnfd(vnfPkgId, includeSignature, callback)</td>
    <td style="padding:15px">Query VNF Package Info

The GET method reads the content of the VNFD within a VNF package.
The VNFD</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/vnf_packages/{pathv1}/vnfd?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfPackagesVnfPkgIdManifest(vnfPkgId, includeSignature, callback)</td>
    <td style="padding:15px">Query VNF Package Manifest

The GET method reads the content of the manifest within a VNF package.
</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/vnf_packages/{pathv1}/manifest?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfPackagesVnfPkgIdPackageContent(vnfPkgId, callback)</td>
    <td style="padding:15px">Fetch VNF Package.
The GET method fetches the content of a VNF package identified by the
VNF packag</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/vnf_packages/{pathv1}/package_content?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfPackagesVnfPkgIdArtifacts(vnfPkgId, callback)</td>
    <td style="padding:15px">Fetch VNF Package Artifacts.

The GET method shall return an archive that contains a set of artifac</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/vnf_packages/{pathv1}/artifacts?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfPackagesVnfPkgIdArtifactsArtifactPath(artifactPath, vnfPkgId, includeSignature, callback)</td>
    <td style="padding:15px">Fetch VNF Package Artifacts.
The GET method fetches the content of an artifact within a VNF package</td>
    <td style="padding:15px">{base_path}/{version}/vnfpkgm/v2/vnf_packages/{pathv1}/artifacts/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postPmJobs(body, callback)</td>
    <td style="padding:15px">Create PM Job.
The POST method creates a PM job.
This method shall follow the provisions specified</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/pm_jobs?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPmJobs(filter, allFields, fields, excludeFields, excludeDefault, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Query PM Job.
The API consumer can use this method to retrieve information about PM jobs.
This meth</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/pm_jobs?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPmJobsPmJobId(pmJobId, callback)</td>
    <td style="padding:15px">Query PM Job.
The API consumer can use this method for reading an individual PM job.
This method sh</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/pm_jobs/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">patchPmJobsPmJobId(pmJobId, callback)</td>
    <td style="padding:15px">This method allows to modify an "Individual PM job" resource.
This method shall follow the provisio</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/pm_jobs/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deletePmJobsPmJobId(pmJobId, callback)</td>
    <td style="padding:15px">Delete PM Job.
This method terminates an individual PM job.
This method shall follow the provisions</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/pm_jobs/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPmJobsPmJobIdReportsReportId(pmJobId, reportId, callback)</td>
    <td style="padding:15px">The API consumer can use this method for reading an individual performance report.
This method shal</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/pm_jobs/{pathv1}/reports/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">postThresholds(body, callback)</td>
    <td style="padding:15px">Create Threshold.
The POST method can be used by the API consumer to create a threshold.
This metho</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/thresholds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getThresholds(filter, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">Query Threshold.
The API consumer can use this method to query information about thresholds.
This m</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/thresholds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getThresholdsThresholdId(thresholdId, callback)</td>
    <td style="padding:15px">Query Threshold.
The API consumer can use this method for reading an individual threshold
This meth</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/thresholds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">patchThresholdsThresholdId(thresholdId, callback)</td>
    <td style="padding:15px">This method allows to modify an "Individual threshold" resource.
This method shall follow the provi</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/thresholds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteThresholdsThresholdId(thresholdId, callback)</td>
    <td style="padding:15px">Delete Threshold.
This method allows to delete a threshold.
This method shall follow the provisions</td>
    <td style="padding:15px">{base_path}/{version}/vnfpm/v2/thresholds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfSnapshotPackages(filter, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">The GET method queries the information of the VNF packages matching the filter.
</td>
    <td style="padding:15px">{base_path}/{version}/vnfsnapshotpkgm/v1/vnf_snapshot_packages?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfSnapshotPackagesVnfSnapshotPkgId(vnfSnapshotPkgId, filter, nextpageOpaqueMarker, callback)</td>
    <td style="padding:15px">The GET method reads the information of an individual VNF snapshot package.
</td>
    <td style="padding:15px">{base_path}/{version}/vnfsnapshotpkgm/v1/vnf_snapshot_packages/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfSnapshotPackagesVnfSnapshotPkgIdPackageContent(vnfSnapshotPkgId, callback)</td>
    <td style="padding:15px">The GET method fetches the content of a VNF snapshot package.
</td>
    <td style="padding:15px">{base_path}/{version}/vnfsnapshotpkgm/v1/vnf_snapshot_packages/{pathv1}/package_content?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVnfSnapshotPackagesVnfSnapshotPkgIdArtifactsArtifactPath(vnfSnapshotPkgId, artifactPath, callback)</td>
    <td style="padding:15px">The GET method fetches the content of an artifact within the VNF snapshot package.
</td>
    <td style="padding:15px">{base_path}/{version}/vnfsnapshotpkgm/v1/vnf_snapshot_packages/{pathv1}/artifacts/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>

### Authentication

This document will go through the steps for authenticating the ETSI Standard sol003 adapter with Basic Authentication. Properly configuring the properties for an adapter in IAP is critical for getting the adapter online. You can read more about adapter authentication <a href="https://www.itential.com/automation-platform/integrations/adapters-resources/authentication/" target="_blank">HERE</a>. 

#### Basic Authentication
The ETSI Standard sol003 adapter requires Basic Authentication. If you change authentication methods, you should change this section accordingly and merge it back into the adapter repository.

STEPS  
1. Ensure you have access to a ETSI Standard sol003 server and that it is running
2. Follow the steps in the README.md to import the adapter into IAP if you have not already done so
3. Use the properties below for the ```properties.authentication``` field
```json
"authentication": {
  "auth_method": "basic user_password",
  "username": "<username>",
  "password": "<password>",
  "token": "",
  "token_timeout": 1800000,
  "token_cache": "local",
  "invalid_token_error": 401,
  "auth_field": "header.headers.Authorization",
  "auth_field_format": "Basic {b64}{username}:{password}{/b64}",
  "auth_logging": false,
  "client_id": "",
  "client_secret": "",
  "grant_type": ""
}
```
4. Restart the adapter. If your properties were set correctly, the adapter should go online. 

#### Troubleshooting
- Make sure you copied over the correct username and password.
- Turn on debug level logs for the adapter in IAP Admin Essentials.
- Turn on auth_logging for the adapter in IAP Admin Essentials (adapter properties).
- Investigate the logs - in particular:
  - The FULL REQUEST log to make sure the proper headers are being sent with the request.
  - The FULL BODY log to make sure the payload is accurate.
  - The CALL RETURN log to see what the other system is telling us.
- Remember when you are done to turn auth_logging off as you do not want to log credentials.

## Additional Information

### Enhancements

#### Adding a Second Instance of an Adapter

You can add a second instance of this adapter without adding new code on the file system. To do this go into the IAP Admin Essentials and add a new service config for this adapter. The two instances of the adapter should have unique ids. In addition, they should point to different instances (unique host and port) of the other system.

#### Adding Adapter Calls

There are multiple ways to add calls to an existing adapter.

The easiest way would be to use the Adapter Builder update process. This process takes in a Swagger or OpenAPI document, allows you to select the calls you want to add and then generates a zip file that can be used to update the adapter. Once you have the zip file simply put it in the adapter directory and execute `npm run adapter:update`.

```bash
mv updatePackage.zip adapter-etsi_sol003
cd adapter-etsi_sol003
npm run adapter:update
```

If you do not have a Swagger or OpenAPI document, you can use a Postman Collection and convert that to an OpenAPI document using APIMatic and then follow the first process.

If you want to manually update the adapter that can also be done the key thing is to make sure you update all of the right files. Within the entities directory you will find 1 or more entities. You can create a new entity or add to an existing entity. Each entity has an action.json file, any new call will need to be put in the action.json file. It will also need to be added to the enum for the ph_request_type in the appropriate schema files. Once this configuration is complete you will need to add the call to the adapter.js file and, in order to make it available as a workflow task in IAP, it should also be added to the pronghorn.json file. You can optionally add it to the unit and integration test files. There is more information on how to work on each of these files in the <a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter Technical Resources</a> on our Documentation Site.

```text
Files to update
* entities/<entity>/action.json: add an action
* entities/<entity>/schema.json (or the schema defined on the action): add action to the enum for ph_request_type
* adapter.js: add the new method and make sure it calls the proper entity and action
* pronghorn.json: add the new method
* test/unit/adapterTestUnit.js (optional but best practice): add unit test(s) - function is there, any required parameters error when not passed in
* test/integration/adapterTestIntegration.js (optional but best practice): add integration test
```

#### Adding Adapter Properties

While changing adapter properties is done in the service instance configuration section of IAP, adding properties has to be done in the adapter. To add a property you should edit the propertiesSchema.json with the proper information for the property. In addition, you should modify the sampleProperties to have the new property in it.

```text
Files to update
* propertiesSchema.json: add the new property and how it is defined
* sampleProperties: add the new property with a default value
* test/unit/adapterTestUnit.js (optional but best practice): add the property to the global properties
* test/integration/adapterTestIntegration.js (optional but best practice): add the property to the global properties
```

#### Changing Adapter Authentication

Often an adapter is built before knowing the authentication and authentication processes can also change over time. The adapter supports many different kinds of authentication but it does require configuration. Some forms of authentication can be defined entirely with the adapter properties but others require configuration.

```text
Files to update
* entities/.system/action.json: change the getToken action as needed
* entities/.system/schemaTokenReq.json: add input parameters (external name is name in other system)
* entities/.system/schemaTokenResp.json: add response parameters (external name is name in other system)
* propertiesSchema.json: add any new property and how it is defined
* sampleProperties: add any new property with a default value
* test/unit/adapterTestUnit.js (optional but best practice): add the property to the global properties
* test/integration/adapterTestIntegration.js (optional but best practice): add the property to the global properties
```

#### Enhancing Adapter Integration Tests

The adapter integration tests are written to be able to test in either stub (standalone) mode or integrated to the other system. However, if integrating to the other system, you may need to provide better data than what the adapter provides by default as that data is likely to fail for create and update. To provide better data, edit the adapter integration test file. Make sure you do not remove the marker and keep custom code below the marker so you do not impact future migrations. Once the edits are complete, run the integration test as it instructs you to above. When you run integrated to the other system, you can also save mockdata for future use by changing the isSaveMockData flag to true.

```text
Files to update
* test/integration/adapterTestIntegration.js: add better data for the create and update calls so that they will not fail.
```

As mentioned previously, for most of these changes as well as other possible changes, there is more information on how to work on an adapter in the <a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter Technical Resources</a> on our Documentation Site.

### Contributing

First off, thanks for taking the time to contribute!

The following is a set of rules for contributing.

#### Code of Conduct

This project and everyone participating in it is governed by the Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@itential.com.

#### How to Contribute

Follow the contributing guide (here)[https://gitlab.com/itentialopensource/adapters/contributing-guide]

### Helpful Links

<a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter Technical Resources</a>

### Node Scripts

There are several node scripts that now accompany the adapter. These scripts are provided to make several activities easier. Many of these scripts can have issues with different versions of IAP as they have dependencies on IAP and Mongo. If you have issues with the scripts please report them to the Itential Adapter Team. Each of these scripts are described below.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Run</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:install</td>
    <td style="padding:15px">Provides an easier way to install the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:checkMigrate</td>
    <td style="padding:15px">Checks whether your adapter can and should be migrated to the latest foundation.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:findPath</td>
    <td style="padding:15px">Can be used to see if the adapter supports a particular API call.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:migrate</td>
    <td style="padding:15px">Provides an easier way to update your adapter after you download the migration zip from Itential DevSite.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:update</td>
    <td style="padding:15px">Provides an easier way to update your adapter after you download the update zip from Itential DevSite.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:revert</td>
    <td style="padding:15px">Allows you to revert after a migration or update if it resulted in issues.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run troubleshoot</td>
    <td style="padding:15px">Provides a way to troubleshoot the adapter - runs connectivity, healthcheck and basic get.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run connectivity</td>
    <td style="padding:15px">Provides a connectivity check to the Servicenow system.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run healthcheck</td>
    <td style="padding:15px">Checks whether the configured healthcheck call works to Servicenow.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run basicget</td>
    <td style="padding:15px">Checks whether the basic get calls works to Servicenow.</td>
  </tr>
</table>
<br>

## Troubleshoot

Run `npm run troubleshoot` to start the interactive troubleshooting process. The command allows you to verify and update connection, authentication as well as healthcheck configuration. After that it will test these properties by sending HTTP request to the endpoint. If the tests pass, it will persist these changes into IAP.

You also have the option to run individual commands to perform specific test:

- `npm run healthcheck` will perform a healthcheck request of with current setting.
- `npm run basicget` will perform some non-parameter GET request with current setting.
- `npm run connectivity` will perform networking diagnostics of the adatper endpoint.

### Connectivity Issues

1. You can run the adapter troubleshooting script which will check connectivity, run the healthcheck and run basic get calls.

```bash
npm run troubleshoot
```

2. Verify the adapter properties are set up correctly.

```text
Go into the Itential Platform GUI and verify/update the properties
```

3. Verify there is connectivity between the Itential Platform Server and Etsi_sol003 Server.

```text
ping the ip address of Etsi_sol003 server
try telnet to the ip address port of Etsi_sol003
execute a curl command to the other system
```

4. Verify the credentials provided for Etsi_sol003.

```text
login to Etsi_sol003 using the provided credentials
```

5. Verify the API of the call utilized for Etsi_sol003 Healthcheck.

```text
Go into the Itential Platform GUI and verify/update the properties
```

### Functional Issues

Adapter logs are located in `/var/log/pronghorn`. In older releases of the Itential Platform, there is a `pronghorn.log` file which contains logs for all of the Itential Platform. In newer versions, adapters can be configured to log into their own files.


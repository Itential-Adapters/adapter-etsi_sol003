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

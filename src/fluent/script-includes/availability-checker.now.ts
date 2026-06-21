import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
  $id: Now.ID['availability_checker_si'],
  name: 'AvailabilityChecker',
  active: true,
  description: 'Reusable utility for checking and updating availability of property units and land lots',
  script: script`var AvailabilityChecker = Class.create();
AvailabilityChecker.prototype = {
  initialize: function() {},

  isUnitAvailable: function(unitSysId) {
    var gr = new GlideRecord('x_2099006_reprop_property_unit');
    if (gr.get(unitSysId)) {
      return gr.getValue('x_2099006_reprop_status') === 'available';
    }
    return false;
  },

  isLotAvailable: function(lotSysId) {
    var gr = new GlideRecord('x_2099006_reprop_land_lot');
    if (gr.get(lotSysId)) {
      return gr.getValue('x_2099006_reprop_status') === 'available';
    }
    return false;
  },

  setUnitStatus: function(unitSysId, status) {
    var gr = new GlideRecord('x_2099006_reprop_property_unit');
    if (gr.get(unitSysId)) {
      gr.setValue('x_2099006_reprop_status', status);
      gr.update();
      return true;
    }
    return false;
  },

  setLotStatus: function(lotSysId, status) {
    var gr = new GlideRecord('x_2099006_reprop_land_lot');
    if (gr.get(lotSysId)) {
      gr.setValue('x_2099006_reprop_status', status);
      gr.update();
      return true;
    }
    return false;
  },

  hasActiveBooking: function(table, sysId, refField) {
    var gr = new GlideRecord('x_2099006_reprop_booking');
    gr.addQuery(refField, sysId);
    gr.addQuery('x_2099006_reprop_status', 'IN', 'submitted,under_review,approved');
    gr.query();
    return gr.hasNext();
  },

  type: 'AvailabilityChecker'
};`,
})

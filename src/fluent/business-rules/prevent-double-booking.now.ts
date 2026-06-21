import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
  $id: Now.ID['prevent_double_booking_br'],
  name: 'Prevent Double Booking',
  table: 'x_2099006_reprop_booking',
  when: 'before',
  action: ['insert'],
  order: 100,
  active: true,
  script: script`function onBefore() {
  var bookingType = current.getValue('x_2099006_reprop_booking_type');
  var checker = new x_2099006_reprop.AvailabilityChecker();

  if (bookingType === 'unit') {
    var unitSysId = current.getValue('x_2099006_reprop_unit');
    if (!unitSysId) {
      current.setAbortAction(true);
      gs.addErrorMessage('A Property Unit must be selected for a unit booking.');
      return;
    }
    if (!checker.isUnitAvailable(unitSysId)) {
      current.setAbortAction(true);
      gs.addErrorMessage('This property unit is no longer available. Please select a different unit.');
      return;
    }
    if (checker.hasActiveBooking('x_2099006_reprop_property_unit', unitSysId, 'x_2099006_reprop_unit')) {
      current.setAbortAction(true);
      gs.addErrorMessage('An active booking already exists for this unit.');
    }
  } else if (bookingType === 'lot') {
    var lotSysId = current.getValue('x_2099006_reprop_lot');
    if (!lotSysId) {
      current.setAbortAction(true);
      gs.addErrorMessage('A Land Lot must be selected for a lot booking.');
      return;
    }
    if (!checker.isLotAvailable(lotSysId)) {
      current.setAbortAction(true);
      gs.addErrorMessage('This land lot is no longer available. Please select a different lot.');
      return;
    }
    if (checker.hasActiveBooking('x_2099006_reprop_land_lot', lotSysId, 'x_2099006_reprop_lot')) {
      current.setAbortAction(true);
      gs.addErrorMessage('An active booking already exists for this lot.');
    }
  }
}`,
})

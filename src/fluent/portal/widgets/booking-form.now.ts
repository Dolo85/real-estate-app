import { SPWidget } from '@servicenow/sdk/core'

export const repropBookingFormWidget = SPWidget({
  $id: Now.ID['reprop_booking_form_widget'],
  name: 'RepProp - Booking Form',
  id: 'reprop-booking-form',
  description: 'Booking submission form for property units and land lots',
  public: true,

  serverScript: `(function() {
  var sysId = $sp.getParameter('sys_id') || '';
  var type  = $sp.getParameter('type')   || 'unit';

  data.type      = type;
  data.property  = null;
  data.error     = '';
  data.submitted = false;
  data.bookingNumber = '';

  // Handle form submission from client
  if (input && input.action === 'submit') {
    var booking = new GlideRecord('x_2099006_reprop_booking');
    booking.setValue('x_2099006_reprop_booking_type',    input.type);
    booking.setValue('x_2099006_reprop_customer_name',   input.customer_name);
    booking.setValue('x_2099006_reprop_customer_email',  input.customer_email);
    booking.setValue('x_2099006_reprop_customer_phone',  input.customer_phone || '');
    booking.setValue('x_2099006_reprop_financing_type',  input.financing_type || 'mortgage');
    booking.setValue('x_2099006_reprop_notes',           input.notes || '');
    booking.setValue('x_2099006_reprop_submitted_at',    new GlideDateTime().toString());

    if (input.type === 'unit') {
      booking.setValue('x_2099006_reprop_unit', sysId);
    } else {
      booking.setValue('x_2099006_reprop_lot', sysId);
    }

    var newId = booking.insert();
    if (newId) {
      var created = new GlideRecord('x_2099006_reprop_booking');
      created.get(newId);
      data.submitted = true;
      data.bookingNumber = created.getValue('number') || newId;
    } else {
      data.error = 'Booking could not be saved. Please try again.';
    }
    return;
  }

  // Load property details for display
  if (!sysId) {
    data.error = 'No property selected.';
    return;
  }

  var table = type === 'lot' ? 'x_2099006_reprop_land_lot' : 'x_2099006_reprop_property_unit';
  var gr = new GlideRecord(table);
  if (!gr.get(sysId)) {
    data.error = 'Property not found.';
    return;
  }

  if (type === 'lot') {
    data.property = {
      label:  'Lot ' + gr.getValue('x_2099006_reprop_lot_number'),
      detail: gr.getDisplayValue('x_2099006_reprop_lot_type'),
      price:  gr.getValue('x_2099006_reprop_price'),
      status: gr.getValue('x_2099006_reprop_status'),
    };
  } else {
    data.property = {
      label:  'Unit ' + gr.getValue('x_2099006_reprop_unit_number'),
      detail: gr.getDisplayValue('x_2099006_reprop_unit_type') + (gr.getValue('x_2099006_reprop_bedrooms') ? ' · ' + gr.getValue('x_2099006_reprop_bedrooms') + ' bd' : ''),
      price:  gr.getValue('x_2099006_reprop_price'),
      status: gr.getValue('x_2099006_reprop_status'),
    };
  }

  if (data.property.status !== 'available') {
    data.error = 'This property is no longer available for booking.';
  }
})();`,

  clientScript: `api.controller = function($location) {
  var c = this;

  c.form = {
    customer_name:  '',
    customer_email: '',
    customer_phone: '',
    financing_type: 'mortgage',
    notes: '',
  };

  c.fmtPrice = function(price) {
    if (!price) return 'Contact for price';
    return '$' + Number(price).toLocaleString();
  };

  c.submit = function() {
    if (!c.form.customer_name || !c.form.customer_email) {
      c.validationError = 'Please fill in your name and email.';
      return;
    }
    c.validationError = '';
    c.submitting = true;
    c.server.get({
      action:         'submit',
      type:           c.data.type,
      customer_name:  c.form.customer_name,
      customer_email: c.form.customer_email,
      customer_phone: c.form.customer_phone,
      financing_type: c.form.financing_type,
      notes:          c.form.notes,
    }).then(function() {
      c.submitting = false;
    });
  };

  c.goBack = function() {
    var page = c.data.type === 'lot' ? 'reprop_lot_detail' : 'reprop_unit_detail';
    var sysId = $location.search().sys_id;
    $location.url('?id=' + page + '&sys_id=' + sysId);
  };
};`,

  htmlTemplate: `<div class="reprop-booking-form">

  <div ng-if="c.data.error" class="alert alert-danger">{{c.data.error}}</div>

  <div ng-if="c.data.submitted" class="text-center reprop-success">
    <i class="fa fa-check-circle fa-4x text-success"></i>
    <h2>Booking Submitted!</h2>
    <p>Thank you for your interest. Your booking application has been received and is under review.</p>
    <p ng-if="c.data.bookingNumber"><strong>Reference: {{c.data.bookingNumber}}</strong></p>
    <p>You will receive an email confirmation and a team member will contact you shortly.</p>
    <a href="?id=reprop_search" class="btn btn-primary">Browse More Properties</a>
    <a href="?id=reprop_my_bookings" class="btn btn-default" style="margin-left:8px">View My Bookings</a>
  </div>

  <div ng-if="!c.data.submitted && c.data.property && !c.data.error">
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <h2>Reserve {{c.data.property.label}}</h2>

        <div class="panel panel-info reprop-property-summary">
          <div class="panel-body">
            <div class="row">
              <div class="col-sm-8">
                <strong>{{c.data.property.label}}</strong>
                <p class="text-muted">{{c.data.property.detail}}</p>
              </div>
              <div class="col-sm-4 text-right">
                <span class="reprop-form-price">{{c.fmtPrice(c.data.property.price)}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-warning" ng-if="c.validationError">{{c.validationError}}</div>

        <div class="panel panel-default">
          <div class="panel-heading"><strong>Your Details</strong></div>
          <div class="panel-body">
            <div class="form-group">
              <label>Full Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" ng-model="c.form.customer_name" placeholder="Your full name">
            </div>
            <div class="form-group">
              <label>Email Address <span class="text-danger">*</span></label>
              <input type="email" class="form-control" ng-model="c.form.customer_email" placeholder="your@email.com">
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" class="form-control" ng-model="c.form.customer_phone" placeholder="+1 (555) 000-0000">
            </div>
            <div class="form-group">
              <label>Financing Type</label>
              <select class="form-control" ng-model="c.form.financing_type">
                <option value="cash">Cash</option>
                <option value="mortgage">Mortgage</option>
                <option value="pre_approved">Pre-Approved Mortgage</option>
              </select>
            </div>
            <div class="form-group">
              <label>Additional Notes</label>
              <textarea class="form-control" rows="3" ng-model="c.form.notes" placeholder="Any questions or additional information"></textarea>
            </div>
          </div>
        </div>

        <div class="text-right reprop-form-actions">
          <button class="btn btn-default" ng-click="c.goBack()">
            <i class="fa fa-arrow-left"></i> Back
          </button>
          <button class="btn btn-primary btn-lg" ng-click="c.submit()" ng-disabled="c.submitting" style="margin-left:8px">
            <i class="fa fa-paper-plane" ng-if="!c.submitting"></i>
            <i class="fa fa-spinner fa-spin" ng-if="c.submitting"></i>
            {{c.submitting ? 'Submitting...' : 'Submit Booking'}}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`,

  customCss: `.reprop-success {
  padding: 40px 20px;
}
.reprop-success .fa-check-circle {
  margin-bottom: 16px;
}
.reprop-property-summary {
  margin-bottom: 24px;
}
.reprop-form-price {
  font-size: 22px;
  font-weight: bold;
  color: #0070d2;
}
.reprop-form-actions {
  margin-top: 16px;
  margin-bottom: 24px;
}`,
})

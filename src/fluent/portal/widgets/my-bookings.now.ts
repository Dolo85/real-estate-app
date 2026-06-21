import { SPWidget } from '@servicenow/sdk/core'

export const repropMyBookingsWidget = SPWidget({
  $id: Now.ID['reprop_my_bookings_widget'],
  name: 'RepProp - My Bookings',
  id: 'reprop-my-bookings',
  description: 'Shows all bookings submitted by the currently logged-in user',
  public: false,

  serverScript: `(function() {
  data.bookings  = [];
  data.isGuest   = gs.isLoggedIn() === false;
  data.userEmail = gs.getUser().getEmail();

  if (data.isGuest) return;

  var gr = new GlideRecord('x_2099006_reprop_booking');
  gr.addQuery('x_2099006_reprop_customer_email', data.userEmail);
  gr.orderByDesc('sys_created_on');
  gr.query();

  while (gr.next()) {
    var bType = gr.getValue('x_2099006_reprop_booking_type');
    var propertyLabel = '';

    if (bType === 'unit') {
      propertyLabel = 'Unit ' + gr.getDisplayValue('x_2099006_reprop_unit');
    } else {
      propertyLabel = 'Lot ' + gr.getDisplayValue('x_2099006_reprop_lot');
    }

    data.bookings.push({
      sys_id:         gr.getValue('sys_id'),
      number:         gr.getValue('number') || gr.getValue('sys_id').substring(0, 8).toUpperCase(),
      booking_type:   gr.getDisplayValue('x_2099006_reprop_booking_type'),
      property_label: propertyLabel,
      status:         gr.getValue('x_2099006_reprop_status'),
      status_label:   gr.getDisplayValue('x_2099006_reprop_status'),
      submitted_at:   gr.getDisplayValue('x_2099006_reprop_submitted_at') || gr.getDisplayValue('sys_created_on'),
      approved_at:    gr.getDisplayValue('x_2099006_reprop_approved_at'),
      offer_price:    gr.getValue('x_2099006_reprop_offer_price'),
    });
  }
})();`,

  clientScript: `api.controller = function($location) {
  var c = this;

  c.statusClass = function(status) {
    var map = {
      submitted:    'label-default',
      under_review: 'label-info',
      approved:     'label-success',
      rejected:     'label-danger',
      cancelled:    'label-warning',
      completed:    'label-primary',
    };
    return map[status] || 'label-default';
  };

  c.viewProperty = function(booking) {
    if (booking.booking_type === 'Land Lot') {
      $location.url('?id=reprop_lot_detail&sys_id=' + booking.sys_id);
    } else {
      $location.url('?id=reprop_unit_detail&sys_id=' + booking.sys_id);
    }
  };

  c.goSearch = function() {
    $location.url('?id=reprop_search');
  };

  c.fmtPrice = function(price) {
    if (!price) return '';
    return '$' + Number(price).toLocaleString();
  };
};`,

  htmlTemplate: `<div class="reprop-my-bookings">
  <h2>My Bookings</h2>

  <div ng-if="c.data.isGuest" class="alert alert-warning">
    <i class="fa fa-lock"></i> Please <a href="?id=login">log in</a> to view your bookings.
  </div>

  <div ng-if="!c.data.isGuest">
    <p class="text-muted" ng-if="c.data.userEmail">Showing bookings for <strong>{{c.data.userEmail}}</strong></p>

    <div ng-if="c.data.bookings.length === 0" class="alert alert-info text-center">
      <i class="fa fa-calendar fa-2x"></i>
      <p>You have no bookings yet.</p>
      <button class="btn btn-primary" ng-click="c.goSearch()">Browse Properties</button>
    </div>

    <div ng-if="c.data.bookings.length > 0" class="table-responsive">
      <table class="table table-striped table-hover reprop-bookings-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Property</th>
            <th>Type</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          <tr ng-repeat="b in c.data.bookings">
            <td><strong>{{b.number}}</strong></td>
            <td>{{b.property_label}}</td>
            <td>{{b.booking_type}}</td>
            <td>
              <span class="label" ng-class="c.statusClass(b.status)">{{b.status_label}}</span>
            </td>
            <td>{{b.submitted_at}}</td>
            <td>{{b.approved_at || '—'}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="reprop-actions">
      <button class="btn btn-default" ng-click="c.goSearch()">
        <i class="fa fa-search"></i> Browse More Properties
      </button>
    </div>
  </div>
</div>`,

  customCss: `.reprop-my-bookings h2 {
  margin-bottom: 16px;
}
.reprop-bookings-table {
  margin-top: 16px;
}
.reprop-actions {
  margin-top: 16px;
}`,
})

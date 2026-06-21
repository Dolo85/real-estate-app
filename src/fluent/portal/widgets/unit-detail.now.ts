import { SPWidget } from '@servicenow/sdk/core'

export const repropUnitDetailWidget = SPWidget({
  $id: Now.ID['reprop_unit_detail_widget'],
  name: 'RepProp - Unit Detail',
  id: 'reprop-unit-detail',
  description: 'Displays full details for a property unit with a booking call-to-action',
  public: true,

  serverScript: `(function() {
  var sysId = $sp.getParameter('sys_id') || '';
  data.unit = null;
  data.error = '';

  if (!sysId) {
    data.error = 'No unit selected.';
    return;
  }

  var gr = new GlideRecord('x_2099006_reprop_property_unit');
  if (!gr.get(sysId)) {
    data.error = 'Property unit not found.';
    return;
  }

  data.unit = {
    sys_id:           gr.getValue('sys_id'),
    unit_number:      gr.getValue('x_2099006_reprop_unit_number'),
    building:         gr.getValue('x_2099006_reprop_building'),
    floor:            gr.getValue('x_2099006_reprop_floor'),
    unit_type:        gr.getDisplayValue('x_2099006_reprop_unit_type'),
    status:           gr.getValue('x_2099006_reprop_status'),
    status_label:     gr.getDisplayValue('x_2099006_reprop_status'),
    price:            gr.getValue('x_2099006_reprop_price'),
    sqft:             gr.getValue('x_2099006_reprop_sqft'),
    bedrooms:         gr.getValue('x_2099006_reprop_bedrooms'),
    bathrooms:        gr.getValue('x_2099006_reprop_bathrooms'),
    parking:          gr.getValue('x_2099006_reprop_parking'),
    description:      gr.getValue('x_2099006_reprop_description'),
    photos_url:       gr.getValue('x_2099006_reprop_photos_url'),
    virtual_tour_url: gr.getValue('x_2099006_reprop_virtual_tour_url'),
    floor_plan_url:   gr.getValue('x_2099006_reprop_floor_plan_url'),
    project_name:     gr.getDisplayValue('x_2099006_reprop_project'),
    is_available:     gr.getValue('x_2099006_reprop_status') === 'available',
  };
})();`,

  clientScript: `api.controller = function($location) {
  var c = this;

  c.goBook = function() {
    $location.url('?id=reprop_booking_form&sys_id=' + c.data.unit.sys_id + '&type=unit');
  };

  c.goBack = function() {
    $location.url('?id=reprop_search');
  };

  c.fmtPrice = function(price) {
    if (!price) return 'Contact for price';
    return '$' + Number(price).toLocaleString();
  };
};`,

  htmlTemplate: `<div class="reprop-detail">
  <div ng-if="c.data.error" class="alert alert-danger">{{c.data.error}}</div>

  <div ng-if="c.data.unit">
    <div class="row reprop-detail-header">
      <div class="col-md-8">
        <h2>Unit {{c.data.unit.unit_number}}
          <small>{{c.data.unit.building}}<span ng-if="c.data.unit.floor"> &middot; Floor {{c.data.unit.floor}}</span></small>
        </h2>
        <p class="reprop-project-name" ng-if="c.data.unit.project_name">
          <i class="fa fa-building"></i> {{c.data.unit.project_name}}
        </p>
      </div>
      <div class="col-md-4 text-right">
        <span class="label reprop-status-badge"
          ng-class="{'label-success': c.data.unit.status === 'available', 'label-warning': c.data.unit.status === 'reserved', 'label-danger': c.data.unit.status === 'sold'}">
          {{c.data.unit.status_label}}
        </span>
        <p class="reprop-price-large">{{c.fmtPrice(c.data.unit.price)}}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="panel panel-default">
          <div class="panel-heading"><strong>Property Details</strong></div>
          <div class="panel-body">
            <div class="row">
              <div class="col-sm-6">
                <p><strong>Type:</strong> {{c.data.unit.unit_type}}</p>
                <p><strong>Bedrooms:</strong> {{c.data.unit.bedrooms || '—'}}</p>
                <p><strong>Bathrooms:</strong> {{c.data.unit.bathrooms || '—'}}</p>
                <p><strong>Size:</strong> {{c.data.unit.sqft | number:0}} sqft</p>
              </div>
              <div class="col-sm-6">
                <p><strong>Floor:</strong> {{c.data.unit.floor || '—'}}</p>
                <p><strong>Parking:</strong> {{c.data.unit.parking ? 'Included' : 'Not included'}}</p>
              </div>
            </div>
            <div ng-if="c.data.unit.description" class="reprop-description" ng-bind-html="c.data.unit.description"></div>
          </div>
        </div>

        <div class="reprop-links" ng-if="c.data.unit.photos_url || c.data.unit.virtual_tour_url || c.data.unit.floor_plan_url">
          <a ng-if="c.data.unit.photos_url" ng-href="{{c.data.unit.photos_url}}" target="_blank" class="btn btn-default btn-sm">
            <i class="fa fa-camera"></i> Photos
          </a>
          <a ng-if="c.data.unit.virtual_tour_url" ng-href="{{c.data.unit.virtual_tour_url}}" target="_blank" class="btn btn-default btn-sm">
            <i class="fa fa-street-view"></i> Virtual Tour
          </a>
          <a ng-if="c.data.unit.floor_plan_url" ng-href="{{c.data.unit.floor_plan_url}}" target="_blank" class="btn btn-default btn-sm">
            <i class="fa fa-th-large"></i> Floor Plan
          </a>
        </div>
      </div>

      <div class="col-md-4">
        <div class="panel panel-primary">
          <div class="panel-heading"><strong>Interested in this unit?</strong></div>
          <div class="panel-body text-center">
            <p class="reprop-price-large">{{c.fmtPrice(c.data.unit.price)}}</p>
            <button ng-if="c.data.unit.is_available" class="btn btn-primary btn-lg btn-block" ng-click="c.goBook()">
              <i class="fa fa-calendar-check-o"></i> Reserve This Unit
            </button>
            <div ng-if="!c.data.unit.is_available" class="alert alert-warning">
              This unit is currently {{c.data.unit.status_label | lowercase}}.
            </div>
          </div>
        </div>
        <button class="btn btn-default btn-block" ng-click="c.goBack()">
          <i class="fa fa-arrow-left"></i> Back to Search
        </button>
      </div>
    </div>
  </div>
</div>`,

  customCss: `.reprop-detail-header {
  margin-bottom: 20px;
}
.reprop-project-name {
  color: #666;
  font-size: 14px;
}
.reprop-status-badge {
  font-size: 14px;
  padding: 6px 12px;
}
.reprop-price-large {
  font-size: 28px;
  font-weight: bold;
  color: #0070d2;
  margin: 8px 0;
}
.reprop-description {
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}
.reprop-links {
  margin-top: 8px;
}
.reprop-links .btn {
  margin-right: 8px;
  margin-bottom: 8px;
}`,
})

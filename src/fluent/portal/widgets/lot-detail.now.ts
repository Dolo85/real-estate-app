import { SPWidget } from '@servicenow/sdk/core'

export const repropLotDetailWidget = SPWidget({
  $id: Now.ID['reprop_lot_detail_widget'],
  name: 'RepProp - Lot Detail',
  id: 'reprop-lot-detail',
  description: 'Displays full details for a land lot with a booking call-to-action',
  public: true,

  serverScript: `(function() {
  var sysId = $sp.getParameter('sys_id') || '';
  data.lot = null;
  data.error = '';

  if (!sysId) {
    data.error = 'No lot selected.';
    return;
  }

  var gr = new GlideRecord('x_2099006_reprop_land_lot');
  if (!gr.get(sysId)) {
    data.error = 'Land lot not found.';
    return;
  }

  data.lot = {
    sys_id:        gr.getValue('sys_id'),
    lot_number:    gr.getValue('x_2099006_reprop_lot_number'),
    lot_type:      gr.getDisplayValue('x_2099006_reprop_lot_type'),
    status:        gr.getValue('x_2099006_reprop_status'),
    status_label:  gr.getDisplayValue('x_2099006_reprop_status'),
    price:         gr.getValue('x_2099006_reprop_price'),
    size_sqft:     gr.getValue('x_2099006_reprop_size_sqft'),
    size_acres:    gr.getValue('x_2099006_reprop_size_acres'),
    frontage_ft:   gr.getValue('x_2099006_reprop_frontage_ft'),
    depth_ft:      gr.getValue('x_2099006_reprop_depth_ft'),
    zoning:        gr.getValue('x_2099006_reprop_zoning'),
    map_lat:       gr.getValue('x_2099006_reprop_map_lat'),
    map_lng:       gr.getValue('x_2099006_reprop_map_lng'),
    util_water:    gr.getValue('x_2099006_reprop_util_water'),
    util_sewer:    gr.getValue('x_2099006_reprop_util_sewer'),
    util_electric: gr.getValue('x_2099006_reprop_util_electric'),
    util_gas:      gr.getValue('x_2099006_reprop_util_gas'),
    util_internet: gr.getValue('x_2099006_reprop_util_internet'),
    road_access:   gr.getValue('x_2099006_reprop_road_access'),
    hoa_fee:       gr.getValue('x_2099006_reprop_hoa_fee'),
    notes:         gr.getValue('x_2099006_reprop_notes'),
    photos_url:    gr.getValue('x_2099006_reprop_photos_url'),
    survey_url:    gr.getValue('x_2099006_reprop_survey_url'),
    project_name:  gr.getDisplayValue('x_2099006_reprop_project'),
    is_available:  gr.getValue('x_2099006_reprop_status') === 'available',
  };
})();`,

  clientScript: `api.controller = function($location) {
  var c = this;

  c.goBook = function() {
    $location.url('?id=reprop_booking_form&sys_id=' + c.data.lot.sys_id + '&type=lot');
  };

  c.goBack = function() {
    $location.url('?id=reprop_search&type=lot');
  };

  c.fmtPrice = function(price) {
    if (!price) return 'Contact for price';
    return '$' + Number(price).toLocaleString();
  };

  c.fmtFee = function(fee) {
    if (!fee) return '';
    return '$' + Number(fee).toLocaleString() + '/mo';
  };

  c.utilIcon = function(val) {
    return val === 'true' || val === '1' || val === true;
  };
};`,

  htmlTemplate: `<div class="reprop-detail">
  <div ng-if="c.data.error" class="alert alert-danger">{{c.data.error}}</div>

  <div ng-if="c.data.lot">
    <div class="row reprop-detail-header">
      <div class="col-md-8">
        <h2>Lot {{c.data.lot.lot_number}}
          <small>{{c.data.lot.lot_type}}</small>
        </h2>
        <p class="reprop-project-name" ng-if="c.data.lot.project_name">
          <i class="fa fa-building"></i> {{c.data.lot.project_name}}
        </p>
      </div>
      <div class="col-md-4 text-right">
        <span class="label reprop-status-badge"
          ng-class="{'label-success': c.data.lot.status === 'available', 'label-warning': c.data.lot.status === 'reserved', 'label-danger': c.data.lot.status === 'sold'}">
          {{c.data.lot.status_label}}
        </span>
        <p class="reprop-price-large">{{c.fmtPrice(c.data.lot.price)}}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="panel panel-default">
          <div class="panel-heading"><strong>Lot Details</strong></div>
          <div class="panel-body">
            <div class="row">
              <div class="col-sm-6">
                <p ng-if="c.data.lot.size_acres"><strong>Size:</strong> {{c.data.lot.size_acres}} acres ({{c.data.lot.size_sqft | number:0}} sqft)</p>
                <p ng-if="c.data.lot.frontage_ft"><strong>Frontage:</strong> {{c.data.lot.frontage_ft}} ft</p>
                <p ng-if="c.data.lot.depth_ft"><strong>Depth:</strong> {{c.data.lot.depth_ft}} ft</p>
                <p ng-if="c.data.lot.zoning"><strong>Zoning:</strong> {{c.data.lot.zoning}}</p>
              </div>
              <div class="col-sm-6">
                <p ng-if="c.data.lot.road_access"><strong>Road Access:</strong> <i class="fa fa-check text-success"></i> Yes</p>
                <p ng-if="c.data.lot.hoa_fee"><strong>HOA Fee:</strong> {{c.fmtFee(c.data.lot.hoa_fee)}}</p>
              </div>
            </div>

            <div class="reprop-utilities">
              <strong>Utilities Available:</strong>
              <div class="row" style="margin-top:8px">
                <div class="col-xs-4 col-sm-2 reprop-util-item">
                  <i class="fa fa-2x" ng-class="c.utilIcon(c.data.lot.util_water) ? 'fa-tint text-success' : 'fa-tint text-muted'"></i>
                  <p><small>Water</small></p>
                </div>
                <div class="col-xs-4 col-sm-2 reprop-util-item">
                  <i class="fa fa-2x" ng-class="c.utilIcon(c.data.lot.util_sewer) ? 'fa-filter text-success' : 'fa-filter text-muted'"></i>
                  <p><small>Sewer</small></p>
                </div>
                <div class="col-xs-4 col-sm-2 reprop-util-item">
                  <i class="fa fa-2x" ng-class="c.utilIcon(c.data.lot.util_electric) ? 'fa-bolt text-success' : 'fa-bolt text-muted'"></i>
                  <p><small>Electric</small></p>
                </div>
                <div class="col-xs-4 col-sm-2 reprop-util-item">
                  <i class="fa fa-2x" ng-class="c.utilIcon(c.data.lot.util_gas) ? 'fa-fire text-success' : 'fa-fire text-muted'"></i>
                  <p><small>Gas</small></p>
                </div>
                <div class="col-xs-4 col-sm-2 reprop-util-item">
                  <i class="fa fa-2x" ng-class="c.utilIcon(c.data.lot.util_internet) ? 'fa-wifi text-success' : 'fa-wifi text-muted'"></i>
                  <p><small>Internet</small></p>
                </div>
              </div>
            </div>

            <div ng-if="c.data.lot.notes" class="reprop-description" ng-bind-html="c.data.lot.notes"></div>
          </div>
        </div>

        <div class="reprop-links" ng-if="c.data.lot.photos_url || c.data.lot.survey_url">
          <a ng-if="c.data.lot.photos_url" ng-href="{{c.data.lot.photos_url}}" target="_blank" class="btn btn-default btn-sm">
            <i class="fa fa-camera"></i> Photos
          </a>
          <a ng-if="c.data.lot.survey_url" ng-href="{{c.data.lot.survey_url}}" target="_blank" class="btn btn-default btn-sm">
            <i class="fa fa-map"></i> Survey / Site Plan
          </a>
        </div>
      </div>

      <div class="col-md-4">
        <div class="panel panel-primary">
          <div class="panel-heading"><strong>Interested in this lot?</strong></div>
          <div class="panel-body text-center">
            <p class="reprop-price-large">{{c.fmtPrice(c.data.lot.price)}}</p>
            <button ng-if="c.data.lot.is_available" class="btn btn-primary btn-lg btn-block" ng-click="c.goBook()">
              <i class="fa fa-calendar-check-o"></i> Reserve This Lot
            </button>
            <div ng-if="!c.data.lot.is_available" class="alert alert-warning">
              This lot is currently {{c.data.lot.status_label | lowercase}}.
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
.reprop-utilities {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
.reprop-util-item {
  text-align: center;
  margin-bottom: 8px;
}
.reprop-description {
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}
.reprop-links .btn {
  margin-right: 8px;
  margin-bottom: 8px;
}`,
})

import { SPWidget } from '@servicenow/sdk/core'

export const repropPropertySearchWidget = SPWidget({
  $id: Now.ID['reprop_property_search_widget'],
  name: 'RepProp - Property Search',
  id: 'reprop-property-search',
  description: 'Search and browse available property units and land lots by type, project, status, and price',
  public: true,

  serverScript: `(function() {
  var type     = $sp.getParameter('type')     || 'all';
  var project  = $sp.getParameter('project')  || '';
  var status   = $sp.getParameter('status')   || 'available';
  var maxPrice = $sp.getParameter('maxPrice') || '';

  data.type         = type;
  data.projectFilter = project;
  data.statusFilter  = status;
  data.maxPrice      = maxPrice;
  data.projects      = [];
  data.units         = [];
  data.lots          = [];

  // Projects dropdown
  var projGr = new GlideRecord('x_2099006_reprop_project');
  projGr.orderBy('x_2099006_reprop_project_name');
  projGr.query();
  while (projGr.next()) {
    data.projects.push({
      sys_id: projGr.getValue('sys_id'),
      name:   projGr.getValue('x_2099006_reprop_project_name'),
    });
  }

  // Units
  if (type !== 'lot') {
    var unitGr = new GlideRecord('x_2099006_reprop_property_unit');
    if (status && status !== 'all') unitGr.addQuery('x_2099006_reprop_status', status);
    if (project) unitGr.addQuery('x_2099006_reprop_project', project);
    if (maxPrice) unitGr.addQuery('x_2099006_reprop_price', '<=', parseInt(maxPrice));
    unitGr.orderBy('x_2099006_reprop_unit_number');
    unitGr.setLimit(60);
    unitGr.query();
    while (unitGr.next()) {
      data.units.push({
        sys_id:       unitGr.getValue('sys_id'),
        unit_number:  unitGr.getValue('x_2099006_reprop_unit_number'),
        unit_type:    unitGr.getDisplayValue('x_2099006_reprop_unit_type'),
        status:       unitGr.getValue('x_2099006_reprop_status'),
        status_label: unitGr.getDisplayValue('x_2099006_reprop_status'),
        price:        unitGr.getValue('x_2099006_reprop_price'),
        sqft:         unitGr.getValue('x_2099006_reprop_sqft'),
        bedrooms:     unitGr.getValue('x_2099006_reprop_bedrooms'),
        bathrooms:    unitGr.getValue('x_2099006_reprop_bathrooms'),
        building:     unitGr.getValue('x_2099006_reprop_building'),
        floor:        unitGr.getValue('x_2099006_reprop_floor'),
      });
    }
  }

  // Lots
  if (type !== 'unit') {
    var lotGr = new GlideRecord('x_2099006_reprop_land_lot');
    if (status && status !== 'all') lotGr.addQuery('x_2099006_reprop_status', status);
    if (project) lotGr.addQuery('x_2099006_reprop_project', project);
    if (maxPrice) lotGr.addQuery('x_2099006_reprop_price', '<=', parseInt(maxPrice));
    lotGr.orderBy('x_2099006_reprop_lot_number');
    lotGr.setLimit(60);
    lotGr.query();
    while (lotGr.next()) {
      data.lots.push({
        sys_id:       lotGr.getValue('sys_id'),
        lot_number:   lotGr.getValue('x_2099006_reprop_lot_number'),
        lot_type:     lotGr.getDisplayValue('x_2099006_reprop_lot_type'),
        status:       lotGr.getValue('x_2099006_reprop_status'),
        status_label: lotGr.getDisplayValue('x_2099006_reprop_status'),
        price:        lotGr.getValue('x_2099006_reprop_price'),
        size_sqft:    lotGr.getValue('x_2099006_reprop_size_sqft'),
        size_acres:   lotGr.getValue('x_2099006_reprop_size_acres'),
        zoning:       lotGr.getValue('x_2099006_reprop_zoning'),
      });
    }
  }
})();`,

  clientScript: `api.controller = function($location) {
  var c = this;

  c.search = function() {
    $location.search({
      id:       'reprop_search',
      type:     c.data.type,
      project:  c.data.projectFilter,
      status:   c.data.statusFilter,
      maxPrice: c.data.maxPrice,
    });
    c.server.refresh();
  };

  c.goToUnit = function(sysId) {
    $location.url('?id=reprop_unit_detail&sys_id=' + sysId);
  };

  c.goToLot = function(sysId) {
    $location.url('?id=reprop_lot_detail&sys_id=' + sysId);
  };

  c.fmtPrice = function(price) {
    if (!price) return 'Contact for price';
    return '$' + Number(price).toLocaleString();
  };

  c.statusClass = function(status) {
    if (status === 'available') return 'label-success';
    if (status === 'reserved')  return 'label-warning';
    if (status === 'sold')      return 'label-danger';
    return 'label-default';
  };
};`,

  htmlTemplate: `<div class="reprop-search">
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-3 col-sm-6">
          <label>Property Type</label>
          <select class="form-control" ng-model="c.data.type">
            <option value="all">All Types</option>
            <option value="unit">Property Units</option>
            <option value="lot">Land Lots</option>
          </select>
        </div>
        <div class="col-md-3 col-sm-6">
          <label>Development Project</label>
          <select class="form-control" ng-model="c.data.projectFilter">
            <option value="">All Projects</option>
            <option ng-repeat="p in c.data.projects" value="{{p.sys_id}}">{{p.name}}</option>
          </select>
        </div>
        <div class="col-md-2 col-sm-4">
          <label>Status</label>
          <select class="form-control" ng-model="c.data.statusFilter">
            <option value="available">Available</option>
            <option value="all">All</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div class="col-md-2 col-sm-4">
          <label>Max Price ($)</label>
          <input type="number" class="form-control" ng-model="c.data.maxPrice" placeholder="No limit">
        </div>
        <div class="col-md-2 col-sm-4">
          <label>&nbsp;</label>
          <button class="btn btn-primary btn-block" ng-click="c.search()">
            <i class="fa fa-search"></i> Search
          </button>
        </div>
      </div>
    </div>
  </div>

  <div ng-if="c.data.type !== 'lot' && c.data.units.length > 0">
    <h3>Property Units <small>({{c.data.units.length}} results)</small></h3>
    <div class="row">
      <div class="col-md-4 col-sm-6" ng-repeat="u in c.data.units">
        <div class="panel panel-default reprop-card">
          <div class="panel-body">
            <span class="label reprop-status-label" ng-class="c.statusClass(u.status)">{{u.status_label}}</span>
            <h4 class="reprop-card-title">Unit {{u.unit_number}}</h4>
            <p class="text-muted reprop-sub">
              <span ng-if="u.building">{{u.building}}</span>
              <span ng-if="u.floor"> &middot; Floor {{u.floor}}</span>
            </p>
            <p>{{u.unit_type}}
              <span ng-if="u.bedrooms"> &middot; {{u.bedrooms}} bd</span>
              <span ng-if="u.bathrooms"> &middot; {{u.bathrooms}} ba</span>
            </p>
            <p ng-if="u.sqft" class="text-muted"><small>{{u.sqft | number:0}} sqft</small></p>
            <p class="reprop-price">{{c.fmtPrice(u.price)}}</p>
            <button class="btn btn-primary btn-sm" ng-click="c.goToUnit(u.sys_id)">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div ng-if="c.data.type !== 'unit' && c.data.lots.length > 0">
    <h3>Land Lots <small>({{c.data.lots.length}} results)</small></h3>
    <div class="row">
      <div class="col-md-4 col-sm-6" ng-repeat="l in c.data.lots">
        <div class="panel panel-default reprop-card">
          <div class="panel-body">
            <span class="label reprop-status-label" ng-class="c.statusClass(l.status)">{{l.status_label}}</span>
            <h4 class="reprop-card-title">Lot {{l.lot_number}}</h4>
            <p class="text-muted reprop-sub">{{l.lot_type}}</p>
            <p ng-if="l.size_acres">{{l.size_acres}} acres &middot; {{l.size_sqft | number:0}} sqft</p>
            <p ng-if="l.zoning" class="text-muted"><small>Zoning: {{l.zoning}}</small></p>
            <p class="reprop-price">{{c.fmtPrice(l.price)}}</p>
            <button class="btn btn-primary btn-sm" ng-click="c.goToLot(l.sys_id)">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div ng-if="c.data.units.length === 0 && c.data.lots.length === 0">
    <div class="alert alert-info text-center">
      <i class="fa fa-search fa-2x"></i>
      <p>No properties match your search. Try adjusting the filters above.</p>
    </div>
  </div>
</div>`,

  customCss: `.reprop-card {
  transition: box-shadow 0.2s;
  margin-bottom: 20px;
}
.reprop-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.reprop-card-title {
  margin-top: 8px;
  margin-bottom: 4px;
}
.reprop-status-label {
  float: right;
  margin-top: 4px;
}
.reprop-sub {
  margin-bottom: 4px;
}
.reprop-price {
  font-size: 18px;
  font-weight: bold;
  color: #0070d2;
  margin-bottom: 10px;
}`,
})

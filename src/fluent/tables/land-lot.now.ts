import {
  Table,
  StringColumn,
  ReferenceColumn,
  DecimalColumn,
  ChoiceColumn,
  BooleanColumn,
  HtmlColumn,
  UrlColumn,
} from '@servicenow/sdk/core'

export const x_2099006_reprop_land_lot = Table({
  name: 'x_2099006_reprop_land_lot',
  label: 'Land Lot',
  schema: {
    x_2099006_reprop_lot_number: StringColumn({
      label: 'Lot Number',
      maxLength: 40,
      mandatory: true,
    }),
    x_2099006_reprop_project: ReferenceColumn({
      label: 'Project',
      referenceTable: 'x_2099006_reprop_project',
      mandatory: true,
    }),
    x_2099006_reprop_status: ChoiceColumn({
      label: 'Availability Status',
      choices: {
        available: { label: 'Available' },
        reserved:  { label: 'Reserved' },
        sold:      { label: 'Sold' },
        off_market: { label: 'Off Market' },
      },
      default: 'available',
    }),
    x_2099006_reprop_lot_type: ChoiceColumn({
      label: 'Lot Type',
      choices: {
        residential: { label: 'Residential' },
        corner:      { label: 'Corner Lot' },
        commercial:  { label: 'Commercial' },
        mixed_use:   { label: 'Mixed Use' },
        premium:     { label: 'Premium' },
      },
      default: 'residential',
    }),
    x_2099006_reprop_price: DecimalColumn({
      label: 'Asking Price',
    }),
    x_2099006_reprop_size_sqft: DecimalColumn({
      label: 'Size (sq ft)',
    }),
    x_2099006_reprop_size_acres: DecimalColumn({
      label: 'Size (acres)',
    }),
    x_2099006_reprop_frontage_ft: DecimalColumn({
      label: 'Frontage (ft)',
    }),
    x_2099006_reprop_depth_ft: DecimalColumn({
      label: 'Depth (ft)',
    }),
    x_2099006_reprop_zoning: StringColumn({
      label: 'Zoning Classification',
      maxLength: 80,
    }),
    x_2099006_reprop_map_lat: DecimalColumn({
      label: 'Latitude',
    }),
    x_2099006_reprop_map_lng: DecimalColumn({
      label: 'Longitude',
    }),
    x_2099006_reprop_map_polygon: StringColumn({
      label: 'Lot Boundary (GeoJSON)',
      maxLength: 4000,
    }),
    x_2099006_reprop_util_water: BooleanColumn({
      label: 'Water Available',
    }),
    x_2099006_reprop_util_sewer: BooleanColumn({
      label: 'Sewer Available',
    }),
    x_2099006_reprop_util_electric: BooleanColumn({
      label: 'Electric Available',
    }),
    x_2099006_reprop_util_gas: BooleanColumn({
      label: 'Gas Available',
    }),
    x_2099006_reprop_util_internet: BooleanColumn({
      label: 'Internet / Fiber Available',
    }),
    x_2099006_reprop_road_access: BooleanColumn({
      label: 'Road Access',
    }),
    x_2099006_reprop_hoa_fee: DecimalColumn({
      label: 'HOA / Monthly Fee',
    }),
    x_2099006_reprop_notes: HtmlColumn({
      label: 'Notes',
    }),
    x_2099006_reprop_photos_url: UrlColumn({
      label: 'Photos URL',
    }),
    x_2099006_reprop_survey_url: UrlColumn({
      label: 'Survey Document URL',
    }),
  },
})

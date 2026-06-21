import {
  Table,
  StringColumn,
  IntegerColumn,
  DecimalColumn,
  ChoiceColumn,
  BooleanColumn,
  UrlColumn,
  HtmlColumn,
} from '@servicenow/sdk/core'

export const x_2099006_reprop_property_unit = Table({
  name: 'x_2099006_reprop_property_unit',
  label: 'Property Unit',
  schema: {
    x_2099006_reprop_unit_number: StringColumn({
      label: 'Unit Number',
      maxLength: 40,
      mandatory: true,
    }),
    x_2099006_reprop_building: StringColumn({
      label: 'Building / Development',
      maxLength: 100,
    }),
    x_2099006_reprop_floor: IntegerColumn({
      label: 'Floor',
    }),
    x_2099006_reprop_unit_type: ChoiceColumn({
      label: 'Unit Type',
      choices: {
        studio:    { label: 'Studio' },
        one_bed:   { label: '1 Bedroom' },
        two_bed:   { label: '2 Bedrooms' },
        three_bed: { label: '3 Bedrooms' },
        penthouse: { label: 'Penthouse' },
      },
      default: 'one_bed',
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
    x_2099006_reprop_price: DecimalColumn({
      label: 'Asking Price',
    }),
    x_2099006_reprop_sqft: IntegerColumn({
      label: 'Square Footage',
    }),
    x_2099006_reprop_bedrooms: IntegerColumn({
      label: 'Bedrooms',
    }),
    x_2099006_reprop_bathrooms: DecimalColumn({
      label: 'Bathrooms',
    }),
    x_2099006_reprop_parking: BooleanColumn({
      label: 'Parking Included',
    }),
    x_2099006_reprop_description: HtmlColumn({
      label: 'Description',
    }),
    x_2099006_reprop_photos_url: UrlColumn({
      label: 'Photos URL',
    }),
    x_2099006_reprop_virtual_tour_url: UrlColumn({
      label: 'Virtual Tour URL',
    }),
    x_2099006_reprop_floor_plan_url: UrlColumn({
      label: 'Floor Plan URL',
    }),
  },
})

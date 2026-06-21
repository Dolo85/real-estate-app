import {
  Table,
  StringColumn,
  IntegerColumn,
  DecimalColumn,
  ChoiceColumn,
  HtmlColumn,
  UrlColumn,
} from '@servicenow/sdk/core'

export const x_2099006_reprop_project = Table({
  name: 'x_2099006_reprop_project',
  label: 'Development Project',
  schema: {
    x_2099006_reprop_project_name: StringColumn({
      label: 'Project Name',
      maxLength: 150,
      mandatory: true,
    }),
    x_2099006_reprop_developer: StringColumn({
      label: 'Developer / Builder',
      maxLength: 150,
    }),
    x_2099006_reprop_status: ChoiceColumn({
      label: 'Project Status',
      choices: {
        upcoming:    { label: 'Upcoming' },
        active:      { label: 'Active' },
        sold_out:    { label: 'Sold Out' },
        completed:   { label: 'Completed' },
        on_hold:     { label: 'On Hold' },
      },
      default: 'active',
    }),
    x_2099006_reprop_address: StringColumn({
      label: 'Address',
      maxLength: 250,
    }),
    x_2099006_reprop_city: StringColumn({
      label: 'City',
      maxLength: 100,
    }),
    x_2099006_reprop_state: StringColumn({
      label: 'State / Province',
      maxLength: 100,
    }),
    x_2099006_reprop_zip: StringColumn({
      label: 'ZIP / Postal Code',
      maxLength: 20,
    }),
    x_2099006_reprop_map_lat: DecimalColumn({
      label: 'Map Center Latitude',
    }),
    x_2099006_reprop_map_lng: DecimalColumn({
      label: 'Map Center Longitude',
    }),
    x_2099006_reprop_map_zoom: IntegerColumn({
      label: 'Default Map Zoom Level',
    }),
    x_2099006_reprop_total_lots: IntegerColumn({
      label: 'Total Lots',
    }),
    x_2099006_reprop_total_units: IntegerColumn({
      label: 'Total Units',
    }),
    x_2099006_reprop_description: HtmlColumn({
      label: 'Description',
    }),
    x_2099006_reprop_brochure_url: UrlColumn({
      label: 'Brochure URL',
    }),
    x_2099006_reprop_site_plan_url: UrlColumn({
      label: 'Site Plan URL',
    }),
    x_2099006_reprop_website_url: UrlColumn({
      label: 'Project Website',
    }),
  },
})

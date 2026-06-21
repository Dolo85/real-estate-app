import {
  Table,
  StringColumn,
  ReferenceColumn,
  ChoiceColumn,
  DateTimeColumn,
  BooleanColumn,
  HtmlColumn,
} from '@servicenow/sdk/core'

export const x_2099006_reprop_viewing_request = Table({
  name: 'x_2099006_reprop_viewing_request',
  label: 'Viewing Request',
  schema: {
    x_2099006_reprop_unit: ReferenceColumn({
      label: 'Property Unit',
      referenceTable: 'x_2099006_reprop_property_unit',
    }),
    x_2099006_reprop_lot: ReferenceColumn({
      label: 'Land Lot',
      referenceTable: 'x_2099006_reprop_land_lot',
    }),
    x_2099006_reprop_booking: ReferenceColumn({
      label: 'Related Booking',
      referenceTable: 'x_2099006_reprop_booking',
    }),
    x_2099006_reprop_prospect_name: StringColumn({
      label: 'Prospect Name',
      maxLength: 100,
      mandatory: true,
    }),
    x_2099006_reprop_prospect_email: StringColumn({
      label: 'Prospect Email',
      maxLength: 150,
      mandatory: true,
    }),
    x_2099006_reprop_prospect_phone: StringColumn({
      label: 'Prospect Phone',
      maxLength: 30,
    }),
    x_2099006_reprop_preferred_date: DateTimeColumn({
      label: 'Preferred Date & Time',
      mandatory: true,
    }),
    x_2099006_reprop_confirmed_date: DateTimeColumn({
      label: 'Confirmed Date & Time',
    }),
    x_2099006_reprop_status: ChoiceColumn({
      label: 'Viewing Status',
      choices: {
        requested:  { label: 'Requested' },
        scheduled:  { label: 'Scheduled' },
        completed:  { label: 'Completed' },
        cancelled:  { label: 'Cancelled' },
        no_show:    { label: 'No Show' },
      },
      default: 'requested',
    }),
    x_2099006_reprop_agent_assigned: StringColumn({
      label: 'Assigned Agent',
      maxLength: 100,
    }),
    x_2099006_reprop_virtual: BooleanColumn({
      label: 'Virtual Viewing',
    }),
    x_2099006_reprop_notes: HtmlColumn({
      label: 'Notes',
    }),
  },
})

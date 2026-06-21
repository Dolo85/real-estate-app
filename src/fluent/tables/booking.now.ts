import {
  Table,
  StringColumn,
  ReferenceColumn,
  ChoiceColumn,
  DateTimeColumn,
  DecimalColumn,
  HtmlColumn,
  BooleanColumn,
} from '@servicenow/sdk/core'

export const x_2099006_reprop_booking = Table({
  name: 'x_2099006_reprop_booking',
  label: 'Property Booking',
  schema: {
    x_2099006_reprop_unit: ReferenceColumn({
      label: 'Property Unit',
      referenceTable: 'x_2099006_reprop_property_unit',
      mandatory: true,
    }),
    x_2099006_reprop_customer_name: StringColumn({
      label: 'Customer Name',
      maxLength: 100,
      mandatory: true,
    }),
    x_2099006_reprop_customer_email: StringColumn({
      label: 'Customer Email',
      maxLength: 150,
      mandatory: true,
    }),
    x_2099006_reprop_customer_phone: StringColumn({
      label: 'Customer Phone',
      maxLength: 30,
    }),
    x_2099006_reprop_status: ChoiceColumn({
      label: 'Booking Status',
      choices: {
        submitted:  { label: 'Submitted' },
        under_review: { label: 'Under Review' },
        approved:   { label: 'Approved' },
        rejected:   { label: 'Rejected' },
        cancelled:  { label: 'Cancelled' },
        completed:  { label: 'Completed' },
      },
      default: 'submitted',
    }),
    x_2099006_reprop_submitted_at: DateTimeColumn({
      label: 'Submitted At',
    }),
    x_2099006_reprop_approved_at: DateTimeColumn({
      label: 'Approved At',
    }),
    x_2099006_reprop_offer_price: DecimalColumn({
      label: 'Offer Price',
    }),
    x_2099006_reprop_financing_type: ChoiceColumn({
      label: 'Financing Type',
      choices: {
        cash:          { label: 'Cash' },
        mortgage:      { label: 'Mortgage' },
        pre_approved:  { label: 'Pre-Approved Mortgage' },
      },
      default: 'mortgage',
    }),
    x_2099006_reprop_notes: HtmlColumn({
      label: 'Notes',
    }),
    x_2099006_reprop_agent_notes: HtmlColumn({
      label: 'Agent Notes',
    }),
    x_2099006_reprop_docs_received: BooleanColumn({
      label: 'Documents Received',
    }),
  },
})

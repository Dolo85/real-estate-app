import { action, Flow, wfa, trigger } from '@servicenow/sdk/automation'

export const bookingSubmissionFlow = Flow(
  {
    $id: Now.ID['booking_submission_flow'],
    name: 'Booking Submission Flow',
    description: 'Handles new booking submissions — marks status under review, reserves the unit or lot, and notifies the customer',
  },
  wfa.trigger(
    trigger.record.created,
    { $id: Now.ID['booking_created_trigger'] },
    {
      table: 'x_2099006_reprop_booking',
      run_flow_in: 'background',
      run_on_extended: 'false',
      run_when_setting: 'both',
      run_when_user_setting: 'any',
      run_when_user_list: [],
    }
  ),
  (params) => {

    // Move booking to Under Review
    wfa.action(
      action.core.updateRecord,
      { $id: Now.ID['set_booking_under_review'] },
      {
        table_name: 'x_2099006_reprop_booking',
        record: wfa.dataPill(params.trigger.current.sys_id, 'reference'),
        values: TemplateValue({
          x_2099006_reprop_status: 'under_review',
        }),
      }
    )

    // Branch: reserve unit or lot
    wfa.flowLogic.if(
      {
        $id: Now.ID['check_booking_type_is_unit'],
        condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_booking_type, 'string')}=unit`,
      },
      () => {
        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID['reserve_property_unit'] },
          {
            table_name: 'x_2099006_reprop_property_unit',
            record: wfa.dataPill(params.trigger.current.x_2099006_reprop_unit, 'reference'),
            values: TemplateValue({
              x_2099006_reprop_status: 'reserved',
            }),
          }
        )
      }
    )

    wfa.flowLogic.else(
      { $id: Now.ID['booking_type_is_lot_branch'] },
      () => {
        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID['reserve_land_lot'] },
          {
            table_name: 'x_2099006_reprop_land_lot',
            record: wfa.dataPill(params.trigger.current.x_2099006_reprop_lot, 'reference'),
            values: TemplateValue({
              x_2099006_reprop_status: 'reserved',
            }),
          }
        )
      }
    )

    // Send confirmation email
    wfa.action(
      action.core.sendEmail,
      { $id: Now.ID['send_booking_confirmation_email'] },
      {
        ah_to: wfa.dataPill(params.trigger.current.x_2099006_reprop_customer_email, 'string'),
        ah_subject: 'Booking Received — Real Estate Property Portal',
        ah_body: 'Thank you for your booking submission. Your application is now under review and a member of our team will be in touch shortly.',
      }
    )

    // Audit log
    wfa.action(
      action.core.log,
      { $id: Now.ID['log_booking_submission'] },
      {
        log_level: 'info',
        log_message: wfa.dataPill(params.trigger.current.x_2099006_reprop_customer_name, 'string'),
      }
    )
  }
)

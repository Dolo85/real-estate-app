import { action, Flow, wfa, trigger } from '@servicenow/sdk/automation'

export const bookingStatusNotificationFlow = Flow(
  {
    $id: Now.ID['booking_status_notification_flow'],
    name: 'Booking Status Notification Flow',
    description: 'Notifies the customer by email whenever their booking status changes',
  },
  wfa.trigger(
    trigger.record.updated,
    { $id: Now.ID['booking_status_changed_trigger'] },
    {
      table: 'x_2099006_reprop_booking',
      condition: 'x_2099006_reprop_statusCHANGES',
      run_flow_in: 'background',
      trigger_strategy: 'unique_changes',
      run_on_extended: 'false',
      run_when_setting: 'both',
      run_when_user_setting: 'any',
      run_when_user_list: [],
    }
  ),
  (params) => {

    // Approved
    wfa.flowLogic.if(
      {
        $id: Now.ID['status_is_approved'],
        condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_status, 'string')}=approved`,
      },
      () => {
        wfa.action(
          action.core.sendEmail,
          { $id: Now.ID['email_booking_approved'] },
          {
            ah_to: wfa.dataPill(params.trigger.current.x_2099006_reprop_customer_email, 'string'),
            ah_subject: 'Your Booking Has Been Approved',
            ah_body: 'Congratulations! Your booking application has been approved. Our team will contact you to arrange next steps.',
          }
        )

        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID['set_approved_at'] },
          {
            table_name: 'x_2099006_reprop_booking',
            record: wfa.dataPill(params.trigger.current.sys_id, 'reference'),
            values: TemplateValue({
              x_2099006_reprop_approved_at: 'javascript:new GlideDateTime()',
            }),
          }
        )
      }
    )

    // Rejected — notify + release reservation
    wfa.flowLogic.elseIf(
      {
        $id: Now.ID['status_is_rejected'],
        condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_status, 'string')}=rejected`,
      },
      () => {
        wfa.action(
          action.core.sendEmail,
          { $id: Now.ID['email_booking_rejected'] },
          {
            ah_to: wfa.dataPill(params.trigger.current.x_2099006_reprop_customer_email, 'string'),
            ah_subject: 'Update on Your Booking Application',
            ah_body: 'Unfortunately your booking application was not approved at this time. Please contact our office for more information or to explore other available properties.',
          }
        )

        wfa.flowLogic.if(
          {
            $id: Now.ID['release_unit_on_reject'],
            condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_booking_type, 'string')}=unit`,
          },
          () => {
            wfa.action(
              action.core.updateRecord,
              { $id: Now.ID['revert_unit_to_available'] },
              {
                table_name: 'x_2099006_reprop_property_unit',
                record: wfa.dataPill(params.trigger.current.x_2099006_reprop_unit, 'reference'),
                values: TemplateValue({ x_2099006_reprop_status: 'available' }),
              }
            )
          }
        )

        wfa.flowLogic.else(
          { $id: Now.ID['release_lot_on_reject'] },
          () => {
            wfa.action(
              action.core.updateRecord,
              { $id: Now.ID['revert_lot_to_available'] },
              {
                table_name: 'x_2099006_reprop_land_lot',
                record: wfa.dataPill(params.trigger.current.x_2099006_reprop_lot, 'reference'),
                values: TemplateValue({ x_2099006_reprop_status: 'available' }),
              }
            )
          }
        )
      }
    )

    // Completed — mark as Sold
    wfa.flowLogic.elseIf(
      {
        $id: Now.ID['status_is_completed'],
        condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_status, 'string')}=completed`,
      },
      () => {
        wfa.action(
          action.core.sendEmail,
          { $id: Now.ID['email_booking_completed'] },
          {
            ah_to: wfa.dataPill(params.trigger.current.x_2099006_reprop_customer_email, 'string'),
            ah_subject: 'Booking Complete — Welcome!',
            ah_body: 'Your booking is now complete. Welcome to your new property! Our team will reach out with final documentation and handover details.',
          }
        )

        wfa.flowLogic.if(
          {
            $id: Now.ID['mark_unit_sold'],
            condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_booking_type, 'string')}=unit`,
          },
          () => {
            wfa.action(
              action.core.updateRecord,
              { $id: Now.ID['set_unit_sold'] },
              {
                table_name: 'x_2099006_reprop_property_unit',
                record: wfa.dataPill(params.trigger.current.x_2099006_reprop_unit, 'reference'),
                values: TemplateValue({ x_2099006_reprop_status: 'sold' }),
              }
            )
          }
        )

        wfa.flowLogic.else(
          { $id: Now.ID['mark_lot_sold'] },
          () => {
            wfa.action(
              action.core.updateRecord,
              { $id: Now.ID['set_lot_sold'] },
              {
                table_name: 'x_2099006_reprop_land_lot',
                record: wfa.dataPill(params.trigger.current.x_2099006_reprop_lot, 'reference'),
                values: TemplateValue({ x_2099006_reprop_status: 'sold' }),
              }
            )
          }
        )
      }
    )

    // Cancelled — release reservation
    wfa.flowLogic.elseIf(
      {
        $id: Now.ID['status_is_cancelled'],
        condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_status, 'string')}=cancelled`,
      },
      () => {
        wfa.action(
          action.core.sendEmail,
          { $id: Now.ID['email_booking_cancelled'] },
          {
            ah_to: wfa.dataPill(params.trigger.current.x_2099006_reprop_customer_email, 'string'),
            ah_subject: 'Booking Cancellation Confirmed',
            ah_body: 'Your booking cancellation has been processed. If this was in error or you would like to explore other properties, please contact our office.',
          }
        )

        wfa.flowLogic.if(
          {
            $id: Now.ID['release_unit_on_cancel'],
            condition: `${wfa.dataPill(params.trigger.current.x_2099006_reprop_booking_type, 'string')}=unit`,
          },
          () => {
            wfa.action(
              action.core.updateRecord,
              { $id: Now.ID['revert_unit_available_cancel'] },
              {
                table_name: 'x_2099006_reprop_property_unit',
                record: wfa.dataPill(params.trigger.current.x_2099006_reprop_unit, 'reference'),
                values: TemplateValue({ x_2099006_reprop_status: 'available' }),
              }
            )
          }
        )

        wfa.flowLogic.else(
          { $id: Now.ID['release_lot_on_cancel'] },
          () => {
            wfa.action(
              action.core.updateRecord,
              { $id: Now.ID['revert_lot_available_cancel'] },
              {
                table_name: 'x_2099006_reprop_land_lot',
                record: wfa.dataPill(params.trigger.current.x_2099006_reprop_lot, 'reference'),
                values: TemplateValue({ x_2099006_reprop_status: 'available' }),
              }
            )
          }
        )
      }
    )

    // Audit log on every status change
    wfa.action(
      action.core.log,
      { $id: Now.ID['log_status_change'] },
      {
        log_level: 'info',
        log_message: wfa.dataPill(params.trigger.current.x_2099006_reprop_status, 'string'),
      }
    )
  }
)

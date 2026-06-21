import { ServicePortal, SPPage } from '@servicenow/sdk/core'
import { repropPropertySearchWidget }  from './widgets/property-search.now'
import { repropUnitDetailWidget }      from './widgets/unit-detail.now'
import { repropLotDetailWidget }       from './widgets/lot-detail.now'
import { repropBookingFormWidget }     from './widgets/booking-form.now'
import { repropMyBookingsWidget }      from './widgets/my-bookings.now'

// ─── Pages ────────────────────────────────────────────────────────────────────

export const repropSearchPage = SPPage({
  pageId: 'reprop_search',
  title: 'Property Search',
  public: true,
  containers: [
    {
      $id: Now.ID['reprop_search_container'],
      width: 'container',
      rows: [
        {
          $id: Now.ID['reprop_search_row'],
          columns: [
            {
              $id: Now.ID['reprop_search_col'],
              size: 12,
              instances: [
                {
                  $id: Now.ID['reprop_search_instance'],
                  widget: repropPropertySearchWidget,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

export const repropUnitDetailPage = SPPage({
  pageId: 'reprop_unit_detail',
  title: 'Property Unit',
  public: true,
  containers: [
    {
      $id: Now.ID['reprop_unit_detail_container'],
      width: 'container',
      rows: [
        {
          $id: Now.ID['reprop_unit_detail_row'],
          columns: [
            {
              $id: Now.ID['reprop_unit_detail_col'],
              size: 12,
              instances: [
                {
                  $id: Now.ID['reprop_unit_detail_instance'],
                  widget: repropUnitDetailWidget,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

export const repropLotDetailPage = SPPage({
  pageId: 'reprop_lot_detail',
  title: 'Land Lot',
  public: true,
  containers: [
    {
      $id: Now.ID['reprop_lot_detail_container'],
      width: 'container',
      rows: [
        {
          $id: Now.ID['reprop_lot_detail_row'],
          columns: [
            {
              $id: Now.ID['reprop_lot_detail_col'],
              size: 12,
              instances: [
                {
                  $id: Now.ID['reprop_lot_detail_instance'],
                  widget: repropLotDetailWidget,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

export const repropBookingFormPage = SPPage({
  pageId: 'reprop_booking_form',
  title: 'Book a Property',
  public: true,
  containers: [
    {
      $id: Now.ID['reprop_booking_form_container'],
      width: 'container',
      rows: [
        {
          $id: Now.ID['reprop_booking_form_row'],
          columns: [
            {
              $id: Now.ID['reprop_booking_form_col'],
              size: 12,
              instances: [
                {
                  $id: Now.ID['reprop_booking_form_instance'],
                  widget: repropBookingFormWidget,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

export const repropMyBookingsPage = SPPage({
  pageId: 'reprop_my_bookings',
  title: 'My Bookings',
  public: false,
  containers: [
    {
      $id: Now.ID['reprop_my_bookings_container'],
      width: 'container',
      rows: [
        {
          $id: Now.ID['reprop_my_bookings_row'],
          columns: [
            {
              $id: Now.ID['reprop_my_bookings_col'],
              size: 12,
              instances: [
                {
                  $id: Now.ID['reprop_my_bookings_instance'],
                  widget: repropMyBookingsWidget,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

// ─── Portal ───────────────────────────────────────────────────────────────────

export const repropPortal = ServicePortal({
  $id: Now.ID['reprop_portal'],
  title: 'Real Estate Property Portal',
  urlSuffix: 'reprop',
  defaultPortal: false,
  homePage: repropSearchPage,
  loginPage: repropSearchPage,
  notFoundPage: repropSearchPage,
  hidePortalName: false,
  enableFavorites: false,
})

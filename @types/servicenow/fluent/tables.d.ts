import '@servicenow/sdk/global';
import type { Table, Column } from '@servicenow/sdk/core';

declare global {
    namespace Now {
        namespace Internal {
            namespace TableSchemas {
                interface x_2099006_reprop_booking {
                    sys_id: Column<string>;
                    x_2099006_reprop_booking_type: Column<string>;
                    x_2099006_reprop_unit: Column<string>;
                    x_2099006_reprop_lot: Column<string>;
                    x_2099006_reprop_project: Column<string>;
                    x_2099006_reprop_customer_name: Column<string>;
                    x_2099006_reprop_customer_email: Column<string>;
                    x_2099006_reprop_customer_phone: Column<string>;
                    x_2099006_reprop_status: Column<string>;
                    x_2099006_reprop_submitted_at: Column<string>;
                    x_2099006_reprop_approved_at: Column<string>;
                    x_2099006_reprop_offer_price: Column<number>;
                    x_2099006_reprop_financing_type: Column<string>;
                    x_2099006_reprop_notes: Column<string>;
                    x_2099006_reprop_agent_notes: Column<string>;
                    x_2099006_reprop_docs_received: Column<boolean>;
                }
                interface x_2099006_reprop_property_unit {
                    x_2099006_reprop_unit_number: Column<string>;
                    x_2099006_reprop_project: Column<string>;
                    x_2099006_reprop_building: Column<string>;
                    x_2099006_reprop_floor: Column<number>;
                    x_2099006_reprop_unit_type: Column<string>;
                    x_2099006_reprop_status: Column<string>;
                    x_2099006_reprop_price: Column<number>;
                    x_2099006_reprop_sqft: Column<number>;
                    x_2099006_reprop_bedrooms: Column<number>;
                    x_2099006_reprop_bathrooms: Column<number>;
                    x_2099006_reprop_parking: Column<boolean>;
                    x_2099006_reprop_description: Column<string>;
                    x_2099006_reprop_photos_url: Column<string>;
                    x_2099006_reprop_virtual_tour_url: Column<string>;
                    x_2099006_reprop_floor_plan_url: Column<string>;
                    x_2099006_reprop_map_lat: Column<number>;
                    x_2099006_reprop_map_lng: Column<number>;
                }
                interface x_2099006_reprop_land_lot {
                    x_2099006_reprop_lot_number: Column<string>;
                    x_2099006_reprop_project: Column<string>;
                    x_2099006_reprop_status: Column<string>;
                    x_2099006_reprop_lot_type: Column<string>;
                    x_2099006_reprop_price: Column<number>;
                    x_2099006_reprop_size_sqft: Column<number>;
                    x_2099006_reprop_size_acres: Column<number>;
                    x_2099006_reprop_frontage_ft: Column<number>;
                    x_2099006_reprop_depth_ft: Column<number>;
                    x_2099006_reprop_zoning: Column<string>;
                    x_2099006_reprop_map_lat: Column<number>;
                    x_2099006_reprop_map_lng: Column<number>;
                    x_2099006_reprop_map_polygon: Column<string>;
                    x_2099006_reprop_util_water: Column<boolean>;
                    x_2099006_reprop_util_sewer: Column<boolean>;
                    x_2099006_reprop_util_electric: Column<boolean>;
                    x_2099006_reprop_util_gas: Column<boolean>;
                    x_2099006_reprop_util_internet: Column<boolean>;
                    x_2099006_reprop_road_access: Column<boolean>;
                    x_2099006_reprop_hoa_fee: Column<number>;
                    x_2099006_reprop_notes: Column<string>;
                    x_2099006_reprop_photos_url: Column<string>;
                    x_2099006_reprop_survey_url: Column<string>;
                }
                interface x_2099006_reprop_project {
                    x_2099006_reprop_project_name: Column<string>;
                    x_2099006_reprop_developer: Column<string>;
                    x_2099006_reprop_status: Column<string>;
                    x_2099006_reprop_address: Column<string>;
                    x_2099006_reprop_city: Column<string>;
                    x_2099006_reprop_state: Column<string>;
                    x_2099006_reprop_zip: Column<string>;
                    x_2099006_reprop_map_lat: Column<number>;
                    x_2099006_reprop_map_lng: Column<number>;
                    x_2099006_reprop_map_zoom: Column<number>;
                    x_2099006_reprop_total_lots: Column<number>;
                    x_2099006_reprop_total_units: Column<number>;
                    x_2099006_reprop_description: Column<string>;
                    x_2099006_reprop_brochure_url: Column<string>;
                    x_2099006_reprop_site_plan_url: Column<string>;
                    x_2099006_reprop_website_url: Column<string>;
                }
            }
            interface Tables {
                x_2099006_reprop_booking: Table<TableSchemas.x_2099006_reprop_booking>;
                x_2099006_reprop_property_unit: Table<TableSchemas.x_2099006_reprop_property_unit>;
                x_2099006_reprop_land_lot: Table<TableSchemas.x_2099006_reprop_land_lot>;
                x_2099006_reprop_project: Table<TableSchemas.x_2099006_reprop_project>;
            }
        }
    }
}

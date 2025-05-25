// using { my.sales as db } from '../db/schema';

// service SalesService @(path : '/sales') {
//     // You can still expose SalesData if you want to store input data or results
//     entity SalesData @(odata.draft.enabled:true) as projection on db.SalesData;

//     // Define a custom action to trigger sales prediction
//     // This action will take all necessary input parameters for your Flask model
//     action predictSales(
//         Item_Identifier         : String @mandatory,
//         Item_Weight             : Decimal ,
//         Item_Fat_Content        : String,
//         Item_Visibility         : Decimal,
//         Item_Type               : String,
//         Item_MRP                : Decimal,
//         Outlet_Identifier       : String,
//         Outlet_Establishment_Year : Integer,
//         Outlet_Size             : String,
//         Outlet_Location_Type    : String,
//         Outlet_Type             : String
//     ) returns {
//         Predicted_sales         : Decimal
//     }
//     ;
// }

using { my.sales as db } from '../db/schema';
service SalesService @(path : '/sales') {
  entity SalesData @(odata.draft.enabled:true) as projection on db.SalesData;

  action predictSales(
    Item_Identifier         : String @mandatory,
    Item_Weight             : Decimal @mandatory,
    Item_Fat_Content        : String @mandatory,
    Item_Visibility         : Decimal @mandatory,
    Item_Type               : String @mandatory,
    Item_MRP                : Decimal @mandatory,
    Outlet_Identifier       : String @mandatory,
    Outlet_Establishment_Year : Integer @mandatory,
    Outlet_Size             : String @mandatory,
    Outlet_Location_Type    : String @mandatory,
    Outlet_Type             : String @mandatory
  ) returns {
    Predicted_sales         : Decimal
  }
}

namespace my.sales;

entity SalesData {
    key Item_Identifier         : String;
    Item_Weight                 : Decimal;
    Item_Fat_Content            : String;
    Item_Visibility             : Decimal;
    Item_Type                   : String;
    Item_MRP                    : Decimal;
    Outlet_Identifier           : String;
    Outlet_Establishment_Year   : Integer;
    Outlet_Size                 : String;
    Outlet_Location_Type        : String;
    Outlet_Type                 : String;
    Item_Outlet_Sales            : Decimal; // This field will be populated from the Flask model
}
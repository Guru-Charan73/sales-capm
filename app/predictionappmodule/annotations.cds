using { SalesService } from '../../srv/service';
annotate SalesService.SalesData with

  @UI.SelectionFields: [
    Item_Identifier,
    Outlet_Identifier,
    Outlet_Location_Type
  ]
  @UI.LineItem: [
    { $Type: 'UI.DataField', Value: Item_Identifier, Label : 'ItemIdentity' },
    { $Type: 'UI.DataField', Value: Outlet_Size, Label : 'OutSize' },
    { $Type: 'UI.DataField', Value: Item_MRP, Label:'Price' },
    { $Type: 'UI.DataField', Value: Outlet_Identifier, Label:'OutletID'},
    { $Type: 'UI.DataField', Value: Outlet_Establishment_Year,CriticalityRepresentation:#WithIcon, Label:'Year'},
    { $Type: 'UI.DataField', Value: Predicted_sales, Label:'PredictedSales'},
    { $Type: 'UI.DataFieldForAction', Action:'SalesService.EntityContainer/predictSales', Label:'PredictSales' }
  ]
  @Capabilities.InsertRestrictions.Insertable: false; 





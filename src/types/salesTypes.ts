export interface SalesOrder {
    SalesHeaderID: string
    SAPSalesOrderID: string,
    SAPSalesOrderObjectID: string,
    SalesDate: string,
    CustomerID: string,
    TotalAmount: number,
    SAPQuantity: number
    isCanceled: boolean,
    SalesDetails: SalesDetail[];
  }
  
  export interface SalesDetail {
    SalesDetailID: string,
    SalesHeaderID: string,
    ProductID: string,
    IdentifiedStockID: string,
    Quantity: number
  }

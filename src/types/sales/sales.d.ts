export interface SalesHeaderPayload {
    CustomerID: string;
    SalesDate: string; // ISO 8601 string: "YYYY-MM-DD HH:MM:SS.SSS"
    TotalAmount: number;
    SAPQuantity: number;
    // SAPSalesOrderID?: string; // Optional, as per your description
    // SAPSalesOrderObjectID?: string; // Optional, as per your description
  }
  
  export interface SalesHeaderResponse {
    isSuccess: boolean;
    message: string;
    id: string | null;
    messageList: string[] | null;
    jObject: any | null;
    errorMessage: string[];
    jToken: any | null;
    periodOpen: boolean;
    data: any | null;
  }
  
  export interface SalesDetailPayload {
    productID: string;
    promisedDeliveryDate: string; // ISO 8601 string: "YYYY-MM-DDTHH:MM:SS.SSSZ"
    location: string;
    pickedFromLocation: string;
    lotNumber: string;
    pickedLotNumber: string;
    quantity: number;
    uom: 'EA' | 'TH'; // 'Each(Ea)' and 'Thousands(Th)'
    quantityPerPallet: number;
    pickQuantityPerPack: number;
    numberOfPacks: number;
    numberOfPacksPicked: number;
    totalQuantityPicked: number;
  }
  
  export interface AddSalesDetailsPayload {
    sapSalesOrderID: string; // This will likely come from the header creation response if needed for correlation
    saleDetails: SalesDetailPayload[];
  }
  
  export interface SalesDetailResponse {
    isSuccess: boolean;
    message: string;
    id: string | null;
    messageList: string[] | null;
    jObject: any | null;
    errorMessage: string[];
    jToken: any | null;
    periodOpen: boolean;
    data: any | null;
  }
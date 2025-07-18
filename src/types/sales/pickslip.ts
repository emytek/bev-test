
// Define the structure for a single pickslip header payload item
export interface PickslipHeaderPayloadItem {
    // pickslipNumber: number; 
    pickslipDate: string; // ISO string for date-time
    pickslipTime: string; // HH:MM:SS string
    shipmentNumber: string;
    loadNumber: string;
    orderNumber: string;
    carrier: string;
    vehicleRegNo: string;
    specialDeliveryInstructions?: string; // Optional
    promisedDeliveryDate: string; // ISO string for date-time
    location: string;
    pickedFromLocation?: string; // Optional
    lotNumber?: string; // Optional
    pickedLotNumber?: string; // Optional
    quantity: number; // Dynamically calculated
    uom: 'EA' | 'TH';
    quantityPerPallet: number;
    pickQuantityPerPack?: number; // Optional
    numberOfPacks: number;
    numberOfPacksPicked?: number; // Optional
    totalQuantityPicked?: number; // Optional
    productID: string;
    productDescription: string;
  }
  
  // Define the full payload structure (an array of items)
  export type PickslipHeaderPayload = PickslipHeaderPayloadItem[];
  
  // Define the structure for the API response after creating a pickslip header
  export interface PickslipHeaderResponseItem {
    isSuccess: boolean;
    message: string;
    id: string; // The ID of the created pickslip
    messageList: string[] | null;
    jObject: any | null;
    errorMessage: string[];
    jToken: any | null;
    periodOpen: boolean;
    data: any | null;
  }
  
  // Define the full response structure (an array of items)
  export type PickslipHeaderResponse = PickslipHeaderResponseItem[];

// For pickslip details payload
export interface PickslipDetailItem {
  pickslipHeaderID: string;
  lineNo: number;
  productID: string;
  identifiedStockID: string; // The scanned barcode
  quantity: number; // Quantity for this specific line item
  uom: 'EA' | 'TH';
}

export interface PickslipDetailsPayload {
  pickslipHeaderID: string;
  pickslipDetails: PickslipDetailItem[];
}

// Response for adding pickslip details (assuming similar to header)
export interface PickslipDetailsResponseItem {
  isSuccess: boolean;
  message: string;
  id: string; // Could be the header ID or a confirmation ID
  messageList: string[] | null;
  jObject: any | null;
  errorMessage: string[];
  jToken: any | null;
  periodOpen: boolean;
  data: any | null;
}

export type PickslipDetailsResponse = PickslipDetailsResponseItem[];
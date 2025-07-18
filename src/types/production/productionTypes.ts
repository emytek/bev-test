export interface ProductionOrderProps {
  setStockIdToPrint: (stockId: string) => void;
  onPrint: (
    stockId: string,
    completedQuantity: number,
    productDescription: string | null,
    orderNumber: string | null,
  ) => void;
}

export interface ProductionOrder {
  ProductionHeaderID: string;
  SAPProductionOrderID: string;
  SAPProductionOrderObjectID: string;
  SAPProductionProposalID: string;
  SAPProductionProposalObjectID: string;
  SAPSupplyTaskID: string;
  SAPMakeTaskID: string;
  SAPProductID: string;
  SAPProductDescription: string;
  SAPPlannedQuantity: number;
  CompletedQuantity: number;
  ProductionDetails?: ProductionDetail[];
  Machine: string;
  ProductionDate: string;
  UoMQuantityPallet: number;
  QuantityUnitCode: string;
  isFinished: boolean;
  isApproved: boolean;
  IsPosted: boolean;
  isCanceled: boolean;
}

export interface ProductionDetail {
  ProductionDetailID: string | undefined;
  ProductionHeaderID: string;
  ProductionDate: string;
  Shift: string;
  isRestricted: string | null;
  CompletedQuantity: number;
  IdentifiedStockID: string;
}

import {useState} from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../ui/table";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { Toaster } from 'sonner';
import Badge from '../../ui/badge/Badge';

interface StockDetail {
  StockDetailID: string;
  StockID: string;
  MovementType: string;
  PostDate: string;
  EntryDate: string;
  TransactionNo: string;
  TransactionLnNo: string;
  SupplierStockCode: string;
  quantityEntries: QuantityEntry[];
}

interface QuantityEntry {
  QtyEntry: number;
  UOMEntry: string;
  TimeOfEntry: string;
  SerialNo: string | null;
  CreatedBy: string | null;
  UpdatedBy: string | null;
  Created: string;
  Updated: string;
  IsPosted: boolean;
  BatchNo: string | null;
  BatchExpiryDate: string | null;
  StatusCode: string | null;
  SAPProductionProposalID: string | null;
  SAPProductionProposalObjectID: string | null;
  SAPProductionOrderID: string | null;
  SAPProductionOrderObjectID: string | null;
  SAPProductionTaskID: string | null;
  SAPGoodsMovementID: string | null;
  SAPChangeOfStockID: string | null;
}


const ProductionOrderMetaDataLookup = () => {
    const [productionOrderNumber, setProductionOrderNumber] = useState("");
  const [stockDetails, setStockDetails] = useState<StockDetail[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductionOrderNumber(e.target.value);
  };

  const handleSendClick = async () => {
    setLoading(true);
    setStockDetails(null);
    setError(null);

    try {
      // Mock API response for demonstration purposes
      const mockApiResponse: StockDetail[] | null = await new Promise((resolve) => {
        setTimeout(() => {
          if (productionOrderNumber === "PO12345") {
            resolve([
              {
                StockDetailID: "SD001",
                StockID: "STK001",
                MovementType: "Goods Receipt",
                PostDate: "2025-04-15",
                EntryDate: "2025-04-15T10:00:00Z",
                TransactionNo: "TRN001",
                TransactionLnNo: "1",
                SupplierStockCode: "SSC001",
                quantityEntries: [
                  {
                    QtyEntry: 1000,
                    UOMEntry: "EA",
                    TimeOfEntry: "2025-04-15T10:05:00Z",
                    SerialNo: null,
                    CreatedBy: "USER001",
                    UpdatedBy: null,
                    Created: "2025-04-15T10:05:00Z",
                    Updated: "2025-04-15T10:05:00Z",
                    IsPosted: true,
                    BatchNo: "BATCH001",
                    BatchExpiryDate: "2026-04-15",
                    StatusCode: "Active",
                    SAPProductionProposalID: "SAPPROP001",
                    SAPProductionProposalObjectID: "OBJ001",
                    SAPProductionOrderID: "SAPORD001",
                    SAPProductionOrderObjectID: "OBJ002",
                    SAPProductionTaskID: "SAPTASK001",
                    SAPGoodsMovementID: "SAPGM001",
                    SAPChangeOfStockID: null,
                  },
                ],
              },
            ]);
          } else if (productionOrderNumber === "PO67890") {
            resolve([
              {
                StockDetailID: "SD002",
                StockID: "STK002",
                MovementType: "Goods Issue",
                PostDate: "2025-04-20",
                EntryDate: "2025-04-20T11:00:00Z",
                TransactionNo: "TRN002",
                TransactionLnNo: "1",
                SupplierStockCode: "SSC002",
                quantityEntries: [
                  {
                    QtyEntry: 500,
                    UOMEntry: "KG",
                    TimeOfEntry: "2025-04-20T11:10:00Z",
                    SerialNo: "SN001",
                    CreatedBy: "USER002",
                    UpdatedBy: null,
                    Created: "2025-04-20T11:10:00Z",
                    Updated: "2025-04-20T11:10:00Z",
                    IsPosted: true,
                    BatchNo: null,
                    BatchExpiryDate: null,
                    StatusCode: "Active",
                    SAPProductionProposalID: null,
                    SAPProductionProposalObjectID: null,
                    SAPProductionOrderID: "SAPORD002",
                    SAPProductionOrderObjectID: "OBJ003",
                    SAPProductionTaskID: "SAPTASK002",
                    SAPGoodsMovementID: "SAPGM002",
                    SAPChangeOfStockID: null,
                  },
                ],
              },
            ]);
          } else {
            resolve(null);
          }
        }, 1000);
      });

      if (mockApiResponse) {
        setStockDetails(mockApiResponse);
      } else {
        setError("Production order number not found.");
      }
    } catch (err: any) {
      setError("Failed to fetch production order metadata.");
      console.error("Error fetching production order metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 overflow-x-auto">
        <Toaster richColors />
           <div className="flex items-center gap-4 mb-6">
             <Input
               type="text"
              placeholder="Production Order Number"
              value={productionOrderNumber}
              onChange={handleInputChange}
              disabled={loading}
            />
            <Button onClick={handleSendClick} disabled={loading}>
              {loading ? "Fetching..." : "Send"}
            </Button>
          </div>
    
          {error && (
            <div className="mb-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
    
          {stockDetails && stockDetails.length > 0 && (
            <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Stock Detail ID</TableCell>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Stock ID</TableCell>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Movement Type</TableCell>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Post Date</TableCell>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Entry Date</TableCell>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Transaction No</TableCell>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Transaction Line No</TableCell>
                      <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Supplier Stock Code</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {stockDetails.map((stockDetail) => (
                      <TableRow key={stockDetail.StockDetailID}>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.StockDetailID}</TableCell>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.StockID}</TableCell>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.MovementType}</TableCell>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.PostDate}</TableCell>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.EntryDate}</TableCell>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.TransactionNo}</TableCell>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.TransactionLnNo}</TableCell>
                        <TableCell className="px-2 py-3 text-start text-xs">{stockDetail.SupplierStockCode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
    
          {stockDetails && stockDetails.length > 0 && (
            stockDetails.map((stockDetail) => (
              <div key={stockDetail.StockDetailID} className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <h3 className="p-3 font-semibold border-b border-gray-100 dark:border-white/[0.05]">
                  Quantity Entries for Stock Detail ID: {stockDetail.StockDetailID}
                </h3>
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Qty Entry</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">UOM Entry</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Time Of Entry</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Serial No</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Created By</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Updated By</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Created</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Updated</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-center text-xs dark:text-gray-400">Is Posted</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Batch No</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Batch Expiry Date</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">Status Code</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">SAP Proposal ID</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">SAP Proposal Obj ID</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">SAP Order ID</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">SAP Order Obj ID</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">SAP Task ID</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">SAP Goods Movement ID</TableCell>
                        <TableCell isHeader className="px-2 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">SAP Change Of Stock ID</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {stockDetail.quantityEntries.map((entry) => (
                        <TableRow key={`<span class="math-inline">\{stockDetail\.StockDetailID\}\-</span>{entry.TimeOfEntry}`}>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.QtyEntry}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.UOMEntry}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.TimeOfEntry}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SerialNo || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.CreatedBy || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.UpdatedBy || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.Created}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.Updated}</TableCell>
                          <TableCell className="px-2 py-3 text-center text-xs">
                            <Badge color={entry.IsPosted ? "success" : "error"}>
                              {entry.IsPosted ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.BatchNo || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.BatchExpiryDate || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.StatusCode || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SAPProductionProposalID || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SAPProductionProposalObjectID || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SAPProductionOrderID || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SAPProductionOrderObjectID || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SAPProductionTaskID || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SAPGoodsMovementID || "N/A"}</TableCell>
                          <TableCell className="px-2 py-3 text-start text-xs">{entry.SAPChangeOfStockID || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))
          )}
    </div>
  )
}

export default ProductionOrderMetaDataLookup
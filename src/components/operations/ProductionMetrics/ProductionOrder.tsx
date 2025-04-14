import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { toast, Toaster } from "sonner"; 
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface ProductionOrderDetails {
  productionOrderNumber: string;
  productionRequest: string;
  productId: string;
  taskId: string;
  quantity: number;
  date: string;
  status: "Pending" | "Processing" | "Completed" | "Failed";
}

interface Props {}

const ProductionOrderLookup: React.FC<Props> = () => {
  const [productionOrderNumber, setProductionOrderNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState<ProductionOrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductionOrderNumber(e.target.value);
  };

  const handleSendClick = async () => {
    setLoading(true);
    setOrderDetails(null);
    setError(null);

    try {
      const mockApiResponse: ProductionOrderDetails | null = await new Promise((resolve) => {
        setTimeout(() => {
          if (productionOrderNumber === "PO12345") {
            resolve({
              productionOrderNumber: "PO12345",
              productionRequest: "Manufacture Widgets",
              productId: "WIDGET-001",
              taskId: "1",
              quantity: 1000,
              date: "2025-04-15",
              status: "Processing",
            });
          } else if (productionOrderNumber === "PO67890") {
            resolve({
              productionOrderNumber: "PO67890",
              productionRequest: "Assemble Gears",
              productId: "GEAR-002",
              taskId: "2",
              quantity: 500,
              date: "2025-04-20",
              status: "Completed",
            });
          } else if (productionOrderNumber === "PO98765") {
            resolve({
              productionOrderNumber: "PO98765",
              productionRequest: "Test Components",
              productId: "TEST-003",
              taskId: "3",
              quantity: 200,
              date: "2025-04-25",
              status: "Pending",
            });
        } else if (productionOrderNumber === "PO12468") {
            resolve({
              productionOrderNumber: "PO12468",
              productionRequest: "Test SAP",
              productId: "TEST-004",
              taskId: "4",
              quantity: 250,
              date: "2025-04-25",
              status: "Pending",
            });
          } else {
            resolve(null);
          }
        }, 1000);
      });

      if (mockApiResponse) {
        setOrderDetails(mockApiResponse);
      } else {
        setError("Production order number not found.");
      }
    } catch (err: any) {
      setError("Failed to fetch production order details.");
      console.error("Error fetching production order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessProduction = async () => {
    if (!orderDetails) {
      toast.error("No production order details to process.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          setOrderDetails({ ...orderDetails, status: "Completed" });
          resolve(true);
        }, 1500);
      });

      toast.success(`Production order ${orderDetails.productionOrderNumber} processed successfully!`);
    } catch (err: any) {
      toast.error(`Failed to process production order ${orderDetails.productionOrderNumber}.`);
      console.error("Error processing production order:", err);
      setError(`Failed to process production order ${orderDetails.productionOrderNumber}.`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6">
      {/* Include the Toaster component */}
      <Toaster richColors />

      <div className="flex items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Production Order Number"
          value={productionOrderNumber}
          onChange={handleInputChange}
          disabled={loading || processing}
        />
        <Button onClick={handleSendClick} disabled={loading || processing}>
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

      {orderDetails && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Production Order Number
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Production Request
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Product ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Task ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                <TableRow key={orderDetails.productionOrderNumber}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {orderDetails.productionOrderNumber}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {orderDetails.productionRequest}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {orderDetails.productId}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {orderDetails.quantity}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {orderDetails.date}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        orderDetails.status === "Completed"
                          ? "success"
                          : orderDetails.status === "Processing"
                          ? "warning"
                          : orderDetails.status === "Failed"
                          ? "error"
                          : "info"
                      }
                    >
                      {orderDetails.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleProcessProduction}
                      disabled={processing || orderDetails.status === "Completed"}
                    >
                      {processing ? "Processing..." : "Process Production"}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionOrderLookup;
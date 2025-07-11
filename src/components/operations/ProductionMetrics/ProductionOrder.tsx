
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaPrint,
  FaSave,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { toast } from "sonner";
import Alert from "../../ui/alert/Alert";

interface ProductionHeader {
  ProductionHeaderID: string;
  SAPProductionOrderID: string;
  SAPProductionOrderObjectID: string;
  SAPProductionProposalID: string;
  SAPSupplyTaskID: string;
  SAPMakeTaskID: string;
}

interface ProductionDetail {
  SAPProductID: string;
  SAPProductDescription: string;
  SAPPlannedQuantity: number;
  CompletedQuantity: number;
  StatusCode: string;
  CreatedBy: string;
  UpdatedBy: string;
  Created: string;
  Updated: string;
}

interface ProductionOrder {
  quantity: string;
  restricted: string;
  shift: string;
  identifiedStockID: string;
}

const mockProductionOrdersData: Record<
  string,
  { header: ProductionHeader; details: ProductionDetail[] }
> = {
  "PO-2025-001": {
    header: {
      ProductionHeaderID: "PH001",
      SAPProductionOrderID: "SAP001",
      SAPProductionOrderObjectID: "OBJ001",
      SAPProductionProposalID: "PROP001",
      SAPSupplyTaskID: "SUP001",
      SAPMakeTaskID: "MAKE001",
    },
    details: [
      {
        SAPProductID: "PROD001",
        SAPProductDescription: "Product A",
        SAPPlannedQuantity: 100,
        CompletedQuantity: 95,
        StatusCode: "Active",
        CreatedBy: "User1",
        UpdatedBy: "User2",
        Created: "2025-04-20",
        Updated: "2025-04-24",
      },
      {
        SAPProductID: "PROD002",
        SAPProductDescription: "Product B",
        SAPPlannedQuantity: 50,
        CompletedQuantity: 50,
        StatusCode: "Completed",
        CreatedBy: "User1",
        UpdatedBy: "User1",
        Created: "2025-04-21",
        Updated: "2025-04-21",
      },
    ],
  },
  "PO-2025-002": {
    header: {
      ProductionHeaderID: "PH002",
      SAPProductionOrderID: "SAP002",
      SAPProductionOrderObjectID: "OBJ002",
      SAPProductionProposalID: "PROP002",
      SAPSupplyTaskID: "SUP002",
      SAPMakeTaskID: "MAKE002",
    },
    details: [
      {
        SAPProductID: "PROD003",
        SAPProductDescription: "Product C",
        SAPPlannedQuantity: 200,
        CompletedQuantity: 150,
        StatusCode: "In Progress",
        CreatedBy: "User3",
        UpdatedBy: "User4",
        Created: "2025-04-22",
        Updated: "2025-04-25",
      },
    ],
  },
  "PO-2025-003": {
    header: {
      ProductionHeaderID: "PH003",
      SAPProductionOrderID: "SAP003",
      SAPProductionOrderObjectID: "OBJ003",
      SAPProductionProposalID: "PROP003",
      SAPSupplyTaskID: "SUP003",
      SAPMakeTaskID: "MAKE003",
    },
    details: [
      {
        SAPProductID: "PROD004",
        SAPProductDescription: "Product D",
        SAPPlannedQuantity: 75,
        CompletedQuantity: 25,
        StatusCode: "Pending",
        CreatedBy: "User2",
        UpdatedBy: "User2",
        Created: "2025-04-23",
        Updated: "2025-04-24",
      },
    ],
  },
};

const mockProductionOrders = Object.keys(mockProductionOrdersData);

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};

const ProductionOrderPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFindSuccessful, setIsFindSuccessful] = useState(false);
  const [findError, setFindError] = useState<string | null>(null);
  const [productionOrderHeader, setProductionOrderHeader] =
    useState<ProductionHeader | null>(null);
  const [productionOrderDetails, setProductionOrderDetails] = useState<
    ProductionDetail[] | null
  >(null);
  const [isNewButtonEnabled, setIsNewButtonEnabled] = useState(false);
  const [showNewInputFields, setShowNewInputFields] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [restricted, setRestricted] = useState("");
  const [shift, setShift] = useState("");
  const [tableData, setTableData] = useState<ProductionOrder[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);

  // Mock function to simulate fetching production order details
  interface FetchProductionOrderResult {
    header: ProductionHeader;
    details: ProductionDetail[];
  }

  const fetchProductionOrderDetails = (
    orderNumber: string
  ): Promise<FetchProductionOrderResult> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockProductionOrders.includes(orderNumber)) {
          resolve(mockProductionOrdersData[orderNumber]);
        } else {
          reject("Invalid Production Order Number");
        }
      }, 1000);
    });
  };

  useEffect(() => {
    if (isFindSuccessful) {
      const timer = setTimeout(() => {
        setSuccessAlertVisible(false);
      }, 3000); // Adjust the duration as needed
      return () => clearTimeout(timer);
    }
  }, [isFindSuccessful]);

  const handleFindClick = () => {
    setIsModalOpen(true);
    setIsFindSuccessful(false);
    setFindError(null);
    setSearchQuery("");
    setProductionOrderHeader(null);
    setProductionOrderDetails(null);
    setIsNewButtonEnabled(false);
    setShowNewInputFields(false);
  };

  const handleSearchClick = async () => {
    setFindError(null);
    try {
      const data = await fetchProductionOrderDetails(searchQuery);
      setProductionOrderHeader(data.header);
      setProductionOrderDetails(data.details);
      setIsFindSuccessful(true);
      setSuccessAlertVisible(true);
      setIsModalOpen(false);
      setIsNewButtonEnabled(true);
      toast.success(`Production Order "${searchQuery}" found!`);
    } catch (error: any) {
      setFindError(error);
      toast.error(error);
    }
  };

  const handleNewClick = () => {
    setShowNewInputFields(true);
    // Reset input fields for new entry
    setQuantity("");
    setRestricted("");
    setShift("");
    setEditingIndex(null);
  };

  const handleAddClick = () => {
    if (!quantity || !restricted || !shift) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const newEntry = {
      quantity,
      restricted,
      shift,
      identifiedStockID: formatDate(Date.now()),
    };

    if (editingIndex !== null) {
      const updatedTableData = [...tableData];
      updatedTableData[editingIndex] = newEntry;
      setTableData(updatedTableData);
      setEditingIndex(null);
      toast.success("Entry updated successfully!");
    } else {
      setTableData([...tableData, newEntry]);
      toast.success("Entry added successfully!");
    }

    // Clear input fields after adding/editing
    setQuantity("");
    setRestricted("");
    setShift("");
  };

  const handleEditClick = (index: number, data: ProductionOrder) => {
    setShowNewInputFields(true);
    setQuantity(data.quantity);
    setRestricted(data.restricted);
    setShift(data.shift);
    setEditingIndex(index);
  };

  const handleDeleteClick = (index: number) => {
    const updatedTableData = tableData.filter((_, i) => i !== index);
    setTableData(updatedTableData);
    toast.success("Entry deleted successfully!");
  };

  const handleBulkDelete = () => {
    const itemsToDelete = Array.from(selectedItems).sort((a, b) => b - a); // Sort to avoid index issues
    let newTableData = [...tableData];
    itemsToDelete.forEach((index) => {
      newTableData.splice(index, 1);
    });
    setTableData(newTableData);
    setSelectedItems(new Set());
    toast.success(`${itemsToDelete.length} item(s) deleted successfully!`);
  };

  const handleCheckboxChange = (index: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(index)) {
      newSelectedItems.delete(index);
    } else {
      newSelectedItems.add(index);
    }
    setSelectedItems(newSelectedItems);
  };

  const renderTable = (header: string[], data: any[]) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mb-4">
      <div className="max-w-full overflow-x-auto">
        <Table aria-label={header.join(", ")}>
          <TableHeader>
            <TableRow>
              {header.map((col) => (
                <TableCell
                  key={col}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {Object.values(item).map((value) => (
                  <TableCell
                    key={`<span class="math-inline">\{index\}\-</span>{i}`}
                    className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400"
                  >
                    {String(value)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={handleFindClick} startIcon={<FaSearch />}>
          Find
        </Button>
        <Button
          onClick={handleNewClick}
          startIcon={<FaPlus />}
          disabled={!isNewButtonEnabled}
        >
          New
        </Button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <h5 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
              Enter Production Order Number
            </h5>
            {findError && (
              <Alert
                variant="error"
                title="Error"
                message={findError}
                style={{ marginBottom: "1rem" }}
              />
            )}
            <div className="flex items-center gap-2 mb-4">
              <Input
                type="text"
                placeholder="Production Order Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSearchClick} startIcon={<FaSearch />}>
                Search
              </Button>
            </div>
            {/* Removed the Cancel button from here */}
          </div>
        </div>
      )}

      {successAlertVisible &&
        isFindSuccessful &&
        productionOrderHeader &&
        productionOrderDetails && (
          <Alert
            variant="success"
            title="Success"
            message={`Production Order "${searchQuery}" found.`}
          />
        )}

      {productionOrderHeader &&
        renderTable(
          [
            "ProductionHeaderID",
            "SAPProductionOrderID",
            "SAPProductionOrderObjectID",
            "SAPProductionProposalID",
            "SAPSupplyTaskID",
            "SAPMakeTaskID",
          ],
          [productionOrderHeader]
        )}

      {productionOrderDetails &&
        productionOrderDetails.length > 0 &&
        renderTable(
          [
            "SAPProductID",
            "SAPProductDescription",
            "SAPPlannedQuantity",
            "CompletedQuantity",
            "StatusCode",
            "CreatedBy",
            "UpdatedBy",
            "Created",
            "Updated",
          ],
          productionOrderDetails
        )}

      {isNewButtonEnabled && showNewInputFields && (
        <div className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-1/4"
          />
          <Input
            type="text"
            placeholder="Restricted"
            value={restricted}
            onChange={(e) => setRestricted(e.target.value)}
            className="w-1/4"
          />
          <Input
            type="text"
            placeholder="Shift"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="w-1/4"
          />
          <Button onClick={handleAddClick} startIcon={<FaPlus />}>
            {editingIndex !== null ? "Update" : "Add"}
          </Button>
        </div>
      )}

      {tableData.length > 0 && (
        <div className="space-y-2">
          {selectedItems.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              startIcon={<FaTrash />}
            >
              Delete Selected ({selectedItems.size})
            </Button>
          )}
          {tableData && tableData.length > 0 && (
            <div className="overflow-x-auto">
              <Table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 shadow-md rounded-xl overflow-hidden">
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableCell className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Select
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Quantity
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Restricted
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Shift
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Identified Stock ID
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((data, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-brand-600 dark:focus:ring-offset-gray-800"
                          checked={selectedItems.has(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        {data.quantity}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        {data.restricted}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        {data.shift}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        {data.identifiedStockID}
                      </TableCell>
                      <TableCell className="px-6 py-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
                        <Button
                          size="sm"
                          onClick={() => handleEditClick(index, data)}
                          startIcon={<FaEdit />}
                          aria-label="Edit"
                          className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 hover:text-blue-400"
                        >
                          <></>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log("Print")}
                          startIcon={<FaPrint />}
                          aria-label="Print"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <></>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log("Save")}
                          startIcon={<FaSave />}
                          aria-label="Save"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <></>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(index)}
                          startIcon={<FaTrash />}
                          aria-label="Delete"
                          className="bg-red-300 text-red-500 hover:bg-red-500/30 hover:text-red-400 transition-colors" // Added transition-colors
                        >
                          <></>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductionOrderPage;

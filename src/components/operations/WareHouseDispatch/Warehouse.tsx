import React, { useState, useMemo } from "react";
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiList,
  FiPrinter,
  FiMaximize,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiPlusCircle,
  FiEdit2,
  FiArchive,
  FiActivity,
  FiBarChart2,
  FiBell,
  FiDownloadCloud,
  FiUploadCloud,
  FiCpu,
  FiClipboard,
  FiCheckSquare,
  FiFilter,
} from "react-icons/fi"; // Feather Icons
import {
  FaWarehouse,
  FaBoxes,
  FaShippingFast,
} from "react-icons/fa"; // Font Awesome
import { MdQrCodeScanner, MdMoveToInbox, MdOutbox } from "react-icons/md"; // Material Design Icons

// TypeScript Interfaces
interface ProductionOrder {
  id: string;
  sapByDId: string;
  productName: string;
  quantity: number;
  status:
    | "Pending"
    | "In Progress"
    | "Awaiting QC"
    | "Ready for Dispatch"
    | "Dispatched"
    | "Completed"
    | "On Hold";
  createdDate: string;
  dueDate: string;
  customer?: string;
  priority: "Low" | "Medium" | "High";
  notes?: string;
  assignedTo?: string;
  location?: string; // Current location in warehouse
}

interface WarehouseItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  availableQuantity: number;
  location: string; // e.g., "A1-R2-B3"
  category: string;
  lastStocked: string;
  lowStockThreshold: number;
  supplier?: string;
  imageUrl?: string; // Optional image URL
}

interface Shipment {
  id: string;
  orderId: string;
  type: "Inbound" | "Outbound";
  status:
    | "Expected"
    | "Processing"
    | "Ready for Dispatch"
    | "Dispatched"
    | "In Transit"
    | "Delivered"
    | "Received"
    | "Delayed";
  carrier?: string;
  trackingNumber?: string;
  expectedDate: string;
  actualDate?: string;
  items: Array<{ itemId: string; name: string; quantity: number }>;
  destination?: string;
  origin?: string;
  contactPerson?: string;
  contactPhone?: string;
}

// Mock Data
const mockProductionOrders: ProductionOrder[] = [
  {
    id: "PO-001",
    sapByDId: "SAP-10234",
    productName: "Industrial Widget X",
    quantity: 150,
    status: "Ready for Dispatch",
    createdDate: "2024-05-01",
    dueDate: "2024-05-28",
    customer: "Globex Corp",
    priority: "High",
    notes: "Expedite shipping.",
    assignedTo: "John Doe",
    location: "Packing Area",
  },
  {
    id: "PO-002",
    sapByDId: "SAP-10235",
    productName: "Advanced Gear Y",
    quantity: 75,
    status: "In Progress",
    createdDate: "2024-05-05",
    dueDate: "2024-06-05",
    customer: "Stark Industries",
    priority: "Medium",
    location: "Assembly Line 2",
  },
  {
    id: "PO-003",
    sapByDId: "SAP-10236",
    productName: "Standard Component Z",
    quantity: 300,
    status: "Pending",
    createdDate: "2024-05-10",
    dueDate: "2024-06-15",
    customer: "Wayne Enterprises",
    priority: "Low",
  },
  {
    id: "PO-004",
    sapByDId: "SAP-10237",
    productName: "Heavy Duty Plate",
    quantity: 50,
    status: "Awaiting QC",
    createdDate: "2024-05-12",
    dueDate: "2024-05-30",
    customer: "Cyberdyne Systems",
    priority: "Medium",
    location: "QC Station 1",
  },
];

const mockWarehouseItems: WarehouseItem[] = [
  {
    id: "ITEM-001",
    sku: "WID-X-IND",
    name: "Industrial Widget X",
    quantity: 500,
    availableQuantity: 450,
    location: "A1-R2-B3",
    category: "Widgets",
    lastStocked: "2024-05-20",
    lowStockThreshold: 50,
    supplier: "Acme Supplies",
    imageUrl: "https://placehold.co/100x100/e2e8f0/334155?text=WidgetX",
  },
  {
    id: "ITEM-002",
    sku: "GEAR-Y-ADV",
    name: "Advanced Gear Y",
    quantity: 200,
    availableQuantity: 180,
    location: "B2-R1-B5",
    category: "Gears",
    lastStocked: "2024-05-18",
    lowStockThreshold: 20,
    supplier: "GearPro Inc.",
    imageUrl: "https://placehold.co/100x100/e2e8f0/334155?text=GearY",
  },
  {
    id: "ITEM-003",
    sku: "COMP-Z-STD",
    name: "Standard Component Z",
    quantity: 1000,
    availableQuantity: 950,
    location: "C3-R5-B1",
    category: "Components",
    lastStocked: "2024-05-22",
    lowStockThreshold: 100,
    supplier: "Standard Parts Co.",
    imageUrl: "https://placehold.co/100x100/e2e8f0/334155?text=CompZ",
  },
  {
    id: "ITEM-004",
    sku: "PLATE-HD",
    name: "Heavy Duty Plate",
    quantity: 150,
    availableQuantity: 120,
    location: "D1-R3-B2",
    category: "Materials",
    lastStocked: "2024-05-15",
    lowStockThreshold: 30,
    supplier: "MetalWorks Ltd.",
    imageUrl: "https://placehold.co/100x100/e2e8f0/334155?text=PlateHD",
  },
];

const mockShipments: Shipment[] = [
  {
    id: "SHP-001",
    orderId: "PO-001",
    type: "Outbound",
    status: "Ready for Dispatch",
    carrier: "DHL",
    trackingNumber: "DHL123456789",
    expectedDate: "2024-05-28",
    items: [{ itemId: "ITEM-001", name: "Industrial Widget X", quantity: 150 }],
    destination: "Globex Corp HQ",
    contactPerson: "Jane Smith",
    contactPhone: "555-1234",
  },
  {
    id: "SHP-002",
    orderId: "PO-IN-001",
    type: "Inbound",
    status: "Received",
    origin: "Acme Supplies",
    expectedDate: "2024-05-20",
    actualDate: "2024-05-20",
    items: [{ itemId: "ITEM-001", name: "Industrial Widget X", quantity: 200 }],
    contactPerson: "Mike Brown",
  },
  {
    id: "SHP-003",
    orderId: "PO-002",
    type: "Outbound",
    status: "Processing",
    expectedDate: "2024-06-05",
    items: [{ itemId: "ITEM-002", name: "Advanced Gear Y", quantity: 75 }],
    destination: "Stark Industries R&D",
    contactPerson: "Pepper Potts",
  },
];

// Helper Components
const TabButton: React.FC<{
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-150 ease-in-out
                ${
                  isActive
                    ? "bg-brand-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-sky-100 hover:text-sky-700"
                }`}
  >
    {/* FIX: Added type assertion for className */}
    {React.cloneElement(icon, {
      className: `w-5 h-5 ${isActive ? "text-white" : "text-brand-500"}`,
    } as React.SVGProps<SVGSVGElement>)}
    <span className="font-medium">{label}</span>
  </button>
);

const Card: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactElement;
  trend?: string;
  trendColor?: string;
  footer?: string;
}> = ({ title, value, icon, trend, trendColor, footer }) => (
  <div className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-gray-200">
        {title}
      </h3>
      {/* FIX: Added type assertion for className */}
      {React.cloneElement(icon, {
        className: "w-8 h-8 text-brand-500",
      } as React.SVGProps<SVGSVGElement>)}
    </div>
    <p className="text-3xl font-bold text-slate-800 mb-1 dark:text-gray-200">{value}</p>
    {trend && <p className={`text-xs font-medium dark:text-gray-200 ${trendColor}`}>{trend}</p>}
    {footer && <p className="text-xs text-slate-400 mt-3 dark:text-gray-200">{footer}</p>}
  </div>
);

const Table: React.FC<{
  columns: string[];
  data: any[][];
  renderActions?: (item: any, index: number) => React.ReactNode;
}> = ({ columns, data, renderActions }) => (
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className="p-4 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider dark:text-gray-200"
            >
              {col}
            </th>
          ))}
          {renderActions && (
            <th className="p-4 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider dark:text-gray-200">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="transition-colors duration-150 "
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="p-4 border-b border-slate-200 text-sm text-slate-700 dark:text-gray-200"
              >
                {typeof cell === "object" && React.isValidElement(cell)
                  ? cell
                  : String(cell)}
              </td>
            ))}
            {renderActions && (
              <td className="p-4 border-b border-slate-200 text-sm text-slate-700 dark:text-gray-200">
                {renderActions(data[rowIndex], rowIndex)}{" "}
                {/* Pass the original row data if needed for actions */}
              </td>
            )}
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td
              colSpan={columns.length + (renderActions ? 1 : 0)}
              className="p-4 text-center text-slate-500 dark:text-gray-200"
            >
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClasses = "bg-slate-200 text-slate-700";
  if (
    status.toLowerCase().includes("pending") ||
    status.toLowerCase().includes("expected")
  )
    colorClasses = "bg-yellow-100 text-yellow-700";
  if (
    status.toLowerCase().includes("progress") ||
    status.toLowerCase().includes("processing")
  )
    colorClasses = "bg-blue-100 text-blue-700";
  if (
    status.toLowerCase().includes("ready") ||
    status.toLowerCase().includes("picked") ||
    status.toLowerCase().includes("packed")
  )
    colorClasses = "bg-sky-100 text-sky-700";
  if (
    status.toLowerCase().includes("dispatch") ||
    status.toLowerCase().includes("transit") ||
    status.toLowerCase().includes("received")
  )
    colorClasses = "bg-green-100 text-green-700";
  if (status.toLowerCase().includes("complete"))
    colorClasses = "bg-emerald-100 text-emerald-700";
  if (
    status.toLowerCase().includes("hold") ||
    status.toLowerCase().includes("delayed") ||
    status.toLowerCase().includes("qc")
  )
    colorClasses = "bg-orange-100 text-orange-700";
  if (
    status.toLowerCase().includes("error") ||
    status.toLowerCase().includes("failed")
  )
    colorClasses = "bg-red-100 text-red-700";

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${colorClasses}`}
    >
      {status}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: "Low" | "Medium" | "High" }> = ({
  priority,
}) => {
  let colorClasses = "bg-slate-200 text-slate-700";
  if (priority === "Low") colorClasses = "bg-green-100 text-green-700";
  if (priority === "Medium") colorClasses = "bg-yellow-100 text-yellow-700";
  if (priority === "High") colorClasses = "bg-red-100 text-red-700";

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center ${colorClasses}`}
    >
      {priority === "High" && <FiChevronUp className="mr-1" />}
      {priority === "Medium" && <span className="mr-1">-</span>}
      {priority === "Low" && <FiChevronDown className="mr-1" />}
      {priority}
    </span>
  );
};

const IconButton: React.FC<{
  icon: React.ReactElement;
  onClick?: () => void;
  tooltip?: string;
  className?: string;
}> = ({ icon, onClick, tooltip, className }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`p-2 rounded-md hover:bg-slate-200 transition-colors duration-150 ${className}`}
  >
    {/* FIX: Added type assertion for className */}
    {React.cloneElement(icon, {
      className: "w-5 h-5 text-slate-600",
    } as React.SVGProps<SVGSVGElement>)}
  </button>
);

// Main Tab Content Components
const OverviewTab: React.FC = () => {
  const totalOrders = mockProductionOrders.length;
  const readyToDispatch = mockProductionOrders.filter(
    (o) => o.status === "Ready for Dispatch"
  ).length;
  const lowStockItems = mockWarehouseItems.filter(
    (i) => i.quantity <= i.lowStockThreshold
  ).length;
  const inboundShipments = mockShipments.filter(
    (s) => s.type === "Inbound" && s.status === "Expected"
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Production Orders"
          value={totalOrders}
          icon={<FiClipboard />}
          footer="Across all statuses"
        />
        <Card
          title="Ready for Dispatch"
          value={readyToDispatch}
          icon={<FaShippingFast />}
          trend={`${Math.round(
            (readyToDispatch / totalOrders) * 100
          )}% of total`}
          trendColor="text-green-600"
        />
        <Card
          title="Low Stock Alerts"
          value={lowStockItems}
          icon={<FiBell />}
          trendColor={lowStockItems > 0 ? "text-red-600" : "text-green-600"}
          trend={
            lowStockItems > 0
              ? `${lowStockItems} items need attention`
              : "All stock levels healthy"
          }
        />
        <Card
          title="Pending Inbound"
          value={inboundShipments}
          icon={<FiDownloadCloud />}
          footer="Expected shipments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-200">
            <FiActivity className="mr-2 text-brand-500" />
            Recent Activity
          </h3>
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {mockProductionOrders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors dark:text-gray-200"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                    {order.productName} (Order: {order.id})
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-200">
                    Status updated: {order.status} on{" "}
                    {new Date(order.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </li>
            ))}
            <li className="flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                  Item 'Industrial Widget X' received
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-200">
                  Quantity: 200, From: Acme Supplies on{" "}
                  {new Date(
                    mockShipments.find((s) => s.id === "SHP-002")?.actualDate ||
                      ""
                  ).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status="Received" />
            </li>
          </ul>
        </div>
        <div className="p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-200">
            <FiBarChart2 className="mr-2 text-brand-500" />
            Order Status Distribution
          </h3>
          {/* Placeholder for a chart. In a real app, use a library like Recharts or Chart.js */}
          <div className="h-80 flex items-center justify-center rounded-md text-slate-500 dark:text-gray-200">
            Chart Placeholder (e.g., Pie chart of order statuses)
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(mockWarehouseItems.map((item) => item.category))],
    []
  );

  const filteredItems = useMemo(() => {
    return mockWarehouseItems.filter(
      (item) =>
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterCategory === "All" || item.category === filterCategory)
    );
  }, [searchTerm, filterCategory]);

  const inventoryTableColumns = [
    "SKU",
    "Name",
    "Category",
    "Total Qty",
    "Available Qty",
    "Location",
    "Status",
  ];
  const inventoryTableData = filteredItems.map((item) => [
    item.sku,
    <div className="flex items-center">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-10 h-10 rounded-md mr-3 object-cover"
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/100x100/e2e8f0/334155?text=N/A")
          }
        />
      )}
      <div>
        <span className="font-medium text-slate-800">{item.name}</span>
        {item.description && (
          <p className="text-xs text-slate-500">
            {item.description.substring(0, 30)}...
          </p>
        )}
      </div>
    </div>,
    item.category,
    item.quantity,
    item.availableQuantity,
    item.location,
    item.availableQuantity <= item.lowStockThreshold ? (
      <StatusBadge status="Low Stock" />
    ) : (
      <StatusBadge status="In Stock" />
    ),
  ]);

  const renderInventoryActions = (_itemData: any[], index: number) => {
    const originalItem = filteredItems[index]; // Get the original item object
    return (
      <div className="flex space-x-1">
        <IconButton
          icon={<FiMaximize />}
          tooltip="View Details"
          onClick={() => alert(`Viewing details for ${originalItem.name}`)}
        />
        <IconButton
          icon={<FiEdit2 />}
          tooltip="Adjust Stock"
          onClick={() => alert(`Adjusting stock for ${originalItem.name}`)}
        />
        <IconButton
          icon={<FiArchive />}
          tooltip="Move Location"
          onClick={() => alert(`Moving ${originalItem.name}`)}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl shadow-lg">
        <div className="relative flex-grow w-full sm:w-auto">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
          />
        </div>
        <div className="relative flex-grow w-full sm:w-auto">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow appearance-none dark:text-gray-200"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="dark:text-gray-200">
                {cat}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
        <button className="flex items-center bg-brand-500 text-white px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow hover:shadow-md w-full sm:w-auto justify-center">
          <FiPlusCircle className="mr-2" /> Add New Item
        </button>
      </div>
      <Table
        columns={inventoryTableColumns}
        data={inventoryTableData}
        renderActions={renderInventoryActions}
      />
    </div>
  );
};

const InboundTab: React.FC = () => {
  const inboundShipments = mockShipments.filter((s) => s.type === "Inbound");
  const columns = [
    "Shipment ID",
    "Origin",
    "Expected Date",
    "Status",
    "Items Count",
  ];
  const data = inboundShipments.map((s) => [
    s.id,
    s.origin,
    new Date(s.expectedDate).toLocaleDateString(),
    <StatusBadge status={s.status} />,
    s.items.reduce((sum, item) => sum + item.quantity, 0),
  ]);

  const renderInboundActions = (_itemData: any[], index: number) => {
    const shipment = inboundShipments[index];
    return (
      <div className="flex space-x-1">
        <IconButton
          icon={<FiMaximize />}
          tooltip="View Details"
          onClick={() => alert(`Viewing shipment ${shipment.id}`)}
        />
        {shipment.status === "Expected" && (
          <IconButton
            icon={<FiCheckSquare />}
            tooltip="Receive Shipment"
            onClick={() => alert(`Receiving ${shipment.id}`)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-gray-200">
          Incoming Shipments
        </h2>
        <button className="flex items-center bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow hover:shadow-md">
          <FiUploadCloud className="mr-2" /> Record New Inbound
        </button>
      </div>
      <Table
        columns={columns}
        data={data}
        renderActions={renderInboundActions}
      />
    </div>
  );
};

const OutboundTab: React.FC = () => {
  const outboundShipments = mockShipments.filter((s) => s.type === "Outbound");
  const columns = [
    "Shipment ID",
    "Order ID",
    "Destination",
    "Carrier",
    "Tracking #",
    "Status",
    "Expected Date",
  ];
  const data = outboundShipments.map((s) => [
    s.id,
    s.orderId,
    s.destination,
    s.carrier || "N/A",
    s.trackingNumber || "N/A",
    <StatusBadge status={s.status} />,
    new Date(s.expectedDate).toLocaleDateString(),
  ]);

  const renderOutboundActions = (_itemData: any[], index: number) => {
    const shipment = outboundShipments[index];
    return (
      <div className="flex space-x-1">
        <IconButton
          icon={<FiMaximize />}
          tooltip="View Details"
          onClick={() => alert(`Viewing shipment ${shipment.id}`)}
        />
        {shipment.status === "Ready for Dispatch" && (
          <IconButton
            icon={<FiTruck />}
            tooltip="Mark Dispatched"
            onClick={() => alert(`Dispatching ${shipment.id}`)}
          />
        )}
        {shipment.status === "Processing" && (
          <IconButton
            icon={<FiPackage />}
            tooltip="Pack Order"
            onClick={() => alert(`Packing for ${shipment.id}`)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-gray-200">
          Outgoing Shipments & Dispatch
        </h2>
        <button className="flex items-center bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow hover:shadow-md dark:text-gray-200">
          <FiPlusCircle className="mr-2" /> Create New Dispatch
        </button>
      </div>
      <Table
        columns={columns}
        data={data}
        renderActions={renderOutboundActions}
      />
    </div>
  );
};

const ProductionOrderOpsTab: React.FC = () => {
  const [scannedOrder, setScannedOrder] = useState<ProductionOrder | null>(
    null
  );
  const [scanInput, setScanInput] = useState("");

  const handleScan = () => {
    const order = mockProductionOrders.find(
      (po) => po.id === scanInput || po.sapByDId === scanInput
    );
    if (order) {
      setScannedOrder(order);
    } else {
      setScannedOrder(null);
      alert("Production Order not found.");
    }
  };

  const productionOrderColumns = [
    "PO ID",
    "SAP ID",
    "Product",
    "Qty",
    "Status",
    "Due Date",
    "Priority",
  ];
  const productionOrderData = mockProductionOrders.map((po) => [
    po.id,
    po.sapByDId,
    po.productName,
    po.quantity,
    <StatusBadge status={po.status} />,
    new Date(po.dueDate).toLocaleDateString(),
    <PriorityBadge priority={po.priority} />,
  ]);

  const renderProductionOrderActions = (_itemData: any[], index: number) => {
    const order = mockProductionOrders[index];
    return (
      <div className="flex space-x-1">
        <IconButton
          icon={<FiMaximize />}
          tooltip="View/Edit Details"
          onClick={() => {
            setScannedOrder(order);
            alert(`Viewing/Editing ${order.id}`);
          }}
        />
        <IconButton
          icon={<FiPrinter />}
          tooltip="Print Barcode"
          onClick={() => alert(`Printing barcode for ${order.id}`)}
        />
        <IconButton
          icon={<FiList />}
          tooltip="View BOM"
          onClick={() => alert(`Viewing Bill of Materials for ${order.id}`)}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-200">
            <MdQrCodeScanner className="mr-2 text-brand-500 w-6 h-6" />
            Scan Production Order
          </h3>
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            <input
              type="text"
              placeholder="Enter PO ID or SAP ID"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="w-full md:flex-grow p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow dark:text-gray-200"
            />
            <button
              onClick={handleScan}
              className="w-full md:w-auto bg-brand-500 text-white px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow hover:shadow-md flex items-center justify-center"
            >
              <FiSearch className="mr-2" /> Scan
            </button>
          </div>
          {scannedOrder && (
            <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <h4 className="font-semibold text-brand-500 mb-2">
                {scannedOrder.productName} ({scannedOrder.id})
              </h4>
              <p className="text-sm text-slate-600">
                SAP ID: {scannedOrder.sapByDId}
              </p>
              <p className="text-sm text-slate-600">
                Quantity: {scannedOrder.quantity}
              </p>
              <p className="text-sm text-slate-600">
                Status: <StatusBadge status={scannedOrder.status} />
              </p>
              <p className="text-sm text-slate-600">
                Due Date: {new Date(scannedOrder.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-600">
                Priority: <PriorityBadge priority={scannedOrder.priority} />
              </p>
              {scannedOrder.notes && (
                <p className="text-sm text-slate-600 mt-1">
                  Notes: {scannedOrder.notes}
                </p>
              )}
              <div className="mt-4 flex space-x-2">
                <button className="text-sm bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors flex items-center">
                  <FiEdit2 className="mr-1.5" /> Add/Edit Details
                </button>
                <button className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors flex items-center">
                  <FiPrinter className="mr-1.5" /> Print Barcode
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-200">
            <FiPrinter className="mr-2 text-brand-500" />
            Batch Print Barcodes
          </h3>
          <p className="text-sm text-slate-600 mb-3 dark:text-gray-200">
            Select orders from the list below or enter a range to print
            barcodes.
          </p>
          <button className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow hover:shadow-md flex items-center justify-center dark:text-gray-200">
            <FiPrinter className="mr-2" /> Print Selected / Range
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 p-4 rounded-xl shadow-lg dark:text-gray-200">
          Manage Production Orders
        </h3>
        <Table
          columns={productionOrderColumns}
          data={productionOrderData}
          renderActions={renderProductionOrderActions}
        />
      </div>
    </div>
  );
};

export const WarehousePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Overview");

  const tabs = [
    { name: "Overview", icon: <FiHome />, component: <OverviewTab /> },
    { name: "Inventory", icon: <FaBoxes />, component: <InventoryTab /> },
    { name: "Inbound", icon: <MdMoveToInbox />, component: <InboundTab /> },
    {
      name: "Outbound & Dispatch",
      icon: <MdOutbox />,
      component: <OutboundTab />,
    },
    {
      name: "Production Order Ops",
      icon: <FiCpu />,
      component: <ProductionOrderOpsTab />,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.name === activeTab)?.component;

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      {/* Header */}
      <header className="shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <FaWarehouse className="w-10 h-10 text-brand-600 mr-3" />
              <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-200">
                Warehouse Operations
              </h1>
            </div>
            {/* <div className="flex items-center space-x-4">
              <IconButton icon={<FiSearch />} tooltip="Global Search" className="text-slate-500 hover:text-sky-600" />
              <IconButton icon={<FiBell />} tooltip="Notifications" className="text-slate-500 hover:text-sky-600" />
              <div className="relative">
                <img src="https://placehold.co/40x40/0ea5e9/ffffff?text=U" alt="User Avatar" className="w-10 h-10 rounded-full cursor-pointer" />
                
              </div>
            </div> */}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="shadow-sm sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 py-3 overflow-x-auto dark:text-gray-200">
            {tabs.map((tab) => (
              <TabButton
                key={tab.name}
                icon={tab.icon}
                label={tab.name}
                isActive={activeTab === tab.name}
                onClick={() => setActiveTab(tab.name)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {ActiveComponent}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500 dark:text-gray-200">
          &copy; {new Date().getFullYear()} Alucan Packaging Limited. All
          rights reserved.
          <p>Warehouse Module v1.0</p>
        </div>
      </footer>
    </div>
  );
};

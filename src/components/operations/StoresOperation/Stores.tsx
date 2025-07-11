import React, { useState, useMemo } from 'react';
// Importing a comprehensive set of icons
import { 
  FiHome, FiList, FiSearch, FiChevronDown, FiChevronUp, 
  FiPlusCircle, FiEdit2, FiActivity, FiBarChart2, 
  FiDownloadCloud, FiUploadCloud, FiCheckSquare, FiFilter, 
  FiAlertCircle, FiFileText, FiGrid,
  FiPrinter
} from 'react-icons/fi'; // Feather Icons
import { 
  FaBoxes, FaUndo, FaClipboardCheck, FaExchangeAlt
} from 'react-icons/fa'; // Font Awesome
import { 
  MdStore, MdPlaylistAddCheck, MdInput, MdOutput
} from 'react-icons/md'; // Material Design Icons
import { GiTestTubes } from "react-icons/gi"; // Game Icons for specific themes

// TypeScript Interfaces for Stores Operations
interface StoreItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  quantityOnHand: number;
  unitOfMeasure: string;
  location: string; // e.g., "Rack 10, Shelf B, Bin 03"
  category: string;
  batchNumber?: string;
  serialNumber?: string;
  expiryDate?: string;
  lastReceivedDate: string;
  supplierId?: string;
  supplierName?: string;
  minStockLevel: number;
  maxStockLevel: number;
  qcStatus: 'Pending' | 'Approved' | 'Rejected' | 'Not Required';
  imageUrl?: string;
}

interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  purchaseOrderId?: string;
  supplierId: string;
  supplierName: string;
  receivedDate: string;
  receivedBy: string;
  items: Array<{ itemId: string; itemName: string; quantityReceived: number; quantityAccepted?: number; batchNumber?: string; expiryDate?: string; notes?: string }>;
  status: 'Pending QC' | 'Partially Received' | 'Fully Received' | 'Closed';
  vehicleNumber?: string;
  invoiceNumber?: string;
}

interface MaterialIssueRequest {
  id: string;
  mirNumber: string;
  productionOrderId: string;
  department: string;
  requestedBy: string;
  requestDate: string;
  requiredDate: string;
  items: Array<{ itemId: string; itemName: string; quantityRequested: number; quantityIssued?: number; unit: string }>;
  status: 'Pending' | 'Partially Issued' | 'Fully Issued' | 'Closed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High';
}

// interface StockAdjustment {
//   id: string;
//   adjustmentNumber: string;
//   itemId: string;
//   itemName: string;
//   adjustmentType: 'Positive' | 'Negative' | 'Transfer'; // Transfer could be to another location/store
//   quantityAdjusted: number;
//   reason: string;
//   adjustedBy: string;
//   adjustmentDate: string;
//   previousQuantity: number;
//   newQuantity: number;
//   notes?: string;
// }

interface StoreReturn {
    id: string;
    returnNumber: string;
    returnType: 'To Supplier' | 'From Production';
    referenceDocumentId: string; // PO for supplier, MIR/ProdOrder for production
    returnDate: string;
    returnedBy: string;
    items: Array<{ itemId: string; itemName: string; quantityReturned: number; reason: string; condition?: string }>;
    status: 'Pending Inspection' | 'Approved' | 'Rejected' | 'Processed';
}


// Mock Data for Stores
const mockStoreItems: StoreItem[] = [
  { id: 'SITEM-001', sku: 'RAW-MTL-001', name: 'Steel Rods - 10mm', quantityOnHand: 1200, unitOfMeasure: 'meters', location: 'R1-S2-B1', category: 'Raw Materials', batchNumber: 'B001', expiryDate: '2025-12-31', lastReceivedDate: '2024-05-15', supplierName: 'MetalCorp', minStockLevel: 200, maxStockLevel: 1500, qcStatus: 'Approved', imageUrl: 'https://placehold.co/100x100/d1d5db/1f2937?text=SteelRod' },
  { id: 'SITEM-002', sku: 'COMP-ELC-005', name: 'Microcontroller Unit XYZ', quantityOnHand: 750, unitOfMeasure: 'pieces', location: 'R5-S1-B3', category: 'Components', serialNumber: 'SN0100-SN0850', lastReceivedDate: '2024-05-20', supplierName: 'ElectroParts Ltd.', minStockLevel: 100, maxStockLevel: 1000, qcStatus: 'Pending', imageUrl: 'https://placehold.co/100x100/d1d5db/1f2937?text=MCU' },
  { id: 'SITEM-003', sku: 'CONSUM-010', name: 'Lubricant Oil Grade A', quantityOnHand: 50, unitOfMeasure: 'liters', location: 'R2-S4-B2', category: 'Consumables', batchNumber: 'LUB077', expiryDate: '2026-06-30', lastReceivedDate: '2024-04-10', supplierName: 'Chem Oils Inc.', minStockLevel: 20, maxStockLevel: 100, qcStatus: 'Approved' },
  { id: 'SITEM-004', sku: 'SPARE-MCH-002', name: 'Bearing Model 6205', quantityOnHand: 300, unitOfMeasure: 'pieces', location: 'R3-S1-B5', category: 'Spare Parts', lastReceivedDate: '2024-05-01', supplierName: 'Bearings Direct', minStockLevel: 50, maxStockLevel: 500, qcStatus: 'Not Required', imageUrl: 'https://placehold.co/100x100/d1d5db/1f2937?text=Bearing' },
];

const mockGRNs: GoodsReceiptNote[] = [
  { id: 'GRN-001', grnNumber: 'GRN202405001', purchaseOrderId: 'PO-S001', supplierId: 'SUP001', supplierName: 'MetalCorp', receivedDate: '2024-05-15', receivedBy: 'Alice Smith', items: [{ itemId: 'SITEM-001', itemName: 'Steel Rods - 10mm', quantityReceived: 500, quantityAccepted: 500, batchNumber: 'B001' }], status: 'Fully Received', vehicleNumber: 'TRK-123', invoiceNumber: 'INV-MC-101' },
  { id: 'GRN-002', grnNumber: 'GRN202405002', purchaseOrderId: 'PO-S002', supplierId: 'SUP002', supplierName: 'ElectroParts Ltd.', receivedDate: '2024-05-20', receivedBy: 'Bob Johnson', items: [{ itemId: 'SITEM-002', itemName: 'Microcontroller Unit XYZ', quantityReceived: 300, notes: 'Awaiting QC' }], status: 'Pending QC', invoiceNumber: 'INV-EP-205' },
];

const mockMIRs: MaterialIssueRequest[] = [
  { id: 'MIR-001', mirNumber: 'MIR202405001', productionOrderId: 'PO-001', department: 'Assembly Line 1', requestedBy: 'Charlie Brown', requestDate: '2024-05-22', requiredDate: '2024-05-23', items: [{ itemId: 'SITEM-001', itemName: 'Steel Rods - 10mm', quantityRequested: 100, unit: 'meters' }, { itemId: 'SITEM-004', itemName: 'Bearing Model 6205', quantityRequested: 20, unit: 'pieces' }], status: 'Pending', priority: 'High' },
  { id: 'MIR-002', mirNumber: 'MIR202405002', productionOrderId: 'PO-002', department: 'Welding Section', requestedBy: 'Diana Prince', requestDate: '2024-05-23', requiredDate: '2024-05-25', items: [{ itemId: 'SITEM-001', itemName: 'Steel Rods - 10mm', quantityRequested: 50, quantityIssued: 50, unit: 'meters' }], status: 'Fully Issued', priority: 'Medium' },
];

// Reusable Helper Components (Can be imported from a shared location in a real app)
const TabButton: React.FC<{ icon: React.ReactElement; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-150 ease-in-out
                ${isActive ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-600 hover:bg-blue-100 hover:text-custom-500'}`}
  >
    {React.cloneElement(icon, { className: `w-5 h-5 ${isActive ? 'text-white' : 'text-brand-500'}` } as React.SVGProps<SVGSVGElement>)}
    <span className="font-medium">{label}</span>
  </button>
);

const Card: React.FC<{ title: string; value: string | number; icon: React.ReactElement; trend?: string; trendColor?: string; footer?: string; bgColor?: string; iconColor?: string }> = 
({ title, value, icon, trend, trendColor, footer, iconColor = 'text-brand-500' }) => (
  <div className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-gray-200">{title}</h3>
      {React.cloneElement(icon, { className: `w-8 h-8 ${iconColor}` } as React.SVGProps<SVGSVGElement>)}
    </div>
    <p className="text-3xl font-bold text-slate-800 mb-1 dark:text-gray-200">{value}</p>
    {trend && <p className={`text-xs font-medium dark:text-gray-200 ${trendColor}`}>{trend}</p>}
    {footer && <p className="text-xs text-slate-400 mt-3 dark:text-gray-200">{footer}</p>}
  </div>
);

const Table: React.FC<{ columns: string[]; data: any[][]; renderActions?: (item: any, index: number) => React.ReactNode; onRowClick?: (item: any, index: number) => void }> = 
({ columns, data, renderActions, onRowClick }) => (
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} className="p-4 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider dark:text-gray-200">
              {col}
            </th>
          ))}
          {renderActions && <th className="p-4 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right dark:text-gray-200">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr 
            key={rowIndex} 
            className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick && onRowClick(data[rowIndex], rowIndex)}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="p-4 border-b border-slate-200 text-sm text-slate-700 dark:text-gray-200">
                {typeof cell === 'object' && React.isValidElement(cell) ? cell : String(cell)}
              </td>
            ))}
            {renderActions && (
              <td className="p-4 border-b border-slate-200 text-sm text-slate-700 text-right dark:text-gray-200">
                {renderActions(data[rowIndex], rowIndex)}
              </td>
            )}
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length + (renderActions ? 1 : 0)} className="p-4 text-center text-slate-500 dark:text-gray-200">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClasses = 'bg-slate-100 text-slate-700'; // Default
  const s = status.toLowerCase();

  if (s.includes('pending') || s.includes('expected') || s.includes('awaiting')) colorClasses = 'bg-yellow-100 text-yellow-800';
  else if (s.includes('progress') || s.includes('processing') || s.includes('partially')) colorClasses = 'bg-blue-100 text-blue-800';
  else if (s.includes('approved') || s.includes('active') || s.includes('available') || s.includes('fully issued') || s.includes('fully received') || s.includes('closed')) colorClasses = 'bg-green-100 text-green-800';
  else if (s.includes('rejected') || s.includes('cancelled') || s.includes('error')) colorClasses = 'bg-red-100 text-red-800';
  else if (s.includes('hold') || s.includes('qc') || s.includes('inspection')) colorClasses = 'bg-orange-100 text-orange-800';
  else if (s.includes('not required')) colorClasses = 'bg-indigo-100 text-indigo-800';
  
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${colorClasses}`}>{status}</span>;
};

const PriorityBadge: React.FC<{ priority: 'Low' | 'Medium' | 'High' }> = ({ priority }) => {
    let colorClasses = 'bg-slate-200 text-slate-700';
    if (priority === 'Low') colorClasses = 'bg-green-100 text-green-700';
    if (priority === 'Medium') colorClasses = 'bg-yellow-100 text-yellow-700';
    if (priority === 'High') colorClasses = 'bg-red-100 text-red-700';
    
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center ${colorClasses}`}>
        {priority === 'High' && <FiChevronUp className="mr-1" />}
        {priority === 'Medium' && <span className="mr-1 font-bold">-</span>}
        {priority === 'Low' && <FiChevronDown className="mr-1" />}
        {priority}
      </span>
    );
  };

const IconButton: React.FC<{ icon: React.ReactElement; onClick?: () => void; tooltip?: string; className?: string; variant?: 'primary' | 'secondary' | 'danger' | 'default' }> = 
({ icon, onClick, tooltip, className, variant = 'default' }) => {
  let hoverBg = 'hover:bg-slate-200';
  let iconColor = 'text-slate-600';

  if (variant === 'primary') { hoverBg = 'hover:bg-brand-100'; iconColor = 'text-brand-500'; }
  else if (variant === 'danger') { hoverBg = 'hover:bg-red-100'; iconColor = 'text-red-600'; }
  
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-md ${hoverBg} transition-colors duration-150 ${className}`}
    >
      {React.cloneElement(icon, { className: `w-5 h-5 ${iconColor}` } as React.SVGProps<SVGSVGElement>)}
    </button>
  );
};

const FilterControls: React.FC<{
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    searchPlaceholder?: string;
    filters?: Array<{label: string; value: string; options: Array<{value: string; label: string}>; onChange: (value: string) => void}>;
    onAddNew?: () => void;
    addNewLabel?: string;
}> = ({ searchTerm, onSearchTermChange, searchPlaceholder = "Search...", filters, onAddNew, addNewLabel="Add New" }) => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl shadow-lg mb-6">
        <div className="relative flex-grow w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
                type="text" 
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow
                dark:text-gray-200"
            />
        </div>
        {filters && filters.map(filter => (
            <div key={filter.label} className="relative flex-grow w-full sm:w-auto">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                    value={filter.value} 
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow appearance-none"
                >
                    {filter.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
        ))}
        {onAddNew && (
            <button 
                onClick={onAddNew}
                className="flex items-center bg-brand-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-light-100 transition-colors shadow hover:shadow-md w-full sm:w-auto justify-center"
            >
                <FiPlusCircle className="mr-2" /> {addNewLabel}
            </button>
        )}
    </div>
);


// Tab Content Components for Stores
const StoresDashboardTab: React.FC = () => {
    const totalStockItems = mockStoreItems.length;
    const itemsPendingQC = mockStoreItems.filter(item => item.qcStatus === 'Pending').length;
    const lowStockAlerts = mockStoreItems.filter(item => item.quantityOnHand < item.minStockLevel).length;
    const pendingMIRs = mockMIRs.filter(mir => mir.status === 'Pending').length;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Stock Items" value={totalStockItems} icon={<FiGrid />} footer="Unique SKUs in store" />
                <Card title="Items Pending QC" value={itemsPendingQC} icon={<GiTestTubes />} trendColor={itemsPendingQC > 0 ? "text-orange-600" : "text-green-600"} trend={itemsPendingQC > 0 ? `${itemsPendingQC} items require inspection` : "All items cleared QC"} />
                <Card title="Low Stock Alerts" value={lowStockAlerts} icon={<FiAlertCircle />} trendColor={lowStockAlerts > 0 ? "text-red-600" : "text-green-600"} trend={lowStockAlerts > 0 ? `${lowStockAlerts} items below min. level` : "Stock levels healthy"} />
                <Card title="Pending Material Issues" value={pendingMIRs} icon={<MdOutput />} footer="Requests from production" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-200"><FiActivity className="mr-2 text-brand-500"/>Recent Store Activities</h3>
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {mockGRNs.slice(0,2).map(grn => (
                             <li key={grn.id} className="flex items-center justify-between p-3 rounded-md transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-gray-200">GRN {grn.grnNumber} received from {grn.supplierName}</p>
                                    <p className="text-xs text-slate-500 dark:text-gray-200">Date: {new Date(grn.receivedDate).toLocaleDateString()}, Status: <StatusBadge status={grn.status} /></p>
                                </div>
                                <FiDownloadCloud className="text-green-500"/>
                            </li>
                        ))}
                        {mockMIRs.slice(0,3).map(mir => (
                             <li key={mir.id} className="flex items-center justify-between p-3 rounded-md transition-colors">
                                <div>
                                    <p className="text-sm font-medium dark:text-gray-200 text-slate-700">MIR {mir.mirNumber} for Prod. Order {mir.productionOrderId}</p>
                                    <p className="text-xs dark:text-gray-200 text-slate-500">Status: <StatusBadge status={mir.status} />, Priority: <PriorityBadge priority={mir.priority} /></p>
                                </div>
                                <FiUploadCloud className="text-blue-500"/>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center dark:text-gray-200"><FiBarChart2 className="mr-2 text-brand-500"/>Stock Categories</h3>
                    {/* Placeholder for chart */}
                    <div className="h-80 flex items-center justify-center dark:text-gray-200 rounded-md text-slate-500">
                        Chart Placeholder (e.g., Stock Value by Category)
                    </div>
                </div>
            </div>
        </div>
    );
};

const GoodsReceivingTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    
    const grnStatuses = ['All', ...new Set(mockGRNs.map(grn => grn.status))];

    const filteredGRNs = useMemo(() => {
        return mockGRNs.filter(grn =>
            (grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) || grn.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterStatus === 'All' || grn.status === filterStatus)
        );
    }, [searchTerm, filterStatus]);

    const columns = ['GRN Number', 'Supplier', 'Received Date', 'Items', 'Status'];
    const data = filteredGRNs.map(grn => [
        grn.grnNumber,
        grn.supplierName,
        new Date(grn.receivedDate).toLocaleDateString(),
        grn.items.length,
        <StatusBadge status={grn.status} />
    ]);

    const renderActions = (_itemData: any[], index: number) => {
        const grn = filteredGRNs[index];
        return (
            <div className="flex space-x-1 justify-end">
                <IconButton icon={<FiFileText />} tooltip="View Details" onClick={() => alert(`Viewing GRN ${grn.grnNumber}`)} variant="primary"/>
                {grn.status === 'Pending QC' && <IconButton icon={<FaClipboardCheck />} tooltip="Perform QC" onClick={() => alert(`Performing QC for ${grn.grnNumber}`)} />}
                <IconButton icon={<FiPrinter />} tooltip="Print GRN" onClick={() => alert(`Printing GRN ${grn.grnNumber}`)} />
            </div>
        );
    };
    
    return (
        <div className="space-y-6">
            <FilterControls
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                searchPlaceholder="Search GRN# or Supplier..."
                filters={[{ label: 'Status', value: filterStatus, options: grnStatuses.map(s => ({value: s, label: s})), onChange: setFilterStatus }]}
                onAddNew={() => alert("Creating New GRN")}
                addNewLabel="New Goods Receipt"
            />
            <Table columns={columns} data={data} renderActions={renderActions} />
        </div>
    );
};

const StockManagementTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    
    const categories = ['All', ...new Set(mockStoreItems.map(item => item.category))];

    const filteredItems = useMemo(() => {
        return mockStoreItems.filter(item =>
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterCategory === 'All' || item.category === filterCategory)
        );
    }, [searchTerm, filterCategory]);

    const columns = ['SKU', 'Item Name', 'Category', 'Qty on Hand', 'UoM', 'Location', 'QC Status', 'Stock Level'];
    const data = filteredItems.map(item => [
        item.sku,
        <div className="flex items-center">
          {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md mr-3 object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/334155?text=N/A')}/>}
          <div>
            <span className="font-medium text-slate-800">{item.name}</span>
            {item.batchNumber && <p className="text-xs text-slate-500">Batch: {item.batchNumber}</p>}
            {item.serialNumber && <p className="text-xs text-slate-500">Serial: {item.serialNumber}</p>}
          </div>
        </div>,
        item.category,
        item.quantityOnHand,
        item.unitOfMeasure,
        item.location,
        <StatusBadge status={item.qcStatus} />,
        item.quantityOnHand < item.minStockLevel ? <StatusBadge status="Low Stock" /> : item.quantityOnHand > item.maxStockLevel ? <StatusBadge status="Overstock" /> : <StatusBadge status="Normal" />
    ]);

    const renderActions = (_itemData: any[], index: number) => {
        const item = filteredItems[index];
        return (
            <div className="flex space-x-1 justify-end">
                <IconButton icon={<FiList />} tooltip="View Details & History" onClick={() => alert(`Viewing details for ${item.name}`)} variant="primary"/>
                <IconButton icon={<FiEdit2 />} tooltip="Adjust Stock" onClick={() => alert(`Adjusting stock for ${item.name}`)} />
                <IconButton icon={<FaExchangeAlt />} tooltip="Transfer Stock" onClick={() => alert(`Transferring stock for ${item.name}`)} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <FilterControls
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                searchPlaceholder="Search SKU or Item Name..."
                filters={[{ label: 'Category', value: filterCategory, options: categories.map(c => ({value: c, label: c})), onChange: setFilterCategory }]}
                onAddNew={() => alert("Adding New Stock Item")}
                addNewLabel="Add New Item"
            />
            <Table columns={columns} data={data} renderActions={renderActions} />
        </div>
    );
};

const MaterialIssuanceTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    
    const mirStatuses = ['All', ...new Set(mockMIRs.map(mir => mir.status))];

    const filteredMIRs = useMemo(() => {
        return mockMIRs.filter(mir =>
            (mir.mirNumber.toLowerCase().includes(searchTerm.toLowerCase()) || mir.productionOrderId.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterStatus === 'All' || mir.status === filterStatus)
        );
    }, [searchTerm, filterStatus]);

    const columns = ['MIR Number', 'Prod. Order ID', 'Department', 'Request Date', 'Priority', 'Status'];
    const data = filteredMIRs.map(mir => [
        mir.mirNumber,
        mir.productionOrderId,
        mir.department,
        new Date(mir.requestDate).toLocaleDateString(),
        <PriorityBadge priority={mir.priority} />,
        <StatusBadge status={mir.status} />
    ]);

    const renderActions = (_itemData: any[], index: number) => {
        const mir = filteredMIRs[index];
        return (
            <div className="flex space-x-1 justify-end">
                <IconButton icon={<FiFileText />} tooltip="View Details" onClick={() => alert(`Viewing MIR ${mir.mirNumber}`)} variant="primary"/>
                {mir.status === 'Pending' && <IconButton icon={<MdPlaylistAddCheck />} tooltip="Process & Issue Items" onClick={() => alert(`Processing MIR ${mir.mirNumber}`)} />}
                <IconButton icon={<FiPrinter />} tooltip="Print Issue Slip" onClick={() => alert(`Printing slip for ${mir.mirNumber}`)} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <FilterControls
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                searchPlaceholder="Search MIR# or Prod. Order ID..."
                filters={[{ label: 'Status', value: filterStatus, options: mirStatuses.map(s => ({value: s, label: s})), onChange: setFilterStatus }]}
                onAddNew={() => alert("Creating New Material Issue Request")}
                addNewLabel="New Issue Request"
            />
            <Table columns={columns} data={data} renderActions={renderActions} />
        </div>
    );
};

const QualityControlStoresTab: React.FC = () => {
    // This tab would list items currently in QC, results, etc.
    // For brevity, a placeholder is used.
    const itemsInQC = mockStoreItems.filter(item => item.qcStatus === 'Pending' || item.qcStatus === 'Rejected');
    
    const columns = ['SKU', 'Item Name', 'Batch/Serial', 'Received Date', 'Supplier', 'Current QC Status'];
    const data = itemsInQC.map(item => [
        item.sku,
        item.name,
        item.batchNumber || item.serialNumber || 'N/A',
        new Date(item.lastReceivedDate).toLocaleDateString(),
        item.supplierName || 'N/A',
        <StatusBadge status={item.qcStatus} />
    ]);

    const renderActions = (_itemData: any[], index: number) => {
        const item = itemsInQC[index];
        return (
            <div className="flex space-x-1 justify-end">
                <IconButton icon={<FiEdit2 />} tooltip="Update QC Status" onClick={() => alert(`Updating QC for ${item.name}`)} variant="primary"/>
                <IconButton icon={<FiList />} tooltip="View QC History" onClick={() => alert(`Viewing QC history for ${item.name}`)} />
            </div>
        );
    };
    
    return (
        <div className="space-y-6">
            <div className="p-4 rounded-xl shadow-lg mb-6">
                <h2 className="text-xl font-semibold dark:text-gray-200 text-slate-800">Items Under Quality Control</h2>
                <p className="text-sm dark:text-gray-200 text-slate-500">Manage and update the quality status of received materials.</p>
            </div>
            <Table columns={columns} data={data} renderActions={renderActions} />
        </div>
    );
};

const ReturnsManagementTab: React.FC = () => {
    // Placeholder for returns management.
    // Mock data for returns would be needed (StoreReturn[])
    const mockReturns: StoreReturn[] = [
        { id: 'RET001', returnNumber: 'RTN2024001', returnType: 'To Supplier', referenceDocumentId: 'PO-S001', returnDate: '2024-05-25', returnedBy: 'Store Keeper A', items: [{itemId: 'SITEM-00X', itemName: 'Defective Part X', quantityReturned: 10, reason: 'Damaged on arrival'}], status: 'Pending Inspection'},
        { id: 'RET002', returnNumber: 'RTN2024002', returnType: 'From Production', referenceDocumentId: 'MIR-001', returnDate: '2024-05-26', returnedBy: 'Prod Supervisor B', items: [{itemId: 'SITEM-001', itemName: 'Steel Rods - 10mm', quantityReturned: 5, reason: 'Excess material'}], status: 'Approved'},
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const returnTypes = ['All', ...new Set(mockReturns.map(r => r.returnType))];


    const filteredReturns = useMemo(() => {
        return mockReturns.filter(ret =>
            (ret.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) || ret.referenceDocumentId.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterType === 'All' || ret.returnType === filterType)
        );
    }, [searchTerm, filterType]);


    const columns = ['Return Number', 'Type', 'Reference Doc', 'Return Date', 'Status'];
    const data = filteredReturns.map(r => [
        r.returnNumber,
        r.returnType,
        r.referenceDocumentId,
        new Date(r.returnDate).toLocaleDateString(),
        <StatusBadge status={r.status} />
    ]);

    const renderActions = (_itemData: any[], index: number) => {
        const ret = filteredReturns[index];
        return (
            <div className="flex space-x-1 justify-end">
                <IconButton icon={<FiFileText />} tooltip="View Return Details" onClick={() => alert(`Viewing return ${ret.returnNumber}`)} variant="primary"/>
                {ret.status === 'Pending Inspection' && <IconButton icon={<FiCheckSquare />} tooltip="Process Return" onClick={() => alert(`Processing return ${ret.returnNumber}`)} />}
            </div>
        );
    };


    return (
        <div className="space-y-6">
             <FilterControls
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                searchPlaceholder="Search Return# or Ref Doc..."
                filters={[{ label: 'Return Type', value: filterType, options: returnTypes.map(s => ({value: s, label: s})), onChange: setFilterType }]}
                onAddNew={() => alert("Creating New Return")}
                addNewLabel="New Return"
            />
            <Table columns={columns} data={data} renderActions={renderActions} />
        </div>
    );
};


// Main Stores Page Component
export const StoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  const tabs = [
    { name: 'Dashboard', icon: <FiHome />, component: <StoresDashboardTab /> },
    { name: 'Goods Receiving', icon: <MdInput />, component: <GoodsReceivingTab /> },
    { name: 'Stock Management', icon: <FaBoxes />, component: <StockManagementTab /> },
    { name: 'Material Issuance', icon: <MdOutput />, component: <MaterialIssuanceTab /> },
    { name: 'Quality Control', icon: <FaClipboardCheck />, component: <QualityControlStoresTab /> },
    { name: 'Returns', icon: <FaUndo />, component: <ReturnsManagementTab /> },
  ];

  const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component;

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      {/* Header */}
      <header className="shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <MdStore className="w-10 h-10 text-brand-500 mr-3" />
              <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-200">Stores Operations</h1>
            </div>
            {/* <div className="flex items-center space-x-4">
              <IconButton icon={<FiSearch />} tooltip="Global Search" className="text-slate-500 hover:text-teal-600" />
              <IconButton icon={<FiBell />} tooltip="Notifications" className="text-slate-500 hover:text-teal-600" />
              <div className="relative">
                <img src="https://placehold.co/40x40/14b8a6/ffffff?text=S" alt="User Avatar" className="w-10 h-10 rounded-full cursor-pointer" />
              </div>
            </div> */}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="shadow-sm sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 py-3 overflow-x-auto">
            {tabs.map(tab => (
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm dark:text-gray-200 text-slate-500">
          &copy; {new Date().getFullYear()} Adon Middleware Solutions. All rights reserved.
          <p>Stores Operations Module v1.0</p>
        </div>
      </footer>
    </div>
  );
};
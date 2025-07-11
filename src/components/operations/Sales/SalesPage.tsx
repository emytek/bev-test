import React from 'react';
import { useState, useMemo } from 'react';
// Importing a diverse set of icons suitable for a sales dashboard
import {
    FiBriefcase, FiUsers, FiTrendingUp, FiFileText, FiDollarSign, FiTarget,
    FiPlusCircle, FiEdit, FiEye, FiCreditCard,
    FiMail, FiPhone, FiCheckCircle, FiAlertTriangle, FiDownload, FiTruck
} from 'react-icons/fi'; // Feather Icons
import { FaFileInvoiceDollar, FaChartLine } from 'react-icons/fa'; // Font Awesome
import { MdDashboard, MdPointOfSale, MdQueryStats } from 'react-icons/md'; // Material Design Icons
// import { HiOutlineDocumentReport } from "react-icons/hi"; // Heroicons - not used in provided navItems
import { QuotationsTab } from './SalesOperation'; // Assuming this component exists


// TypeScript Interfaces ( 그대로 유지 )
interface Customer {
    id: string;
    name: string;
    industry?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    accountManager?: string;
    totalSpent: number;
    lastContactDate?: string;
    status: 'Active' | 'Inactive' | 'Lead' | 'Prospect';
    avatarUrl?: string;
}

interface SalesOrder {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    orderDate: string;
    deliveryDate?: string;
    totalAmount: number;
    status: 'Pending Confirmation' | 'Confirmed' | 'Processing' | 'Ready for Dispatch' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Awaiting Payment';
    paymentStatus: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
    productionOrderId?: string; // Link to production
    salesRep: string;
    items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }>;
}

// interface Quotation {
//     id: string;
//     quoteNumber: string;
//     customerId: string;
//     customerName: string;
//     creationDate: string;
//     expiryDate: string;
//     totalAmount: number;
//     status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
//     salesRep: string;
// }

interface SalesOpportunity {
    id: string;
    opportunityName: string;
    customerId: string;
    customerName: string;
    stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
    estimatedValue: number;
    probability?: number; // %
    closeDate: string;
    salesRep: string;
    createdDate: string;
}

// Mock Data ( 그대로 유지 )
const mockCustomers: Customer[] = [
    { id: 'CUST-001', name: 'Innovatech Solutions', industry: 'Technology', email: 'contact@innovatech.com', phone: '555-0101', totalSpent: 150000, lastContactDate: '2024-05-15', status: 'Active', avatarUrl: 'https://placehold.co/60x60/818cf8/ffffff?text=IS', accountManager: 'Alice Wonderland' },
    { id: 'CUST-002', name: 'Global Exports Ltd.', industry: 'Logistics', email: 'info@globalexports.net', phone: '555-0202', totalSpent: 75000, status: 'Active', avatarUrl: 'https://placehold.co/60x60/a78bfa/ffffff?text=GE', accountManager: 'Bob The Builder' },
    { id: 'CUST-003', name: 'GreenLeaf Organics', industry: 'Agriculture', email: 'sales@greenleaf.org', totalSpent: 0, status: 'Lead', avatarUrl: 'https://placehold.co/60x60/7dd3fc/ffffff?text=GO' },
];

const mockSalesOrders: SalesOrder[] = [
    { id: 'SO-001', orderNumber: 'SO2024001', customerId: 'CUST-001', customerName: 'Innovatech Solutions', orderDate: '2024-05-10', deliveryDate: '2024-06-10', totalAmount: 45000, status: 'Processing', paymentStatus: 'Paid', productionOrderId: 'PO-001', salesRep: 'Alice Wonderland', items: [{ productId: 'PROD-A', productName: 'Enterprise Software Suite', quantity: 1, unitPrice: 45000, totalPrice: 45000 }] },
    { id: 'SO-002', orderNumber: 'SO2024002', customerId: 'CUST-002', customerName: 'Global Exports Ltd.', orderDate: '2024-05-20', deliveryDate: '2024-06-20', totalAmount: 22000, status: 'Confirmed', paymentStatus: 'Pending', salesRep: 'Bob The Builder', items: [{ productId: 'PROD-B', productName: 'Logistics Management Module', quantity: 2, unitPrice: 11000, totalPrice: 22000 }] },
];

export const mockOpportunities: SalesOpportunity[] = [
    { id: 'OPP-001', opportunityName: 'Innovatech Upgrade Deal', customerId: 'CUST-001', customerName: 'Innovatech Solutions', stage: 'Proposal', estimatedValue: 60000, probability: 70, closeDate: '2024-06-30', salesRep: 'Alice Wonderland', createdDate: '2024-04-10' },
    { id: 'OPP-002', opportunityName: 'New Client: Alpha Corp', customerId: 'CUST-NEW-01', customerName: 'Alpha Corp (New Lead)', stage: 'Qualification', estimatedValue: 100000, probability: 30, closeDate: '2024-07-15', salesRep: 'Charles Xavier', createdDate: '2024-05-01' },
];

const mockInvoices = [
    { id: 'INV-001', invoiceNumber: 'INV2024-001', salesOrderId: 'SO-001', customerName: 'Innovatech Solutions', invoiceDate: '2024-05-12', dueDate: '2024-06-12', totalAmount: 45000, status: 'Paid', items: [{ productName: 'Enterprise Software Suite', quantity: 1, unitPrice: 45000, totalPrice: 45000 }] },
    { id: 'INV-002', invoiceNumber: 'INV2024-002', salesOrderId: 'SO-002', customerName: 'Global Exports Ltd.', invoiceDate: '2024-05-22', dueDate: '2024-06-22', totalAmount: 22000, status: 'Pending', items: [{ productName: 'Logistics Management Module', quantity: 2, unitPrice: 11000, totalPrice: 22000 }] },
    { id: 'INV-003', invoiceNumber: 'INV2024-003', salesOrderId: 'SO-003', customerName: 'MediCorp Inc.', invoiceDate: '2024-05-24', dueDate: '2024-06-24', totalAmount: 78000, status: 'Paid', items: [{ productName: 'Medical Device Integration', quantity: 1, unitPrice: 78000, totalPrice: 78000 }] },
    { id: 'INV-004', invoiceNumber: 'INV2024-004', salesOrderId: 'SO-004', customerName: 'Urban Designs', invoiceDate: '2024-05-26', dueDate: '2024-06-26', totalAmount: 15000, status: 'Pending', items: [{ productName: 'Retail Analytics Platform', quantity: 1, unitPrice: 15000, totalPrice: 15000 }] },
    { id: 'INV-005', invoiceNumber: 'INV2024-005', salesOrderId: 'SO-006', customerName: 'Global Exports Ltd.', invoiceDate: '2024-05-16', dueDate: '2024-06-16', totalAmount: 50000, status: 'Paid', items: [{ productName: 'SaaS Renewal', quantity: 1, unitPrice: 50000, totalPrice: 50000 }] },
];


// --- UI Components ---

// NavItem (Tab Item) - Styled to match ProductionPage
const NavItem: React.FC<{ icon: React.ReactElement; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-shrink-0 flex items-center px-4 py-3 sm:px-6 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none -mb-px
                 ${isActive
                ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
    >
        {React.cloneElement(icon, { className: `w-5 h-5 mr-2 flex-shrink-0` } as React.SVGProps<SVGSVGElement>)}
        {/* Label always visible, matching ProductionPage */}
        <span className="font-medium text-sm">{label}</span>
    </button>
);

// KPI Card (Sales Theme) - Unchanged from original, but ensure dark mode text is considered if needed
export const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactElement; trend?: string; trendDirection?: 'up' | 'down' | 'neutral'; period?: string; }> =
    ({ title: cardTitle, value, icon, trend, trendDirection = 'neutral', period }) => {
        let trendColor = 'text-slate-500 dark:text-slate-400'; // Added dark mode for trend text
        if (trendDirection === 'up') trendColor = 'text-green-500 dark:text-green-400';
        if (trendDirection === 'down') trendColor = 'text-red-500 dark:text-red-400';

        return (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-indigo-700/50 transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">{cardTitle}</p>
                        <p className="text-3xl font-bold text-brand-500 dark:text-brand-400">{value}</p> {/* Assuming brand-500 has a dark variant or adjust */}
                    </div>
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        {React.cloneElement(icon, { className: "w-6 h-6 text-brand-500 dark:text-brand-400" } as React.SVGProps<SVGSVGElement>)}
                    </div>
                </div>
                {(trend || period) && (
                    <div className="mt-3 flex items-center text-xs">
                        {trend && <span className={`font-semibold ${trendColor} mr-1`}>{trend}</span>}
                        {period && <span className="text-slate-400 dark:text-slate-500">{period}</span>}
                    </div>
                )}
            </div>
        );
    };

// Table (Sales Theme) - Unchanged from original, added dark mode
export const SalesTable: React.FC<{ columns: string[]; data: any[][]; renderActions?: (item: any, index: number) => React.ReactNode; onRowClick?: (item: any, index: number) => void }> =
    ({ columns, data, renderActions, onRowClick }) => (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr className="border-b border-indigo-200 dark:border-indigo-700">
                        {columns.map((col, idx) => (
                            <th key={idx} className="p-4 text-sm font-semibold text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                                {col}
                            </th>
                        ))}
                        {renderActions && <th className="p-4 text-sm font-semibold text-brand-500 dark:text-brand-400 uppercase tracking-wider text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`border-b border-slate-100 dark:border-slate-700 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onRowClick && onRowClick(data[rowIndex], rowIndex)} // Make sure data[rowIndex] is what you expect for onRowClick
                        >
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="p-4 text-sm text-slate-700 dark:text-slate-300">
                                    {typeof cell === 'object' && React.isValidElement(cell) ? cell : String(cell)}
                                </td>
                            ))}
                            {renderActions && (
                                <td className="p-4 text-sm text-slate-700 text-right">
                                    <div className="flex items-center justify-end space-x-1">
                                        {renderActions(mockSalesOrders[rowIndex] || mockCustomers[rowIndex] || mockOpportunities[rowIndex] || mockInvoices[rowIndex], rowIndex)} {/* Ensure you pass the correct item object */}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + (renderActions ? 1 : 0)} className="p-6 text-center text-slate-500 dark:text-slate-400">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

// Status Badge (Sales Theme) - Unchanged from original, added dark mode for general text if no specific class applies
export const SalesStatusBadge: React.FC<{ status: string; type?: 'order' | 'payment' | 'opportunity' | 'customer' | 'quotation' }> = ({ status, type = 'order' }) => {
    let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'; // Default
    const s = status.toLowerCase();

    if (type === 'order') {
        if (s.includes('pending') || s.includes('awaiting')) colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        else if (s.includes('confirmed') || s.includes('processing')) colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        else if (s.includes('shipped') || s.includes('ready')) colorClasses = 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300';
        else if (s.includes('delivered')) colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        else if (s.includes('cancelled')) colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    } else if (type === 'payment') {
        if (s.includes('pending') || s.includes('partially')) colorClasses = 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
        else if (s.includes('paid')) colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        else if (s.includes('overdue')) colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    } else if (type === 'opportunity') {
        if (s.includes('prospecting') || s.includes('qualification')) colorClasses = 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        else if (s.includes('proposal') || s.includes('negotiation')) colorClasses = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
        else if (s.includes('won')) colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        else if (s.includes('lost')) colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    } else if (type === 'customer') {
        if (s.includes('active')) colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        else if (s.includes('inactive')) colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300';
        else if (s.includes('lead') || s.includes('prospect')) colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    } else if (type === 'quotation') {
        if (s.includes('draft')) colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300';
        else if (s.includes('sent')) colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        else if (s.includes('accepted')) colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        else if (s.includes('rejected') || s.includes('expired')) colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }

    return <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${colorClasses}`}>{status}</span>;
};

// Action Button (Sales Theme) - Unchanged from original, check dark mode compatibility
export interface SalesActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactElement;
    variant?: 'primary' | 'secondary' | 'danger' | 'icon';
    children?: React.ReactNode;
}

export const SalesActionButton: React.FC<SalesActionButtonProps> =
    ({ icon, variant = 'secondary', children, className, ...props }) => {
        let baseStyle = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900"; // Added dark mode offset
        if (variant === 'primary') baseStyle += " bg-brand-500 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-brand-400 dark:hover:bg-brand-500 dark:focus:ring-brand-300";
        else if (variant === 'secondary') baseStyle += " bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500 dark:bg-indigo-900/60 dark:text-indigo-300 dark:hover:bg-indigo-800/60 dark:focus:ring-indigo-400";
        else if (variant === 'danger') baseStyle += " bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400";
        else if (variant === 'icon') baseStyle = "p-2 rounded-full text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 focus:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400 dark:focus:ring-indigo-400";

        return (
            <button className={`${baseStyle} ${icon && children ? 'flex items-center justify-center space-x-2' : ''} ${className || ''}`} {...props}>
                {icon && React.cloneElement(icon, { className: `w-4 h-4 ${variant === 'icon' ? 'w-5 h-5' : ''}` } as React.SVGProps<SVGSVGElement>)}
                {children}
            </button>
        );
    };

// --- Tab Content Components for Sales ( 그대로 유지, but ensure they use dark mode compatible components like KpiCard) ---
const SalesDashboardTab: React.FC = () => (
    <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <KpiCard title="Total Revenue" value="$1.2M" icon={<FiDollarSign />} trend="+15.2%" trendDirection="up" period="vs last month" />
            <KpiCard title="New Sales Orders" value="27" icon={<FiTrendingUp />} trend="+5" trendDirection="up" period="this week" />
            <KpiCard title="Active Opportunities" value="42" icon={<FiTarget />} trend="$350K Est. Value" />
            <KpiCard title="Conversion Rate" value="23%" icon={<FaChartLine />} trend="-1.5%" trendDirection="down" period="this quarter" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-brand-500 dark:text-brand-400 mb-4">Sales Performance Over Time</h3>
                <div className="h-72 sm:h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-md text-slate-400 dark:text-slate-500">Chart Placeholder</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-brand-500 dark:text-brand-400 mb-4">Top Opportunities</h3>
                <ul className="space-y-3 max-h-72 sm:max-h-80 overflow-y-auto">
                    {mockOpportunities.slice(0, 4).map(op => (
                        <li key={op.id} className="p-3 bg-indigo-50/50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors">
                            <p className="text-sm font-medium text-brand-500 dark:text-brand-400">{op.opportunityName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{op.customerName} - Est. ${op.estimatedValue.toLocaleString()}</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1.5">
                                <div className="bg-green-500 dark:bg-green-400 h-1.5 rounded-full" style={{ width: `${op.probability || 0}%` }}></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const CustomersTab: React.FC = () => {
    const columns = ['Customer Name', 'Industry', 'Email / Phone', 'Total Spent', 'Status', 'Account Manager'];
    const data = mockCustomers.map(c => [
        <div className="flex items-center">
            <img src={c.avatarUrl || `https://placehold.co/40x40/a5b4fc/312e81?text=${c.name.charAt(0)}`} alt={c.name} className="w-10 h-10 rounded-full mr-3 border border-indigo-200 dark:border-indigo-700" />
            <div>
                <p className="font-medium text-brand-500 dark:text-brand-400">{c.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.id}</p>
            </div>
        </div>,
        c.industry || 'N/A',
        <div><FiMail className="inline mr-1.5 text-slate-400 dark:text-slate-500" />{c.email}<br /><FiPhone className="inline mr-1.5 text-slate-400 dark:text-slate-500" />{c.phone || 'N/A'}</div>,
        `$${c.totalSpent.toLocaleString()}`,
        <SalesStatusBadge status={c.status} type="customer" />,
        c.accountManager || 'N/A'
    ]);
    const renderActions = (item: Customer, _index: number) => { // Ensure 'item' is typed correctly
        return (<>
            <SalesActionButton variant="icon" title="View Details" onClick={() => alert(`Viewing ${item.name}`)}><FiEye /></SalesActionButton>
            <SalesActionButton variant="icon" title="Edit Customer" onClick={() => alert(`Editing ${item.name}`)}><FiEdit /></SalesActionButton>
        </>);
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-brand-500 dark:text-brand-400">Customer Management</h2>
                <SalesActionButton variant="primary" icon={<FiPlusCircle />} onClick={() => alert("Add new customer")}>Add Customer</SalesActionButton>
            </div>
            <SalesTable columns={columns} data={data} renderActions={(rowIndex) => renderActions(mockCustomers[rowIndex], rowIndex)} />
        </div>
    );
};

const SalesOrdersTab: React.FC = () => {
    const columns = ['Order #', 'Customer', 'Order Date', 'Total Amount', 'Status', 'Payment'];
    const data = mockSalesOrders.map(so => [
        <div><p className="font-medium text-brand-500 dark:text-brand-400">{so.orderNumber}</p>{so.productionOrderId && <p className="text-xs text-slate-400 dark:text-slate-500">Prod. Order: {so.productionOrderId}</p>}</div>,
        so.customerName,
        new Date(so.orderDate).toLocaleDateString(),
        `$${so.totalAmount.toLocaleString()}`,
        <SalesStatusBadge status={so.status} type="order" />,
        <SalesStatusBadge status={so.paymentStatus} type="payment" />
    ]);
    const renderActions = (item: SalesOrder, _index: number) => { // Ensure 'item' is typed correctly
        return (<>
            <SalesActionButton variant="icon" title="View Order" onClick={() => alert(`Viewing ${item.orderNumber}`)}><FiEye /></SalesActionButton>
            <SalesActionButton variant="icon" title="Track Order" onClick={() => alert(`Tracking ${item.orderNumber}`)}><FiTruck /></SalesActionButton>
            <SalesActionButton variant="icon" title="Download Invoice" onClick={() => alert(`Downloading invoice for ${item.orderNumber}`)}><FiDownload /></SalesActionButton>
        </>);
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-brand-500 dark:text-brand-400">Sales Orders</h2>
                <SalesActionButton variant="primary" icon={<FiPlusCircle />} onClick={() => alert("Create new sales order")}>New Sales Order</SalesActionButton>
            </div>
            <SalesTable columns={columns} data={data} renderActions={(rowIndex) => renderActions(mockSalesOrders[rowIndex], rowIndex)} />
        </div>
    );
};

const OpportunitiesTab: React.FC = () => {
    const columns = ['Opportunity Name', 'Customer', 'Stage', 'Est. Value', 'Probability', 'Close Date'];
    const data = mockOpportunities.map(opp => [
        opp.opportunityName,
        opp.customerName,
        <SalesStatusBadge status={opp.stage} type="opportunity" />,
        `$${opp.estimatedValue.toLocaleString()}`,
        `${opp.probability || 0}%`,
        new Date(opp.closeDate).toLocaleDateString(),
    ]);

    const renderActions = (item: SalesOpportunity, _index: number) => { // Ensure 'item' is typed correctly
        return (
            <>
                <SalesActionButton variant="icon" title="View Details" onClick={() => alert(`Viewing opportunity ${item.opportunityName}`)}><FiEye /></SalesActionButton>
                <SalesActionButton variant="icon" title="Edit Opportunity" onClick={() => alert(`Editing opportunity ${item.opportunityName}`)}><FiEdit /></SalesActionButton>
            </>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-brand-500 dark:text-brand-400">Sales Opportunities</h2>
                <SalesActionButton variant="primary" icon={<FiPlusCircle />} onClick={() => alert("Create new opportunity")}>Create Opportunity</SalesActionButton>
            </div>
            <SalesTable columns={columns} data={data} renderActions={(rowIndex) => renderActions(mockOpportunities[rowIndex], rowIndex)} />
        </div>
    );
};

const InvoicesTab: React.FC = () => {
    const columns = ['Invoice #', 'Sales Order #', 'Customer', 'Issue Date', 'Due Date', 'Total Amount', 'Status'];
    const data = mockInvoices.map(inv => [
        inv.invoiceNumber,
        inv.salesOrderId,
        inv.customerName,
        new Date(inv.invoiceDate).toLocaleDateString(),
        new Date(inv.dueDate).toLocaleDateString(),
        `$${inv.totalAmount.toLocaleString()}`,
        <SalesStatusBadge status={inv.status} type="payment" />,
    ]);

    const renderActions = (item: typeof mockInvoices[0], _index: number) => { // Typed item based on mockInvoices structure
        return (
            <>
                <SalesActionButton variant="icon" title="View Invoice" onClick={() => alert(`Viewing ${item.invoiceNumber}`)}><FiEye /></SalesActionButton>
                <SalesActionButton variant="icon" title="Download PDF" onClick={() => alert(`Downloading PDF for ${item.invoiceNumber}`)}><FiDownload /></SalesActionButton>
                {item.status === 'Pending' && <SalesActionButton variant="icon" title="Mark as Paid" onClick={() => alert(`Marking ${item.invoiceNumber} as paid`)}><FiCheckCircle /></SalesActionButton>}
            </>
        );
    };

    const totalInvoicedAmount = mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPaidAmount = mockInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-brand-500 dark:text-brand-400">Invoices</h2>
                <SalesActionButton variant="primary" icon={<FiPlusCircle />} onClick={() => alert("Create new invoice")}>Create Invoice</SalesActionButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <KpiCard title="Total Invoiced" value={`$${totalInvoicedAmount.toLocaleString()}`} icon={<FaFileInvoiceDollar />} />
                <KpiCard title="Total Paid" value={`$${totalPaidAmount.toLocaleString()}`} icon={<FiCreditCard />} />
                <KpiCard title="Pending Payments" value={`$${(totalInvoicedAmount - totalPaidAmount).toLocaleString()}`} icon={<FiAlertTriangle />} trend="3 overdue" trendDirection="down" period="current" />
            </div>
            <SalesTable columns={columns} data={data} renderActions={(rowIndex) => renderActions(mockInvoices[rowIndex], rowIndex)} />
        </div>
    );
};

const AnalyticsTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-brand-500 dark:text-brand-400">Sales Analytics</h2>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[400px] flex items-center justify-center text-slate-400 dark:text-slate-500">
                Advanced Analytics Dashboards and Reports will go here.
            </div>
        </div>
    );
};


// Main Sales Page Component
export const SalesPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('Dashboard');
    // Removed mobileMenuOpen state as we are using horizontal scrolling instead of a dropdown

    const navItems = useMemo(() => [
        { name: 'Dashboard', icon: <MdDashboard />, component: <SalesDashboardTab /> },
        { name: 'Customers', icon: <FiUsers />, component: <CustomersTab /> },
        { name: 'Sales Orders', icon: <MdPointOfSale />, component: <SalesOrdersTab /> },
        { name: 'Quotations', icon: <FiFileText />, component: <QuotationsTab /> }, // Assuming QuotationsTab component is defined
        { name: 'Opportunities', icon: <FiTarget />, component: <OpportunitiesTab /> },
        { name: 'Invoices', icon: <FaFileInvoiceDollar />, component: <InvoicesTab /> },
        { name: 'Analytics', icon: <MdQueryStats />, component: <AnalyticsTab /> },
    ], []);

    const ActiveComponent = navItems.find(item => item.name === activeSection)?.component || <div className="p-4">Section not found. Please select a tab.</div>;

    return (
        <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between px-4 p-4 sm:px-6 relative z-20">
                <div className="flex items-center">
                    <FiBriefcase className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 dark:text-gray-200" />
                    <span className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">Sales Management</span>
                </div>
                {/* Removed mobile menu button, as tabs will now always be visible */}
            </header>

            {/* Tab Navigation Bar (Always visible and responsive) */}
            <nav className="flex border-b border-gray-300 dark:border-slate-700 px-2 sm:px-4 overflow-x-auto whitespace-nowrap relative z-10 mt-8 custom-scrollbar">
                {navItems.map(item => (
                    <NavItem
                        key={item.name}
                        icon={item.icon}
                        label={item.name}
                        isActive={activeSection === item.name}
                        onClick={() => setActiveSection(item.name)}
                    />
                ))}
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
                {ActiveComponent}
            </main>
        </div>
    );
};
import { FiAlertTriangle, FiCheckCircle, FiCreditCard, FiDollarSign, FiDownload, FiEdit, FiEye, FiFileText, FiPlusCircle, FiSend, FiTrendingUp, FiXCircle } from "react-icons/fi";
import { KpiCard, mockOpportunities, SalesActionButton, SalesStatusBadge, SalesTable } from "./SalesPage";
import { FaFileInvoiceDollar, FaHandshake, FaMoneyBillAlt } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdPointOfSale } from "react-icons/md";

export const mockInvoices = [
    { id: 'INV-001', invoiceNumber: 'INV2024-001', salesOrderId: 'SO-001', customerName: 'Innovatech Solutions', invoiceDate: '2024-05-12', dueDate: '2024-06-12', totalAmount: 45000, status: 'Paid', items: [{productName: 'Enterprise Software Suite', quantity: 1, unitPrice: 45000, totalPrice: 45000}] },
    { id: 'INV-002', invoiceNumber: 'INV2024-002', salesOrderId: 'SO-002', customerName: 'Global Exports Ltd.', invoiceDate: '2024-05-22', dueDate: '2024-06-22', totalAmount: 22000, status: 'Pending', items: [{productName: 'Logistics Management Module', quantity: 2, unitPrice: 11000, totalPrice: 22000}] },
    { id: 'INV-003', invoiceNumber: 'INV2024-003', salesOrderId: 'SO-003', customerName: 'MediCorp Inc.', invoiceDate: '2024-05-24', dueDate: '2024-06-24', totalAmount: 78000, status: 'Paid', items: [{productName: 'Medical Device Integration', quantity: 1, unitPrice: 78000, totalPrice: 78000}] },
    { id: 'INV-004', invoiceNumber: 'INV2024-004', salesOrderId: 'SO-004', customerName: 'Urban Designs', invoiceDate: '2024-05-26', dueDate: '2024-06-26', totalAmount: 15000, status: 'Pending', items: [{productName: 'Retail Analytics Platform', quantity: 1, unitPrice: 15000, totalPrice: 15000}] },
    { id: 'INV-005', invoiceNumber: 'INV2024-005', salesOrderId: 'SO-006', customerName: 'Global Exports Ltd.', invoiceDate: '2024-05-16', dueDate: '2024-06-16', totalAmount: 50000, status: 'Paid', items: [{productName: 'SaaS Renewal', quantity: 1, unitPrice: 50000, totalPrice: 50000}] },
  ];

  // Add this to your mock data section, e.g., after mockOpportunities
export const mockQuotations = [
    { id: 'QUO-001', quoteNumber: 'QT2024-001', customerId: 'CUST-001', customerName: 'Innovatech Solutions', creationDate: '2024-05-01', expiryDate: '2024-05-31', totalAmount: 55000, status: 'Accepted', salesRep: 'Alice Wonderland' },
    { id: 'QUO-002', quoteNumber: 'QT2024-002', customerId: 'CUST-002', customerName: 'Global Exports Ltd.', creationDate: '2024-05-10', expiryDate: '2024-06-09', totalAmount: 30000, status: 'Sent', salesRep: 'Bob The Builder' },
    { id: 'QUO-003', quoteNumber: 'QT2024-003', customerId: 'CUST-003', customerName: 'GreenLeaf Organics', creationDate: '2024-05-15', expiryDate: '2024-06-14', totalAmount: 12000, status: 'Draft', salesRep: 'Alice Wonderland' },
    { id: 'QUO-004', quoteNumber: 'QT2024-004', customerId: 'CUST-001', customerName: 'Innovatech Solutions', creationDate: '2024-04-20', expiryDate: '2024-05-20', totalAmount: 18000, status: 'Expired', salesRep: 'Alice Wonderland' },
    { id: 'QUO-005', quoteNumber: 'QT2024-005', customerId: 'CUST-002', customerName: 'Global Exports Ltd.', creationDate: '2024-05-25', expiryDate: '2024-06-24', totalAmount: 7500, status: 'Rejected', salesRep: 'Bob The Builder' },
    { id: 'QUO-006', quoteNumber: 'QT2024-006', customerId: 'CUST-001', customerName: 'Innovatech Solutions', creationDate: '2024-05-28', expiryDate: '2024-06-28', totalAmount: 85000, status: 'Draft', salesRep: 'Alice Wonderland' },
  ];

export const OpportunitiesTab: React.FC = () => {
    const columns = ['Opportunity Name', 'Customer', 'Stage', 'Estimated Value', 'Probability', 'Close Date', 'Sales Rep'];
    const data = mockOpportunities.map(opp => [
      <div className="font-medium text-brand-500">{opp.opportunityName}</div>,
      opp.customerName,
      <SalesStatusBadge status={opp.stage} type="opportunity" />,
      `$${opp.estimatedValue.toLocaleString()}`,
      <div className="flex items-center">
        <div className="w-16 bg-slate-200 rounded-full h-1.5 mr-2">
          <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${opp.probability || 0}%` }}></div>
        </div>
        <span className="text-sm text-slate-600">{opp.probability}%</span>
      </div>,
      new Date(opp.closeDate).toLocaleDateString(),
      opp.salesRep,
    ]);
  
    const renderActions = (_itemData: any[], index: number) => {
      const opportunity = mockOpportunities[index];
      return (
        <>
          <SalesActionButton variant="icon" title="View Opportunity" onClick={() => alert(`Viewing ${opportunity.opportunityName}`)}><FiEye /></SalesActionButton>
          <SalesActionButton variant="icon" title="Edit Opportunity" onClick={() => alert(`Editing ${opportunity.opportunityName}`)}><FiEdit /></SalesActionButton>
          {opportunity.stage !== 'Closed Won' && opportunity.stage !== 'Closed Lost' && (
              <SalesActionButton variant="icon" title="Close Opportunity" onClick={() => alert(`Closing ${opportunity.opportunityName}`)}><FiCheckCircle /></SalesActionButton>
          )}
        </>
      );
    };
  
    const totalEstimatedValue = mockOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
    const closedWonValue = mockOpportunities.filter(op => op.stage === 'Closed Won').reduce((sum, opp) => sum + opp.estimatedValue, 0);
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-brand-500">Sales Opportunities</h2>
          <SalesActionButton variant="primary" icon={<FiPlusCircle />} onClick={() => alert("Create new opportunity")}>New Opportunity</SalesActionButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard title="Total Pipeline Value" value={`$${totalEstimatedValue.toLocaleString()}`} icon={<FiDollarSign />} />
          <KpiCard title="Opportunities Won" value={`$${closedWonValue.toLocaleString()}`} icon={<FaHandshake />} trend="+10%" trendDirection="up" period="this quarter" />
          <KpiCard title="Avg. Probability" value={`${(mockOpportunities.reduce((sum, opp) => sum + (opp.probability || 0), 0) / mockOpportunities.length).toFixed(0)}%`} icon={<FiTrendingUp />} />
        </div>
        <SalesTable columns={columns} data={data} renderActions={renderActions} />
      </div>
    );
  };


  export const InvoicesTab: React.FC = () => {
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
  
    const renderActions = (_itemData: any[], index: number) => {
      const invoice = mockInvoices[index];
      return (
        <>
          <SalesActionButton variant="icon" title="View Invoice" onClick={() => alert(`Viewing ${invoice.invoiceNumber}`)}><FiEye /></SalesActionButton>
          <SalesActionButton variant="icon" title="Download PDF" onClick={() => alert(`Downloading PDF for ${invoice.invoiceNumber}`)}><FiDownload /></SalesActionButton>
          {invoice.status === 'Pending' && <SalesActionButton variant="icon" title="Mark as Paid" onClick={() => alert(`Marking ${invoice.invoiceNumber} as paid`)}><FiCheckCircle /></SalesActionButton>}
        </>
      );
    };
  
    const totalInvoicedAmount = mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPaidAmount = mockInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-brand-500">Invoices</h2>
          <SalesActionButton variant="primary" icon={<FiPlusCircle />} onClick={() => alert("Create new invoice")}>Create Invoice</SalesActionButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard title="Total Invoiced" value={`$${totalInvoicedAmount.toLocaleString()}`} icon={<FaFileInvoiceDollar />} />
          <KpiCard title="Total Paid" value={`$${totalPaidAmount.toLocaleString()}`} icon={<FiCreditCard />} />
          <KpiCard title="Pending Payments" value={`$${(totalInvoicedAmount - totalPaidAmount).toLocaleString()}`} icon={<FiAlertTriangle />} trend="3 overdue" trendDirection="down" period="current" />
        </div>
        <SalesTable columns={columns} data={data} renderActions={renderActions} />
      </div>
    );
  };

  export const AnalyticsTab: React.FC = () => {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-brand-500">Sales Analytics & Reports</h2>
          <SalesActionButton variant="secondary" icon={<HiOutlineDocumentReport />} onClick={() => alert("Generate custom report")}>Generate Report</SalesActionButton>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-brand-500 mb-4">Sales by Product Category</h3>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-md text-slate-400">Bar Chart Placeholder</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-brand-500 mb-4">Sales Rep Performance</h3>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              <li className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-md">
                <span className="font-medium text-brand-500">Alice Wonderland</span>
                <span className="text-slate-600 font-semibold">$350,000</span>
              </li>
              <li className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-md">
                <span className="font-medium text-brand-500">Bob The Builder</span>
                <span className="text-slate-600 font-semibold">$180,000</span>
              </li>
              <li className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-md">
                <span className="font-medium text-brand-500">Charles Xavier</span>
                <span className="text-slate-600 font-semibold">$120,000</span>
              </li>
            </ul>
          </div>
        </div>
  
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-brand-500 mb-4">Opportunity Funnel Analysis</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-md text-slate-400">Funnel Chart Placeholder</div>
        </div>
  
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-brand-500 mb-4">Customer Segmentation</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-md text-slate-400">Pie Chart Placeholder (e.g., by industry or status)</div>
        </div>
      </div>
    );
  };

export const QuotationsTab: React.FC = () => {
  const columns = ['Quote #', 'Customer', 'Creation Date', 'Expiry Date', 'Total Amount', 'Status', 'Sales Rep'];
  const data = mockQuotations.map(q => [
    q.quoteNumber,
    q.customerName,
    new Date(q.creationDate).toLocaleDateString(),
    new Date(q.expiryDate).toLocaleDateString(),
    `$${q.totalAmount.toLocaleString()}`,
    <SalesStatusBadge status={q.status} type="opportunity" />, // Using 'opportunity' type for now as it has similar states
    q.salesRep,
  ]);

  const renderActions = (_itemData: any[], index: number) => {
    const quote = mockQuotations[index];
    return (
      <>
        <SalesActionButton variant="icon" title="View Details" onClick={() => alert(`Viewing ${quote.quoteNumber}`)}><FiEye /></SalesActionButton>
        {quote.status === 'Draft' && (
          <SalesActionButton variant="icon" title="Send Quote" onClick={() => alert(`Sending ${quote.quoteNumber}`)}><FiSend /></SalesActionButton>
        )}
        {quote.status === 'Sent' && (
          <>
            <SalesActionButton variant="icon" title="Mark as Accepted" onClick={() => alert(`Marking ${quote.quoteNumber} as accepted`)}><FiCheckCircle /></SalesActionButton>
            <SalesActionButton variant="icon" title="Mark as Rejected" onClick={() => alert(`Marking ${quote.quoteNumber} as rejected`)}><FiXCircle /></SalesActionButton>
          </>
        )}
        {(quote.status === 'Draft' || quote.status === 'Sent') && (
            <SalesActionButton variant="icon" title="Edit Quote" onClick={() => alert(`Editing ${quote.quoteNumber}`)}><FiEdit /></SalesActionButton>
        )}
        {quote.status === 'Accepted' && (
            <SalesActionButton variant="primary" title="Convert to Sales Order" onClick={() => alert(`Converting ${quote.quoteNumber} to SO`)}><MdPointOfSale /></SalesActionButton>
        )}
      </>
    );
  };

  const totalQuotedAmount = mockQuotations.reduce((sum, q) => sum + q.totalAmount, 0);
  const totalAcceptedAmount = mockQuotations.filter(q => q.status === 'Accepted').reduce((sum, q) => sum + q.totalAmount, 0);
  const totalPendingSentAmount = mockQuotations.filter(q => q.status === 'Sent' || q.status === 'Draft').reduce((sum, q) => sum + q.totalAmount, 0);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-brand-500">Quotations</h2>
        <SalesActionButton variant="primary" icon={<FiPlusCircle />} onClick={() => alert("Create new quotation")}>Create Quotation</SalesActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total Quoted" value={`$${totalQuotedAmount.toLocaleString()}`} icon={<FaMoneyBillAlt />} />
        <KpiCard title="Accepted Value" value={`$${totalAcceptedAmount.toLocaleString()}`} icon={<FiCheckCircle />} />
        <KpiCard title="Pending/Draft" value={`$${totalPendingSentAmount.toLocaleString()}`} icon={<FiFileText />} />
      </div>

      <SalesTable columns={columns} data={data} renderActions={renderActions} />
    </div>
  );
};
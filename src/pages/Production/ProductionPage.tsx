// components/production/ProductionPage.tsx
import React, { useState } from "react";
import {
  FiGrid,
  FiList,
  FiActivity,
  FiPackage,
  FiCheckSquare,
  FiBarChart2,
} from "react-icons/fi";
// Assuming these paths are correct relative to your project structure
import ProductionAnalytics from "../../components/operations/ProductionMetrics/tabs/ProductionAnalytics";
import OrdersManagementTab from "../../components/operations/ProductionMetrics/tabs/OrdersManagementTab";
import ProductionDisplayView from "../../components/operations/ProductionMetrics/tabs/ProductionDisplayView";
import ProductionOrderReports from "../../components/operations/ProductionMetrics/reports/ProductionOrderList";
import ApprovedOrdersManagementTab from "../../components/operations/ProductionMetrics/tabs/ApprovedOrderManagement";
import PostedOrdersManagementTab from "../../components/operations/ProductionMetrics/tabs/PostedOrders";
import { MdFactory } from "react-icons/md";

// Import other tab components here...

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  content: React.ElementType;
}

const productionTabs: Tab[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FiGrid,
    content: ProductionAnalytics,
  },
  {
    id: "analytics",
    label: "Reporting & Analytics",
    icon: FiBarChart2,
    content: () => <ProductionOrderReports />,
  },
  {
    id: "activeLines",
    label: "Production Insights",
    icon: FiActivity,
    content: () => <ProductionDisplayView />,
  },
  {
    id: "orders",
    label: "Finished Orders",
    icon: FiList,
    content: OrdersManagementTab,
  },
  {
    id: "materialStaging",
    label: "Approved Orders",
    icon: FiPackage,
    content: () => <ApprovedOrdersManagementTab />,
  },
  {
    id: "qualityAssurance",
    label: "Posted Orders",
    icon: FiCheckSquare,
    content: () => <PostedOrdersManagementTab />,
  },
];

const ProductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(productionTabs[0].id);

  const ActiveTabComponent =
    productionTabs.find((tab) => tab.id === activeTab)?.content ||
    (() => <div className="p-4">Select a tab or content not found.</div>);

  return (
    <div className="flex-1 p-4 sm:p-6 min-h-screen">
      <header className="mb-4 sm:mb-6 flex items-center gap-2">
        <MdFactory className="text-2xl text-gray-700 dark:text-gray-300" />
        <h4 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Production Management
        </h4>
      </header>

      {/* Horizontal Navigation Tabs */}
      <nav className="mb-4 sm:mb-6">
        <div className="flex border-b border-gray-300 overflow-x-auto whitespace-nowrap">
          {productionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center px-4 py-3 sm:px-6 text-sm font-medium transition-colors duration-150 ease-in-out
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } focus:outline-none -mb-px dark:text-gray-200`}
            >
              <tab.icon className="mr-2 h-5 w-5 flex-shrink-0" />{" "}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Active Tab Content */}
      <main>
        <ActiveTabComponent />
      </main>
    </div>
  );
};

export default ProductionPage;

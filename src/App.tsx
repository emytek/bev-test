import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
// import useInstallPrompt from "./hooks/useInstallPrompt";
import Notifications from "./components/settings/Notifications";
import { useLocalNotification } from "./hooks/useLocalNotification";
import { usePushNotifications } from "./hooks/usePushNotifications";
import UserList from "./components/user-management/UserList";
import ForgotPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";
// import Barcode from 'react-barcode'
import RegisterUser from "./components/auth/Onboarding/CreateUser";
// import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ProductionOrderPage from "./components/operations/ProductionMetrics/process-production/ProductionOrder";
import { OrderNumberProvider } from "./context/OrderNoContext";
import PrintDisplay from "./components/operations/ProductionMetrics/print/PrintDisplay";
import ChangePasswordForm from "./components/settings/ChangePassword";
import DisplaySettings from "./components/settings/ThemeDisplay";
import ScannerPage from "./pages/ScanBot/ScannerPage";
import { WarehousePage } from "./components/operations/WareHouseDispatch/Warehouse";
import { StoresPage } from "./components/operations/StoresOperation/Stores";
import { SalesPage } from "./components/operations/Sales/SalesPage";
import ProductionPage from "./pages/Production/ProductionPage";
import FinishedOrderDetailsPage from "./components/operations/ProductionMetrics/FinishedProduction";
import ProductionOrderReports from "./components/operations/ProductionMetrics/reports/ProductionOrderList";
import ProductionOrderDetailsPage from "./components/operations/ProductionMetrics/reports/DetailsPage";
import ApprovedProductionOrderDetailsPage from "./components/operations/ProductionMetrics/ApprovedProduction";
import DeliveryNote from "./components/operations/delivery";
import PickSlipContent from "./components/operations/pickslip/PickslipPage";

// Define types for print targets
type PrintTarget = 'none' | 'deliveryCopy' | 'pickSlip' | 'productionReport';

export default function App() {
  // States for production report print
  const [stockIdToPrint, setStockIdToPrint] = useState<string | null>(null);
  const [completedQuantityToPrint, setCompletedQuantityToPrint] = useState<number | null>(null);
  const [productDescriptionToPrint, setProductDescriptionToPrint] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState<string | null>(null);

  // Global state to control which content is currently being prepared for print
  const [currentPrintTarget, setCurrentPrintTarget] = useState<PrintTarget>('none');

  useLocalNotification();
  usePushNotifications();

  // Handle print for Production Report (triggered from ProductionOrderPage)
  const handlePrintProductionReport = (
    stockId: string,
    completedQuantity: number,
    productDescription: string | null,
    orderNumber: string | null
  ) => {
    setStockIdToPrint(stockId);
    setCompletedQuantityToPrint(completedQuantity);
    setProductDescriptionToPrint(productDescription);
    setOrderNo(orderNumber);
    setCurrentPrintTarget('productionReport'); // Set target to productionReport
    setTimeout(() => {
      window.print();
      setCurrentPrintTarget('none'); // Reset after print dialog
    }, 100);
  };

  // Handle print for Delivery Copy (triggered by a dedicated button in App)
  const handlePrintDeliveryCopy = () => {
    setCurrentPrintTarget('deliveryCopy'); // Set target to deliveryCopy
    setTimeout(() => {
      window.print();
      setCurrentPrintTarget('none'); // Reset after print dialog
    }, 50);
  };

  // Handle print for Pick Slip Copy
  const handlePrintPickSlipCopy = () => {
    setCurrentPrintTarget('pickSlip'); // Set target to pickSlip
    setTimeout(() => {
      window.print();
      setCurrentPrintTarget('none'); // Reset after print dialog
    }, 50);
  };

  return (
    <Router basename="/">
      {/* Main App UI - conditionally hidden when any print job is active */}
      {/* This div contains all your routes and regular application content */}
      <div className={currentPrintTarget !== 'none' ? 'print:hidden' : ''}>
        <AuthProvider>
          <OrderNumberProvider>
            <ScrollToTop />
            <Notifications />
            <Routes>
              {/* Dashboard Layout */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route index path="/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
                <Route path="/finished-orders" element={<ProtectedRoute><FinishedOrderDetailsPage /></ProtectedRoute>} />
                <Route index path="/production-details" element={<ProtectedRoute><ProductionOrderPage setStockIdToPrint={setStockIdToPrint} onPrint={handlePrintProductionReport} /></ProtectedRoute>} />
                <Route index path="/sales-details" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
                <Route path="/production-reports" element={<ProtectedRoute><ProductionOrderReports /></ProtectedRoute>} />
                <Route path="/production-orders/:productionHeaderID/details" element={<ProtectedRoute><ProductionOrderDetailsPage /></ProtectedRoute>} />
                <Route path="/approved-production-order-details/:sapProductionOrderID" element={<ProtectedRoute><ApprovedProductionOrderDetailsPage /></ProtectedRoute>} />

                {/* Settings */}
                <Route path="/change-password" element={<ChangePasswordForm />} />
                <Route path="/theme" element={<DisplaySettings />} />

                {/* Onboarding */}
                <Route path="/create-user" element={<RegisterUser />} />

                {/* Scanner */}
                <Route path="/scanner" element={<ScannerPage />} />

                {/* Delivery Copy and Pick Slip print buttons/viewer */}
                <Route path="/documents-viewer" element={
                  <ProtectedRoute>
                    <div className="flex flex-col items-center p-4 gap-6">
                      <h2 className="text-2xl font-bold mb-4">Document Viewer</h2>
                      <button
                        onClick={handlePrintDeliveryCopy}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        aria-label="Print Delivery Note"
                      >
                        Print Delivery Note
                      </button>

                      <button
                        onClick={handlePrintPickSlipCopy}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        aria-label="Print Pick Slip"
                      >
                        Print Pick Slip
                      </button>
                      {/* Optionally, show previews here if desired */}
                    </div>
                  </ProtectedRoute>
                } />


                <Route path="/warehouse" element={<WarehousePage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/blank" element={<Blank />} />

                {/* Forms */}
                <Route path="/form-elements" element={<FormElements />} />

                {/* Tables */}
                <Route path="/basic-tables" element={<BasicTables />} />

                {/* Ui Elements */}
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/badge" element={<Badges />} />
                <Route path="/buttons" element={<Buttons />} />
                <Route path="/images" element={<Images />} />
                <Route path="/videos" element={<Videos />} />

                {/* Charts */}
                <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} />

                {/* User management */}
                <Route path="/user-list" element={<UserList />} />
                <Route path="/profile" element={<UserProfiles />} />
              </Route>

              {/* Auth Layout */}
              <Route path="/" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route path="/delivery" element={<DeliveryNote />} />

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OrderNumberProvider>
        </AuthProvider>
      </div>

      {/* Production Report Print Section - conditionally rendered and styled */}
      <div
        id="print-section"
        className={`print-area ${currentPrintTarget === 'productionReport' ? 'is-active-print-target' : ''}`}
      >
        <PrintDisplay
          stockIdToPrint={stockIdToPrint}
          completedQuantityToPrint={completedQuantityToPrint}
          productDescriptionToPrint={productDescriptionToPrint}
          orderNo={orderNo}
        />
      </div>

      {/* Delivery Copy Print Section - conditionally rendered and styled */}
      <div
        id="printable-delivery-copy-section"
        className={`print-area ${currentPrintTarget === 'deliveryCopy' ? 'is-active-print-target' : ''}`}
      >
        <DeliveryNote />
      </div>

      {/* Pick Slip Print Section - conditionally rendered and styled */}
      <div
        id="printable-pick-slip-section"
        className={`print-area ${currentPrintTarget === 'pickSlip' ? 'is-active-print-target' : ''}`}
      >
        {/* <PickSlipPrintableContent /> */}
        <PickSlipContent />
      </div>
    </Router>
  );
}


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
import Calendar from "./pages/Calendar";
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
import Production from "./pages/Production";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ProductionOrderPage from "./components/operations/ProductionMetrics/process-production/ProductionOrder";
import { OrderNumberProvider } from "./context/OrderNoContext";
import PrintDisplay from "./components/operations/ProductionMetrics/print/PrintDisplay";
import ProductionOrderList from "./components/operations/ProductionMetrics/reports/ProductionOrderList";
import ChangePasswordForm from "./components/settings/ChangePassword";
import DisplaySettings from "./components/settings/ThemeDisplay";
import ScannerPage from "./pages/ScanBot/ScannerPage";

export default function App() {
  // const { promptVisible, showInstallPrompt } = useInstallPrompt();
  const [stockIdToPrint, setStockIdToPrint] = useState<string | null>(null);
  const [completedQuantityToPrint, setCompletedQuantityToPrint] = useState<
    number | null
  >(null);
  const [productDescriptionToPrint, setProductDescriptionToPrint] = useState<
    string | null
  >(null);

  useLocalNotification();
  usePushNotifications();

  const handlePrint = (
    stockId: string,
    completedQuantity: number,
    productDescription: string | null
  ) => {
    setStockIdToPrint(stockId);
    setCompletedQuantityToPrint(completedQuantity);
    setProductDescriptionToPrint(productDescription);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      <div className="print:hidden">
        <Router>
          <AuthProvider>
            <OrderNumberProvider>
              <ScrollToTop />
              <Notifications />
              <Routes>
                {/* Dashboard Layout */}
                <Route element={<AppLayout />}>
                  <Route
                    path="/dashboard"
                    element={
                      // <ProtectedRoute>
                        <Home />
                      // </ProtectedRoute>
                    }
                  />
                  {/* Production */}
                  <Route
                    index
                    path="/production"
                    element={
                      // <ProtectedRoute>
                        <Production />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    index
                    path="/production-details"
                    element={
                      // <ProtectedRoute>
                        <ProductionOrderPage
                          setStockIdToPrint={setStockIdToPrint}
                          onPrint={handlePrint}
                        />
                      // </ProtectedRoute>
                    }
                  />

                  <Route
                    index
                    path="/reports"
                    element={
                      // <ProtectedRoute>
                        <ProductionOrderList />
                      // </ProtectedRoute>
                    }
                  />

                  {/* Settings */}
                  <Route
                    path="/change-password"
                    element={<ChangePasswordForm />}
                  />
                  <Route path="/theme" element={<DisplaySettings />} />

                  {/* Scanner */}
                  <Route path="/scanner" element={<ScannerPage />} />

                  <Route path="/warehouse" element={<UserProfiles />} />
                  <Route path="/stores" element={<Calendar />} />
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

                {/* Onboarding */}
                <Route path="/create-user" element={<RegisterUser />} />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OrderNumberProvider>
          </AuthProvider>
        </Router>
        {/* {promptVisible && (
        <button onClick={showInstallPrompt} className="p-4">
          Install PWA
        </button>
      )} */}

        {/* <div className="p-4 flex justify-center items-center">
   

      <BarcodeGenerator/>
      <h1>Testing...</h1>
      <input type="text" value={text} onChange={generateBarCode} />
      
      {!scannedCode ? (
        <BarcodeScanner onScan={setScannedCode} onError={(err) => console.error(err)} />
      ) : (
        <div className="p-4 bg-green-200 rounded-md">
          <p>Scanned Code: {scannedCode}</p>
          <button
            onClick={() => setScannedCode(null)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Scan Again
          </button>
        </div>
      )}
    </div> */}
      </div>

      {/* <div
        id="print-section"
        className="print:block hidden print:!block print:absolute print:top-0 print:left-0 print:bg-white print:text-black w-full p-4 sm:p-6 md:p-8 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto print:w-full print:h-full print:max-w-full print:mx-0"
      >
        <PrintDisplay
          stockIdToPrint={stockIdToPrint}
          completedQuantityToPrint={completedQuantityToPrint}
          productDescriptionToPrint={productDescriptionToPrint}
        />
      </div> */}
      <div
        id="print-section"
        className="print:!block hidden print:absolute print:top-0 print:left-0 print:bg-white print:text-black w-full p-4 sm:p-6 md:p-8 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto print:w-full print:h-full print:max-w-full print:mx-0"
      >
        <PrintDisplay
          stockIdToPrint={stockIdToPrint}
          completedQuantityToPrint={completedQuantityToPrint}
          productDescriptionToPrint={productDescriptionToPrint}
        />
      </div>
    </>
  );
}

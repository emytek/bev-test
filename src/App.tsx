import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Notifications from "./components/Notifications";
import { useLocalNotification } from "./hooks/useLocalNotification";
import { usePushNotifications } from "./hooks/usePushNotifications";
// import { useState } from "react";
// import BarcodeScanner from "./components/BarcodeScanner";
// import ScannerBot from "./components/Scanner";
// import CreateUserForm from "./components/auth/Onboarding/CreateUser";
import UserList from "./components/user-management/UserList";
import ForgotPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";
// import Barcode from 'react-barcode'
import RegisterUser from "./components/auth/Onboarding/CreateUser";
import Production from "./pages/Production";
import ProductionOrderLookup from "./components/operations/ProductionMetrics/ProductionOrder";
import ProductionOrderMetaDataLookup from "./components/operations/ProductionMetrics/ProductionOrderMetaData";


export default function App() {
  // const { promptVisible, showInstallPrompt } = useInstallPrompt();
  // const [scannedCode, setScannedCode] = useState<string | null>(null);
  // const [text, setText] = useState<string>(""); 

  useLocalNotification();
  usePushNotifications();

  // const generateBarCode = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setText(e.target.value);
  // };

  return (
    <>
      <Router>
        <ScrollToTop />
        <Notifications />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route index path="/production" element={<Production />} />
            <Route index path="/production-details" element={<ProductionOrderLookup />} />
            <Route index path="/production-info" element={<ProductionOrderMetaDataLookup />} />

            {/* Others Page */}
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
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Onboarding */}
          <Route path="/create-user" element={<RegisterUser />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* {promptVisible && (
        <button onClick={showInstallPrompt} className="p-4">
          Install PWA
        </button>
      )} */}
  
      {/* <div className="p-4 flex justify-center items-center"> */}
      {/* <ScannerBot />

      <Barcode value="emmy" /> */}
      {/* <h1>Testing...</h1>
      <input type="text" value={text} onChange={generateBarCode} /> */}
      
      {/* {!scannedCode ? (
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
      )} */}
    {/* </div> */}
    </>
  );
}

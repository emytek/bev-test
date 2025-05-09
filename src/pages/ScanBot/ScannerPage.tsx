// import { useState } from "react";

// import { BiBarcodeReader } from "react-icons/bi";
// import BarcodeScanner from "../../components/settings/BarcodeScanner";

// const ScannerPage = () => {
//   const [scannedCode, setScannedCode] = useState<string | null>(null);
//   const [showScanner, setShowScanner] = useState<boolean>(true);

//   const handleScan = (code: string) => {
//     setScannedCode(code);
//     setShowScanner(false);
//   };

//   const resetScanner = () => {
//     setScannedCode(null);
//     setShowScanner(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col items-center justify-center p-6">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 space-y-6">
//         <div className="flex items-center gap-3 text-blue-600">
//           <BiBarcodeReader size={24} />
//           <h1 className="text-lg font-semibold">Barcode Scanner</h1>
//         </div>

//         {showScanner ? (
//           <BarcodeScanner
//             onScan={handleScan}
//             onError={(err) => console.error(err)}
//           />
//         ) : (
//           <div className="text-center space-y-4">
//             <p className="text-lg text-gray-800">
//               <span className="font-medium text-blue-600">Scanned Code:</span>
//               <br />
//               <span className="font-mono text-xl break-words">{scannedCode}</span>
//             </p>
//             <button
//               onClick={resetScanner}
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition"
//             >
//               Scan Again
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ScannerPage;



import { useState, useCallback, useEffect } from "react";
import { BiBarcodeReader } from "react-icons/bi";
import { BsCameraFill } from "react-icons/bs";
import BarcodeScanner from "../../components/settings/BarcodeScanner";

const ScannerPage = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(true);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleScan = useCallback((code: string) => {
    setScannedCode(code);
    setShowScanner(false);
  }, [setScannedCode, setShowScanner]);

  const resetScanner = useCallback(() => {
    setScannedCode(null);
    setShowScanner(true);
  }, [setScannedCode, setShowScanner]);

  const switchCamera = useCallback(() => {
    const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    setCurrentCameraId(availableCameras[nextIndex].deviceId);
  }, [availableCameras, currentCameraId]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        // console.log(availableCameras, "CAMS:::") // Removed console.log for production

        // On small screens, try to default to the back camera
        if (isSmallScreen) {
          for (const device of videoDevices) {
            const label = device.label.toLowerCase();
            if (label.includes("back") || label.includes("rear")) {
              setCurrentCameraId(device.deviceId);
              return;
            }
          }
          // If no back camera found explicitly, use the first one
          if (videoDevices.length > 0 && !currentCameraId) {
            setCurrentCameraId(videoDevices[0].deviceId);
          }
        } else if (videoDevices.length > 0 && !currentCameraId) {
          // On larger screens, default to the first available camera if not already set
          setCurrentCameraId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error enumerating video devices:", error);
      }
    };

    getCameras();
  }, [isSmallScreen, setCurrentCameraId, setAvailableCameras]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Cleanup listener
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSmallScreen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex flex-col items-center justify-center py-12 px-6 sm:px-12">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-6 px-8 sm:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BiBarcodeReader size={32} />
            <h1 className="text-xl font-semibold tracking-tight">
              {showScanner ? "Scan Barcode" : "Scan Successful"}
            </h1>
          </div>
          {!showScanner && (
            <span className="text-sm text-indigo-100">Tap "Scan Again" to continue</span>
          )}
        </div>
        <div className="p-8 space-y-6 relative">
          {availableCameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              <BsCameraFill size={20} />
            </button>
          )}
          {showScanner ? (
            <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
              <BarcodeScanner
                onScan={handleScan}
                onError={(err) => console.error("Scanner Error:", err)}
                preferredCameraId={currentCameraId}
              />
              <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
              <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2">
                Point camera at barcode
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-16 h-16 text-green-500 rounded-full bg-green-100 p-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <p className="mt-4 text-lg text-gray-800">
                  <span className="font-medium text-brand-500">Scanned Code:</span>
                  <br />
                  <span className="font-mono text-xl break-words">{scannedCode}</span>
                </p>
              </div>
              <button
                onClick={resetScanner}
                className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                <BiBarcodeReader className="inline-block mr-2" />
                Scan Again
              </button>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Need help? <a href="#" className="text-brand-500 hover:underline">Contact Support</a>
                </p>
                <p className="mt-1">Ensure the barcode is well-lit and within the frame.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
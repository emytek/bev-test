
// import { useState, useCallback, useEffect } from "react";
// import { BiBarcodeReader } from "react-icons/bi";
// import { BsCameraFill } from "react-icons/bs";
// import BarcodeScanner from "../../components/settings/BarcodeScanner";

// const ScannerPage = () => {
//   const [scannedCode, setScannedCode] = useState<string | null>(null);
//   const [showScanner, setShowScanner] = useState<boolean>(true);
//   const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
//   const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
//   const [isSmallScreen, setIsSmallScreen] = useState(false);

//   const handleScan = useCallback((code: string) => {
//     setScannedCode(code);
//     setShowScanner(false);
//   }, [setScannedCode, setShowScanner]);

//   const resetScanner = useCallback(() => {
//     setScannedCode(null);
//     setShowScanner(true);
//   }, [setScannedCode, setShowScanner]);

//   const switchCamera = useCallback(() => {
//     const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
//     const nextIndex = (currentIndex + 1) % availableCameras.length;
//     setCurrentCameraId(availableCameras[nextIndex].deviceId);
//   }, [availableCameras, currentCameraId]);

//   useEffect(() => {
//     const getCameras = async () => {
//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const videoDevices = devices.filter((device) => device.kind === 'videoinput');
//         setAvailableCameras(videoDevices);
//         // console.log(availableCameras, "CAMS:::") // Removed console.log for production

//         // On small screens, try to default to the back camera
//         if (isSmallScreen) {
//           for (const device of videoDevices) {
//             const label = device.label.toLowerCase();
//             if (label.includes("back") || label.includes("rear")) {
//               setCurrentCameraId(device.deviceId);
//               return;
//             }
//           }
//           // If no back camera found explicitly, use the first one
//           if (videoDevices.length > 0 && !currentCameraId) {
//             setCurrentCameraId(videoDevices[0].deviceId);
//           }
//         } else if (videoDevices.length > 0 && !currentCameraId) {
//           // On larger screens, default to the first available camera if not already set
//           setCurrentCameraId(videoDevices[0].deviceId);
//         }
//       } catch (error) {
//         console.error("Error enumerating video devices:", error);
//       }
//     };

//     getCameras();
//   }, [isSmallScreen, setCurrentCameraId, setAvailableCameras]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 768); // Adjust breakpoint as needed
//     };

//     // Initial check
//     handleResize();

//     // Listen for resize events
//     window.addEventListener('resize', handleResize);

//     // Cleanup listener
//     return () => window.removeEventListener('resize', handleResize);
//   }, [setIsSmallScreen]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex flex-col items-center justify-center py-12 px-6 sm:px-12">
//       <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-6 px-8 sm:px-10 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <BiBarcodeReader size={32} />
//             <h1 className="text-xl font-semibold tracking-tight">
//               {showScanner ? "Scan Barcode" : "Scan Successful"}
//             </h1>
//           </div>
//           {/* {!showScanner && (
//             <span className="text-sm text-indigo-100">Tap "Scan Again" to continue</span>
//           )} */}
//         </div>
//         <div className="p-8 space-y-6 relative">
//           {availableCameras.length > 1 && (
//             <button
//               onClick={switchCamera}
//               className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
//             >
//               <BsCameraFill size={20} />
//             </button>
//           )}
//           {showScanner ? (
//             <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
//               <BarcodeScanner
//                 onScan={handleScan}
//                 onError={(err) => console.error("Scanner Error:", err)}
//                 preferredCameraId={currentCameraId}
//               />
//               <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
//               <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2">
//                 Point camera at barcode
//               </p>
//             </div>
//           ) : (
//             <div className="text-center space-y-6">
//               <div className="flex flex-col items-center justify-center">
//                 <svg
//                   className="w-16 h-16 text-green-500 rounded-full bg-green-100 p-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5 13l4 4L19 7"
//                   ></path>
//                 </svg>
//                 <p className="mt-4 text-lg text-gray-800">
//                   <span className="font-medium text-brand-500">Scanned Code:</span>
//                   <br />
//                   <span className="font-mono text-xl break-words">{scannedCode}</span>
//                 </p>
//               </div>
//               <button
//                 onClick={resetScanner}
//                 className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
//               >
//                 <BiBarcodeReader className="inline-block mr-2" />
//                 Scan Again
//               </button>
//               <div className="mt-4 text-sm text-gray-500">
//                 <p>
//                   Need help? <a href="#" className="text-brand-500 hover:underline">Contact Support</a>
//                 </p>
//                 <p className="mt-1">Ensure the barcode is well-lit and within the frame.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScannerPage;



// import { useState, useCallback, useEffect } from "react";
// import { BiBarcodeReader } from "react-icons/bi";
// import { BsCameraFill } from "react-icons/bs";
// import BarcodeScanner from "../../components/settings/BarcodeScanner";

// const ScannerPage = () => {
//   const [scannedCode, setScannedCode] = useState<string | null>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(true); // Control scanning state
//   const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
//   const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
//   const [isSmallScreen, setIsSmallScreen] = useState(false);

//   const handleScan = useCallback((code: string) => {
//     setScannedCode(code);
//     setIsScanning(false); // Stop scanning after a successful scan
//   }, [setScannedCode, setIsScanning]);

//   const resetScanner = useCallback(() => {
//     setScannedCode(null);
//     setIsScanning(true); // Start scanning again
//   }, [setScannedCode, setIsScanning]);

//   const switchCamera = useCallback(() => {
//     const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
//     const nextIndex = (currentIndex + 1) % availableCameras.length;
//     setCurrentCameraId(availableCameras[nextIndex].deviceId);
//   }, [availableCameras, currentCameraId]);

//   useEffect(() => {
//     const getCameras = async () => {
//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const videoDevices = devices.filter((device) => device.kind === 'videoinput');
//         setAvailableCameras(videoDevices);

//         // On small screens, try to default to the back camera
//         if (isSmallScreen) {
//           for (const device of videoDevices) {
//             const label = device.label.toLowerCase();
//             if (label.includes("back") || label.includes("rear")) {
//               setCurrentCameraId(device.deviceId);
//               return;
//             }
//           }
//           if (videoDevices.length > 0 && !currentCameraId) {
//             setCurrentCameraId(videoDevices[0].deviceId);
//           }
//         } else if (videoDevices.length > 0 && !currentCameraId) {
//           // On larger screens, default to the first available camera if not already set
//           setCurrentCameraId(videoDevices[0].deviceId);
//         } else if (videoDevices.length > 0 && !currentCameraId && isSmallScreen) {
//           setCurrentCameraId(videoDevices[0].deviceId);
//         }
//       } catch (error) {
//         console.error("Error enumerating video devices:", error);
//       }
//     };

//     getCameras();
//   }, [isSmallScreen, setCurrentCameraId, setAvailableCameras]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 768); // Adjust breakpoint as needed
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [setIsSmallScreen]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex flex-col items-center justify-center py-12 px-6 sm:px-12">
//       <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-6 px-8 sm:px-10 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <BiBarcodeReader size={32} />
//             <h1 className="text-xl font-semibold tracking-tight">
//               {isScanning ? "Scan Barcode" : "Scan Successful"}
//             </h1>
//           </div>
//         </div>
//         <div className="p-8 space-y-6 relative">
//           {availableCameras.length > 1 && isScanning && (
//             <button
//               onClick={switchCamera}
//               className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
//             >
//               <BsCameraFill size={20} />
//             </button>
//           )}
//           {isScanning ? (
//             <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
//               <BarcodeScanner
//                 onScan={handleScan}
//                 onError={(err) => console.error("Scanner Error:", err)}
//                 preferredCameraId={currentCameraId}
//                 isScanning={isScanning} // Pass the scanning state
//               />
//               <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
//               <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2">
//                 Point camera at barcode
//               </p>
//             </div>
//           ) : (
//             <div className="text-center space-y-6">
//               <div className="flex flex-col items-center justify-center">
//                 <svg
//                   className="w-16 h-16 text-green-500 rounded-full bg-green-100 p-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5 13l4 4L19 7"
//                   ></path>
//                 </svg>
//                 <p className="mt-4 text-lg text-gray-800">
//                   <span className="font-medium text-brand-500">Scanned Code:</span>
//                   <br />
//                   <span className="font-mono text-xl break-words">{scannedCode}</span>
//                 </p>
//               </div>
//               <button
//                 onClick={resetScanner}
//                 className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
//               >
//                 <BiBarcodeReader className="inline-block mr-2" />
//                 Scan Again
//               </button>
//               <div className="mt-4 text-sm text-gray-500">
//                 <p>
//                   Need help? <a href="#" className="text-brand-500 hover:underline">Contact Support</a>
//                 </p>
//                 <p className="mt-1">Ensure the barcode is well-lit and within the frame.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScannerPage;



import { useState, useCallback, useEffect, useRef } from "react";
import { BiBarcodeReader } from "react-icons/bi";
import { BsCameraFill } from "react-icons/bs";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

const ScannerPage = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);
  const [scanError, setScanError] = useState<string | Error | null>(null); // Explicit union type

  const handleScan = useCallback((code: string) => {
    setScannedCode(code);
    setIsScanning(false);
  }, [setScannedCode, setIsScanning]);

  const resetScanner = useCallback(() => {
    setScannedCode(null);
    setScanError(null);
    setIsScanning(true);
  }, [setScannedCode, setIsScanning, setScanError]);

  const switchCamera = useCallback(() => {
    const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    setCurrentCameraId(availableCameras[nextIndex].deviceId);
  }, [availableCameras, currentCameraId]);

  const startScanner = useCallback(async (deviceId?: string) => {
    if (!videoRef.current || !codeReaderRef.current || !isScanning) {
      scannerControls?.stop();
      setScannerControls(null);
      return;
    }

    try {
      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        deviceId ? deviceId : currentCameraId!,
        videoRef.current,
        (result) => {
          if (result) {
            handleScan(result.getText());
          }
        }
      );
      setScannerControls(controls);
    } catch (error: unknown) { // Explicitly type the caught error as unknown
      console.error("Error starting scanner:", error);
      if (typeof error === 'string') {
        setScanError(error);
      } else if (error instanceof Error) {
        setScanError(error);
      } else {
        setScanError(new Error("An unknown error occurred while starting the scanner."));
      }
    }
  }, [currentCameraId, handleScan, isScanning, scannerControls]);

  const stopScanner = useCallback(() => {
    scannerControls?.stop();
    setScannerControls(null);
  }, [scannerControls]);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);

        let initialCameraId: string | undefined;
        if (isSmallScreen) {
          const backCamera = videoDevices.find(device =>
            device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
          );
          initialCameraId = backCamera?.deviceId || videoDevices[0]?.deviceId;
        } else {
          initialCameraId = videoDevices[0]?.deviceId;
        }
        setCurrentCameraId(initialCameraId);
      } catch (error: unknown) {
        console.error("Error enumerating video devices:", error);
        if (typeof error === 'string') {
          setScanError(error);
        } else if (error instanceof Error) {
          setScanError(error);
        } else {
          setScanError(new Error("An unknown error occurred while enumerating devices."));
        }
      }
    };

    getCameras();

    return () => {
      stopScanner();
      codeReaderRef.current = null;
    };
  }, [isSmallScreen, stopScanner]);

  useEffect(() => {
    if (currentCameraId && isScanning) {
      startScanner(currentCameraId);
    } else {
      stopScanner();
    }
  }, [currentCameraId, isScanning, startScanner, stopScanner]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSmallScreen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex flex-col items-center justify-center py-12 px-6 sm:px-12">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-6 px-8 sm:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BiBarcodeReader size={32} />
            <h1 className="text-xl font-semibold tracking-tight">
              {isScanning ? "Scan Barcode!" : scannedCode ? "Scan Successful" : "Ready to Scan"}
            </h1>
          </div>
        </div>
        <div className="p-8 space-y-6 relative">
          {availableCameras.length > 1 && isScanning && (
            <button
              onClick={switchCamera}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              <BsCameraFill size={20} />
            </button>
          )}
          {isScanning ? (
            <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
              <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2">
                Point camera at barcode
              </p>
              {scanError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 text-white rounded-md">
                  <p>Error: Could not start camera.</p>
                  {typeof scanError === 'string' && <p className="ml-2">{scanError}</p>}
                  {scanError instanceof Error && <p className="ml-2">{scanError.message}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              {scannedCode ? (
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
              ) : (
                <p className="text-gray-600">Ready to scan</p>
              )}
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
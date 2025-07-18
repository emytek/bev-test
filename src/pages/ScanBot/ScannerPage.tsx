
import { useState, useCallback, useEffect } from "react";
import { BiBarcodeReader } from "react-icons/bi";
import { BsCameraFill } from "react-icons/bs";
import BarcodeScannerComponent from "../../components/settings/BarcodeScanner";

const ScannerPage = () => {
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [scanAgain, setScanAgain] = useState<boolean>(false);
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
  
    const handleScan = useCallback((code: string) => {
      setScannedCode(code);
      setScanAgain(false); // Stop scanning after a successful scan
    }, [setScannedCode, setScanAgain]);
  
    const resetScanner = useCallback(() => {
      setScannedCode(null);
      setScanAgain(true); // Trigger a new scan (will remount BarcodeScanner)
    }, [setScannedCode, setScanAgain]);
  
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
  
          if (isSmallScreen) {
            const backCamera = videoDevices.find(device =>
              device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
            );
            setCurrentCameraId(backCamera?.deviceId || videoDevices[0]?.deviceId);
          } else if (videoDevices.length > 0 && !currentCameraId) {
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
                {scanAgain ? "Scan Barcode" : scannedCode ? "Scan Successful" : "Ready to Scan"}
              </h1>
            </div>
          </div>
          <div className="p-8 space-y-6 relative">
            {availableCameras.length > 1 && scanAgain && (
              <button
                onClick={switchCamera}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              >
                <BsCameraFill size={20} />
              </button>
            )}
            {scanAgain ? (
              <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
                <BarcodeScannerComponent
                  key={currentCameraId} // Force remount on camera change as well
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



  // import { useState, useCallback, useEffect } from "react";
  // import { BiBarcodeReader } from "react-icons/bi";
  // import { BsCameraFill } from "react-icons/bs";
  // import BarcodeScannerComponent from "../../components/settings/BarcodeScanner";
  
  // const ScannerPage = () => {
  //     // Change scannedCode to an array to store multiple scanned codes
  //     const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  //     const [scanAgain, setScanAgain] = useState<boolean>(true); // Start with scanning active
  //     const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  //     const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
  //     const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  //     const handleScan = useCallback((code: string) => {
  //         setScannedCodes(prevCodes => {
  //             // Only add if the code isn't already in the list (optional, depends on your requirements)
  //             if (!prevCodes.includes(code)) {
  //                 return [...prevCodes, code];
  //             }
  //             return prevCodes;
  //         });
  //         // You might still want to show a brief success state or just keep scanning
  //         // For continuous scanning, you don't need to set scanAgain to false here.
  //         // If you want to pause after each scan and require a 'scan again' click, keep the line below:
  //         // setScanAgain(false);
  //     }, []); // No need to depend on setScannedCodes as it's provided by React
  
  //     const resetScanner = useCallback(() => {
  //         setScannedCodes([]); // Clear all scanned codes
  //         setScanAgain(true); // Trigger a new scan
  //     }, []); // No need to depend on setScannedCodes or setScanAgain
  
  //     const switchCamera = useCallback(() => {
  //         const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
  //         const nextIndex = (currentIndex + 1) % availableCameras.length;
  //         setCurrentCameraId(availableCameras[nextIndex].deviceId);
  //     }, [availableCameras, currentCameraId]);
  
  //     useEffect(() => {
  //         const getCameras = async () => {
  //             try {
  //                 const devices = await navigator.mediaDevices.enumerateDevices();
  //                 const videoDevices = devices.filter((device) => device.kind === 'videoinput');
  //                 setAvailableCameras(videoDevices);
  
  //                 if (isSmallScreen) {
  //                     const backCamera = videoDevices.find(device =>
  //                         device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
  //                     );
  //                     setCurrentCameraId(backCamera?.deviceId || videoDevices[0]?.deviceId);
  //                 } else if (videoDevices.length > 0 && !currentCameraId) {
  //                     setCurrentCameraId(videoDevices[0].deviceId);
  //                 }
  //             } catch (error) {
  //                 console.error("Error enumerating video devices:", error);
  //             }
  //         };
  
  //         getCameras();
  //     }, [isSmallScreen, setCurrentCameraId, setAvailableCameras]);
  
  //     useEffect(() => {
  //         const handleResize = () => {
  //             setIsSmallScreen(window.innerWidth < 768);
  //         };
  //         handleResize();
  //         window.addEventListener('resize', handleResize);
  //         return () => window.removeEventListener('resize', handleResize);
  //     }, [setIsSmallScreen]);
  
  //     return (
  //         <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 flex flex-col items-center justify-center py-12 px-6 sm:px-12">
  //             <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
  //                 <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-6 px-8 sm:px-10 flex items-center justify-between">
  //                     <div className="flex items-center gap-4">
  //                         <BiBarcodeReader size={32} />
  //                         <h1 className="text-xl font-semibold tracking-tight">
  //                             {scannedCodes.length > 0 ? `Scanned (${scannedCodes.length})` : "Scan Barcode"}
  //                         </h1>
  //                     </div>
  //                 </div>
  //                 <div className="p-8 space-y-6 relative">
  //                     {availableCameras.length > 1 && scanAgain && (
  //                         <button
  //                             onClick={switchCamera}
  //                             className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
  //                         >
  //                             <BsCameraFill size={20} />
  //                         </button>
  //                     )}
  //                     {scanAgain ? (
  //                         <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
  //                             <BarcodeScannerComponent
  //                                 key={currentCameraId} // Force remount on camera change as well
  //                                 onScan={handleScan}
  //                                 onError={(err) => console.error("Scanner Error:", err)}
  //                                 preferredCameraId={currentCameraId}
  //                             />
  //                             <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
  //                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
  //                             <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2">
  //                                 Point camera at barcode
  //                             </p>
  //                         </div>
  //                     ) : null} {/* Only show scanner if scanAgain is true */}
  
  //                     {scannedCodes.length > 0 && (
  //                         <div className="mt-6">
  //                             <h2 className="text-lg font-semibold text-gray-700 mb-3">Scanned Barcodes:</h2>
  //                             <ul className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
  //                                 {scannedCodes.map((code, index) => (
  //                                     <li key={index} className="py-1 px-2 border-b border-gray-100 last:border-b-0 text-gray-800 font-mono text-sm break-all">
  //                                         {code}
  //                                     </li>
  //                                 ))}
  //                             </ul>
  //                         </div>
  //                     )}
  
  //                     <div className="text-center space-y-6 mt-6"> {/* Added margin top for separation */}
  //                         {scannedCodes.length > 0 && (
  //                             <div className="text-lg text-gray-800">
  //                                 Total Scanned: <span className="font-bold text-brand-500">{scannedCodes.length}</span>
  //                             </div>
  //                         )}
  //                         <button
  //                             onClick={() => setScanAgain(true)} // Allow rescanning
  //                             className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
  //                         >
  //                             <BiBarcodeReader className="inline-block mr-2" />
  //                             Scan Next / Continue Scanning
  //                         </button>
  //                         {scannedCodes.length > 0 && (
  //                              <button
  //                                 onClick={resetScanner}
  //                                 className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 mt-2"
  //                              >
  //                                 Clear All Scanned Codes
  //                              </button>
  //                         )}
  //                         <div className="mt-4 text-sm text-gray-500">
  //                             <p>
  //                                 Need help? <a href="#" className="text-brand-500 hover:underline">Contact Support</a>
  //                             </p>
  //                             <p className="mt-1">Ensure the barcode is well-lit and within the frame.</p>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     );
  // };
  
  // export default ScannerPage;


// // src/components/operations/Pickslip/LiveBarcodeScannerUI.tsx
// import { useState, useCallback, useEffect } from "react";
// import { BiBarcodeReader } from "react-icons/bi";
// import { BsCameraFill } from "react-icons/bs";
// // Assuming this is your actual low-level Quagga wrapper component

// import { FaTimesCircle } from "react-icons/fa";
// import BarcodeScannerComponent from "../../barcode-scan/BarcodeScanner";

// interface LiveBarcodeScannerUIProps {
//   onScan: (code: string) => void;
//   scanActive: boolean; // Controls whether the scanner is actively looking for barcodes
//   onScannerReady?: () => void; // Optional callback when scanner is ready
//   // You might want to pass error handling up as well
//   onError?: (error: any) => void;
// }

// const LiveBarcodeScannerUI: React.FC<LiveBarcodeScannerUIProps> = ({
//   onScan,
//   scanActive,
//   onScannerReady,
//   onError,
// }) => {
//   // Internal state for camera management
//   const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
//   const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
//   const [isSmallScreen, setIsSmallScreen] = useState(false);

//   // Camera enumeration and selection logic
//   useEffect(() => {
//     const getCameras = async () => {
//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const videoDevices = devices.filter((device) => device.kind === 'videoinput');
//         setAvailableCameras(videoDevices);

//         if (isSmallScreen) {
//           const backCamera = videoDevices.find(device =>
//             device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
//           );
//           setCurrentCameraId(backCamera?.deviceId || videoDevices[0]?.deviceId);
//         } else if (videoDevices.length > 0 && !currentCameraId) {
//           setCurrentCameraId(videoDevices[0].deviceId);
//         }
//         onScannerReady?.(); // Notify parent that scanner UI is ready
//       } catch (error) {
//         console.error("Error enumerating video devices:", error);
//         onError?.(error); // Pass error up
//       }
//     };
//     getCameras();
//   }, [isSmallScreen, setCurrentCameraId, setAvailableCameras, currentCameraId, onScannerReady, onError]);

//   // Handle screen resize for camera preference
//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [setIsSmallScreen]);

//   const switchCamera = useCallback(() => {
//     const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
//     const nextIndex = (currentIndex + 1) % availableCameras.length;
//     setCurrentCameraId(availableCameras[nextIndex].deviceId);
//   }, [availableCameras, currentCameraId]);

//   return (
//     <div className="relative aspect-video rounded-md overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
//       {availableCameras.length > 1 && scanActive && (
//         <button
//           onClick={switchCamera}
//           className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition z-10"
//           aria-label="Switch Camera"
//         >
//           <BsCameraFill size={20} />
//         </button>
//       )}

//       {scanActive ? (
//         <>
//           <BarcodeScannerComponent
//             key={currentCameraId} // Force remount on camera change
//             onScan={onScan}
//             onError={onError || ((err) => console.error("Scanner Error:", err))}
//             preferredCameraId={currentCameraId}
//           />
//           <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
//           <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2 z-10">
//             Point camera at barcode
//           </p>
//         </>
//       ) : (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4">
//           <FaTimesCircle className="text-red-500 text-5xl mb-3" />
//           <p className="text-lg font-semibold text-center">Scanner Inactive</p>
//           <p className="text-sm text-center">Press "Start Scan" to begin.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveBarcodeScannerUI;


// src/components/operations/Pickslip/LiveBarcodeScannerUI.tsx
import { useState, useCallback, useEffect } from "react";
import { BsCameraFill } from "react-icons/bs"; // Assuming BsCameraFill
import { FaTimesCircle } from 'react-icons/fa'; // For scanner inactive icon
import { BrowserMultiFormatReader } from "@zxing/browser"; // To list cameras
import BarcodeScannerComponent from "../../../../settings/BarcodeScanner";


interface LiveBarcodeScannerUIProps {
  onScan: (code: string) => void;
  scanActive: boolean; // Controls whether the scanner is actively looking for barcodes
  onScannerReady?: () => void; // Optional callback when scanner is ready
  onError?: (error: unknown) => void;
}

const LiveBarcodeScannerUI: React.FC<LiveBarcodeScannerUIProps> = ({
  onScan,
  scanActive,
  onScannerReady,
  onError,
}) => {
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Camera enumeration and selection logic
  useEffect(() => {
    const getCameras = async () => {
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        setAvailableCameras(videoInputDevices);

        let defaultCameraId: string | undefined;
        if (isSmallScreen) {
          // Prefer back camera on small screens (mobile)
          const backCamera = videoInputDevices.find(device =>
            device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
          );
          defaultCameraId = backCamera?.deviceId || videoInputDevices[0]?.deviceId;
        } else {
          // On larger screens (laptops/desktops), the first camera is usually the front-facing one
          defaultCameraId = videoInputDevices[0]?.deviceId;
        }
        
        setCurrentCameraId(defaultCameraId);
        onScannerReady?.(); // Notify parent that scanner UI is ready
      } catch (error) {
        console.error("Error enumerating video devices:", error);
        onError?.(error);
      }
    };
    getCameras();
  }, [isSmallScreen, onScannerReady, onError]); // Rerun if screen size changes

  // Handle screen resize for camera preference
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSmallScreen]);

  const switchCamera = useCallback(() => {
    if (availableCameras.length <= 1) return; // No need to switch if only one or no cameras

    const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    setCurrentCameraId(availableCameras[nextIndex].deviceId);
  }, [availableCameras, currentCameraId]);

  return (
    <div className="relative aspect-video rounded-md overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      {availableCameras.length > 1 && scanActive && (
        <button
          onClick={switchCamera}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition z-10"
          aria-label="Switch Camera"
        >
          <BsCameraFill size={20} />
        </button>
      )}

      {scanActive && currentCameraId ? (
        <>
          <BarcodeScannerComponent
            key={currentCameraId} // Force remount on camera change
            onScan={onScan}
            onError={onError}
            preferredCameraId={currentCameraId}
          />
          <div className="absolute inset-0 bg-black opacity-10 rounded-md" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-blue-300 rounded-md" />
          <p className="absolute bottom-4 left-4 text-white text-sm bg-blue-800 bg-opacity-50 rounded-md py-1 px-2 z-10">
            Point camera at barcode
          </p>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4">
          <FaTimesCircle className="text-red-500 text-5xl mb-3" />
          <p className="text-lg font-semibold text-center">Scanner Inactive</p>
          <p className="text-sm text-center">Press "Start Scan" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default LiveBarcodeScannerUI;
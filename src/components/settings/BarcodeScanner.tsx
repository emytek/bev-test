// import React, { memo, useRef, useEffect, useState } from "react";
// import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

// interface BarcodeScannerProps {
//   onScan: (result: string) => void;
//   onError?: (error: unknown) => void;
//   preferredCameraId?: string;
// }

// const BarcodeScannerComponent: React.FC<BarcodeScannerProps> = memo(
//   ({ onScan, onError, preferredCameraId }) => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

//     useEffect(() => {
//       const codeReader = new BrowserMultiFormatReader();
//       let activeDeviceId: string | undefined = preferredCameraId;
//       let isComponentMounted = true;

//       const startScanner = async (deviceId?: string) => {
//         try {
//           if (!videoRef.current || !isComponentMounted) return;

//           const controls = await codeReader.decodeFromVideoDevice(
//             deviceId ? deviceId : activeDeviceId!,
//             videoRef.current,
//             (result) => {
//               if (result && isComponentMounted) {
//                 onScan(result.getText());
//               }
//             }
//           );
//           if (isComponentMounted) {
//             setScannerControls(controls);
//           }
//         } catch (error) {
//           console.error("Error starting barcode scanner with device ID:", deviceId, error);
//           onError?.(error);
//         }
//       };

//       const initScanner = async () => {
//         try {
//           const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
//           if (videoInputDevices.length === 0) {
//             console.error("No camera found!");
//             return;
//           }

//           if (!preferredCameraId) {
//             for (const device of videoInputDevices) {
//               const label = device.label.toLowerCase();
//               if (label.includes("back") || label.includes("rear")) {
//                 activeDeviceId = device.deviceId;
//                 break;
//               }
//             }
//             if (!activeDeviceId && videoInputDevices.length > 0) {
//               console.warn("Back camera not explicitly found. Using the first available camera.");
//               activeDeviceId = videoInputDevices[0].deviceId;
//             } else if (!activeDeviceId) {
//               console.error("No suitable video input device found.");
//               return;
//             }
//           }

//           startScanner(activeDeviceId);
//         } catch (error) {
//           console.error("Error initializing barcode scanner:", error);
//           onError?.(error);
//         }
//       };

//       initScanner();

//       return () => {
//         isComponentMounted = false;
//         scannerControls?.stop();
//         // No direct 'reset' on codeReader, 'stop' on controls handles resource release
//       };
//     }, [onScan, onError, preferredCameraId]);

//     return <video ref={videoRef} className="w-full h-full object-cover" />;
//   }
// );

// export default BarcodeScannerComponent;


// src/components/settings/BarcodeScanner.tsx
import React, { memo, useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: unknown) => void;
  preferredCameraId?: string; // This will be passed from LiveBarcodeScannerUI
}

const BarcodeScannerComponent: React.FC<BarcodeScannerProps> = memo(
  ({ onScan, onError, preferredCameraId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

    useEffect(() => {
      const codeReader = new BrowserMultiFormatReader();
      let activeDeviceId: string | undefined = preferredCameraId;
      let isComponentMounted = true;

      const startScanner = async (deviceId?: string) => {
        try {
          if (!videoRef.current || !isComponentMounted) return;

          // Stop any existing scanner before starting a new one
          scannerControls?.stop();
          setScannerControls(null); // Clear controls for the new instance

          const controls = await codeReader.decodeFromVideoDevice(
            deviceId ? deviceId : activeDeviceId!,
            videoRef.current,
            (result) => {
              if (result && isComponentMounted) {
                onScan(result.getText());
                // After a successful scan, you might want to stop the scanner
                // or let the parent component decide. For this flow, we'll let
                // the parent (PickslipScanningPage) manage stopping via `isScanningActive`.
              }
            }
          );
          if (isComponentMounted) {
            setScannerControls(controls);
          }
        } catch (error) {
          console.error("Error starting barcode scanner with device ID:", deviceId, error);
          onError?.(error);
        }
      };

      const initScanner = async () => {
        try {
          // If a preferredCameraId is provided, use it directly.
          // Otherwise, try to find a back camera, then fallback to the first.
          if (!preferredCameraId) {
            const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
            if (videoInputDevices.length === 0) {
              console.error("No camera found!");
              onError?.(new Error("No camera found!"));
              return;
            }

            for (const device of videoInputDevices) {
              const label = device.label.toLowerCase();
              if (label.includes("back") || label.includes("rear")) {
                activeDeviceId = device.deviceId;
                break;
              }
            }
            if (!activeDeviceId && videoInputDevices.length > 0) {
              console.warn("Back camera not explicitly found. Using the first available camera.");
              activeDeviceId = videoInputDevices[0].deviceId;
            } else if (!activeDeviceId) {
              console.error("No suitable video input device found.");
              onError?.(new Error("No suitable video input device found."));
              return;
            }
          } else {
            activeDeviceId = preferredCameraId; // Use the provided preferredCameraId
          }
          
          if (activeDeviceId) {
            startScanner(activeDeviceId);
          } else {
            onError?.(new Error("No active camera device ID determined."));
          }

        } catch (error) {
          console.error("Error initializing barcode scanner:", error);
          onError?.(error);
        }
      };

      initScanner();

      return () => {
        isComponentMounted = false;
        scannerControls?.stop(); // Stop scanner when component unmounts
        // No direct 'reset' on codeReader, 'stop' on controls handles resource release
      };
    }, [onScan, onError, preferredCameraId]); // Re-run effect if preferredCameraId changes

    return <video ref={videoRef} className="w-full h-full object-cover" />;
  }
);

export default BarcodeScannerComponent;

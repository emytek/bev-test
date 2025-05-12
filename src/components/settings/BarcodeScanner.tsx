// import { useEffect, useRef, useState } from "react";
// import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

// interface BarcodeScannerProps {
//   onScan: (result: string) => void;
//   onError?: (error: unknown) => void;
//   preferredCameraId?: string; // Prop to explicitly set the camera
// }

// const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError, preferredCameraId }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

//   useEffect(() => {
//     const codeReader = new BrowserMultiFormatReader();
//     let activeDeviceId: string | undefined = preferredCameraId;

//     const startScanner = async (deviceId?: string) => {
//       try {
//         if (!videoRef.current) return;

//         const controls = await codeReader.decodeFromVideoDevice(
//           deviceId ? deviceId : activeDeviceId!,
//           videoRef.current,
//           (result) => {
//             if (result) {
//               onScan(result.getText());
//             }
//           }
//         );
//         setScannerControls(controls);
//       } catch (error) {
//         console.error("Error starting barcode scanner with device ID:", deviceId, error);
//         onError?.(error);
//       }
//     };

//     const initScanner = async () => {
//       try {
//         const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
//         if (videoInputDevices.length === 0) {
//           console.error("No camera found!");
//           return;
//         }

//         if (!preferredCameraId) {
//           // Prioritize back camera if no preferredId is given
//           for (const device of videoInputDevices) {
//             const label = device.label.toLowerCase();
//             if (label.includes("back") || label.includes("rear")) {
//               activeDeviceId = device.deviceId;
//               break;
//             }
//           }
//           if (!activeDeviceId && videoInputDevices.length > 0) {
//             console.warn("Back camera not explicitly found. Using the first available camera.");
//             activeDeviceId = videoInputDevices[0].deviceId;
//           } else if (!activeDeviceId) {
//             console.error("No suitable video input device found.");
//             return;
//           }
//         }

//         startScanner(activeDeviceId);

//       } catch (error) {
//         console.error("Error initializing barcode scanner:", error);
//         onError?.(error);
//       }
//     };

//     initScanner();

//     return () => {
//       scannerControls?.stop();
//     };
//   }, [onScan, onError, preferredCameraId]);

//   return <video ref={videoRef} className="w-full h-full object-cover" />;
// };

// export default BarcodeScanner;



import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: unknown) => void;
  preferredCameraId?: string;
  isScanning: boolean; // New prop to control scanning state
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError, preferredCameraId, isScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;
    let activeDeviceId: string | undefined = preferredCameraId;

    const startScanner = async (deviceId?: string) => {
      try {
        if (!videoRef.current || !isScanning) {
          scannerControls?.stop();
          codeReader = null;
          setScannerControls(null);
          return;
        }

        codeReader = new BrowserMultiFormatReader();
        const controls = await codeReader.decodeFromVideoDevice(
          deviceId ? deviceId : activeDeviceId!,
          videoRef.current,
          (result) => {
            if (result) {
              onScan(result.getText());
              // Optionally, stop scanning after the first successful scan if needed
              // controls.stop();
            }
          }
        );
        setScannerControls(controls);
      } catch (error) {
        console.error("Error starting barcode scanner with device ID:", deviceId, error);
        onError?.(error);
      }
    };

    const initScanner = async () => {
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          console.error("No camera found!");
          return;
        }

        if (!preferredCameraId) {
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
            return;
          }
        }

        startScanner(activeDeviceId);

      } catch (error) {
        console.error("Error initializing barcode scanner:", error);
        onError?.(error);
      }
    };

    if (isScanning) {
      initScanner();
    } else {
      scannerControls?.stop();
      codeReader = null;
      setScannerControls(null);
    }

    return () => {
      scannerControls?.stop();
      codeReader = null;
    };
  }, [onScan, onError, preferredCameraId, isScanning]);

  return <video ref={videoRef} className="w-full h-full object-cover" />;
};

export default BarcodeScanner;
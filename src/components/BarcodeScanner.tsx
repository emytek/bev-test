// import { useEffect, useRef, useState } from "react";
// import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

// interface BarcodeScannerProps {
//   onScan: (result: string) => void;
//   onError?: (error: unknown) => void;
// }

// const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

//   useEffect(() => {
//     const codeReader = new BrowserMultiFormatReader();

//     const startScanner = async () => {
//       try {
//         const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
//         if (videoInputDevices.length === 0) {
//           console.error("No camera found!");
//           return;
//         }

//         const controls = await codeReader.decodeFromVideoDevice(
//           videoInputDevices[0].deviceId,
//           videoRef.current!,
//           (result) => {
//             if (result) {
//               onScan(result.getText()); // Send scanned barcode data to parent component
//             }
//           }
//         );

//         setScannerControls(controls);
//       } catch (error) {
//         console.error("Error starting barcode scanner:", error);
//         onError?.(error);
//       }
//     };

//     startScanner();

//     return () => {
//       scannerControls?.stop(); // Stop scanner when component unmounts
//     };
//   }, []);

//   return <video ref={videoRef} className="w-70 h-60" />;
// };

// export default BarcodeScanner;


import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: unknown) => void;
  preferredCameraId?: string; // Prop to explicitly set the camera
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError, preferredCameraId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let activeDeviceId: string | undefined = preferredCameraId;

    const startScanner = async (deviceId?: string) => {
      try {
        if (!videoRef.current) return;

        const controls = await codeReader.decodeFromVideoDevice(
          deviceId ? deviceId : activeDeviceId!,
          videoRef.current,
          (result) => {
            if (result) {
              onScan(result.getText());
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
          // Prioritize back camera if no preferredId is given
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

    initScanner();

    return () => {
      scannerControls?.stop();
    };
  }, [onScan, onError, preferredCameraId]);

  return <video ref={videoRef} className="w-full h-full object-cover" />;
};

export default BarcodeScanner;
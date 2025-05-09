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
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          console.error("No camera found!");
          return;
        }

        let backCameraDeviceId: string | undefined;
        for (const device of videoInputDevices) {
          const label = device.label.toLowerCase();
          if (label.includes("back") || label.includes("rear")) {
            backCameraDeviceId = device.deviceId;
            break; // Use the first identified back camera
          }
        }

        let deviceIdToUse: string;
        if (backCameraDeviceId) {
          deviceIdToUse = backCameraDeviceId;
        } else if (videoInputDevices.length > 0) {
          console.warn("Back camera not explicitly found. Using the first available camera.");
          deviceIdToUse = videoInputDevices[0].deviceId;
        } else {
          console.error("No video input devices found.");
          return;
        }

        const controls = await codeReader.decodeFromVideoDevice(
          deviceIdToUse,
          videoRef.current!,
          (result) => {
            if (result) {
              onScan(result.getText());
              // Optionally, stop scanning after the first successful scan
              // controls.stop();
            }
          }
        );

        setScannerControls(controls);
      } catch (error) {
        console.error("Error starting barcode scanner:", error);
        onError?.(error);
      }
    };

    startScanner();

    return () => {
      scannerControls?.stop(); // Stop scanner when component unmounts
    };
  }, [onScan, onError]);

  return <video ref={videoRef} className="w-70 h-60" />;
};

export default BarcodeScanner;

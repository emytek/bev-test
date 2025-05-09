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
import {
  BrowserMultiFormatReader,
  IScannerControls,
} from "@zxing/browser";

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

        const controls = await codeReader.decodeFromVideoDevice(
          videoInputDevices[0].deviceId,
          videoRef.current!,
          (result) => {
            if (result) {
              onScan(result.getText());
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
      scannerControls?.stop();
    };
  }, []);

  return (
    <div className="rounded-xl shadow-lg p-4 border border-gray-200">
      <video ref={videoRef} className="w-full h-60 rounded-lg" />
    </div>
  );
};

export default BarcodeScanner;


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

const getPreferredCamera = async (): Promise<MediaDeviceInfo | null> => {
 const devices = await BrowserMultiFormatReader.listVideoInputDevices();
 if (devices.length === 0) return null;

 const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

 if (isMobile) {
 const backCamera = devices.find(
 (device) =>
 /back|environment/i.test(device.label) || /rear/i.test(device.label)
 );
 return backCamera || devices[0];
 }

 const frontCamera = devices.find((device) =>
 /front|user/i.test(device.label)
 );
 return frontCamera || devices[0];
};

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const selectedDevice = await getPreferredCamera();

        if (!selectedDevice) {
          throw new Error("No suitable camera device found.");
        }

        const controls = await codeReader.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current!,
          (result, error) => {
            if (result) {
              onScan(result.getText());
            } else if (error && !(error.name === "NotFoundException")) {
              console.warn("Scanner error:", error);
              onError?.(error);
            }
          }
        );

        setScannerControls(controls);
      } catch (error) {
        console.error("Failed to initialize scanner:", error);
        onError?.(error);
      }
    };

    startScanner();

    return () => {
      scannerControls?.stop();
    };
  }, [onScan, onError]);

  return <video ref={videoRef} className="w-72 h-60 object-cover rounded-lg shadow-md" />;
};

export default BarcodeScanner;


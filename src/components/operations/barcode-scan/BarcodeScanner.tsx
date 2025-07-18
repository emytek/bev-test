// src/components/settings/BarcodeScanner.tsx
import React, { useRef, useEffect } from 'react';

// IMPORTANT: Quagga.js needs to be loaded globally or imported.
// For this environment, the simplest way is to add it via a CDN script tag in your public/index.html:
// <script src="https://unpkg.com/quagga@0.12.1/dist/quagga.min.js"></script>
// If you've installed it via npm (e.g., `npm install quagga` or `@ericblade/quagga2`),
// you would import it here: `import Quagga from 'quagga';` or `import Quagga from '@ericblade/quagga2';`

interface BarcodeScannerComponentProps {
  onScan: (code: string) => void;
  onError: (error: any) => void;
  preferredCameraId?: string;
  // Note: scanActive is managed by the parent LiveBarcodeScannerUI,
  // this component will always be active when mounted by the parent.
}

const BarcodeScannerComponent: React.FC<BarcodeScannerComponentProps> = ({
  onScan,
  onError,
  preferredCameraId,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const isQuaggaInitialized = useRef(false); // Use ref to track initialization across renders

  useEffect(() => {
    if (!videoRef.current) {
      console.warn("Video ref is not available for Quagga.js initialization.");
      return;
    }

    if (typeof Quagga === 'undefined') {
      console.error("Quagga.js is not loaded. Please ensure it's included in your public/index.html or installed.");
      onError(new Error("Quagga.js not found."));
      return;
    }

    // Only initialize if not already initialized
    if (!isQuaggaInitialized.current) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current, // Target the div element
          constraints: {
            width: { min: 640 }, // Prefer a minimum width
            height: { min: 480 }, // Prefer a minimum height
            aspectRatio: { min: 1, max: 100 }, // Allow flexible aspect ratio
            facingMode: "environment", // Use rear camera by default
            deviceId: preferredCameraId, // Use the preferred camera if provided
          },
        },
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader",
            "code_128_reader",
            "datamatrix_reader", // Common for QR-like codes
            "itf_reader",
            "qr_code_reader" // If you expect QR codes
          ],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          }
        },
        locator: {
          patchSize: "medium", // 'x-small', 'small', 'medium', 'large', 'x-large'
          halfSample: true // Reduce processing load
        },
        numOfWorkers: navigator.hardwareConcurrency ? navigator.hardwareConcurrency / 2 : 2, // Use half available cores
        frequency: 10, // How often to process frames (lower is more frequent)
        locate: true, // Enable the locator to draw lines
      }, function (err: any) {
        if (err) {
          console.error("Quagga.init error:", err);
          onError(err);
          isQuaggaInitialized.current = false;
          return;
        }
        Quagga.start();
        isQuaggaInitialized.current = true;
        console.log("Quagga started successfully with camera:", preferredCameraId || 'default');
      });

      // Event listener for barcode detection
      Quagga.onDetected((result: any) => {
        if (result && result.codeResult && result.codeResult.code) {
          onScan(result.codeResult.code);
          // Optionally stop Quagga here if you only want one scan per activation
          // Quagga.stop();
          // isQuaggaInitialized.current = false; // Reset for next activation
        }
      });

      // Event listener for drawing processing results (bounding boxes, scan lines)
      Quagga.onProcessed((result: any) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (drawingCtx && drawingCanvas) {
          // --- FIX: Removed parseInt() calls here ---
          drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

          if (result.boxes) {
            result.boxes.filter(function (box: any) {
              return box !== result.box;
            }).forEach(function (box: any) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
            });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: "red", lineWidth: 3 });
          }
        }
      });
    }

    // Cleanup function to stop Quagga when component unmounts or preferredCameraId changes
    return () => {
      if (isQuaggaInitialized.current) {
        console.log("Stopping Quagga.");
        Quagga.stop();
        isQuaggaInitialized.current = false;
        // Remove event listeners to prevent memory leaks
        Quagga.offDetected();
        Quagga.offProcessed();
      }
    };
  }, [preferredCameraId, onScan, onError]); // Re-run effect if camera changes or callbacks change

  return (
    // Quagga will render the video stream and canvas directly into this div
    <div ref={videoRef} className="w-full h-full">
      {/* Optional: Add a loading indicator or message before Quagga starts */}
      {!isQuaggaInitialized.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 text-white text-lg rounded-md">
          Initializing Scanner...
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerComponent;
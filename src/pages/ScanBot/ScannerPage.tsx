import { useState } from "react";

import { BiBarcodeReader } from "react-icons/bi";
import BarcodeScanner from "../../components/settings/BarcodeScanner";

const ScannerPage = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(true);

  const handleScan = (code: string) => {
    setScannedCode(code);
    setShowScanner(false);
  };

  const resetScanner = () => {
    setScannedCode(null);
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 text-blue-600">
          <BiBarcodeReader size={24} />
          <h1 className="text-lg font-semibold">Barcode Scanner</h1>
        </div>

        {showScanner ? (
          <BarcodeScanner
            onScan={handleScan}
            onError={(err) => console.error(err)}
          />
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-800">
              <span className="font-medium text-blue-600">Scanned Code:</span>
              <br />
              <span className="font-mono text-xl break-words">{scannedCode}</span>
            </p>
            <button
              onClick={resetScanner}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;

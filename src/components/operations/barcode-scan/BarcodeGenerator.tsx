import React, { useEffect, useRef } from 'react';
// JsBarcode library is loaded via CDN in index.html for global availability

interface BarcodeGeneratorProps {
  value: string;
  isLong?: boolean; // Prop to indicate a longer barcode
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ value, isLong = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Ensure JsBarcode is available globally before trying to use it
    if (window.JsBarcode && svgRef.current) {
      // JsBarcode options for black and white, and adjusting width for 'isLong'
      const options = {
        format: "CODE128", // Common barcode format
        displayValue: false, // Do not display value below barcode (we'll add it manually)
        lineColor: "#000",
        // Adjusted width and height for better fit on A4 Landscape
        // These values are pixels for the SVG itself, which then scales via CSS
        width: isLong ? 1.5 : 0.8, // Reduced bar width slightly for print compactness
        height: isLong ? 40 : 30,  // Reduced height slightly for print compactness
        margin: 0, // No extra margin around barcode
      };

      // Generate the barcode into the SVG element
      window.JsBarcode(svgRef.current, value, options);
    } else {
      console.warn('JsBarcode is not loaded or SVG ref is not available.');
    }
  }, [value, isLong]); // Re-generate if value or isLong changes

  return (
    // Use an SVG element as the target for JsBarcode
    // Set explicit width to control the overall barcode size, especially for long ones
    // Added print:w-auto and print:h-auto to allow browser/printer to scale naturally
    // Also added explicit print:w-X and print:h-X for more control if needed
    <svg
      ref={svgRef}
      className={`${isLong ? "w-64 h-auto print:w-52 print:h-auto" : "w-48 h-auto print:w-40 print:h-auto"}`}
    ></svg>
  );
};

export default BarcodeGenerator;

// Declare JsBarcode on the Window object for TypeScript
declare global {
  interface Window {
    JsBarcode: any; // Or a more specific type if you install @types/jsbarcode
  }
}
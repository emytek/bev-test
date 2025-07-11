// import React, { useEffect, useRef } from "react";
// import JsBarcode from "jsbarcode";

// interface PrintDisplayProps {
//   stockIdToPrint: string | null;
//   completedQuantityToPrint: number | null;
//   productDescriptionToPrint: string | null;
// }

// const PrintDisplay: React.FC<PrintDisplayProps> = ({
//   stockIdToPrint,
//   completedQuantityToPrint,
//   productDescriptionToPrint,
// }) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     if (stockIdToPrint && svgRef.current) {
//       const numericValue = stockIdToPrint.replace(/\D/g, "").slice(0, 12);

//       JsBarcode(svgRef.current, numericValue, {
//         format: "EAN13",
//         lineColor: "#000000",
//         background: "#ffffff",
//         width: 4,
//         height: 200,
//         displayValue: true,
//       });
//     }
//   }, [stockIdToPrint]);

//   if (!stockIdToPrint) return null;

//   return (
//     <div className="bg-white p-6 print:p-0">
//       <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl p-6 md:p-8 xl:p-10 print:shadow-none print:border-none">
//         <header className="text-center mb-6">
//           <h4 className="text-2xl sm:text-2xl font-extrabold text-gray-600">
//             Production Batch Label
//           </h4>
//           <p className="text-gray-500 mt-2 text-sm sm:text-base">
//             printable stock identifier
//           </p>
//         </header>

//         <main className="flex flex-col items-center justify-center gap-6">
//           <div className="text-lg sm:text-xl text-gray-800 bg-blue-50 px-6 py-3 rounded-md shadow-sm w-full text-center">
//             <strong>Stock ID:</strong> {stockIdToPrint}
//           </div>

//           <div className="bg-white p-4 border border-dashed border-gray-300 rounded-md shadow-md w-full max-w-xs sm:max-w-md md:max-w-lg">
//             <svg ref={svgRef} className="w-full max-w-full h-auto"></svg>
//           </div>

//           <p className="text-xs sm:text-sm text-gray-400 print:hidden">
//             Ensure this document is printed clearly for future scanning and
//             reference.
//           </p>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PrintDisplay;


import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface PrintDisplayProps {
  stockIdToPrint: string | null;
  completedQuantityToPrint: number | null;
  productDescriptionToPrint: string | null;
  orderNo: string | null;
}

const PrintDisplay: React.FC<PrintDisplayProps> = ({
  stockIdToPrint,
  completedQuantityToPrint,
  productDescriptionToPrint,
  orderNo
}) => {
  const svgRef = useRef < SVGSVGElement | null > (null);

  useEffect(() => {
    if (stockIdToPrint && svgRef.current) {
      const numericValue = stockIdToPrint.replace(/\D/g, '').slice(0, 12);

      JsBarcode(svgRef.current, numericValue, {
        format: 'EAN13',
        lineColor: '#000000',
        background: '#ffffff',
        width: 2,
        height: 90, 
        displayValue: true,
        textMargin: 6, 
        fontSize: 18, 
      });
    }
  }, [stockIdToPrint]);

  if (!stockIdToPrint) return null;

  return (
    <div className="bg-white p-6 print:p-0 flex justify-center items-center min-h-[280px] print:min-h-auto relative">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md p-6 md:p-8 xl:p-10 print:shadow-none print:border-none flex flex-col items-center justify-between h-full print:h-auto relative">
        
        {/* Order Number - Top Right */}
        {orderNo && (
          <div className="absolute top-4 right-4 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium shadow-sm print:static print:mt-2 print:mb-2 print:bg-white print:text-black">
            Order No: <span className="font-semibold">{orderNo}</span>
          </div>
        )}

        {/* Header Section */}
        <header className="text-center mb-4 w-full">
          <h4 className="text-xl font-bold text-gray-700 print:text-black">
            Production Batch Label
          </h4>
          <p className="text-sm text-gray-500 mt-1 print:text-black">
            Printable Stock Identifier
          </p>
        </header>

        {/* Product Description */}
        {productDescriptionToPrint && (
          <div className="text-center mb-3 w-full">
            <div className="bg-gray-100 rounded-md py-2 px-4 print:bg-white print:text-black">
              <strong className="text-gray-600 text-base print:text-black">
                Product:
              </strong>{' '}
              <span className="text-lg font-semibold text-blue-600 print:text-black">
                {productDescriptionToPrint}
              </span>
            </div>
          </div>
        )}

        {/* Barcode Section */}
        <div className="flex flex-col items-center justify-center mb-4 w-full">
          <svg ref={svgRef} className="w-52 h-auto print:w-full" />
          <div className="text-center mt-3 print:text-black">
            <strong className="text-gray-600 text-base print:text-black">
              Batch ID:
            </strong>{' '}
            <span className="text-lg font-semibold text-green-600 print:text-black">
              {stockIdToPrint}
            </span>
          </div>
        </div>

        {/* Completed Quantity */}
        {completedQuantityToPrint !== null && (
          <div className="text-center mb-3 w-full">
            <div className="bg-yellow-100 rounded-md py-2 px-4 print:bg-white print:text-black">
              <strong className="text-gray-600 text-base print:text-black">
                Completed Qty:
              </strong>{' '}
              <span className="text-lg font-semibold text-orange-600 print:text-black">
                {completedQuantityToPrint}
              </span>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-xs text-gray-400 text-center print:hidden mt-4 w-full">
          Ensure this document is printed clearly for future scanning and reference.
        </p>
      </div>
    </div>
  );
};

export default PrintDisplay;
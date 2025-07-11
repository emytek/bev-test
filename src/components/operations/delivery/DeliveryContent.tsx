// src/components/DeliveryContent.tsx - UPDATED
import React from "react";
import BarcodeGenerator from "../Sales/delivery-notes/MainCopy/DocumentDetail/BarcodeGenerator";

// const DeliveryContent: React.FC = () => {
//   // Define the number of empty rows to extend the table height
//   // Adjust this number (e.g., from 5 to 10 or more) based on your A4 print testing
//   const numberOfEmptyRows = 5; // Start with 5, adjust as needed for A4 fit

//   // Generate empty rows with vertical borders for table extension
//   const emptyRows = Array.from({ length: numberOfEmptyRows }).map(
//     (_, index) => (
//       <tr key={`empty-delivery-row-${index}`}>
//         {/* Apply border-r to all cells except the last one in each empty row */}
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//           &nbsp;
//         </td>
//         <td className="px-1 py-1 whitespace-nowrap text-xxs">&nbsp;</td>{" "}
//         {/* Last column has no right border */}
//       </tr>
//     )
//   );

//   return (
//     <section className="p-4 mx-auto w-[210mm] font-sans text-xs print:w-auto print:p-2">
//       {/* Main 10-Column Table */}
//       <div className="overflow-x-auto mb-3 border border-black rounded-md">
//         <table className="min-w-full divide-y divide-black">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Item number
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Item description
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Customer Item
//                 <br />
//                 Description/
//                 <br />
//                 Lot No
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Order Number
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Order
//                 <br />
//                 Line
//                 <br />
//                 Number
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Customer Order
//                 <br />
//                 Number
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 UOM
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Quantity per
//                 <br />
//                 Pack
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//               >
//                 Number of
//                 <br />
//                 Packs
//               </th>
//               <th
//                 scope="col"
//                 className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider"
//               >
//                 Total
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {/* Dummy Data Row 1 */}
//             <tr>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 {" "}
//                 {/* Changed border-gray-200 to border-black */}
//                 1001
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 {" "}
//                 {/* Changed border-gray-200 to border-black */}
//                 Product A Description
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUST-ITEM-001/LOT123
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 ORD-001
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 1
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUSTORD-5678
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 PCS
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 10
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 50
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs">500</td>
//             </tr>
//             {/* Dummy Data Row 2 */}
//             <tr>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 {" "}
//                 {/* Changed border-gray-200 to border-black */}
//                 1002
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 {" "}
//                 {/* Changed border-gray-200 to border-black */}
//                 Product B Description Longer Text
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUST-ITEM-002/LOT456
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 ORD-001
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 2
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUSTORD-5678
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 BOX
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 20
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 15
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs">300</td>
//             </tr>
//             {/* Dummy Data Row 3 */}
//             <tr>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 {" "}
//                 {/* Changed border-gray-200 to border-black */}
//                 1003
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 {" "}
//                 {/* Changed border-gray-200 to border-black */}
//                 Another Product Desc
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUST-ITEM-003/LOT789
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 ORD-002
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 1
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUSTORD-9101
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 KG
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 5
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 100
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs">500</td>
//             </tr>
//             {/* NEW Dummy Data Row 4 */}
//             <tr>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 1004
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 Fourth Product Item
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUST-ITEM-004/LOT101
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 ORD-003
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 1
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUSTORD-1234
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 EA
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 1
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 250
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs">250</td>
//             </tr>
//             {/* NEW Dummy Data Row 5 */}
//             <tr>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 1005
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 Fifth Product Sample
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUST-ITEM-005/LOT202
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 ORD-003
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 2
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 CUSTORD-1234
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 SET
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 2
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black">
//                 10
//               </td>
//               <td className="px-1 py-1 whitespace-nowrap text-xxs">20</td>
//             </tr>
//             {/* Dynamically added empty rows to extend height */}
//             {emptyRows}
//           </tbody>
//         </table>
//       </div>

//       {/* Left View and Right View */}
//       <div className="flex justify-between items-start gap-x-4">
//         {/* Left View */}
//         <div className="flex flex-col w-3/5 items-start">
//           {/* First Small Table */}
//           <div className="w-full mb-3">
//             <div className="flex border border-black rounded-t-md text-xxs font-semibold h-8">
//               {" "}
//               {/* Changed border-gray-300 to border-black */}
//               <div className="flex-1/2 flex items-center justify-start p-1 border-r border-black">
//                 {" "}
//                 {/* Changed border-gray-300 to border-black */}
//                 Goods Received by Transporter:
//               </div>
//               <div className="flex-1/2 flex items-center justify-start p-1">
//                 Goods Dispatched By:
//               </div>
//             </div>
//             <table className="min-w-full divide-y divide-black border border-black rounded-b-md">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//                   >
//                     Name in Full
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//                   >
//                     Signature
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//                   >
//                     Name in Full
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider w-1/4"
//                   >
//                     Signature
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-black">
//                 {/* Empty rows for signatures */}
//                 <tr>
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black"></td>
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black"></td>
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black"></td>
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs"></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Second Small Table */}
//           <div className="w-full mb-3">
//             <div className="flex border border-black rounded-t-md text-xxs font-semibold h-8 items-center justify-center">
//               {" "}
//               {/* Changed border-gray-300 to border-black */}
//               Goods Received at Customer by:
//             </div>
//             <table className="min-w-full divide-y divide-black border border-black rounded-b-md">
//               {" "}
//               {/* Changed divide-gray-300 and border-gray-300 to border-black */}
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//                   >
//                     Name in Full
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//                   >
//                     Signature
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black"
//                   >
//                     Date
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider w-1/4"
//                   >
//                     Actual Delivery Time
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-black">
//                 {" "}
//                 {/* Changed divide-gray-200 to divide-black */}
//                 {/* Empty rows for signatures */}
//                 <tr>
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black"></td>{" "}
//                   {/* Changed border-gray-200 to border-black */}
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black"></td>{" "}
//                   {/* Changed border-gray-200 to border-black */}
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black"></td>{" "}
//                   {/* Changed border-gray-200 to border-black */}
//                   <td className="px-1 py-4 whitespace-nowrap text-xxs"></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Bottom Border Box */}
//           <>
//           <div className="w-full border border-black rounded-md p-0.5 h-6 mt-3">
//     {/* This box is now significantly smaller */}
//   </div>
//   <div className="text-center mt-1 font-bold"> {/* Added a div for the text with margin-top for spacing */}
//     <p className="text-xxs">
//       This delivery note is subject to our standard Terms and Conditions,  a copy of which is
//     </p>
//     <p className="text-xxs">
//      available on request.
//     </p>
//   </div>
//           </>
//         </div>

//         {/* Right View (Barcodes) */}
//         <div className="flex flex-col w-2/5 items-center justify-start gap-y-6 pt-4">
//           {/* First Barcode */}
//           <div className="flex flex-col items-center">
//             <BarcodeGenerator value="50204741" />
//             <span className="text-sm mt-2">50204741</span>{" "}
//             {/* Barcode number below */}
//           </div>

//           {/* Second Barcode (Longer) */}
//           <div className="flex flex-col items-center">
//             <span className="text-sm mb-2">24001524 SO_AGABARA1_50204741</span>{" "}
//             {/* Barcode number on top */}
//             <BarcodeGenerator
//               value="24001524SO_AGABARA1_50204741"
//               isLong={true}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };



const DeliveryContent: React.FC = () => {
  // Define the number of empty rows to extend the table height
  // Adjust this number (e.g., from 5 to 10 or more) based on your A4 print testing
  const numberOfEmptyRows = 8; // Start with 8, adjust as needed for A4 fit

  // Generate empty rows with vertical borders for table extension
  const emptyRows = Array.from({ length: numberOfEmptyRows }).map(
    (_, index) => (
      <tr key={`empty-delivery-row-${index}`}>
        {/* Apply border-r to all cells except the last one in each empty row */}
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">&nbsp;</td>{" "}
        {/* Last column has no right border */}
      </tr>
    )
  );

  return (
    <section className="p-2 w-full font-sans text-xs print:p-1 flex-grow">
      {/* Main 10-Column Table */}
      <div className="overflow-x-auto mb-2 border border-black rounded-md print:mb-1">
        <table className="min-w-full divide-y divide-black table-auto print:text-[6.5pt]">
          <thead className="bg-gray-50">
            <tr>
              {/* Consider print:w-X classes for column widths if content is too wide */}
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Item number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Item description</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Customer Item <br /> Description/<br /> Lot No</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Order Number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Order <br /> Line <br /> Number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Customer Order <br /> Number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">UOM</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Quantity per <br /> Pack</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Number of <br /> Packs</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider print:px-0.5 print:py-0.5">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* Dummy Data Row 1 */}
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1001</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Product A Description</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-001/LOT123</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-001</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-5678</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">PCS</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">10</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">50</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">500</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1002</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Product B Description Longer Text</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-002/LOT456</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-001</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">2</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-5678</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">BOX</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">20</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">15</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">300</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1003</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Another Product Desc</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-003/LOT789</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-002</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-9101</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">KG</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">5</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">100</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">500</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1004</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Fourth Product Item</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-004/LOT101</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-003</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-1234</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">EA</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">250</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">250</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1005</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Fifth Product Sample</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-005/LOT202</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-003</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">2</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-1234</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">SET</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">2</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">10</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">20</td>
            </tr>
            {/* Dynamically added empty rows to extend height */}
            {emptyRows}
          </tbody>
        </table>
      </div>

      {/* Left View and Right View */}
      <div className="flex justify-between items-start gap-x-4 print:gap-x-2">
        {/* Left View */}
        <div className="flex flex-col w-3/5 items-start">
          {/* First Small Table */}
          <div className="w-full mb-3 print:mb-1">
            <div className="flex border border-black rounded-t-md text-xxs font-semibold h-8 print:h-6 print:text-[7pt]">
              <div className="flex-1/2 flex items-center justify-start p-1 border-r border-black print:p-0.5">
                Goods Received by Transporter:
              </div>
              <div className="flex-1/2 flex items-center justify-start p-1 print:p-0.5">
                Goods Dispatched By:
              </div>
            </div>
            <table className="min-w-full divide-y divide-black border border-black rounded-b-md print:text-[6.5pt]">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Name in Full</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Signature</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Name in Full</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider w-1/4 print:px-0.5 print:py-0.5">Signature</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black">
                <tr>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs print:py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Second Small Table */}
          <div className="w-full mb-3 print:mb-1">
            <div className="flex border border-black rounded-t-md text-xxs font-semibold h-8 items-center justify-center print:h-6 print:text-[7pt]">
              Goods Received at Customer by:
            </div>
            <table className="min-w-full divide-y divide-black border border-black rounded-b-md print:text-[6.5pt]">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Name in Full</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Signature</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Date</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider w-1/4 print:px-0.5 print:py-0.5">Actual Delivery Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black">
                <tr>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs print:py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Border Box */}
          <>
            <div className="w-full border border-black rounded-md p-0.5 h-6 mt-3 print:h-4 print:mt-1">
              {/* This box is now significantly smaller */}
            </div>
            <div className="text-center mt-1 font-bold print:mt-0.5">
              <p className="text-xxs print:text-[6pt]">
                This delivery note is subject to our standard Terms and Conditions, a copy of which is
              </p>
              <p className="text-xxs print:text-[6pt]">
                available on request.
              </p>
            </div>
          </>
        </div>

        {/* Right View (Barcodes) */}
        {/* Adjusted gap and padding for print */}
        <div className="flex flex-col w-2/5 items-center justify-start gap-y-4 pt-4 print:gap-y-2 print:pt-2">
          {/* First Barcode */}
          <div className="flex flex-col items-center">
            {/* Replaced placeholder with BarcodeGenerator */}
            <BarcodeGenerator value="50204741" />
            <span className="text-sm mt-2 print:text-[8pt] print:mt-1">50204741</span>
          </div>

          {/* Second Barcode (Longer) */}
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 print:text-[8pt] print:mb-1">24001524 SO_AGABARA1_50204741</span>
            {/* Replaced placeholder with BarcodeGenerator */}
            <BarcodeGenerator value="24001524SO_AGABARA1_50204741" isLong={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryContent;

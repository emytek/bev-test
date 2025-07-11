// components/TableSection.tsx
import React from 'react';

interface TableSectionProps {
  // No props needed for this static content
}

const TableSection: React.FC<TableSectionProps> = () => {
  // Define the number of empty rows you want to add.
  // **Crucial for A4 fit: Adjust this number during print testing.**
  const numberOfEmptyRows = 5; // Keep this value as a starting point, fine-tune as needed.

  // Generate an array of empty rows with vertical borders
  const emptyRows = Array.from({ length: numberOfEmptyRows }).map((_, index) => (
    <tr key={`empty-row-${index}`}>
      {/* 14 columns, apply border-r to all but the last column */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none border-r border-black">&nbsp;</td> {/* Changed border-gray-300 to border-black */}
      <td className="px-0.5 py-0.5 text-center leading-none">&nbsp;</td> {/* Last column has no right border */}
    </tr>
  ));

  return (
    <div className="p-1 bg-white shadow-sm">
      <table className="w-full border-collapse border border-black table-fixed text-left print:text-[6.5pt]"> {/* Changed border-gray-400 to border-black */}
        <thead className="bg-gray-100">
          <tr>
            {/* Header cells with right borders (except last) and bottom border for the header row */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom whitespace-nowrap leading-none">Item Number</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Item Description</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Promised<br/>Delivery<br/>Date</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom whitespace-nowrap leading-none">Location</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Picked<br/>From<br/>Location</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom whitespace-nowrap leading-none">Lot Number</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Picked Lot<br/>Number</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center whitespace-nowrap leading-none">Quantity</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center whitespace-nowrap leading-none">UOM</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Quantity<br/>Per Pack</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Picked<br/>Quantity Per<br/>Pack</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Number<br/>of Packs</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none">Number<br/>of Packs<br/>Picked</th> {/* Changed border-gray-300 to border-black */}
            <th className="px-0.5 py-0.5 font-bold border-b border-black text-center align-bottom leading-none">Total<br/>Quantity<br/>Picked</th> {/* Last header has no right border */}
          </tr>
        </thead>
        <tbody>
          {/* Your existing data row - NO BOTTOM BORDER, but keep right borders */}
          <tr>
            <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none">010370116</td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center leading-none">330 MALTINA NG 1402</td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none">29/01/2025</td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none">FG</td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center leading-none"></td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center leading-none"></td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center leading-none"></td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none">179.718</td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none">8.169</td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center leading-none"></td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center leading-none"></td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none">22.000</td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 border-r border-black text-center leading-none"></td> {/* Changed border-gray-300 to border-black */}
            <td className="px-0.5 py-0.5 text-center leading-none"></td> {/* Last column has no right border */}
          </tr>
          {/* Dynamically added empty rows */}
          {emptyRows}
        </tbody>
      </table>
    </div>
  );
};

// const TableSection: React.FC<TableSectionProps> = () => {
//   // Define the number of empty rows you want to add.
//   // **CRUCIAL FOR A4 FIT: Adjust this number during print testing.**
//   // Start with a lower number, then increase if there's too much empty space,
//   // or decrease if content overflows. This directly controls the height.
//   const numberOfEmptyRows = 12; // Adjusted to a higher value for potentially more content, fine-tune this!

//   // Generate an array of empty rows with vertical borders
//   const emptyRows = Array.from({ length: numberOfEmptyRows }).map((_, index) => (
//     <tr key={`empty-row-${index}`} className="h-[14px] print:h-[12px]"> {/* Explicitly set row height for better control */}
//       {/* 14 columns, apply border-r to all but the last column */}
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none border-r border-black print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//       <td className="px-0.5 py-0.5 text-center leading-none print:px-[1px] print:py-[1px] print:leading-none">&nbsp;</td>
//     </tr>
//   ));

//   return (
//     <div className="p-1 bg-white shadow-sm print:p-0.5 flex-grow"> {/* Reduced padding for print, added flex-grow */}
//       <table className="w-full border-collapse border border-black table-fixed text-left print:text-[6.5pt]">
//         <thead className="bg-gray-100">
//           <tr className="h-auto print:h-[20mm]"> {/* Increased print header row height to ensure text fits */}
//             {/* Header cells with right borders (except last) and bottom border for the header row */}
//             {/* Added print:w-X to force column widths. Adjust these percentages to sum to 100%. */}
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[7%]">Item Number</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[15%]">Item Description</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[7%]">Promised<br/>Delivery<br/>Date</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[7%]">Location</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[7%]">Picked<br/>From<br/>Location</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[7%]">Lot Number</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[7%]">Picked Lot<br/>Number</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[7%]">Quantity</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[6%]">UOM</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[8%]">Quantity<br/>Per Pack</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[8%]">Picked<br/>Quantity Per<br/>Pack</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[6%]">Number<br/>of Packs</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-r border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[6%]">Number<br/>of Packs<br/>Picked</th>
//             <th className="px-0.5 py-0.5 font-bold border-b border-black text-center align-bottom leading-none print:px-[1px] print:py-[1px] print:leading-none print:w-[6%]">Total<br/>Quantity<br/>Picked</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Your existing data row - with print px/py and leading-none */}
//           <tr className="h-[14px] print:h-[12px]"> {/* Explicitly set row height */}
//             <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none">010370116</td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center leading-none print:px-[1px] print:py-[1px] print:leading-none">330 MALTINA NG 1402</td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none">29/01/2025</td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none">FG</td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center leading-none print:px-[1px] print:py-[1px] print:leading-none"></td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center leading-none print:px-[1px] print:py-[1px] print:leading-none"></td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center leading-none print:px-[1px] print:py-[1px] print:leading-none"></td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none">179.718</td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none">8.169</td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center leading-none print:px-[1px] print:py-[1px] print:leading-none"></td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center leading-none print:px-[1px] print:py-[1px] print:leading-none"></td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center whitespace-nowrap leading-none print:px-[1px] print:py-[1px] print:leading-none">22.000</td>
//             <td className="px-0.5 py-0.5 border-r border-black text-center leading-none print:px-[1px] print:py-[1px] print:leading-none"></td>
//             <td className="px-0.5 py-0.5 text-center leading-none print:px-[1px] print:py-[1px] print:leading-none"></td>
//           </tr>
//           {/* Dynamically added empty rows */}
//           {emptyRows}
//         </tbody>
//       </table>
//     </div>
//   );
// };

export default TableSection;
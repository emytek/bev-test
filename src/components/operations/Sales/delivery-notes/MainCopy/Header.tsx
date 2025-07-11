// import React from 'react';

// // Define the type for the Address component props
// interface AddressProps {
//   lines: string[];
//   className?: string;
// }

// /**
//  * Reusable Address component to display multi-line addresses.
//  * Uses <br /> for line breaks and `not-italic` to remove default address styling.
//  */
// const Address: React.FC<AddressProps> = ({ lines, className }) => (
//   <address className={`not-italic text-sm leading-tight ${className}`}>
//     {lines.map((line, index) => (
//       <React.Fragment key={index}>
//         {line}
//         {index < lines.length - 1 && <br />} {/* Add breakline unless it's the last line */}
//       </React.Fragment>
//     ))}
//   </address>
// );

// // Define the type for the SmallTable component props
// interface SmallTableProps {
//   data: string[][];
// }

// /**
//  * Reusable SmallTable component to display small tabular data.
//  * Includes a centered title above the table.
//  */
// const SmallTable: React.FC<SmallTableProps> = ({ data }) => (
//   <div className="flex flex-col items-center">
//     <table className="min-w-full text-left text-xs border border-gray-300">
//       <tbody>
//         {data.map((row, rowIndex) => (
//           <tr key={rowIndex}>
//             {row.map((cell, cellIndex) => (
//               <td key={cellIndex} className="p-1 border border-gray-300 whitespace-nowrap">
//                 {cell}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );


// /**
//  * HeaderSection component representing the top part of the document.
//  * It uses a 6-column grid layout with responsive adjustments.
//  */
// const HeaderSection: React.FC = () => {
//   return (
//     // Header container with a responsive grid layout
//     <header className="grid grid-cols-6 md:grid-cols-6 gap-x-4 gap-y-4 mb-8">
//       {/* Row 1 */}
//       {/* Col 1: Logo Placeholder */}
//       <div className="col-span-1 flex items-center justify-center">
//         {/* Placeholder for logo - In a real application, this would be an <img> tag
//             with a proper source and alt text for accessibility. */}
//         <div className="bg-gray-200 h-12 w-24 flex items-center justify-center text-[10px] text-gray-500 rounded">
//           [Logo Here]
//         </div>
//       </div>

//       {/* Col 2: Empty - This column is intentionally left empty to create wider spacing
//           and is visually represented by a light gray background for clarity during development. */}
//       <div className="col-span-1 md:col-span-1 bg-gray-50"></div>

//       {/* Col 3: Empty */}
//       <div className="col-span-1"></div>

//       {/* Col 4: Address - Spans 3 columns on small screens, 2 on medium, 1 on large,
//           to ensure proper wrapping and spacing. */}
//       <div className="col-span-3 sm:col-span-2 md:col-span-1 text-[10px]">
//         {/* <Address
//           lines={[
//             'Alucan Packaging Limited',
//             'Km32 Area 5 Opic Industrial Estate',
//             'Agbara',
//             'Ogun State',
//             'Nigeria',
//           ]}
//         /> */}
//         <Address
//           lines={[
//             'Alucan Packaging Limited',
//             'Km32 Area 5 Opic Industrial Estate, Agbara',
//             'Agbara, Ogun State, Nigeria'
//           ]}
//         />
//       </div>

//       {/* NEW: Col 5 & 6 Container - Spans two columns and uses flex-col to stack content */}
//       <div className="col-span-full md:col-span-2 flex flex-col items-center justify-center">
//         {/* Delivery Note Box - Now a child of the flex-col container, takes full width of its parent */}
//         <div className="flex items-center justify-center p-2 border-2 border-black rounded-lg bg-gray-100 w-full h-16 md:h-auto">
//           <span className="font-bold text-4xl md:text-3xl text-center">Delivery note</span>
//         </div>
//         {/* Customer Copy Text - Outside the border box, but within the same grid column span */}
//         <span className="font-bold text-2xl md:text-xl text-center mt-2">Customer Copy</span>
//       </div>

//       {/* Row 2 */}
//       {/* Col 1: Alucan Packaging Details (Reg No, VAT No) */}
//       <div className="col-span-2 md:col-span-1 text-[10px] leading-tight">
//         <p>Alucan Packaging Limited</p>
//         <p>Reg No RC: 720459</p>
//         <p>VAT No. 0364410-0001</p>
//       </div>

//       {/* Col 2: Empty - Wider width placeholder */}
//       <div className="col-span-1 md:col-span-1 bg-gray-50"></div>

//       {/* Col 3: Empty */}
//       <div className="col-span-1"></div>

//       {/* Col 4: Empty - Wider width placeholder */}
//       <div className="col-span-3 sm:col-span-2 md:col-span-1 bg-gray-50"></div>

//       {/* Col 5 & 6: Small Table for Delivery Information - Spans full width on small screens, 2 columns on medium/large. */}
//       <div className="col-span-full md:col-span-2 font-bold text-[10px]">
//         <SmallTable
//           data={[
//             ['Delivery Note', '50204741', 'Page 1 of 1'],
//             ['Ship Date', '18/02/2025', ''],
//             ['Shipment Number/ Load Number', '7412363', ''],
//           ]}
//         />
//       </div>

//       {/* Row 3 */}
//       {/* Col 1: "Deliver From" Label */}
//       <div className="col-span-1 text-sm font-semibold pt-2">Deliver From</div>

//       {/* Col 2: Deliver From Address - Wider width on screen, adapts for print */}
//       <div className="col-span-2 md:col-span-1 pt-2 text-[10px]">
//         {/* <Address
//           lines={[
//             'Alucan Packaging Limited',
//             'Km32 Area 5 Opic Industrial Estate',
//             'Agbara',
//             'Ogun State',
//             'Nigeria',
//           ]}
//         /> */}
//         <Address
//           lines={[
//             'Alucan Packaging Limited',
//             'Km32 Area 5 Opic Industrial Estate Agabara',
//             'Ogun State, Nigeria',
//           ]}
//         />
//       </div>

//       {/* Col 3: "Deliver To" Label */}
//       <div className="col-span-1 text-sm font-semibold pt-2">Deliver To</div>

//       {/* Col 4: Deliver To Address - Wider width on screen, adapts for print */}
//       <div className="col-span-2 md:col-span-1 pt-2 text-[10px]">
//         {/* <Address
//           lines={[
//             'NigerianBreweries PLC',
//             '1A Kudenda Industrial area',
//             'Kaduna South',
//             'Kaduna',
//             'Other Areas',
//             'Nigeria',
//           ]}
//         /> */}
//         <Address
//           lines={[
//             'NigerianBreweries PLC',
//             '1A Kudenda Industrial area, Kaduna South',
//             'Kaduna, Nigeria',
//           ]}
//         />
//       </div>

//       {/* Col 5: "For Account" Label */}
//       <div className="col-span-1 text-sm font-semibold pt-2">For Account</div>

//       {/* Col 6: For Account Address - Wider width on screen, adapts for print */}
//       <div className="col-span-2 md:col-span-1 pt-2">
//         {/* <Address
//           lines={[
//             'NigerianBreweries PLC',
//             'Abebe Village Road',
//             'Iganmu',
//             'PO Box 86',
//             'Apapa',
//             'Lagos',
//             'Other Areas',
//             'Nigeria',
//           ]}
//         /> */}
//         <Address
//           lines={[
//             'NigerianBreweries PLC,',
//             'Abebe Village Road, Iganmu',
//             'PO Box 86, Apapa',
//             'Lagos, Nigeria',
//           ]}
//         />
//       </div>
//     </header>
//   );
// };

// export default HeaderSection;


import React from 'react';

// Define the type for the Address component props
interface AddressProps {
  lines: string[];
  className?: string;
}

/**
 * Reusable Address component to display multi-line addresses.
 * Uses <br /> for line breaks and `not-italic` to remove default address styling.
 */
const Address: React.FC<AddressProps> = ({ lines, className }) => (
  <address className={`not-italic text-sm leading-tight ${className}`}>
    {lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />} {/* Add breakline unless it's the last line */}
      </React.Fragment>
    ))}
  </address>
);

// Define the type for the SmallTable component props
interface SmallTableProps {
  data: string[][];
}

/**
 * Reusable SmallTable component to display small tabular data.
 * Includes a centered title above the table.
 */
const SmallTable: React.FC<SmallTableProps> = ({ data }) => (
  <div className="flex flex-col items-center">
    <table className="min-w-full text-left text-xs border border-black">
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="p-1 border border-black whitespace-nowrap">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


/**
 * HeaderSection component representing the top part of the document.
 * It uses a 6-column grid layout with responsive adjustments.
 */
const HeaderSection: React.FC = () => {
  return (
    // Header container with a responsive grid layout
    <header className="grid grid-cols-6 md:grid-cols-6 gap-x-4 gap-y-4 mb-8">
      {/* Row 1 */}
      {/* Col 1: Logo Placeholder */}
      <div className="col-span-1 flex items-center justify-center">
        {/* Placeholder for logo - In a real application, this would be an <img> tag
            with a proper source and alt text for accessibility. */}
        <div className="bg-gray-200 h-12 w-24 flex items-center justify-center text-[10px] text-gray-500 rounded">
          [Logo Here]
        </div>
      </div>

      {/* Col 2: Empty - This column is intentionally left empty to create wider spacing
          and is visually represented by a light gray background for clarity during development. */}
      <div className="col-span-1 md:col-span-1 bg-gray-50"></div>

      {/* Col 3: Empty */}
      <div className="col-span-1"></div>

      {/* Col 4: Address - Spans 3 columns on small screens, 2 on medium, 1 on large,
          to ensure proper wrapping and spacing. */}
      <div className="col-span-3 sm:col-span-2 md:col-span-1 text-[10px]">
        {/* <Address
          lines={[
            'Alucan Packaging Limited',
            'Km32 Area 5 Opic Industrial Estate',
            'Agbara',
            'Ogun State',
            'Nigeria',
          ]}
        /> */}
        <Address
          lines={[
            'Alucan Packaging Limited',
            'Km32 Area 5 Opic Industrial Estate, Agbara',
            'Agbara, Ogun State, Nigeria'
          ]}
        />
      </div>

      {/* NEW: Col 5 & 6 Container - Spans two columns and uses flex-col to stack content */}
      <div className="col-span-full md:col-span-2 flex flex-col items-center justify-center">
        {/* Delivery Note Box - Now a child of the flex-col container, takes full width of its parent */}
        <div className="flex items-center justify-center p-2 border-2 border-black rounded-lg bg-gray-100 w-full h-16 md:h-auto">
          <span className="font-bold text-4xl md:text-3xl text-center">Delivery note</span>
        </div>
        {/* Customer Copy Text - Outside the border box, but within the same grid column span */}
        <span className="font-bold text-2xl md:text-xl text-center mt-2">Customer Copy</span>
      </div>

      {/* Row 2 */}
      {/* Col 1: Alucan Packaging Details (Reg No, VAT No) */}
      <div className="col-span-2 md:col-span-1 text-[10px] leading-tight">
        <p>Alucan Packaging Limited</p>
        <p>Reg No RC: 720459</p>
        <p>VAT No. 0364410-0001</p>
      </div>

      {/* Col 2: Empty - Wider width placeholder */}
      <div className="col-span-1 md:col-span-1 bg-gray-50"></div>

      {/* Col 3: Empty */}
      <div className="col-span-1"></div>

      {/* Col 4: Empty - Wider width placeholder */}
      <div className="col-span-3 sm:col-span-2 md:col-span-1 bg-gray-50"></div>

      {/* Col 5 & 6: Small Table for Delivery Information - Spans full width on small screens, 2 columns on medium/large. */}
      <div className="col-span-full md:col-span-2 font-bold text-[10px]">
        <SmallTable
          data={[
            ['Delivery Note', '50204741', 'Page 1 of 1'],
            ['Ship Date', '18/02/2025', ''],
            ['Shipment Number/ Load Number', '7412363', ''],
          ]}
        />
      </div>

      {/* Row 3 */}
      {/* Col 1: "Deliver From" Label */}
      <div className="col-span-1 text-sm font-semibold pt-2">Deliver From</div>

      {/* Col 2: Deliver From Address - Wider width on screen, adapts for print */}
      <div className="col-span-2 md:col-span-1 pt-2 text-[10px]">
        {/* <Address
          lines={[
            'Alucan Packaging Limited',
            'Km32 Area 5 Opic Industrial Estate',
            'Agbara',
            'Ogun State',
            'Nigeria',
          ]}
        /> */}
        <Address
          lines={[
            'Alucan Packaging Limited',
            'Km32 Area 5 Opic Industrial Estate Agabara',
            'Ogun State, Nigeria',
          ]}
        />
      </div>

      {/* Col 3: "Deliver To" Label */}
      <div className="col-span-1 text-sm font-semibold pt-2">Deliver To</div>

      {/* Col 4: Deliver To Address - Wider width on screen, adapts for print */}
      <div className="col-span-2 md:col-span-1 pt-2 text-[10px]">
        {/* <Address
          lines={[
            'NigerianBreweries PLC',
            '1A Kudenda Industrial area',
            'Kaduna South',
            'Kaduna',
            'Other Areas',
            'Nigeria',
          ]}
        /> */}
        <Address
          lines={[
            'NigerianBreweries PLC',
            '1A Kudenda Industrial area, Kaduna South',
            'Kaduna, Nigeria',
          ]}
        />
      </div>

      {/* Col 5: "For Account" Label */}
      <div className="col-span-1 text-sm font-semibold pt-2">For Account</div>

      {/* Col 6: For Account Address - Wider width on screen, adapts for print */}
      <div className="col-span-2 md:col-span-1 pt-2">
        {/* <Address
          lines={[
            'NigerianBreweries PLC',
            'Abebe Village Road',
            'Iganmu',
            'PO Box 86',
            'Apapa',
            'Lagos',
            'Other Areas',
            'Nigeria',
          ]}
        /> */}
        <Address
          lines={[
            'NigerianBreweries PLC,',
            'Abebe Village Road, Iganmu',
            'PO Box 86, Apapa',
            'Lagos, Nigeria',
          ]}
        />
      </div>
    </header>
  );
};

export default HeaderSection;


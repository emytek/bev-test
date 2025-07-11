// components/FooterSection.tsx
import React from 'react';

interface FooterSectionProps {
  // No props needed for this static content currently
}

const FooterSection: React.FC<FooterSectionProps> = () => {
  return (
    // Outer div for the footer section, taking full A4 width but minimal padding
    // Font size will be controlled by the parent PickSlipContent for print
    <div className="bg-white px-1 py-0.5 font-sans"> {/* Reduced padding slightly */}
      <div className="grid grid-cols-9 gap-x-1 gap-y-0.5 print:text-[6.5pt]"> {/* Adjusted gap-x and gap-y for max compactness */}

        {/* --- FIRST ROW: Labels --- */}

        {/* Column 1: Goods Picked By: */}
        <div className="col-span-1 flex flex-col items-center justify-start text-center">
          <p className="font-bold leading-tight">Goods Picked</p>
          <p className="font-bold leading-tight">By:</p>
        </div>

        {/* Column 2: Name in full: */}
        <div className="col-span-2 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Name in full:</p>
        </div>

        {/* Column 3: Signature: */}
        <div className="col-span-1 flex flex-col items-start justify-start"> {/* Adjusted col-span from 2 to 1 for signature */}
          <p className="whitespace-nowrap leading-tight">Signature:</p>
        </div>

        {/* Column 4: Goods Loaded By: */}
        <div className="col-span-1 flex flex-col items-center justify-start text-center">
          <p className="font-bold leading-tight">Goods Loaded</p>
          <p className="font-bold leading-tight">By:</p>
        </div>

        {/* Column 5: Name in full: */}
        <div className="col-span-2 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Name in full:</p>
        </div>

        {/* Column 6: Signature: */}
        <div className="col-span-1 flex flex-col items-start justify-start"> {/* Adjusted col-span from 2 to 1 for signature */}
          <p className="whitespace-nowrap leading-tight">Signature:</p>
        </div>

        {/* Column 7: Loaded Goods checked by Transporter */}
        <div className="col-span-1 flex flex-col items-center justify-start text-center">
          <p className="font-bold leading-tight">Loaded Goods</p>
          <p className="font-bold leading-tight">checked by</p>
          <p className="font-bold leading-tight">Transporter</p>
        </div>

        {/* Column 8: Name in full: */}
        <div className="col-span-1 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Name in full:</p>
        </div>

        {/* Column 9: Signature: */}
        <div className="col-span-1 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Signature:</p>
        </div>


        {/* --- SECOND ROW: Underlines for Names and Signatures --- */}

        {/* Column 1: Underline for Name (Goods Picked By) */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="w-full border-b border-black" style={{ minWidth: '40px' }}></div> {/* Longer underline */}
        </div>

        {/* Column 2: Underline for Signature (Goods Picked By) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="w-4/5 border-b border-black" style={{ minWidth: '20px' }}></div> {/* Shorter underline */}
        </div>

        {/* Column 3: Empty */}
        <div className="col-span-1"></div> {/* This column is empty in the second row according to your description */}

        {/* Column 4: Underline for Name (Goods Loaded By) */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="w-full border-b border-black" style={{ minWidth: '40px' }}></div> {/* Longer underline */}
        </div>

        {/* Column 5: Underline for Signature (Goods Loaded By) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="w-4/5 border-b border-black" style={{ minWidth: '20px' }}></div> {/* Shorter underline */}
        </div>

        {/* Column 6: Empty */}
        <div className="col-span-1"></div> {/* This column is empty in the second row according to your description */}

        {/* Column 7: Underline for Name (Loaded Goods checked by Transporter) */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="w-full border-b border-black" style={{ minWidth: '40px' }}></div> {/* Longer underline */}
        </div>

        {/* Column 8: Underline for Signature (Loaded Goods checked by Transporter) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="w-4/5 border-b border-black" style={{ minWidth: '20px' }}></div> {/* Shorter underline */}
        </div>

        {/* Column 9: Empty */}
        <div className="col-span-1"></div> {/* This column is empty in the second row according to your description */}


        {/* --- THIRD ROW: Time/Date Labels --- */}

        {/* Column 1: Empty */}
        <div className="col-span-1"></div>

        {/* Column 2: Time Load completed: */}
        <div className="col-span-2 flex flex-col items-start justify-start">
          <p className="leading-tight">Time Load</p>
          <p className="leading-tight whitespace-nowrap">completed:</p>
        </div>

        {/* Column 3: Date */}
        <div className="col-span-1 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Date</p>
        </div>

        {/* Column 4: Empty */}
        <div className="col-span-1"></div>

        {/* Column 5: Time Load completed: (Repeat) */}
        <div className="col-span-2 flex flex-col items-start justify-start">
          <p className="leading-tight">Time Load</p>
          <p className="leading-tight whitespace-nowrap">completed:</p>
        </div>

        {/* Column 6: Date (Repeat) */}
        <div className="col-span-1 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Date</p>
        </div>

        {/* Column 7: Empty */}
        <div className="col-span-1"></div>

        {/* Column 8: Time Checked: */}
        <div className="col-span-1 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Time Checked:</p>
        </div>

        {/* Column 9: Date */}
        <div className="col-span-1 flex flex-col items-start justify-start">
          <p className="whitespace-nowrap leading-tight">Date</p>
        </div>


        {/* --- FOURTH ROW: Underlines for Time/Date --- */}

        {/* Column 1: Time Picked (___H___) */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="flex items-center w-full text-center">
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">H</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
          </div>
        </div>

        {/* Column 2: Date Picked (___/___/20__) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="flex items-center w-full text-center">
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">/</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">/20</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
          </div>
        </div>

        {/* Column 3: Empty (This column is empty in the fourth row according to your description) */}
        <div className="col-span-1"></div>

        {/* Column 4: Time Loaded (___H___) */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="flex items-center w-full text-center">
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">H</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
          </div>
        </div>

        {/* Column 5: Date Loaded (___/___/20__) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="flex items-center w-full text-center">
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">/</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">/20</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
          </div>
        </div>

        {/* Column 6: Empty (This column is empty in the fourth row according to your description) */}
        <div className="col-span-1"></div>

        {/* Column 7: Time Checked (___H___) */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="flex items-center w-full text-center">
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">H</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
          </div>
        </div>

        {/* Column 8: Date Checked (___/___/20__) */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="flex items-center w-full text-center">
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">/</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
            <span className="px-px font-bold leading-none">/20</span>
            <div className="flex-1 border-b border-black" style={{ minWidth: '10px' }}></div>
          </div>
        </div>

        {/* Column 9: Empty (This column is empty in the fourth row according to your description) */}
        {/* The description for the 4th row implies the last date is in col 9, but in a 9-col grid, the previous column was 8. */}
        {/* Assuming the last date is in col 9 as per the last sentence. */}
      </div>
    </div>
  );
};

export default FooterSection;
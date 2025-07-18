// src/components/DeliveryNoteHeader.tsx
import React from "react";

interface DeliveryNoteHeaderProps {
  logoSrc?: string; // Optional prop for the logo image source
}

const DeliveryNoteHeader: React.FC<DeliveryNoteHeaderProps> = ({ logoSrc }) => {
  return (
    <header className="p-2 border border-gray-300 w-full font-sans text-xs print:p-1 print:border-0">
      {/* Header Grid */}
      <div className="grid grid-cols-6 gap-x-1 h-auto print:gap-x-0.5">
    
        <div className="col-span-1 flex items-center justify-center">
          {logoSrc && (
            <img
              src={logoSrc}
              alt="Company Logo"
              className="h-10 w-auto max-w-full print:h-8" // Smaller logo for print if needed
            />
          )}
        </div>
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1 text-right leading-tight print:text-[8pt]">
          <p>Alucan Packaging Limited</p>
          <p>Km32 Area 5 Opic Industrial Estate</p>
          <p>Agbara</p>
          <p>Ogun State</p>
          <p>Nigeria</p>
        </div>
        <div className="col-span-2 flex items-center justify-center p-2 border-2 border-gray-700 rounded-lg shadow-sm text-center h-[50px] print:h-[40px] print:p-1 print:text-base">
          <p className="font-bold text-lg">Delivery note</p>
        </div>
      
        <div className="col-span-1 leading-tight print:text-[8pt]">
          <p>Alucan Packaging Limited</p>
          <p>Reg No RC: 720459</p>
          <p>VAT No. 0364410-0001</p>
        </div>
        <div className="col-span-1"></div> 
        <div className="col-span-1"></div> 
        <div className="col-span-1"></div> 
        <div className="col-span-2 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold mb-1 print:text-[9pt]">Customer Copy</h3>
          
          <div className="grid grid-cols-3 text-xxs border border-black w-full print:text-[7pt]">
            <div className="col-span-1 p-1 border-r border-b border-black font-medium">Delivery Note</div>
            <div className="col-span-1 p-1 border-r border-b border-black">50204741</div>
            <div className="col-span-1 p-1 border-b border-black">Page 1 of 1</div>

            <div className="col-span-1 p-1 border-r border-b border-black font-medium">Ship Date</div>
            <div className="col-span-1 p-1 border-r border-b border-black">18/02/2025</div>
            <div className="col-span-1 p-1 border-b border-black"></div>

            <div className="col-span-1 p-1 border-r border-black font-medium">Shipment Number/ Load Number</div>
            <div className="col-span-1 p-1 border-r border-black">7412363</div>
            <div className="col-span-1 p-1"></div>
          </div>
        </div>
        {/* Row 3 - Use `flex-basis` or `w-1/3` to distribute width for print */}
        <div className="col-span-1 text-left font-semibold print:text-[8pt] ml-6">Deliver From:</div>
        <div className="col-span-1 leading-tight print:text-[8pt]">
          <p>Alucan Packaging Limited</p>
          <p>Km32 Area 5 Opic Industrial Estate</p>
          <p>Agbara</p>
          <p>Ogun State</p>
          <p>Nigeria</p>
        </div>
        <div className="col-span-1 text-left font-semibold print:text-[8pt]">Deliver To:</div>
        <div className="col-span-1 leading-tight print:text-[8pt]">
          <p>NigerianBreweries PLC</p>
          <p>1A Kudenda Industrial area</p>
          <p>Kaduna South</p>
          <p>Kaduna</p>
          <p>Other Areas</p>
          <p>Nigeria</p>
        </div>
        <div className="col-span-1 text-left font-semibold print:text-[8pt]">For Account</div>
        <div className="col-span-1 leading-tight print:text-[8pt]">
          <p>NigerianBreweries PLC</p>
          <p>Abebe Village Road</p>
          <p>Iganmu</p>
          <p>PO Box 86</p>
          <p>Apapa</p>
          <p>Lagos</p>
          <p>Other Areas</p>
          <p>Nigeria</p>
        </div>
      </div>
    </header>
  );
};

export default DeliveryNoteHeader;

// src/components/Header.tsx - UPDATED
import React from "react";
import SmallTablePickslip from "./SmallTablePickslip";
import BarcodeGenerator from "../../../barcode-scan/BarcodeGenerator";

const PlaceholderLogo = () => (
  <div className="flex items-center justify-center h-full text-lg font-bold text-gray-700 print:text-[8pt]">
    LOGO
  </div>
);

interface HeaderProps {
  // No props needed for this static content
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className="p-1 sm:p-2 bg-white shadow-sm mt-0 print:p-0.5 print:mt-0"> {/* Reduced overall padding and top margin */}
      {/* Reduced gap-x and gap-y for print compactness */}
      <div className="grid grid-cols-6 grid-rows-4 gap-x-1 gap-y-0.5 print:gap-x-[2px] print:gap-y-[0px]">
        {/* FIRST MAIN ROW */}
        <div className="col-span-1 flex items-center justify-center print:h-[15mm]"> {/* Adjusted print height */}
          <PlaceholderLogo />
        </div>
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1"></div> {/* Empty */}
        {/* Removed fixed width w-[69mm], let grid manage it. Reduced height and padding for print. */}
        <div className="col-span-2 flex items-center justify-center border-2 border-black p-0.5 rounded-sm flex-col h-[40px] print:h-[15mm] print:p-[1px]">
          <p className="font-bold text-md md:text-lg print:text-[12pt]"> {/* Reduced print font size */}
            PICKSLIP
          </p>
        </div>
        {/* SECOND MAIN ROW */}
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1"></div> {/* Empty */}
        {/* Reduced height, padding, and font size for print. */}
        <div className="col-span-2 border border-black rounded-md p-0.5 grid grid-cols-2 gap-x-0 h-[40px] print:h-[15mm] print:p-0.5">
          {/* Left Column: Labels with bottom border (except last) */}
          <div className="flex flex-col justify-center">
            <p className="font-bold leading-tight border-b border-black pr-1 print:text-[8pt] print:leading-none">
              Customer Number
            </p>
            <p className="font-bold leading-tight pr-1 print:text-[8pt] print:leading-none">
              Shipment Number
            </p>
          </div>
          {/* Right Column: Values with bottom border (except last) - NO LEFT BORDER */}
          <div className="flex flex-col justify-center text-right">
            <p className="leading-tight border-b border-black pl-1 print:text-[8pt] print:leading-none">
              622878
            </p>
            <p className="leading-tight pl-1 print:text-[8pt] print:leading-none">622880</p>
          </div>
        </div>
        {/* Small table spanning columns 5 & 6 and rows 2 & 3 */}
        <div className="col-span-2 row-span-2">
          <SmallTablePickslip
            // headers={["PickSlip Number", "Value", "Details"]}
            data={[
              ["PickSlip Number", "3992318", "Page 1 of 1"],
              ["PickSlip Date", "18/02/2025", ""],
              ["PickSlip Time", "21:28:01", ""],
              ["Shipment Number", "7412363", ""],
              ["Load Number", "", ""],
              ["Order Number", "24001524", ""],
            ]}
          />
        </div>
        {/* THIRD MAIN ROW */}
        <div className="col-span-1 pt-px print:pt-[1px]"> {/* Reduced print pt */}
          <p className="font-bold leading-tight print:text-[8pt] ml-6">Deliver From:</p>
        </div>
        <div className="col-span-1 pt-px print:pt-[1px] print:text-[8pt]"> {/* Reduced print pt */}
          <address className="not-italic leading-tight print:text-[8pt] print:leading-tight">
            Alucan Packaging Limited
            <br />
            Km32 Area 5 Opic Industrial Estate
            <br />
            Agbara
            <br />
            Ogun State
            <br />
            Nigeria
          </address>
        </div>
        <div className="col-span-1 pt-px print:pt-[1px]"> {/* Reduced print pt */}
          <p className="font-bold leading-tight print:text-[8pt]">Deliver To</p>
        </div>
        <div className="col-span-1 pt-px print:pt-[1px] print:text-[8pt]"> {/* Reduced print pt */}
          <address className="not-italic leading-tight print:text-[8pt] print:leading-tight">
            NigerianBreweries PLC
            <br />
            1A Kudenda Industrial area
            <br />
            Kaduna South
            <br />
            Kaduna
            <br />
            Nigeria
          </address>
        </div>
        {/* FOURTH MAIN ROW */}
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1"></div> {/* Empty */}
        <div className="col-span-1"></div> {/* Empty */}
        {/* Barcode section: Optimized for minimal vertical space */}
        <div className="col-span-2 flex flex-col items-center justify-start p-0 pt-0.5 print:pt-[2px] print:h-[15mm]"> {/* Reduced print padding and height */}
          <BarcodeGenerator value="07412363" />
          <span className="mt-0 text-sm print:text-[8pt] print:mt-[1px]">07412363</span> {/* Reduced print text size and margin */}
        </div>
      </div>
    </div>
  );
};

export default Header;
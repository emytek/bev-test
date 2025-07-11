// src/components/PickslipHeaderSection.tsx
import React from 'react';
import CustomerShipmentInfoBox from './Shipment';
import SmallTablePickslip from './Table';
import Address from './Address';
import BarcodeGenerator from '../../MainCopy/DocumentDetail/BarcodeGenerator';


const PickslipHeaderSection: React.FC = () => {
  return (
    // Header container with a 6-column grid layout.
    // The `gap-x-4` and `gap-y-4` provide consistent spacing between grid items.
    <header className="grid grid-cols-6 md:grid-cols-6 p-2 gap-x-4 gap-y-4 mb-8">
      {/* FIRST MAIN ROW */}
      {/* Col 1: Logo Placeholder */}
      <div className="col-span-1 flex items-center justify-center">
        {/* Placeholder for a logo. In a real application, this would be an <img> tag
            with a proper source, alt text for accessibility, and potentially a link. */}
        <div className="bg-gray-200 h-16 w-24 flex items-center justify-center text-xs text-gray-500 rounded">
          [Logo Here]
        </div>
      </div>

      {/* Col 2: Empty - This column is intentionally left empty to contribute to the "wider width"
          requirement for column 2. Visually represented by a light gray background for clarity during development. */}
      <div className="col-span-1 md:col-span-1 bg-gray-50"></div>

      {/* Col 3: Empty */}
      <div className="col-span-1"></div>

      {/* Col 4: Empty - This column is intentionally left empty to contribute to the "wider width"
          requirement for column 4. */}
      <div className="col-span-1 md:col-span-1 bg-gray-50"></div>

      {/* Col 5 & 6: PICKSLIP Box - Spans two columns, centered content, bold text, rounded edges. */}
      <div className="col-span-2 flex items-center justify-center w-[69mm] border border-gray-300 p-1 rounded-sm flex-col h-[50px] mt-4">
            <p className="font-bold text-md md:text-lg print:text-[12pt]">PICKSLIP</p>
      </div>

      {/* SECOND MAIN ROW */}
      {/* Col 1: Empty */}
      <div className="col-span-1"></div>

      {/* Col 2: Empty - Wider width placeholder. */}
      <div className="col-span-1 md:col-span-1 bg-gray-50"></div>

      {/* Col 3 & 4: Customer/Shipment Info Box - Spans two columns. */}
      <div className="col-span-2">
        <CustomerShipmentInfoBox customerNumber="622878" shipmentNumber="622880" />
      </div>

      {/* Col 5 & 6: Small Table (Spans 2 rows - SECOND MAIN ROW and THIRD MAIN ROW).
          The `row-span-2` Tailwind class makes this grid item occupy two rows. */}
      <div className="col-span-2 row-span-2">
        <SmallTablePickslip
          headers={['PickSlip Number', 'Value', 'Details']} // Generic headers for this table structure
          data={[
            ['PickSlip Number', '3992318', 'Page 1 of 1'],
            ['PickSlip Date', '18/02/2025', ''],
            ['PickSlip Time', '21:28:01', ''],
            ['Shipment Number', '7412363', ''],
            ['Load Number', '', ''],
            ['Order Number', '24001524', ''],
          ]}
        />
      </div>

      {/* THIRD MAIN ROW */}
      {/* Col 1: "Deliver From" Label */}
      <div className="col-span-1 text-sm font-semibold pt-2">Deliver From</div>

      {/* Col 2: Deliver From Address - Wider width. */}
      <div className="col-span-1 md:col-span-1 pt-2">
        <Address
          lines={[
            'Alucan Packaging Limited',
            'Km32 Area 5 Opic Industrial Estate',
            'Agbara',
            'Ogun State',
            'Nigeria',
          ]}
        />
      </div>

      {/* Col 3: "Deliver To" Label */}
      <div className="col-span-1 text-sm font-semibold pt-2">Deliver To</div>

      {/* Col 4: Deliver To Address - Wider width. */}
      <div className="col-span-1 md:col-span-1 pt-2">
        <Address
          lines={[
            'NigerianBreweries PLC',
            '1A Kudenda Industrial area',
            'Kaduna South',
            'Kaduna',
            'Nigeria', // Only 5 breaklines as per request
          ]}
        />
      </div>

      {/* Col 5 & 6 are implicitly occupied by the Small Table from the previous row due to `row-span-2`.
          No explicit div is needed here. */}

      {/* FOURTH MAIN ROW */}
      {/* Col 1-4: Empty - Spans four columns. */}
      <div className="col-span-4"></div>

      {/* Col 5 & 6: Barcode - Spans two columns, centered with number below. */}
      <div className="col-span-2 flex flex-col items-center justify-center">
        <BarcodeGenerator value="07412363" />
        <span className="text-sm mt-2">07412363</span> {/* Barcode number placed just under the barcode */}
      </div>
    </header>
  );
};

export default PickslipHeaderSection;
// src/App.tsx
import HeaderSection from './Header';

import FooterSection from './Footer/FooterSection';
import MidSection from '../../../pickslip/MidSection';
import TableSection from '../../../pickslip/TableSection';

   

const PickSlipPrintableContent: React.FC = () => {
    // Define headers for the DetailedPickslipTable
    // const pickslipHeaders = [
    //   'Item Number',
    //   'Item Description',
    //   'Promised Delivery Date',
    //   'Location',
    //   'Picked From Location',
    //   'Lot Number',
    //   'Picked Lot Number',
    //   'Quantity',
    //   'UOM',
    //   'Quantity Per Pack',
    //   'Picked',
    //   'Number of Packs',
    //   'Number of Packs Picked',
    //   'Total Quantity Picked',
    // ];
  
    // Define mock data for the DetailedPickslipTable
    // const pickslipData = [
    //   [
    //     '1001', 'Alu Can 33cl Standard', '2025-07-10', 'WH1-A01', 'WH1-B05',
    //     'LOT-ABC-001', 'LOT-ABC-001', '2400', 'CS', '24', 'Yes', '100', '100', '2400',
    //   ],
    //   [
    //     '1002', 'Alu Can 50cl Tall', '2025-07-10', 'WH1-C02', 'WH1-C02',
    //     'LOT-XYZ-002', 'LOT-XYZ-002', '1200', 'CS', '12', 'Yes', '100', '100', '1200',
    //   ],
    //   [
    //     '1003', 'Alu Bottle 33cl', '2025-07-11', 'WH2-D03', 'WH2-D03',
    //     'LOT-PQR-003', 'LOT-PQR-003', '1000', 'CS', '20', 'Yes', '50', '50', '1000',
    //   ],
    //   [
    //     '1004', 'Alu Can 33cl Slim', '2025-07-11', 'WH1-E04', 'WH1-E04',
    //     'LOT-MNO-004', 'LOT-MNO-004', '1800', 'CS', '24', 'Yes', '75', '75', '1800',
    //   ],
    //   [
    //     '1005', 'Alu Can 25cl Small', '2025-07-12', 'WH2-F06', 'WH2-F06',
    //     'LOT-UVW-005', 'LOT-UVW-005', '600', 'CS', '20', 'Yes', '30', '30', '600',
    //   ],
    //   // Add more mock data as needed
    // ];
  
    return (
      // Outer wrapper for the printable content, adjusted for print
      // The `font-sans` class ensures the Inter font is applied as defined in tailwind.config.js
      <div className="print-outer-wrapper min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
        {/* This is the main content area that will be printed.
            It has a specific ID for targeting with print CSS. */}
        <div
          id="printable-content" // Keep this ID for its specific print CSS rules
          className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 lg:p-8"
        >
          {/* Render the Header Section component */}
          {/* Assuming HeaderSection here refers to PickslipHeaderSection as per previous request context */}
          {/* If you intended to use the *newly designed* PickslipHeaderSection,
              you would import and use that here instead of the generic HeaderSection.
              For now, I'll keep HeaderSection as per your provided code, but note this potential ambiguity. */}
          <HeaderSection />
          <MidSection /> {/* This MidSection is from MainCopy, ensure it's still relevant for Pickslip */}
  
          {/* REPLACED: DocumentDetailsSection with DetailedPickslipTable */}
          {/* <DetailedPickslipTable headers={pickslipHeaders} data={pickslipData} /> */}
          <TableSection />
          <FooterSection />
        </div>
      </div>
    );
  };

export default PickSlipPrintableContent;
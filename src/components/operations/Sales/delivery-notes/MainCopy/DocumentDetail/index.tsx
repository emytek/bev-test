// src/components/DocumentDetailsSection.tsx
import React from 'react';
import TableComponent from './Table';
import SignatureTable from './SignatureTable';
import BarcodeGenerator from './BarcodeGenerator';


const DocumentDetailsSection: React.FC = () => {
    // Mock data for the 10-column table
    const tableHeaders = [
      'Item number',
      'Item description',
      'Customer Item Description/Lot No',
      'Order Number',
      'Order Line Number',
      'Customer Order Number',
      'UOM',
      'Quantity Per Pack',
      'Number of Packs',
      'Total',
    ];
  
    const tableData = [
      [
        '1001',
        'Alu Can 33cl',
        'LOT12345',
        'PO-001',
        '001',
        'CUST-ORD-001',
        'CS',
        '24',
        '100',
        '2400',
      ],
      [
        '1002',
        'Alu Can 50cl',
        'LOT12346',
        'PO-001',
        '002',
        'CUST-ORD-001',
        'CS',
        '12',
        '50',
        '600',
      ],
      [
        '1003',
        'Alu Can 33cl Slim',
        'LOT12347',
        'PO-002',
        '001',
        'CUST-ORD-002',
        'CS',
        '24',
        '75',
        '1800',
      ],
      [
        '1004',
        'Alu Bottle 33cl',
        'LOT12348',
        'PO-003',
        '001',
        'CUST-ORD-003',
        'CS',
        '20',
        '120',
        '2400',
      ],
      // Add more mock data as needed
    ];
  
    // Mock data for the first small signature table (Goods Received/Dispatched)
    const signatureTable1Data = [
      ['', '', '', ''], // Empty rows for signatures
    ];
  
    // Mock data for the second small signature table (Goods Received at Customer)
    const signatureTable2Data = [
      ['', '', '', ''], // Empty rows for signatures
    ];
  
    return (
      <section className="mb-16">
        {/* 10-Column Table */}
        <TableComponent headers={tableHeaders} data={tableData} />
  
        {/* Left View (Signature Tables) and Right View (Barcodes) */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left View: Two Small Tables */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 ">
            {/* First Small Table */}
            <div className="flex flex-col">
              {/* Border box for the first small table */}
              <div className="grid grid-cols-4 border border-black rounded-t-md text-[10px] font-semibold h-10 items-center">
                {/* Left text with border-r for the dividing line */}
                <div className="col-span-2 p-2 border-r border-black flex items-center h-full">Goods Received by Transporter:</div>
                {/* Right text */}
                <div className="col-span-2 p-2 flex items-center h-full">Goods Dispatched By:</div>
              </div>
              <SignatureTable
                headers={['Name in Full', 'Signature', 'Name in Full', 'Signature']} // Headers for the first table
                data={signatureTable1Data}
              />
            </div>
  
            {/* Second Small Table */}
            <div className="flex flex-col mb-8"> {/* Added mt-4 for spacing between tables */}
              {/* Border box for the second small table */}
              <div className="flex justify-center items-center border border-black rounded-t-md text-sm font-semibold h-10 w-full">
                Goods Received at Customer by:
              </div>
              <SignatureTable
                headers={['Name in Full', 'Signature', 'Date', 'Actual Delivery Time']} // UPDATED HEADERS for the second table
                data={signatureTable2Data}
              />
            </div>
  
            {/* Border box under the second small table */}
            <div className="border border-black rounded-md h-10 mt-6 w-full flex items-center justify-center">
              {/* This box is intentionally empty as per requirements */}
            </div>
  
            {/* Text under the last border box */}
            <div className="text-center text-[10px]">
              <p>This delivery note is subject to our standard Terms and Conditions,</p>
              <p className="mx-auto">a copy of which is available on request</p>
            </div>
          </div>
  
          {/* Right View: Two Barcodes */}
          <div className="flex flex-col items-center md:items-end justify-center gap-8 w-full md:w-1/2 p-4">
            {/* First Barcode */}
            <div className="flex flex-col items-center">
              <BarcodeGenerator value="50204741" />
              <span className="text-sm mt-2">50204741</span> {/* Barcode number below */}
            </div>
  
            {/* Second Barcode (Longer) */}
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">24001524 SO_AGABARA1_50204741</span> {/* Barcode number on top */}
              <BarcodeGenerator value="24001524SO_AGABARA1_50204741" isLong={true} />
            </div>
          </div>
        </div>
      </section>
    );
  };
  

export default DocumentDetailsSection;

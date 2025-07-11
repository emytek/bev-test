
import React from 'react';
import DetailedPickslipTable from '.';

const PickslipContentExample: React.FC = () => {
  const pickslipHeaders = [
    'Item Number',
    'Item Description',
    'Promised Delivery Date',
    'Location',
    'Picked From Location',
    'Lot Number',
    'Picked Lot Number',
    'Quantity',
    'UOM',
    'Quantity Per Pack',
    'Picked',
    'Number of Packs',
    'Number of Packs Picked',
    'Total Quantity Picked',
  ];

  const pickslipData = [
    [
      '1001',
      'Alu Can 33cl Standard',
      '2025-07-10',
      'WH1-A01',
      'WH1-B05',
      'LOT-ABC-001',
      'LOT-ABC-001',
      '2400',
      'CS',
      '24',
      'Yes',
      '100',
      '100',
      '2400',
    ],
    [
      '1002',
      'Alu Can 50cl Tall',
      '2025-07-10',
      'WH1-C02',
      'WH1-C02',
      'LOT-XYZ-002',
      'LOT-XYZ-002',
      '1200',
      'CS',
      '12',
      'Yes',
      '100',
      '100',
      '1200',
    ],
    [
      '1003',
      'Alu Bottle 33cl',
      '2025-07-11',
      'WH2-D03',
      'WH2-D03',
      'LOT-PQR-003',
      'LOT-PQR-003',
      '1000',
      'CS',
      '20',
      'Yes',
      '50',
      '50',
      '1000',
    ],
    [
      '1004',
      'Alu Can 33cl Slim',
      '2025-07-11',
      'WH1-E04',
      'WH1-E04',
      'LOT-MNO-004',
      'LOT-MNO-004',
      '1800',
      'CS',
      '24',
      'Yes',
      '75',
      '75',
      '1800',
    ],
    [
      '1005',
      'Alu Can 25cl Small',
      '2025-07-12',
      'WH2-F06',
      'WH2-F06',
      'LOT-UVW-005',
      'LOT-UVW-005',
      '600',
      'CS',
      '20',
      'Yes',
      '30',
      '30',
      '600',
    ],
  ];

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Pickslip Item Details</h2>
      <DetailedPickslipTable headers={pickslipHeaders} data={pickslipData} />
    </section>
  );
};

export default PickslipContentExample;
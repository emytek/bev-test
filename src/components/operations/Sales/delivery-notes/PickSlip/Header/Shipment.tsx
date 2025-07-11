// src/components/CustomerShipmentInfoBox.tsx
import React from 'react';

interface CustomerShipmentInfoBoxProps {
  customerNumber: string;
  shipmentNumber: string;
}

const CustomerShipmentInfoBox: React.FC<CustomerShipmentInfoBoxProps> = ({ customerNumber, shipmentNumber }) => (
  <div className="border border-black rounded-lg p-3 flex flex-col justify-center h-full">
    <div className="flex justify-between items-center mb-1">
      <span className="font-bold text-sm">Customer Number</span>
      <span className="text-sm">{customerNumber}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="font-bold text-sm">Shipment Number</span>
      <span className="text-sm">{shipmentNumber}</span>
    </div>
  </div>
);

export default CustomerShipmentInfoBox;

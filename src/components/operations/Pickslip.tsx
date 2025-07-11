import React from "react";

const PickSlipPrint: React.FC = () => {
  return (
    <div className="w-[794px] min-h-[1123px] mx-auto p-8 bg-white text-black text-sm border border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold">Alucan Packaging Limited</h1>
          <p className="leading-tight">
            Km32 Area 5, Opic Industrial Estate, Agbara, Ogun State, Nigeria
          </p>
          <p>Email: info@alucan.com.ng | Tel: +234 803 000 0000</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">PICKSLIP</h2>
          <p className="mt-2">Date: 05-Jul-2025</p>
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p><span className="font-semibold">Customer:</span> Greg Birch</p>
          <p><span className="font-semibold">Delivery Address:</span> 123 Victoria Island, Lagos</p>
          <p><span className="font-semibold">Phone:</span> +234 805 555 5555</p>
        </div>
        <div>
          <p><span className="font-semibold">Order No:</span> ALU/02584</p>
          <p><span className="font-semibold">Pickslip No:</span> PS-2025-00042</p>
          <p><span className="font-semibold">Dispatch By:</span> Emmanuel Okalla</p>
        </div>
      </div>

      {/* Table Header */}
      <div className="border border-gray-400">
        <div className="grid grid-cols-6 font-semibold bg-gray-100 border-b border-gray-400">
          <div className="p-2 col-span-1">Item</div>
          <div className="p-2 col-span-2">Description</div>
          <div className="p-2 col-span-1 text-center">Qty</div>
          <div className="p-2 col-span-1 text-center">Unit</div>
          <div className="p-2 col-span-1 text-center">Remarks</div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-6 border-b border-gray-300 text-sm"
          >
            <div className="p-2 col-span-1">{i}</div>
            <div className="p-2 col-span-2">Aluminum Can - 33cl</div>
            <div className="p-2 col-span-1 text-center">500</div>
            <div className="p-2 col-span-1 text-center">pcs</div>
            <div className="p-2 col-span-1 text-center">-</div>
          </div>
        ))}
      </div>

      {/* Signature Section */}
      <div className="mt-10 grid grid-cols-2 gap-8 text-sm">
        <div>
          <p className="font-semibold">Prepared By:</p>
          <div className="h-16 border-b border-gray-400 w-3/4 mt-4" />
        </div>
        <div>
          <p className="font-semibold">Received By:</p>
          <div className="h-16 border-b border-gray-400 w-3/4 mt-4" />
        </div>
      </div>
    </div>
  );
};

export default PickSlipPrint;

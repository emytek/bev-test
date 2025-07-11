// src/components/MidSection.tsx

import React from "react";

const MidSection: React.FC = () => {
  return (
    <section className="p-2 mx-auto w-[210mm] font-sans text-[10px] print:w-auto print:p-1">
      <div className="flex justify-between items-stretch h-[50px]">
        {/* First Border Box */}
        <div className="w-[69mm] border border-black p-1 rounded-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Carrier</p>
            <p className="text-right">Road Transport BVN</p>
          </div>
          <div>
            <p className="font-semibold">Vehicle Registration Number</p>
          </div>
        </div>

        {/* Second Border Box */}
        <div className="w-[60mm] border border-black p-1 mx-1 rounded-sm flex flex-col justify-center items-center text-center">
          <p className="font-semibold leading-tight">Promised Delivery Date</p>
          <p>18/02/2025</p>
        </div>

        <div className="w-[60mm] border border-black p-1 mx-1 rounded-sm flex flex-col justify-start items-start">
          {" "}
          {/* Changed justify-center to justify-start and items-center to items-start */}
          <div>
            <p className="font-semibold">Special Delivery Instructions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MidSection;

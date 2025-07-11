// src/components/MidSection.tsx

import React from "react";

// const MidSection: React.FC = () => {
//   return (
//     <section className="p-2 mx-auto w-[210mm] font-sans text-[10px] print:w-auto print:p-1">
// <div className="flex justify-between items-stretch h-[50px] gap-x-4"> {/* Added gap-x-4 */}
//   <div className="w-[69mm] border border-black p-1 rounded-sm flex flex-col justify-between">
//     <div className="flex justify-between items-center">
//       <p className="font-semibold">Carrier</p>
//       <p className="text-right">Road Transport BVN</p>
//     </div>
//     <div>
//       <p className="font-semibold">Vehicle Registration Number</p>
//     </div>
//   </div>

//   <div className="w-[60mm] border border-black p-1 mx-2 rounded-sm flex flex-col justify-start items-start"> {/* Increased mx-1 to mx-2 */}
//     {" "}
//     {/* Changed justify-center to justify-start and items-center to items-start */}
//     <div>
//       <p className="font-semibold">Special Delivery Instructions</p>
//     </div>
//   </div>
// </div>
//     </section>
//   );
// };


const MidSection: React.FC = () => {
  return (
    <section className="p-2 mx-auto w-[210mm] font-sans text-[10px] print:w-auto print:p-1 print:text-[8pt]">
      {/* Increased gap-x for more spacing between the boxes */}
      <div className="flex justify-between items-stretch h-[50px] gap-x-8"> {/* Changed gap-x from default to gap-x-8 */}
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
        {/* Removed mx-1 as gap-x on the parent will handle spacing */}
        <div className="w-[60mm] border border-black p-1 rounded-sm flex flex-col justify-start items-start">
          <div>
            <p className="font-semibold">Special Delivery Instructions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MidSection;

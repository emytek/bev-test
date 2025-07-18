import React from "react";
import BarcodeGenerator from "../../../barcode-scan/BarcodeGenerator";

const DeliveryContent: React.FC = () => {
  const numberOfEmptyRows = 8; 

  const emptyRows = Array.from({ length: numberOfEmptyRows }).map(
    (_, index) => (
      <tr key={`empty-delivery-row-${index}`}>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">
          &nbsp;
        </td>
        <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">&nbsp;</td>{" "}
        {/* Last column has no right border */}
      </tr>
    )
  );

  return (
    <section className="p-2 w-full font-sans text-xs print:p-1 flex-grow">
      <div className="overflow-x-auto mb-2 border border-black rounded-md print:mb-1">
        <table className="min-w-full divide-y divide-black table-auto print:text-[6.5pt]">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Item number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Item description</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Customer Item <br /> Description/<br /> Lot No</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Order Number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Order <br /> Line <br /> Number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Customer Order <br /> Number</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">UOM</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Quantity per <br /> Pack</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Number of <br /> Packs</th>
              <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider print:px-0.5 print:py-0.5">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* Dummy Data Row 1 */}
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1001</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Product A Description</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-001/LOT123</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-001</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-5678</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">PCS</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">10</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">50</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">500</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1002</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Product B Description Longer Text</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-002/LOT456</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-001</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">2</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-5678</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">BOX</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">20</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">15</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">300</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1003</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Another Product Desc</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-003/LOT789</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-002</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-9101</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">KG</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">5</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">100</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">500</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1004</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Fourth Product Item</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-004/LOT101</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-003</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-1234</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">EA</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">250</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">250</td>
            </tr>
            <tr>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">1005</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">Fifth Product Sample</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUST-ITEM-005/LOT202</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">ORD-003</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">2</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">CUSTORD-1234</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">SET</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">2</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs border-r border-black print:px-0.5 print:py-0.5">10</td>
              <td className="px-1 py-1 whitespace-nowrap text-xxs print:px-0.5 print:py-0.5">20</td>
            </tr>
            {emptyRows}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-start gap-x-4 print:gap-x-2">
      
        <div className="flex flex-col w-3/5 items-start">
          <div className="w-full mb-3 print:mb-1">
            <div className="flex border border-black rounded-t-md text-xxs font-semibold h-8 print:h-6 print:text-[7pt]">
              <div className="flex-1/2 flex items-center justify-start p-1 border-r border-black print:p-0.5">
                Goods Received by Transporter:
              </div>
              <div className="flex-1/2 flex items-center justify-start p-1 print:p-0.5">
                Goods Dispatched By:
              </div>
            </div>
            <table className="min-w-full divide-y divide-black border border-black rounded-b-md print:text-[6.5pt]">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Name in Full</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Signature</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Name in Full</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider w-1/4 print:px-0.5 print:py-0.5">Signature</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black">
                <tr>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs print:py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full mb-3 print:mb-1">
            <div className="flex border border-black rounded-t-md text-xxs font-semibold h-8 items-center justify-center print:h-6 print:text-[7pt]">
              Goods Received at Customer by:
            </div>
            <table className="min-w-full divide-y divide-black border border-black rounded-b-md print:text-[6.5pt]">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Name in Full</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Signature</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider border-r border-black print:px-0.5 print:py-0.5">Date</th>
                  <th scope="col" className="px-1 py-1 text-left text-xxs font-semibold uppercase tracking-wider w-1/4 print:px-0.5 print:py-0.5">Actual Delivery Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black">
                <tr>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs border-r border-black print:py-2"></td>
                  <td className="px-1 py-4 whitespace-nowrap text-xxs print:py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Border Box */}
          <>
            <div className="w-full border border-black rounded-md p-0.5 h-6 mt-3 print:h-4 print:mt-1">
              {/* This box is now significantly smaller */}
            </div>
            <div className="text-center mt-1 font-bold print:mt-0.5">
              <p className="text-xxs print:text-[6pt]">
                This delivery note is subject to our standard Terms and Conditions, a copy of which is
              </p>
              <p className="text-xxs print:text-[6pt]">
                available on request.
              </p>
            </div>
          </>
        </div>

        {/* Right View (Barcodes) */}
        {/* Adjusted gap and padding for print */}
        <div className="flex flex-col w-2/5 items-center justify-start gap-y-4 pt-4 print:gap-y-2 print:pt-2">
          {/* First Barcode */}
          <div className="flex flex-col items-center">
            {/* Replaced placeholder with BarcodeGenerator */}
            <BarcodeGenerator value="50204741" />
            <span className="text-sm mt-2 print:text-[8pt] print:mt-1">50204741</span>
          </div>

          {/* Second Barcode (Longer) */}
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 print:text-[8pt] print:mb-1">24001524 SO_AGABARA1_50204741</span>
            {/* Replaced placeholder with BarcodeGenerator */}
            <BarcodeGenerator value="24001524SO_AGABARA1_50204741" isLong={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryContent;

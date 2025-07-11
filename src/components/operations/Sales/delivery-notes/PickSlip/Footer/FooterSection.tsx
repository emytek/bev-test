import React from 'react';
import SignatureLine from './SignatureLine';
import TimeDateInputLine from './TimeDateInputLine';

/**
 * FooterSection component for the document.
 * Features a 2-row, 9-column grid layout with specific text and input line formats.
 * Designed with responsiveness in mind, collapsing columns on smaller screens.
 */
const FooterSection: React.FC = () => {
  return (
    <footer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 gap-x-4 gap-y-6 mt-8 p-4 border-t border-gray-300">
      {/* FIRST ROW */}

      {/* Group 1: Goods Picked By */}
      <div className="col-span-full sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-2 sm:gap-x-4">
        <div className="flex flex-col text-sm font-bold whitespace-nowrap">
          <span>Goods Picked</span>
          <span>By:</span>
        </div>
        <SignatureLine label="Name in full:" type="name" className="flex-grow" />
        <SignatureLine label="Signature:" type="signature" />
      </div>

      {/* Group 2: Goods Loaded By */}
      <div className="col-span-full sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-2 sm:gap-x-4 mt-4 sm:mt-0">
        <div className="flex flex-col text-sm font-bold whitespace-nowrap">
          <span>Goods Loaded</span>
          <span>By:</span>
        </div>
        <SignatureLine label="Name in full:" type="name" className="flex-grow" />
        <SignatureLine label="Signature:" type="signature" />
      </div>

      {/* Group 3: Loaded Goods checked by Transporter */}
      <div className="col-span-full sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-2 sm:gap-x-4 mt-4 md:mt-0">
        <div className="flex flex-col text-sm font-bold whitespace-nowrap">
          <span>Loaded Goods</span>
          <span>checked by</span>
          <span>Transporter</span>
        </div>
        <SignatureLine label="Name in full:" type="name" className="flex-grow" />
        <SignatureLine label="Signature:" type="signature" />
      </div>

      {/* SECOND ROW */}

      {/* Group 1 Time/Date */}
      <div className="col-span-full sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-2 sm:gap-x-4">
        <div className="col-span-1"></div> {/* Empty column 1 */}
        <TimeDateInputLine label="Time Load" format="time" className="flex-grow" />
        <TimeDateInputLine label="Date" format="date" />
      </div>

      {/* Group 2 Time/Date */}
      <div className="col-span-full sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-2 sm:gap-x-4 mt-4 sm:mt-0">
        <div className="col-span-1"></div> {/* Empty column 4 */}
        <TimeDateInputLine label="Time Load" format="time" className="flex-grow" />
        <TimeDateInputLine label="Date" format="date" />
      </div>

      {/* Group 3 Time/Date */}
      <div className="col-span-full sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-2 sm:gap-x-4 mt-4 md:mt-0">
        <div className="col-span-1"></div> {/* Empty column 7 */}
        <TimeDateInputLine label="Time Checked:" format="time" className="flex-grow" />
        <TimeDateInputLine label="Date" format="date" />
      </div>

    </footer>
  );
};

export default FooterSection;
// components/FooterComponentV2.tsx
import React from 'react';

interface FooterComponentV2Props {
  // No props needed for this static content currently
}

const FooterComponentV2: React.FC<FooterComponentV2Props> = () => {
  // Common styles for the H and Date underlines to promote reusability and consistency
  const H_UNDERLINE_CLASSES = "flex items-center w-full text-center mt-3";
  const H_LINE_CLASSES = "flex-1 border-b border-black print:min-w-[12px]";
  const DATE_UNDERLINE_CLASSES = "flex items-center w-full text-center mt-3";
  const DATE_LINE_CLASSES = "flex-1 border-b border-black print:min-w-[12px]";

  return (
    // Outer div for the footer section, minimal padding
    // Font size controlled by the parent PickSlipContent for print
    <div className="bg-white px-2 py-3 font-sans print:text-[8pt]">
      {/* Main grid for the three parts: Goods Picked, Goods Loaded, Transporter */}
      <div className="grid grid-cols-3 gap-x-4">

        {/* --- PART 1: Goods Picked By --- */}
        <div className="flex items-start justify-between">
          {/* 1st Subsection: Bold Label */}
          <div className="flex flex-col items-center justify-start text-center mr-2">
            <p className="font-bold leading-tight">Goods Picked</p>
            <p className="font-bold leading-tight">By:</p>
          </div>

          {/* 2nd Subsection: Name & Time (Vertical Alignment) */}
          <div className="flex flex-col items-start justify-start ml-2 mr-2">
            <p className="whitespace-nowrap leading-snug">Name in full:</p>
            {/* Increased mt for more space between text and line */}
            <div className="w-full border-b border-black mt-3 mb-4"></div> {/* Changed mt from 1 to 3 */}

            <p className="leading-snug mt-2">Time Load</p>
            <p className="leading-snug whitespace-nowrap">completed:</p>
            <div className={H_UNDERLINE_CLASSES}>
              <div className={H_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">H</span>
              <div className={H_LINE_CLASSES}></div>
            </div>
          </div>

          {/* 3rd Subsection: Signature & Date (Vertical Alignment) */}
          <div className="flex flex-col items-start justify-start ml-2">
            <p className="whitespace-nowrap leading-snug">Signature:</p>
            {/* Increased mt for more space between text and line */}
            <div className="w-4/5 border-b border-black mt-3 mb-4" style={{ minWidth: '35px' }}></div> {/* Changed mt from 1 to 3 */}

            <p className="leading-snug mt-2">Date:</p>
            <p className="leading-snug whitespace-nowrap hidden">completed:</p>
            <div className={DATE_UNDERLINE_CLASSES}>
              <div className={DATE_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">/</span>
              <div className={DATE_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">/20</span>
              <div className={DATE_LINE_CLASSES}></div>
            </div>
          </div>
        </div>

        {/* --- PART 2: Goods Loaded By --- */}
        <div className="flex items-start justify-between">
          {/* 1st Subsection: Bold Label */}
          <div className="flex flex-col items-center justify-start text-center mr-2">
            <p className="font-bold leading-tight">Goods Loaded</p>
            <p className="font-bold leading-tight">By:</p>
          </div>

          {/* 2nd Subsection: Name & Time (Vertical Alignment) */}
          <div className="flex flex-col items-start justify-start ml-2 mr-2">
            <p className="whitespace-nowrap leading-snug">Name in full:</p>
            {/* Increased mt for more space between text and line */}
            <div className="w-full border-b border-black mt-3 mb-4"></div> {/* Changed mt from 1 to 3 */}

            <p className="leading-snug mt-2">Time Load</p>
            <p className="leading-snug whitespace-nowrap">completed:</p>
            <div className={H_UNDERLINE_CLASSES}>
              <div className={H_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">H</span>
              <div className={H_LINE_CLASSES}></div>
            </div>
          </div>

          {/* 3rd Subsection: Signature & Date (Vertical Alignment) */}
          <div className="flex flex-col items-start justify-start ml-2">
            <p className="whitespace-nowrap leading-snug">Signature:</p>
            {/* Increased mt for more space between text and line */}
            <div className="w-4/5 border-b border-black mt-3 mb-4" style={{ minWidth: '35px' }}></div> {/* Changed mt from 1 to 3 */}

            <p className="leading-snug mt-2">Date:</p>
            <p className="leading-snug whitespace-nowrap hidden">completed:</p>
            <div className={DATE_UNDERLINE_CLASSES}>
              <div className={DATE_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">/</span>
              <div className={DATE_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">/20</span>
              <div className={DATE_LINE_CLASSES}></div>
            </div>
          </div>
        </div>

        {/* --- PART 3: Loaded Goods checked by Transporter --- */}
        <div className="flex items-start justify-between">
          {/* 1st Subsection: Bold Label */}
          <div className="flex flex-col items-center justify-start text-center mr-2">
            <p className="font-bold leading-tight">Loaded goods</p>
            <p className="font-bold leading-tight">checked by</p>
            <p className="font-bold leading-tight">Transporter</p>
          </div>

          {/* 2nd Subsection: Name & Time (Vertical Alignment) */}
          <div className="flex flex-col items-start justify-start ml-2 mr-2">
            <p className="whitespace-nowrap leading-snug">Name in full:</p>
            {/* Increased mt for more space between text and line */}
            <div className="w-full border-b border-black mt-3 mb-4"></div> {/* Changed mt from 1 to 3 */}

            <p className="leading-snug mt-2">Time Load</p>
            <p className="leading-snug whitespace-nowrap">completed:</p>
            <div className={H_UNDERLINE_CLASSES}>
              <div className={H_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">H</span>
              <div className={H_LINE_CLASSES}></div>
            </div>
          </div>

          {/* 3rd Subsection: Signature & Date (Vertical Alignment) */}
          <div className="flex flex-col items-start justify-start ml-2">
            <p className="whitespace-nowrap leading-snug">Signature:</p>
            {/* Increased mt for more space between text and line */}
            <div className="w-4/5 border-b border-black mt-3 mb-4" style={{ minWidth: '35px' }}></div> {/* Changed mt from 1 to 3 */}

            <p className="leading-snug mt-2">Date:</p>
            <p className="leading-snug whitespace-nowrap hidden">completed:</p>
            <div className={DATE_UNDERLINE_CLASSES}>
              <div className={DATE_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">/</span>
              <div className={DATE_LINE_CLASSES}></div>
              <span className="px-1 font-bold leading-none">/20</span>
              <div className={DATE_LINE_CLASSES}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FooterComponentV2;
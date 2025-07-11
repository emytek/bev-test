// src/App.tsx
import HeaderSection from './Header';
import DocumentDetailsSection from './DocumentDetail';
   
const DeliveryCopyPrintableContent: React.FC = () => {
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
          <HeaderSection />
          {/* Render the Mid Section component */}
          {/* <MidSection /> */}
          {/* Further sections of your document would go here */}
          <DocumentDetailsSection />
        </div>
      </div>
    );
};
  
  export default DeliveryCopyPrintableContent;
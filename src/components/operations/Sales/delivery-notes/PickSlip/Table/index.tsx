import React from 'react';

// Define the interface for the props of DetailedPickslipTable
interface DetailedPickslipTableProps {
  // Headers are provided as an array of strings
  headers: string[];
  // Data is a 2D array of strings, representing rows and columns
  data: string[][];
}

/**
 * DetailedPickslipTable Component
 *
 * This component renders a comprehensive table, typically used for detailed pickslip information.
 * It supports a large number of columns (14 in this case) and includes responsive
 * design to handle overflow on smaller screens via horizontal scrolling.
 *
 * Adheres to enterprise-level standards for:
 * - React & TypeScript: Strong typing for props, functional component.
 * - Tailwind CSS: Utility-first for styling, ensuring consistency and performance.
 * - Design Aesthetics: Clean, black-and-white theme with clear borders and alternating row colors.
 * - Responsiveness: `overflow-x-auto` enables horizontal scrolling on smaller screens.
 * - Code Quality: Clear variable names, comments, and modular structure.
 * - Scalability & Performance: Efficient rendering of table data.
 *
 * Props:
 * - headers: An array of strings for table column headers.
 * - data: A 2D array of strings for the table rows and cells.
 */
const DetailedPickslipTable: React.FC<DetailedPickslipTableProps> = ({ headers, data }) => {
  return (
    // Outer container for the table.
    // `overflow-x-auto` ensures horizontal scrolling if the table content
    // exceeds the screen width, crucial for tables with many columns.
    // `mb-8` adds margin below the table.
    // `border border-gray-300 rounded-md` provides a subtle border and rounded corners for the table container.
    <div className="overflow-x-auto mb-8 border border-gray-300 rounded-md">
      {/* The table element itself.
          `min-w-full` ensures the table takes at least the full width of its container,
          allowing `overflow-x-auto` to kick in if content is wider.
          `border-collapse` removes spacing between table cells.
          `text-left text-sm` sets default text alignment and size for the entire table. */}
      <table className="min-w-full border-collapse text-left text-sm">
        {/* Table Header Section */}
        <thead>
          <tr>
            {/* Map over the headers array to create table header cells (<th>) */}
            {headers.map((header, index) => (
              <th
                key={index} // Unique key for each header cell
                // Styling for header cells:
                // `px-2 py-1`: Padding inside cells.
                // `text-left font-semibold`: Left-aligned, bold text.
                // `border border-gray-300`: Borders for separation.
                // `bg-gray-100`: Light gray background for header row.
                // `whitespace-nowrap`: Prevents header text from wrapping, ensuring single line.
                className="px-2 py-1 text-left font-semibold border border-gray-300 bg-gray-100 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body Section */}
        <tbody>
          {/* Map over the data array to create table rows (<tr>) */}
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex} // Unique key for each row
              // Conditional background for alternating row colors, improving readability.
              className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              {/* Map over each row's data to create table data cells (<td>) */}
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex} // Unique key for each cell
                  // Styling for data cells:
                  // `px-2 py-1`: Padding inside cells.
                  // `border border-gray-300`: Borders for separation.
                  // `whitespace-nowrap`: Prevents cell content from wrapping, ensuring single line.
                  className="px-2 py-1 border border-gray-300 whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedPickslipTable;

// src/components/SignatureTable.tsx
import React from 'react';

interface SignatureTableProps {
  headers: string[];
  data: string[][];
}

const SignatureTable: React.FC<SignatureTableProps> = ({ headers, data }) => {
  return (
    <div className="border border-gray-300 rounded-b-md overflow-hidden"> {/* Rounded bottom edges */}
      <table className="w-full border-collapse text-left text-[10px]">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-2 py-1 text-left font-semibold border border-gray-300 bg-gray-100 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="h-10"> {/* Fixed height for signature rows */}
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-2 py-1 border border-gray-300 whitespace-nowrap">
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

export default SignatureTable;
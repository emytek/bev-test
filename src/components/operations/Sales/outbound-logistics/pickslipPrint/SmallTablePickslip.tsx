// src/components/SmallTablePickslip.tsx
import React from "react";

interface SmallTablePickslipProps {
  headers?: string[];
  data: string[][];
  className?: string; // To allow external styling like row spanning
}

const SmallTablePickslip: React.FC<SmallTablePickslipProps> = ({
  data,
  className,
}) => {
  return (
    <div
      className={`border border-black rounded-md overflow-hidden ${className}`}
    >
      <table className="min-w-full border-collapse text-left text-xs">
        {/* <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-2 py-1 text-left font-semibold border border-black bg-gray-100 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead> */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-2 py-1 border border-black whitespace-nowrap ${
                    cellIndex === 0 ? "font-bold" : ""
                  }`}
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

export default SmallTablePickslip;

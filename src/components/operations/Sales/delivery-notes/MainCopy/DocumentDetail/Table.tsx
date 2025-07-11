// src/components/TableComponent.tsx
import React from 'react';

interface TableComponentProps {
  headers: string[];
  data: string[][];
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto mb-8 border border-gray-300 rounded-md">
      <table className="min-w-full border-collapse text-left text-sm">
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
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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

export default TableComponent;
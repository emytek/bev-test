// components/production/analytics/charts/ProductionVolumeChart.tsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FiAlertCircle } from 'react-icons/fi';

interface ProductionVolumeData {
  date: string; // e.g., 'Jan', 'Feb', 'Mon', 'Tue' or actual dates
  produced: number;
  target?: number; // Optional target line
}

interface ProductionVolumeChartProps {
  data: ProductionVolumeData[];
}

export const ProductionVolumeChart: React.FC<ProductionVolumeChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FiAlertCircle className="w-12 h-12 mb-2 text-gray-400" />
        <p>No production volume data available for the selected period.</p>
    </div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
            labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
            itemStyle={{ color: '#4b5563' }}
          />
          <Legend wrapperStyle={{ fontSize: "14px", paddingTop: '10px' }} />
          {data[0]?.target !== undefined && (
             <Bar dataKey="target" fill="#a3bfeb" name="Target Output" radius={[4, 4, 0, 0]} />
          )}
          <Bar dataKey="produced" fill="#3b82f6" name="Actual Output" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


interface OrderStatusData {
  name: string; // e.g., 'Completed', 'Delayed', 'In Progress'
  value: number;
}

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6B7280']; // Green, Yellow, Blue, Red, Gray

interface OrderStatusDistributionChartProps {
  data: OrderStatusData[];
}

export const OrderStatusDistributionChart: React.FC<OrderStatusDistributionChartProps> = ({ data }) => {
   if (!data || data.length === 0) {
    return <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FiAlertCircle className="w-12 h-12 mb-2 text-gray-400" />
        <p>No order status data available for the selected period.</p>
    </div>;
  }
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // For Donut shape
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}
            formatter={(value: number, name: string) => [`${value} orders`, name]}
          />
          <Legend wrapperStyle={{ fontSize: "14px", paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusDistributionChart;


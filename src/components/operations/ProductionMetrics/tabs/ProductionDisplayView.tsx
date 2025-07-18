// components/production/analytics/ProductionAnalyticsPage.tsx
import React, { useState, useMemo } from 'react';
import { FiBarChart2, FiCalendar, FiFilter, FiTrendingUp, FiCheckCircle, FiClock, FiPackage } from 'react-icons/fi';
import { DateRangePicker } from 'react-date-range'; // Example: using react-date-range
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns';
import OrderStatusDistributionChart, { ProductionVolumeChart } from './Metrics';


// Define types for Analytics Data
interface KPIStat {
  title: string;
  value: string | number;
  previousValue?: string | number; // For comparison (e.g. vs last period)
  unit?: string;
  icon: React.ElementType;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface AnalyticsFilters {
  dateRange: {
    startDate: Date;
    endDate: Date;
    key: string;
  };
  productCategory?: string;
  workCenter?: string;
}

// Dummy data - In a real app, this would come from API calls based on filters
const dummyKPIs: KPIStat[] = [
  { title: 'Total Orders Completed', value: 1250, previousValue: 1180, unit: 'orders', icon: FiCheckCircle, iconColor: 'text-green-500', trend: 'up' },
  { title: 'On-Time Completion Rate', value: 92, previousValue: 90, unit: '%', icon: FiTrendingUp, iconColor: 'text-blue-500', trend: 'up' },
  { title: 'Avg. Cycle Time', value: 3.5, previousValue: 3.8, unit: 'days', icon: FiClock, iconColor: 'text-yellow-500', trend: 'down' }, // Lower is better
  { title: 'Total Output', value: 78500, previousValue: 75000, unit: 'units', icon: FiPackage, iconColor: 'text-indigo-500', trend: 'up' },
];

const ProductionDisplayView: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: 'selection',
    },
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Placeholder for actual data fetching and processing based on filters
  // const { data, loading, error } = useAnalyticsData(filters);

  const handleDateChange = (ranges: any) => {
    setFilters(prev => ({ ...prev, dateRange: ranges.selection }));
  };

  // Memoize chart data to prevent re-computation if not needed
  const chartData = useMemo(() => {
    // This is where you'd process data from your API based on filters
    return {
      productionVolume: [ /* ... data for ProductionVolumeChart ... */ ],
      orderStatus: [ /* ... data for OrderStatusDistributionChart ... */ ],
      topProducts: [ /* ... data for TopProductsChart ... */ ],
      cycleTime: [ /* ... data for CycleTimeByWorkCenterChart ... */ ],
      detailedOrders: [ /* ... data for AnalyticsDataTable ... */ ],
    };
  }, [filters /*, data */]); // Add 'data' once API integration is done

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center">
          <FiBarChart2 className="mr-3 text-blue-600" />
          Production Order Analytics
        </h1>
      </header>

      {/* Filters Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Date Range Picker */}
          <div className="relative">
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex items-center justify-between"
            >
              <span>
                {`${filters.dateRange.startDate.toLocaleDateString()} - ${filters.dateRange.endDate.toLocaleDateString()}`}
              </span>
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </button>
            {showDatePicker && (
              <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                <DateRangePicker
                  ranges={[filters.dateRange]}
                  onChange={handleDateChange}
                  months={2}
                  direction="horizontal"
                  showDateDisplay={false}
                />
                <div className="p-2 text-right border-t border-gray-200">
                    <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Apply
                    </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Category Filter (Example) */}
          <div>
            <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
            <select
              id="product-category"
              value={filters.productCategory || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, productCategory: e.target.value }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              <option value="widget-a">Widget A</option>
              <option value="component-b">Component B</option>
              {/* Add more options */}
            </select>
          </div>

          {/* Work Center Filter (Example) */}
          <div>
            <label htmlFor="work-center" className="block text-sm font-medium text-gray-700 mb-1">Work Center</label>
            <select
              id="work-center"
              value={filters.workCenter || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, workCenter: e.target.value }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Work Centers</option>
              <option value="wc-01">WC-01</option>
              <option value="wc-02">WC-02</option>
              {/* Add more options */}
            </select>
          </div>
          <button className="mt-4 md:mt-0 w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center text-sm">
            <FiFilter className="mr-2 h-4 w-4" /> Apply Filters
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dummyKPIs.map((kpi) => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Production Volume Over Time" icon={FiTrendingUp}>
          <ProductionVolumeChart data={chartData.productionVolume} />
        </ChartCard>
        <ChartCard title="Order Status Distribution" icon={FiCheckCircle}>
          <OrderStatusDistributionChart data={chartData.orderStatus} />
        </ChartCard>
      </div>

    </div>
  );
};

export default ProductionDisplayView;


// Reusable StatCard Component
interface StatCardProps extends KPIStat {}

const StatCard: React.FC<StatCardProps> = ({ title, value, previousValue, unit, icon: Icon, iconColor = 'text-blue-500', trend }) => {
  const valueFormatted = typeof value === 'number' ? value.toLocaleString() : value;
  const prevValueFormatted = typeof previousValue === 'number' ? previousValue.toLocaleString() : previousValue;
  let trendIndicator = null;
  let trendColor = 'text-gray-500';
  let changePercentage: number | null = null;

  if (typeof value === 'number' && typeof previousValue === 'number' && previousValue !== 0) {
    changePercentage = parseFloat((((value - previousValue) / previousValue) * 100).toFixed(1));
  }

  if (trend && changePercentage !== null) {
    if (changePercentage > 0) {
        trendIndicator = <FiTrendingUp className="h-4 w-4" />;
        trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500'; // Green if trend is 'up' and value increased
    } else if (changePercentage < 0) {
        trendIndicator = <FiTrendingDown className="h-4 w-4" />; // Assuming FiTrendingDown exists or use FiTrendingUp with rotation
        trendColor = trend === 'down' ? 'text-green-500' : 'text-red-500'; // Green if trend is 'down' and value decreased (good)
    }
  }


  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-full ${iconColor.replace('text-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        {trendIndicator && changePercentage !== null && (
            <span className={`flex items-center text-xs font-semibold ${trendColor}`}>
                {trendIndicator}
                {Math.abs(changePercentage)}%
            </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-1">
        {valueFormatted}
        {unit && <span className="text-lg font-medium text-gray-500 ml-1">{unit}</span>}
      </p>
      {previousValue !== undefined && (
        <p className="text-xs text-gray-400 mt-1">
          vs. {prevValueFormatted} {unit && unit} (last period)
        </p>
      )}
    </div>
  );
};

// Reusable ChartCard Component
interface ChartCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isTable?: boolean; // To adjust padding for tables
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children, isTable }) => (
  <div className="bg-white rounded-xl shadow-lg">
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      {/* <button className="text-gray-400 hover:text-gray-600">
        <FiMaximize className="h-5 w-5" />
      </button> */}
    </div>
    <div className={isTable ? "p-0" : "p-4"}> {/* No padding if it's a table container */}
      {children}
    </div>
  </div>
);

// Dummy FiTrendingDown icon (react-icons might not have it directly, adjust as needed)
const FiTrendingDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
);
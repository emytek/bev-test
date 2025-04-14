  
  interface ProductionMetricProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }
  
  export const ProductionMetric: React.FC<ProductionMetricProps> = ({ label, value, icon, color }) => (
    <div className="flex items-center justify-between border-b border-gray-100 py-2 text-sm text-gray-500 font-medium">
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    </div>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
  
  export const StatusBadge = ({ status }: { status: string }) => {
    const statusColors: Record<string, string> = {
      Synced: 'bg-green-100 text-green-600',
      Posted: 'bg-blue-100 text-blue-600',
      Pending: 'bg-yellow-100 text-yellow-600',
      Failed: 'bg-red-100 text-red-600',
    };
  
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };
  

  
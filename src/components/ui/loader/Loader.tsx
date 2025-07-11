import { Loader2 } from "lucide-react"; 

const Loader = ({ message = "Loading...", fullScreen = true }) => {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
          : "flex items-center justify-center py-8"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loader;

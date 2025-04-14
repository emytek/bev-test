import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaClock,
  FaCheck,
} from "react-icons/fa"; 

interface ProductionItem {
  id: number;
  productName: string;
  completed: number;
  failed: number;
  ignored: number;
  pending: number;
  confirmed: number;
}

const dailyProductionData: ProductionItem[] = [
  {
    id: 1,
    productName: "Widget A",
    completed: 85,
    failed: 5,
    ignored: 2,
    pending: 10,
    confirmed: 102,
  },
  {
    id: 2,
    productName: "Gear B",
    completed: 120,
    failed: 3,
    ignored: 0,
    pending: 5,
    confirmed: 128,
  },
  {
    id: 3,
    productName: "Assembly C",
    completed: 55,
    failed: 8,
    ignored: 1,
    pending: 15,
    confirmed: 79,
  },
  {
    id: 4,
    productName: "Component D",
    completed: 150,
    failed: 2,
    ignored: 3,
    pending: 0,
    confirmed: 155,
  },
  {
    id: 5,
    productName: "Module E",
    completed: 95,
    failed: 1,
    ignored: 0,
    pending: 7,
    confirmed: 103,
  },
];

export default function DailyProduction() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daily Production Status
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tracking production progress for today
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            View Report
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                <span className="hidden sm:inline">Product</span>
                <span className="inline sm:hidden">Prod.</span>
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                <FaCheckCircle className="w-5 h-5 inline-block mr-1 text-green-500" />
                <span className="hidden sm:inline">Completed</span>
                <span className="inline sm:hidden">Comp.</span>
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                <FaTimesCircle className="w-5 h-5 inline-block mr-1 text-red-500" />
                <span className="hidden sm:inline">Failed</span>
                <span className="inline sm:hidden">Fail.</span>
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                <FaPauseCircle className="w-5 h-5 inline-block mr-1 text-gray-400 dark:text-gray-500" />
                <span className="hidden sm:inline">Ignored</span>
                <span className="inline sm:hidden">Ign.</span>
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                <FaClock className="w-5 h-5 inline-block mr-1 text-yellow-500" />
                <span className="hidden sm:inline">Pending</span>
                <span className="inline sm:hidden">Pend.</span>
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                <FaCheck className="w-5 h-5 inline-block mr-1 text-blue-500" />
                <span className="hidden sm:inline">Confirmed</span>
                <span className="inline sm:hidden">Conf.</span>
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {dailyProductionData.map((item) => (
              <TableRow key={item.id} className="">
                <TableCell className="py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {item.productName}
                </TableCell>
                <TableCell className="py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                  {item.completed}
                </TableCell>
                <TableCell className="py-3 text-red-500 text-center text-theme-sm dark:text-red-400">
                  {item.failed}
                </TableCell>
                <TableCell className="py-3 text-gray-400 text-center text-theme-sm dark:text-gray-500">
                  {item.ignored}
                </TableCell>
                <TableCell className="py-3 text-yellow-500 text-center text-theme-sm dark:text-yellow-400">
                  {item.pending}
                </TableCell>
                <TableCell className="py-3 text-blue-500 text-center text-theme-sm dark:text-blue-400">
                  {item.confirmed}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

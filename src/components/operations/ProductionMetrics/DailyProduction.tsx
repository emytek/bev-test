import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../ui/table";
  import Badge from "../../ui/badge/Badge";
  
  // Daily production data types
  interface DailyProductionItem {
    id: number;
    name: string;
    productionType: "Synchronized" | "Posted";
    status: "Successful" | "Failed";
  }
  
  // Mocked production data
  const synchronizedData: DailyProductionItem[] = [
    {
      id: 1,
      name: "WYZE Cap Assembly",
      productionType: "Synchronized",
      status: "Successful",
    },
    {
      id: 2,
      name: "Sensor Pack A",
      productionType: "Synchronized",
      status: "Successful",
    },
    {
      id: 3,
      name: "Label Print Test",
      productionType: "Synchronized",
      status: "Failed",
    },
  ];
  
  const postedData: DailyProductionItem[] = [
    {
      id: 1,
      name: "WYZE Cap Assembly",
      productionType: "Posted",
      status: "Successful",
    },
    { id: 2, name: "Sensor Pack A", productionType: "Posted", status: "Failed" },
    {
      id: 3,
      name: "Quality Batch B",
      productionType: "Posted",
      status: "Successful",
    },
  ];
  
  export default function DailyProductionTables() {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    const renderTable = (title: string, data: DailyProductionItem[]) => (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full lg:min-w-[400px]">
          <div className="px-4 pt-4 pb-3 sm:px-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {title} - {today}
              </h3>
            </div>
            <div className="max-w-full overflow-x-auto">
              <Table className="w-full"> {/* Ensured Table takes full width */}
                <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.map((item) => (
                    <TableRow key={item.id} className="h-12">
                      <TableCell className="py-3 text-sm font-medium text-gray-700 dark:text-white/90">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
                        {item.productionType}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          color={item.status === "Successful" ? "success" : "error"}
                          variant="light"
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    
      return (
        <div className="w-full px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6"> {/* Changed grid to flex for better responsiveness */}
            {renderTable("Synchronized Data", synchronizedData)}
            {renderTable("Posted Data", postedData)}
          </div>
        </div>
      );
  }
  
import StatisticsChart from "../../StatisticsChart";
import PageMeta from "../../../common/PageMeta";
import { ProductionOverview } from "../TotalProduction";
import MonthlyProductionChart from "../MonthlyProduction";
import DailyProductionTables from "../DailyProduction";
import DailyProduction from "../../RecentProduction";


export default function ProductionAnalytics() {
  return (
    <>
      <PageMeta
        title="Bevcan App"
        description="Solution ReactPWA for Bevcan"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <ProductionOverview />

          <DailyProductionTables />
          {/* <MonthlySalesChart /> */}
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyProductionChart />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <DailyProduction />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>
    </>
  );
}

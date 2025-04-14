import StatisticsChart from "../../components/operations/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import { ProductionOverview } from "../../components/operations/ProductionMetrics/TotalProduction";
import MonthlyProductionChart from "../../components/operations/ProductionMetrics/MonthlyProduction";
import DailyProductionTables from "../../components/operations/ProductionMetrics/DailyProduction";
import DailyProduction from "../../components/operations/RecentProduction";


export default function Production() {
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

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}
      </div>
    </>
  );
}

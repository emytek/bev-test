import MonthlySalesChart from "../../components/operations//MonthlySalesChart";
import MonthlyTarget from "../../components/operations//MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import DailyProduction from "../../components/operations//RecentProduction";
import StoreOperationsStatus from "../../components/operations//RecentStores";
import WarehouseAndSalesMetrics from "../../components/operations//OtherMetrics";
import OperationsOverview from "../../components/operations/OperationsOverview";
//import Barcode from "react-barcode";


export default function Home() {
  return (
    <>
      <PageMeta
        title="Bevcan App"
        description="Solution ReactPWA for Bevcan"
      />
       {/* <Barcode value="62682982" /> */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <OperationsOverview />
          <WarehouseAndSalesMetrics />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <MonthlySalesChart />
          {/* <DemographicCard /> */}
        </div>
        
        <div className="col-span-12">
          <DailyProduction />
        </div>

        <div className="col-span-12">
          <StoreOperationsStatus />
        </div>
      </div>
    </>
  );
}

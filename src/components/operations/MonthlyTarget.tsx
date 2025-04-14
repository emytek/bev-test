import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

export default function MonthlyTarget() {
  const series = [75.55];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    // <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
    //   <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
    //     <div className="flex justify-between">
    //       <div>
    //         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
    //           Sync status
    //         </h3>
    //         <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
    //           Target you’ve set for each month
    //         </p>
    //       </div>
    //       <div className="relative inline-block">
    //         <button className="dropdown-toggle" onClick={toggleDropdown}>
    //           <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
    //         </button>
    //         <Dropdown
    //           isOpen={isOpen}
    //           onClose={closeDropdown}
    //           className="w-40 p-2"
    //         >
    //           <DropdownItem
    //             onItemClick={closeDropdown}
    //             className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
    //           >
    //             View More
    //           </DropdownItem>
    //           <DropdownItem
    //             onItemClick={closeDropdown}
    //             className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
    //           >
    //             Delete
    //           </DropdownItem>
    //         </Dropdown>
    //       </div>
    //     </div>
    //     <div className="relative ">
    //       <div className="max-h-[330px]" id="chartDarkStyle">
    //         <Chart
    //           options={options}
    //           series={series}
    //           type="radialBar"
    //           height={330}
    //         />
    //       </div>

    //       <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
    //         +10%
    //       </span>
    //     </div>
    //     <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
    //       You earn $3287 today, it's higher than last month. Keep up your good
    //       work!
    //     </p>
    //   </div>

    //   <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
    //     <div>
    //       <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
    //         Target
    //       </p>
    //       <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
    //         $20K
    //         <svg
    //           width="16"
    //           height="16"
    //           viewBox="0 0 16 16"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             clipRule="evenodd"
    //             d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
    //             fill="#D92D20"
    //           />
    //         </svg>
    //       </p>
    //     </div>

    //     <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

    //     <div>
    //       <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
    //         Revenue
    //       </p>
    //       <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
    //         $20K
    //         <svg
    //           width="16"
    //           height="16"
    //           viewBox="0 0 16 16"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             clipRule="evenodd"
    //             d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
    //             fill="#039855"
    //           />
    //         </svg>
    //       </p>
    //     </div>

    //     <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

    //     <div>
    //       <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
    //         Today
    //       </p>
    //       <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
    //         $20K
    //         <svg
    //           width="16"
    //           height="16"
    //           viewBox="0 0 16 16"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             clipRule="evenodd"
    //             d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
    //             fill="#039855"
    //           />
    //         </svg>
    //       </p>
    //     </div>
    //   </div>
    // </div>

    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
  <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-8 dark:bg-gray-900 sm:px-6 sm:pt-6">
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Operational Overview
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Key performance indicators at a glance
        </p>
      </div>
      <div className="relative inline-block">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
        </button>
        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="w-40 p-2"
        >
          <DropdownItem
            onItemClick={closeDropdown}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Details
          </DropdownItem>
          <DropdownItem
            onItemClick={closeDropdown}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Analytics
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
    <div className="relative mt-4">
      <div className="max-h-[330px]" id="chartDarkStyle">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={330}
        />
      </div>

      <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
        Efficiency: +5%
      </span>
    </div>
    <p className="mx-auto mt-8 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
      Overall operational efficiency shows a positive trend. Let's dive into the specifics:
    </p>
  </div>

  <div className="flex items-center justify-around gap-3 px-6 py-4 sm:gap-6 sm:py-5">
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 text-xl font-semibold text-indigo-600 dark:text-indigo-400">
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
        </svg>
        <span className="text-gray-800 dark:text-white/90">98%</span>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        Production Completion
      </p>
    </div>

    <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

    <div className="text-center">
      <div className="flex items-center justify-center gap-2 text-xl font-semibold text-green-600 dark:text-green-400">
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7m-8 0v4m0-4l-8 4m8-4l8 4" />
        </svg>
        <span className="text-gray-800 dark:text-white/90">350</span>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        Units Dispatched
      </p>
    </div>

    <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

    <div className="text-center">
      <div className="flex items-center justify-center gap-2 text-xl font-semibold text-yellow-600 dark:text-yellow-400">
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="text-gray-800 dark:text-white/90">15</span>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        Low Stock Items
      </p>
    </div>
  </div>
</div>
  );
}

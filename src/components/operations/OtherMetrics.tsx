import {
    FaTruckLoading,
    FaShoppingCart,
    FaArrowUp,
    FaArrowDown,
  } from "react-icons/fa"; 
  import Badge from "../ui/badge/Badge";
  import { motion, type Variants } from "framer-motion";
  import { easeOut } from "framer-motion";
  
  // const cardVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  // };
  const cardVariants: Variants = { // Explicitly type cardVariants as Variants
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut, // <-- Use the imported easeOut function here
      },
    },
  };
   
  interface Props {}
  
  const WarehouseAndSalesMetrics: React.FC<Props> = () => {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
      >
        {/* Warehouse Dispatch Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)" }}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-800">
            <FaTruckLoading className="text-blue-800 size-6 dark:text-blue-400" />
          </div>
  
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Items Dispatched
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                1,257
              </h4>
            </div>
            <Badge color="success">
              <FaArrowUp />
              7.32%
            </Badge>
          </div>
        </motion.div>
  
        {/* Sales Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)" }}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-800">
            <FaShoppingCart className="text-green-800 size-6 dark:text-green-400" />
          </div>
  
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Sales Revenue
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                ₦ 8,954,000
              </h4>
            </div>
            <Badge color="warning">
              <FaArrowDown />
              2.18%
            </Badge>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  export default WarehouseAndSalesMetrics;
import {
  FaIndustry, // Icon for Production Management
  FaStore, // Icon for Store Operation
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import Badge from "../ui/badge/Badge";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface Props {}

const OperationsOverview: React.FC<Props> = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
    >
      {/* Production Management Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)" }}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-300"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl dark:bg-indigo-800">
          <FaIndustry className="text-indigo-800 size-6 dark:text-indigo-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Production Orders*
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              1,528
            </h4>
          </div>
          <Badge color="success">
            <FaArrowUp />
            5.7%
          </Badge>
        </div>
      </motion.div>

      {/* Store Operation Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)" }}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-300"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl dark:bg-teal-800">
          <FaStore className="text-teal-800 size-6 dark:text-teal-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Average Store Items
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              875
            </h4>
          </div>
          <Badge color="warning">
            <FaArrowDown />
            1.2%
          </Badge>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OperationsOverview;
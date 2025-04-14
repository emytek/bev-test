import React from 'react'
import { ProductionMetric, StatusBadge } from '.'
import { motion } from 'framer-motion';
import { 
    FiCheckCircle, 
    FiXCircle, 
    FiClock, 
    FiRefreshCcw, 
    FiAlertTriangle, 
    FiInfo 
  } from 'react-icons/fi';
import Badge from '../../ui/badge/Badge';

export const ProductionOverview = () => {
    const data = {
      completed: 120,
      failed: 15,
      pending: 30,
    };
  
    const summary = {
      confirmedTotal: 160,
      failedTotal: 140,
    };
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Production Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.05)' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
            <FiCheckCircle className="text-green-600 w-6 h-6" />
          </div>
  
          <div className="mt-5">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Production</span>
            <div className="mt-3 space-y-2">
              <ProductionMetric
                label="Completed"
                value={data.completed}
                icon={<FiCheckCircle className="w-4 h-4 text-green-600" />}
                color="text-green-600"
              />
              <ProductionMetric
                label="Failed"
                value={data.failed}
                icon={<FiXCircle className="w-4 h-4 text-red-500" />}
                color="text-red-500"
              />
              <ProductionMetric
                label="Pending"
                value={data.pending}
                icon={<FiClock className="w-4 h-4 text-yellow-500" />}
                color="text-yellow-500"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <StatusBadge status="Synced" />
              <StatusBadge status="Posted" />
            </div>
          </div>
        </motion.div>
  
        {/* Production Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.05)' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-300"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">Production Summary</div>
  
          <div className="mb-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">Confirmed Production</div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ProductionMetric
                label="Confirmed"
                value={summary.confirmedTotal}
                icon={<FiCheckCircle className="w-4 h-4 text-green-600" />}
                color="text-green-600"
              />
            </motion.div>
            <motion.div
              className="mt-2 flex gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <StatusBadge status="Synced" />
              <StatusBadge status="Posted" />
            </motion.div>
          </div>
  
          <hr className="my-4" />
  
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Failed Production</div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ProductionMetric
                label="Failed"
                value={summary.failedTotal}
                icon={<FiXCircle className="w-4 h-4 text-red-500" />}
                color="text-red-500"
              />
            </motion.div>
            <motion.div
              className="mt-2 flex gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <StatusBadge status="Failed" />
              <StatusBadge status="Pending" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };








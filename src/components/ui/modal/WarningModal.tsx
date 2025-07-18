// src/components/ui/WarningModal.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface WarningModalProps {
  message: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  timeout?: number; // Milliseconds after which the modal closes automatically
}

const WarningModal: React.FC<WarningModalProps> = ({
  message,
  title = 'Warning',
  isOpen,
  onClose,
  timeout,
}) => {
  useEffect(() => {
    if (isOpen && timeout) {
      const timer = setTimeout(() => {
        onClose();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, timeout]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-yellow-300 dark:border-yellow-600 relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close warning"
            >
              <FaTimes size={18} />
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <FaExclamationTriangle className="text-yellow-500 text-5xl mb-2" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                {message}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors shadow-md"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarningModal;
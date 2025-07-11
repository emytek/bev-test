import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Button from "../button/Button";
import { MdWarningAmber } from "react-icons/md";

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) => {
  // Prevent body scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close icon */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>

            {/* Action buttons */}
            <div className="pt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


type NewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const modalRoot = document.getElementById("modal-root") || document.body;

export const NewModal: React.FC<NewModalProps> = ({ isOpen, onClose, children }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl dark:bg-zinc-900 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};


interface WarningModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  show,
  message,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(onClose, 2000);
      return () => clearTimeout(timeout);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Centered Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-100 px-6 py-4 rounded-xl shadow-2xl max-w-md w-full flex items-start gap-3">
              <MdWarningAmber className="text-3xl mt-1 shrink-0 text-yellow-600 dark:text-yellow-300" />
              <div className="text-sm font-medium">{message}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const ConfirmationFinishModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel"
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <MdWarningAmber className="w-6 h-6 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {title}
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              >
                {cancelLabel}
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export const ConfirmationApprovalModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: ConfirmationModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <MdWarningAmber className="text-yellow-500 text-2xl" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {title}
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>

            <div className="pt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="red"
                onClick={onConfirm}
                className="text-white"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Approval"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto"
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};



interface PostToSAPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  isPosted: boolean;
}

export const PostToSAPDrawer = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  isPosted,
}: PostToSAPDrawerProps) => {
  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Post to SAP
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-yellow-100 text-yellow-800 p-4 rounded-md dark:bg-yellow-200/10 dark:text-yellow-400 mb-6">
            <MdWarningAmber className="h-6 w-6 mt-1" />
            <div>
              <p className="text-sm font-medium">
                This action will post the completed and approved production
                order to SAP.
              </p>
              <p className="text-sm mt-1">Do you want to continue?</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="red"
              disabled={loading || isPosted}
              className={`${
                loading || isPosted
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Posting..." : isPosted ? "Posted" : "Post to SAP"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PostToSAPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  isPosted: boolean;
}

export const PostToSAPModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  isPosted,
}: PostToSAPModalProps) => {
  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 bg-opacity-50 dark:bg-opacity-75 flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ y: "-50%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-50%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Post to SAP
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 bg-yellow-100 text-yellow-800 p-4 rounded-md dark:bg-yellow-200/10 dark:text-yellow-400 mb-6">
              <MdWarningAmber className="h-6 w-6 mt-1" />
              <div>
                <p className="text-sm font-medium">
                  This action will post the completed and approved production
                  order to SAP.
                </p>
                <p className="text-sm mt-1">Do you want to continue?</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                variant="red" // Assuming 'red' variant for destructive actions or primary actions
                disabled={loading || isPosted}
                className={`${
                  loading || isPosted
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white" // Changed to blue for primary action
                }`}
              >
                {loading ? "Posting..." : isPosted ? "Posted" : "Post to SAP"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.classList.add('overflow-hidden'); // Prevent scrolling behind modal
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800 ${className}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <IoClose className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-4">
          {children}
        </div>

        {/* Footer (Optional - you can add a footer with buttons if needed) */}
        {/* <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={onClose}
          >
            Close
          </button>
        </div> */}
      </div>
    </div>,
    document.body // Mount the modal directly to the body to avoid stacking context issues
  );
};

export default CustomModal;
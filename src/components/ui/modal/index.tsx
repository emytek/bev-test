
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  title?: string;
  message?: string; 
}


export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  children,
  className,
  showCloseButton = true,
  // isFullscreen = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className={`bg-white dark:bg-gray-900 rounded-lg p-6 w-96 shadow-lg ${className}`}>
        {showCloseButton && (
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            ✕
          </button>
        )}
        {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>}
        {message && <p className="text-gray-700 dark:text-gray-300">{message}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
};


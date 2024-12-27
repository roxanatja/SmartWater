import React, { MouseEvent, ReactNode, FunctionComponent } from "react";
import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Modal: FunctionComponent<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const closeModal = () => {
    onClose();
  };

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains("modal-background")) {
      closeModal();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="modal-background fixed inset-0 bg-black dark:bg-gray-950 opacity-50"
            onClick={handleBackgroundClick}
          ></div>
          <motion.div
            initial={{ opacity: 0, right: 100, position: "relative" }}
            animate={{ opacity: 1, right: 0, position: "relative" }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0 }}
            className={`${className} w-4/12 max-sm:w-10/12  bg-main-background p-0 rounded-lg z-50 relative shadow-md dark:shadow-slate-500 overflow-auto max-h-[90vh]`}
          >
            <div className="absolute top-0 right-0 p-2 pt-4 z-50 font-bold flex justify-end">
              <button onClick={closeModal} className="flex justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Modal;

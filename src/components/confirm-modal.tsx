"use client";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import { Loader } from "./loader";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "red" | "blue" | "purple";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const getConfirmButtonColor = () => {
    switch (confirmColor) {
      case "red":
        return "bg-red-600 hover:bg-red-700";
      case "blue":
        return "bg-blue-600 hover:bg-blue-700";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700";
      default:
        return "bg-red-600 hover:bg-red-700";
    }
  };

  return (
    <dialog
      open={isOpen}
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur-sm flex justify-center items-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <Button
              variant="outlined"
              placeholder={""}
              onClick={onClose}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </Button>
            <Button
              placeholder={""}
              onClick={handleConfirm}
              disabled={loading}
              className={`${getConfirmButtonColor()} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  <span>Processing...</span>
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
}


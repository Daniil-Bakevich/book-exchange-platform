"use client";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h2 id="modal-title" className="text-xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="flex justify-end pt-6 mt-4 space-x-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary-700"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import { Button } from "./button";

export function Dialog({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dialog-overlay">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md mx-auto bg-finance-surface rounded-lg shadow-xl dialog-content border border-finance-border">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-finance-border ${className}`}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div
      className={`px-6 py-4 border-t border-finance-border bg-finance-dark rounded-b-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold text-finance-light ${className}`}>
      {children}
    </h3>
  );
}

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-finance-secondary mt-2 ${className}`}>
      {children}
    </p>
  );
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive", // destructive, default
  loading = false,
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-finance-light">{title}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-finance-border text-finance-secondary hover:text-finance-light"
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>

      <DialogContent>
        <DialogDescription className="text-finance-secondary">
          {message}
        </DialogDescription>
      </DialogContent>

      <DialogFooter>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto hover:bg-gray-50 hover:border-gray-200 active:scale-95 transition-all duration-150 ease-out"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto hover:bg-red-600 hover:shadow-lg hover:shadow-finance-danger/25 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-finance-danger focus:ring-offset-2 transition-all duration-200 ease-out"
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}

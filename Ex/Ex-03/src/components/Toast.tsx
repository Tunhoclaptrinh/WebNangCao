interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="toast-notification" role="status" aria-live="polite">
      <div className="toast-icon">🛒</div>
      <div className="toast-message">{message}</div>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Đóng thông báo"
      >
        ✕
      </button>
    </div>
  );
}

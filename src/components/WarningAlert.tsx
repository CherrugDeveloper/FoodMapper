interface WarningAlertProps {
  message: string;
}

export function WarningAlert({ message }: WarningAlertProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg bg-red-50/90 text-white font-medium animate-slide-up">
      <div className="flex items-center gap-2">
        <span className="text-red-600">⚠️</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
interface StatusBadgeProps {
  completed: boolean;
  className?: string;
}

export function StatusBadge({ completed, className = "" }: StatusBadgeProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          completed
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
        }`}
      >
        {completed ? '✅ Concluída' : '⏳ Em Andamento'}
      </span>
    </div>
  );
} 
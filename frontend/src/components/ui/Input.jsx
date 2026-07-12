import { cn } from '@/lib/utils';

export function Input({ className, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>}
      <input
        className={cn(
          'bg-white dark:bg-gray-800 border border-[#e8d2e2] dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#714b67] transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

export function Select({ className, label, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>}
      <select
        className={cn(
          'bg-white dark:bg-gray-800 border border-[#e8d2e2] dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white text-sm focus:outline-none focus:border-[#714b67] transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

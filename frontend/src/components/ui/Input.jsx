import { cn } from '@/lib/utils';

export function Input({ className, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-500 dark:text-[#d4adc8]">{label}</label>}
      <input
        className={cn(
          'bg-white dark:bg-[#261828] border border-[#e8d2e2] dark:border-[#4e3347] rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-[#9e6089] focus:outline-none focus:border-[#714b67] transition-colors',
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
      {label && <label className="text-sm text-gray-500 dark:text-[#d4adc8]">{label}</label>}
      <select
        className={cn(
          'bg-white dark:bg-[#261828] border border-[#e8d2e2] dark:border-[#4e3347] rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#714b67] transition-colors',
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

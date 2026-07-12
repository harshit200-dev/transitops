import { cn } from '@/lib/utils';

export function Button({ className, variant = 'default', size = 'default', children, ...props }) {
  const variants = {
    default: 'bg-[#714b67] hover:bg-[#5e3d56] text-white',
    outline: 'border border-[#714b67] text-[#714b67] hover:bg-[#714b67] hover:text-white dark:border-[#9e6089] dark:text-[#d4adc8] dark:hover:bg-[#714b67] dark:hover:text-white',
    ghost: 'hover:bg-[#714b67]/10 text-[#714b67] dark:text-[#d4adc8] dark:hover:bg-[#714b67]/20',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };
  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

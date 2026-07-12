import { cn } from '@/lib/utils';

export function Button({ className, variant = 'default', size = 'default', children, ...props }) {
  const variants = {
    default: 'bg-purple-600 hover:bg-purple-700 text-white',
    outline: 'border border-gray-600 hover:bg-gray-800 text-gray-200',
    ghost: 'hover:bg-gray-800 text-gray-300',
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

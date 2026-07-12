import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6', className)} {...props}>
      {children}
    </div>
  );
}
export function CardHeader({ className, children }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}
export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}>{children}</h3>;
}
export function CardContent({ className, children }) {
  return <div className={cn(className)}>{children}</div>;
}

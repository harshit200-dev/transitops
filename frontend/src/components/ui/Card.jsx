import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('bg-white dark:bg-[#261828] border border-[#e8d2e2] dark:border-[#4e3347] rounded-xl p-6', className)} {...props}>
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

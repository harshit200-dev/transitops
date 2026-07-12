import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  // Vehicle
  Active: 'bg-green-500/20 text-green-400 border-green-500/30',
  Maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Retired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Out of Service': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  // Driver
  Inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
  // Trip
  Scheduled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function Badge({ status, className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      className
    )}>
      {status}
    </span>
  );
}

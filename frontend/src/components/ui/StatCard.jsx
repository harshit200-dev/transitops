export function StatCard({ title, value, subtitle, icon: Icon, color = 'brand' }) {
  const colors = {
    brand:  'bg-[#714b67]/10 text-[#714b67] dark:bg-purple-500/10 dark:text-purple-400',
    blue:   'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green:  'bg-green-500/10 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    red:    'bg-red-500/10 text-red-600 dark:text-red-400',
    purple: 'bg-[#714b67]/10 text-[#714b67] dark:bg-purple-500/10 dark:text-purple-400',
  };
  return (
    <div className="bg-white dark:bg-gray-900 border border-[#e8d2e2] dark:border-gray-800 rounded-xl p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colors[color] || colors.brand}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-black dark:text-white mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'brand' }) {
  const colors = {
    brand:  'bg-[#714b67]/10 text-[#714b67] dark:bg-[#714b67]/20 dark:text-[#d4adc8]',
    blue:   'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green:  'bg-green-500/10 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    red:    'bg-red-500/10 text-red-600 dark:text-red-400',
    purple: 'bg-[#714b67]/10 text-[#714b67] dark:bg-[#714b67]/20 dark:text-[#d4adc8]',
  };
  return (
    <div className="bg-white dark:bg-[#261828] border border-[#e8d2e2] dark:border-[#4e3347] rounded-xl p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colors[color] || colors.brand}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-[#b980a6]">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-[#9e6089] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

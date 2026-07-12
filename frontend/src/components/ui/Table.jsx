export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}
export function Thead({ children }) {
  return <thead className="bg-gray-50 dark:bg-gray-800/50"><tr>{children}</tr></thead>;
}
export function Th({ children, className }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className || ''}`}>
      {children}
    </th>
  );
}
export function Tbody({ children }) {
  return <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{children}</tbody>;
}
export function Tr({ children, className }) {
  return <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${className || ''}`}>{children}</tr>;
}
export function Td({ children, className }) {
  return <td className={`px-4 py-3 text-gray-600 dark:text-gray-300 ${className || ''}`}>{children}</td>;
}

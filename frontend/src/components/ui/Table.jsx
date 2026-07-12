export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e8d2e2] dark:border-gray-800">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}
export function Thead({ children }) {
  return <thead className="bg-[#faf5f9] dark:bg-gray-800/50"><tr>{children}</tr></thead>;
}
export function Th({ children, className }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-[#714b67] dark:text-gray-400 uppercase tracking-wider ${className || ''}`}>
      {children}
    </th>
  );
}
export function Tbody({ children }) {
  return <tbody className="divide-y divide-[#f3e8f0] dark:divide-gray-800">{children}</tbody>;
}
export function Tr({ children, className }) {
  return <tr className={`hover:bg-[#faf5f9] dark:hover:bg-gray-800/30 transition-colors ${className || ''}`}>{children}</tr>;
}
export function Td({ children, className }) {
  return <td className={`px-4 py-3 text-black dark:text-gray-300 ${className || ''}`}>{children}</td>;
}

export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e8d2e2] dark:border-[#4e3347]">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}
export function Thead({ children }) {
  return <thead className="bg-[#faf5f9] dark:bg-[#3d2838]"><tr>{children}</tr></thead>;
}
export function Th({ children, className }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-[#714b67] dark:text-[#d4adc8] uppercase tracking-wider ${className || ''}`}>
      {children}
    </th>
  );
}
export function Tbody({ children }) {
  return <tbody className="divide-y divide-[#f3e8f0] dark:divide-[#3d2838]">{children}</tbody>;
}
export function Tr({ children, className }) {
  return <tr className={`hover:bg-[#faf5f9] dark:hover:bg-[#3d2838]/50 transition-colors ${className || ''}`}>{children}</tr>;
}
export function Td({ children, className }) {
  return <td className={`px-4 py-3 text-gray-600 dark:text-[#e8d2e2] ${className || ''}`}>{children}</td>;
}

import type React from "react";

interface DrawTableProps {
  from: number;
  to: number;
}

const DrawTable: React.FC<DrawTableProps> = ({ from, to }) => {
  const rows = [];
  for (let i = from; i <= to; i++) {
    rows.push(i);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ドロー枚数
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              確率 (%)
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              期待値
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((drawCount) => (
            <tr key={drawCount} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {drawCount}枚
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                --
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                --
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrawTable;

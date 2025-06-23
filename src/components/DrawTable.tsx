import type React from "react";
import type { DrawTableProps } from "../types/drawTable";

export const DrawTable: React.FC<DrawTableProps> = ({ data }) => {
  // 確率の表示形式を決定する関数
  const formatProbability = (value: number): string => {
    if (value >= 99.99) {
      // 99.99%以上の場合は小数点第4位まで表示
      return `${value.toFixed(4)}%`;
    }
    // それ以外は小数点第2位まで表示
    return `${value.toFixed(2)}%`;
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ドロー枚数
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              なし
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              1枚交換
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              2枚交換
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              3枚交換
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              4枚交換
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.drawCount} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.drawCount}枚
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatProbability(row.none)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatProbability(row.exchange1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatProbability(row.exchange2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatProbability(row.exchange3)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatProbability(row.exchange4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

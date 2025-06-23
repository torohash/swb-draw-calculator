import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { DrawTable } from "./components/DrawTable";
import { calculateDrawProbability } from "./funcs/probabilityCalculator";
import {
  type ProbabilityFormData,
  probabilityFormSchema,
} from "./schemas/probabilityForm";
import { type DrawTableRow, MulliganType } from "./types/drawTable";

function App() {
  const [tableData, setTableData] = useState<DrawTableRow[]>([]);

  // フォームフィールド用のID生成
  const targetCardsId = useId();
  const minTargetId = useId();
  const mulliganTypeId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProbabilityFormData>({
    resolver: zodResolver(probabilityFormSchema),
    defaultValues: {
      targetCards: 3,
      minTarget: 1,
      mulliganType: MulliganType.WITHOUT_REPLACEMENT,
    },
  });

  const onSubmit = (data: ProbabilityFormData) => {
    const probabilityResults = calculateDrawProbability(
      40, // デッキサイズ固定
      data.targetCards,
      1, // 開始ターン固定
      36, // 終了ターン固定
      data.minTarget,
      data.mulliganType,
    );

    const newTableData: DrawTableRow[] = probabilityResults.map(
      (result, index) => ({
        drawCount: 1 + index,
        none: result.none,
        exchange1: result.exchange1,
        exchange2: result.exchange2,
        exchange3: result.exchange3,
        exchange4: result.exchange4,
      }),
    );

    setTableData(newTableData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          SWB ドロー確率シミュレーター
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">パラメータ設定</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* ターゲットカード枚数 */}
              <div>
                <label
                  htmlFor={targetCardsId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ターゲットカード枚数
                </label>
                <input
                  id={targetCardsId}
                  type="number"
                  {...register("targetCards", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
                {errors.targetCards && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.targetCards.message}
                  </p>
                )}
              </div>

              {/* 最小ターゲット数 */}
              <div>
                <label
                  htmlFor={minTargetId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  最小ターゲット数
                </label>
                <input
                  id={minTargetId}
                  type="number"
                  {...register("minTarget", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
                {errors.minTarget && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.minTarget.message}
                  </p>
                )}
              </div>

              {/* マリガンタイプ */}
              <div>
                <label
                  htmlFor={mulliganTypeId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  マリガンタイプ
                </label>
                <select
                  id={mulliganTypeId}
                  {...register("mulliganType")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value={MulliganType.WITHOUT_REPLACEMENT}>
                    戻さない
                  </option>
                  <option value={MulliganType.WITH_REPLACEMENT}>戻す</option>
                </select>
                {errors.mulliganType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mulliganType.message}
                  </p>
                )}
              </div>
            </div>

            {/* 計算ボタン */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                確率を計算
              </button>
            </div>
          </div>
        </form>

        {/* 結果テーブル */}
        {tableData.length > 0 && <DrawTable data={tableData} />}
      </div>
    </div>
  );
}

export default App;

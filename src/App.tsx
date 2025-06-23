import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";
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
  const deckSizeId = useId();
  const targetCardsId = useId();
  const fromTurnId = useId();
  const toTurnId = useId();
  const minTargetId = useId();
  const mulliganTypeId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProbabilityFormData>({
    resolver: zodResolver(probabilityFormSchema),
    defaultValues: {
      deckSize: 40,
      targetCards: 3,
      fromTurn: 1,
      toTurn: 10,
      minTarget: 1,
      mulliganType: MulliganType.WITHOUT_REPLACEMENT,
    },
  });

  const onSubmit = (data: ProbabilityFormData) => {
    const probabilityResults = calculateDrawProbability(
      data.deckSize,
      data.targetCards,
      data.fromTurn,
      data.toTurn,
      data.minTarget,
      data.mulliganType,
    );

    const newTableData: DrawTableRow[] = probabilityResults.map(
      (result, index) => ({
        drawCount: data.fromTurn + index,
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        シャドウバース ドロー確率シミュレーター
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">パラメータ設定</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* デッキサイズ */}
            <div>
              <label
                htmlFor={deckSizeId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                デッキサイズ
              </label>
              <input
                id={deckSizeId}
                type="number"
                {...register("deckSize", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              {errors.deckSize && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.deckSize.message}
                </p>
              )}
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              {errors.targetCards && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.targetCards.message}
                </p>
              )}
            </div>

            {/* 開始ターン */}
            <div>
              <label
                htmlFor={fromTurnId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                開始ターン
              </label>
              <input
                id={fromTurnId}
                type="number"
                {...register("fromTurn", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              {errors.fromTurn && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fromTurn.message}
                </p>
              )}
            </div>

            {/* 終了ターン */}
            <div>
              <label
                htmlFor={toTurnId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                終了ターン
              </label>
              <input
                id={toTurnId}
                type="number"
                {...register("toTurn", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              {errors.toTurn && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.toTurn.message}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            確率を計算
          </button>
        </div>
      </form>

      {/* 結果テーブル */}
      {tableData.length > 0 && <DrawTable data={tableData} />}
    </div>
  );
}

export default App;

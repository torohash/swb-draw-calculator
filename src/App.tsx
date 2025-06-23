import "./App.css";
import { DrawTable } from "./components/DrawTable";
import { calculateDrawProbability } from "./funcs/probabilityCalculator";
import { type DrawTableRow, MulliganType } from "./types/drawTable";

function App() {
  // ハードコーディングされたパラメータ
  const deckSize = 40; // シャドウバースの標準デッキサイズ
  const targetCards = 3; // ターゲットカードの枚数
  const fromTurn = 1; // 開始ターン
  const toTurn = 10; // 終了ターン
  const minTarget = 1; // 最小ターゲット数（1枚以上引く確率）

  // マリガンタイプの選択
  // WITHOUT_REPLACEMENT: 戻さない（現在の実装）
  // WITH_REPLACEMENT: 戻す
  const mulliganType = MulliganType.WITHOUT_REPLACEMENT;

  // 計算処理の実行
  const probabilityResults = calculateDrawProbability(
    deckSize,
    targetCards,
    fromTurn,
    toTurn,
    minTarget,
    mulliganType,
  );

  // DrawTableRowフォーマットに変換
  const tableData: DrawTableRow[] = probabilityResults.map((result, index) => ({
    drawCount: fromTurn + index,
    none: result.none,
    exchange1: result.exchange1,
    exchange2: result.exchange2,
    exchange3: result.exchange3,
    exchange4: result.exchange4,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        シャドウバース ドロー確率シミュレーター
      </h1>
      <DrawTable data={tableData} />
    </div>
  );
}

export default App;

export enum MulliganType {
  WITHOUT_REPLACEMENT = "without_replacement", // 戻さない
  WITH_REPLACEMENT = "with_replacement", // 戻す
}

export interface DrawTableRow {
  drawCount: number;
  none: number;
  exchange1: number;
  exchange2: number;
  exchange3: number;
  exchange4: number;
}

export interface DrawTableProps {
  data: DrawTableRow[];
}

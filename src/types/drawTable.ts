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

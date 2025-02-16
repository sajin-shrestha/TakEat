export type TableStatus = "available" | "occupied";

export interface ITable {
  _id: string;
  tablename: string;
  status: TableStatus;
}

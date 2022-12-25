import { Column, GetDataParams, TableType } from "../types";

export class Table<Data extends object> implements TableType<Data> {
  constructor(
    public name: string,
    public columns: Column<Data>[],
    public getData: (params: GetDataParams) => Promise<{
      data: Data[];
      totalRows: number;
      totalFiltredRows: number;
    }>,
  ) {}
}

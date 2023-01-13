import { v4 } from "uuid";
import { admin } from "..";
import { Column, TableType } from "../types";
import { User } from "../Users";

export function reduceColumn(user: User, column: Column<any>) {

  if (['checkbox', 'input', 'select', 'multiselect'].includes(column.type)) {
    const action = (column as any).onChange.bind(column);

    const id = v4();

    admin.compoents.push({ type: 'action', id, action, userId: user.id });

    return {
      ...column,
      onChange: id,
      options: (column as any).options?.map((option: any) => typeof option === 'string' ? { value: option, text: option } : option)
    };
  }

  return column;
}

export function reduceTable(user: User, table: TableType<any>) {
  const id = v4();
  admin.compoents.push({ ...table, type: 'table', id, userId: user.id });
  return {
    type: 'table',
    columns: table.columns.map((column) => reduceColumn(user, column)),
    id,
  };
}
import { FormType } from "./form";
import { TableType } from "./tables";

export type JsxComponent = {
  type: 'jsx',
  content: JSX.Element
}

export type Action = { type: 'action', action: (data: any) => any };

export type TmpComponents = (
  (TableType<any> & { type: 'table' })
  | Action
) & { id: string }

export type ComponentsContentType = (
  (TableType<any> & { type: 'table' })
  | (FormType & { type: 'form' })
  | JsxComponent
);

export type PageType = {
  readonly path: string,
  readonly title: string | ((params: Record<string, string | number>) => string | Promise<string>),
  content: (params: Record<string, string | number>) => (
    Promise<(string | ComponentsContentType)[]>
    | (string | ComponentsContentType)[]
  ),
}

export * from "./tables";
export * from "./form";
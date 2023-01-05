import { TableType } from "./tables";

export type JsxComponent = {
  type: 'jsx',
  content: JSX.Element
}

export type ComponentsContentType = (
  (TableType<any> & { type: 'table' })
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
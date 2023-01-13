import { User } from "../Users";
import { FormType } from "./form";
import { TableType } from "./tables";

export type JsxComponent = {
  type: 'jsx',
  content: JSX.Element
}

export type Action = { type: 'action', userId: number, action: (data: any) => any };

export type TmpComponents = (
  (TableType<any> & { type: 'table', userId: number })
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
  readonly auth?: (user: User) => boolean | Promise<boolean>,
  content: (params: Record<string, string | number>, user: User) => (
    Promise<(string | ComponentsContentType)[]>
    | (string | ComponentsContentType)[]
  ),
}

export * from "./tables";
export * from "./form";
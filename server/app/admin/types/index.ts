import { TableType } from "./tables";

export type PageType = {
  readonly path: string,
  readonly title: string | ((params: Record<string, string | number>) => string | Promise<string>),
  content: (params: Record<string, string | number>) => Promise<
    (
      string
      | TableType<any> & { type: 'table' }
    )[]
  >,
}

export * from "./tables";
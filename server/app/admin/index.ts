import { v4 } from "uuid";
import { mainRouter } from "../context";
import "./protection";
import { protect } from "./protection";
import { PageType, TableType } from "./types";

export const state = {
  pages: [] as PageType[],
  menu: [] as { path: string, title: string, icon: string }[],
  tables: [] as (TableType<any> & { id: string })[]
}

mainRouter.post('/admin/pages/load', async (ctx) => {
  const { path, params } = ctx.request.body;

  const page = state.pages.find((page) => page.path === path);

  if (page) {
    ctx.body = {
      title: typeof page.title === 'function' ? await page.title(params) : page.title,
      menu: state.menu,
      content: (await page.content(params)).map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
          return { type: 'html', payload: item };
        }

        if (typeof item === 'object' && item.type === 'table') {
          const id = v4();
          state.tables.push({ ...item, id });
          return {
            type: 'table',
            columns: item.columns,
            tableId: id,
          };
        }

        return {
          type: 'special',
          payload: item,
        };
      })
    };
  } else {
    ctx.status = 404;
    ctx.message = 'Page for load not found'
  }
});

mainRouter.post('/admin/pages/get-data', async (ctx) => {
  const { params, tableId } = ctx.request.body;

  const table = state.tables.find((table) => table.id === tableId);

  if (table) {
    ctx.body = await table.getData(params);
  } else {
    ctx.status = 404;
    ctx.message = 'Table not found';
  }
});

mainRouter.post('/admin/pages/clear-tables', (ctx) => {
  const { tablesIds } = ctx.request.body;

  if (Array.isArray(tablesIds)) {
    ctx.status = 400;
    ctx.message = 'In field tablesIds need set array of tables ids';
  }

  state.tables = state.tables.filter(({ id }) => !tablesIds.includes(id));

  ctx.status = 204;
});

mainRouter.get('/admin/pages/', protect(), (ctx) => {
  ctx.body = {
    paths: state.pages.map((page) => page.path),
    menu: state.menu,
  };
});
import { v4 } from "uuid";
import { router, admin } from ".";
import { renderToString } from 'react-dom/server'
import { TableType } from "./types";

router.get('/pages/', (ctx) => {
  ctx.body = {
    paths: admin.pages.map((page) => page.path),
    menu: admin.menu,
  };
});

router.post('/pages/load', async (ctx) => {
  const { path, params } = ctx.request.body;

  const page = admin.pages.find((page) => page.path === path);

  if (page) {
    admin.compoents = [];
    ctx.body = {
      title: typeof page.title === 'function' ? await page.title(params) : page.title,
      menu: admin.menu,
      content: (await page.content(params)).map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
          return { type: 'html', payload: item };
        }
        const id = v4();
        admin.compoents.push({ ...item, id });

        if (item.type === 'table') {
          return {
            type: 'table',
            columns: item.columns,
            id,
          };
        }

        if (item.type === 'jsx') {
          return {
            type: 'html',
            payload: renderToString(item.content)
          }
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

router.post('/pages/components/get-data', async (ctx) => {
  const { params, id } = ctx.request.body;

  const table = admin.compoents.find((table) => table.id === id && table.type === 'table') as TableType<any> | null;

  if (table) {
    ctx.body = await table.getData(params);
  } else {
    ctx.status = 404;
    ctx.message = 'Table not found';
  }
});
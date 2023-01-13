import { v4 } from "uuid";
import { router, admin } from ".";
import { renderToString } from 'react-dom/server'
import { Action, renderForm, TableType } from "./types";
import fs from 'fs/promises';
import path from 'path';
import config from "../context/config";
import { reduceTable } from "./tables/reduceColumns";

router.get('/pages/', async (ctx) => {

  const menuPromise = (
    await Promise.all(admin.menu
      .map(async (item) => !item.auth || item.auth(ctx.state.user) ? item : null)
    )
  ).filter(item => item);

  const pagesPromise = (
    await Promise.all(admin.pages
      .map(async (item) => !item.auth || item.auth(ctx.state.user) ? item : null)
    )
  ).filter(item => item);

  ctx.body = {
    paths: pagesPromise.map((page: any) => page.path),
    menu: menuPromise,
  };
});

router.post('/pages/load', async (ctx) => {
  const { path, params } = ctx.request.body;

  const page = admin.pages.find((page) => page.path === path);

  if (page && (!page.auth || await page.auth(ctx.state.user))) {
    admin.compoents = admin.compoents.filter(({ userId }) => userId !== ctx.state.user.id);
    ctx.body = {
      title: typeof page.title === 'function' ? await page.title(params) : page.title,
      menu: admin.menu,
      content: (await page.content(params, ctx.state.user)).map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
          return { type: 'html', payload: item };
        }
        const id = v4();

        if (item.type === 'table') {
          admin.compoents.push({ ...item, id, userId: ctx.state.user.id });
          return reduceTable(ctx.state.user, item);
        }

        if (item.type === 'form') {
          return {
            type: 'html',
            payload: renderForm(item, ctx.state.user),
          }
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

  const table = admin
    .compoents
    .find((comp) => (
      typeof comp === 'object'
      && comp.id === id
      && comp.type === 'table'
    )) as TableType<any> | null;

  if (table) {
    ctx.body = await table.getData(params);
  } else {
    ctx.status = 404;
    ctx.message = 'Table not found';
  }
});

router.post('/pages/components/action/:id', async (ctx) => {
  const { id } = ctx.params;
  const body = ctx.request.body;
  const filesReq = ctx.request.files || {};

  const action = admin.compoents.find((com) => com.type === 'action' && com.id === id) as Action | null;

  const files: any = {};

  if (Object.keys(filesReq).length !== 0) {
    await Promise.all(Object.keys(filesReq).map(async (key) => {
      if (filesReq[key] && !Array.isArray(filesReq[key])) {
        await fs.rename(
          (filesReq[key] as any).filepath,
          path.resolve(config.static, (filesReq[key] as any).newFilename + (filesReq[key] as any).originalFilename)
        );

        files[key] = `${process.env.SERVER_URL}/static/${(filesReq[key] as any).newFilename + (filesReq[key] as any).originalFilename}`;
      }
    }))
  }

  if (action) {
    const data = await action.action({ ...body, ...files });

    if (data) {
      ctx.body = data;
    } else {
      ctx.status = 204;
    }
  } else {
    ctx.status = 404;
    ctx.message = 'Action not found';
  }
});
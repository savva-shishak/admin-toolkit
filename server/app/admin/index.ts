import Router from "koa-router";
import { mainRouter } from "../context";

export const router = new Router();
export const publicRouter = mainRouter;

import "./protection";
import { PageType, TmpComponents } from "./types";
import "./pages";

export const admin = {
  pages: [] as PageType[],
  menu: [] as { path: string, title: string, icon: string }[],
  compoents: [] as TmpComponents[]
};


mainRouter.use('/admin', router.routes());

export * from "./tables/reduceArrayByParams";
export * from './tables/sequlizeQueryByParams';
export * from './protection';
export * from './types';
import Router from "koa-router";
import { mainRouter } from "../context";

export const router = new Router();
export const publicRouter = mainRouter;

import "./protection";
import { ComponentsContentType, PageType } from "./types";
import "./pages";

export const admin = {
  pages: [] as PageType[],
  menu: [] as { path: string, title: string, icon: string }[],
  compoents: [] as (ComponentsContentType & { id: string })[]
};


mainRouter.use('/admin', router.routes());

export * from "./tables/reduceArrayByParams";
export * from './tables/sequlizeQueryByParams';
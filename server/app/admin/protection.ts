import { Context, Next } from 'koa';
import { v4 } from "uuid";
import { mainRouter } from "../context";

const sessions: string[] = [];

if (process.env.DEV_MODE === 'on') {
  sessions.push('dev-session');
}

mainRouter.post('/admin/login', (ctx) => {
  const { ADMIN_LOGIN, ADMIN_PASSWORD } = process.env;
  const { login, password } = ctx.request.body;

  if (ADMIN_LOGIN === login && ADMIN_PASSWORD === password) {
    const session = v4();

    sessions.push(session);

    ctx.body = session;
  } else {
    ctx.status = 400;
    ctx.message = 'Login or password incorrect';
  }
});

export function protect() {
  return async (ctx: Context, next: Next) => {
    const session = ctx.headers.authorization;

    if (session && sessions.includes(session)) {
      await next(); 
    } else {
      ctx.status = 401;
      ctx.message = 'Auth error';
    }
  }
}
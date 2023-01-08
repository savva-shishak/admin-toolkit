import { Context, Next } from 'koa';
import { v4 } from 'uuid';
import { publicRouter, router } from '.';

let session: string | null = process.env.DEV_MODE === 'on' ? 'dev-session' : null;

export async function protect(ctx: Context, next: Next) {
  const session = ctx.headers.authorization;

  if (session && ctx.headers.authorization === session) {
    await next(); 
  } else {
    ctx.status = 401;
    ctx.message = 'Auth error';
  }
}

router.use(
  async (ctx: Context, next: Next) => {
    const session = ctx.headers.authorization;

    if (session && ctx.headers.authorization === session) {
      await next(); 
    } else {
      ctx.status = 401;
      ctx.message = 'Auth error';
    }
  }
);

publicRouter.post('/admin/login', (ctx) => {
  const { ADMIN_LOGIN, ADMIN_PASSWORD } = process.env;
  const { login, password } = ctx.request.body;

  if (ADMIN_LOGIN === login && ADMIN_PASSWORD === password) {
    session = v4();

    ctx.body = session;
  } else {
    ctx.status = 400;
    ctx.message = 'Login or password incorrect';
  }
});

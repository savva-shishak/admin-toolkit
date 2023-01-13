import { Context, Next } from 'koa';
import { v4 } from 'uuid';
import { publicRouter, router } from '.';
import { ADMIN_ALL, User } from './Users';
import { compare, hash } from 'bcrypt';

let sessions: { session: string, user: User }[] = [];

User.afterSync(async () => {
  const { ADMIN_LOGIN, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_LOGIN || !ADMIN_PASSWORD) {
    throw new Error("admin login and password not setting");
  }

  const [ user ] = await User.findOrCreate({
    where: { login: ADMIN_LOGIN },
    defaults: {
      login: ADMIN_LOGIN,
      hashPassword: await hash(ADMIN_PASSWORD, 10),
      name: 'administrator',
      grants: [ADMIN_ALL]
    }
  });

  if (process.env.DEV_MODE === 'on') {
    sessions.push({ session: 'dev-session', user });
    console.log('admin session registred');
    
  }
});

export function registrySession(user: User) {
  const session = v4();

  sessions.push({ session, user });

  return session;
}

export function updateUser(user: User) {
  for (const session of sessions) {
    if (session.user.id === user.id) {
      session.user = user;
    }
  }
}

User.beforeUpdate(updateUser);

User.beforeDestroy(async (user) => {
  sessions = sessions.filter((session) => session.user.id !== user.id);
});

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
    const session = sessions.find((session) => session.session === ctx.headers.authorization);

    if (session) {
      ctx.state.user = session.user;
      await next(); 
    } else {
      ctx.status = 401;
      ctx.message = 'Auth error';
    }
  }
);

publicRouter.post('/admin/login', async (ctx) => {
  const { login, password } = ctx.request.body;

  const user = await User.findOne({ where: { login } })

  if (!user) {
    ctx.status = 404;
    ctx.message = 'User with this login not found';
    return;
  }

  if (!await compare(password, user.hashPassword)) {
    ctx.status = 403;
    ctx.message = 'Incorrect password';
    return;
  }

  ctx.body = registrySession(user);
});

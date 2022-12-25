import { mainRouter } from "../context";
import { User } from '../admin/User';
import { getPeerId } from '../context/protect';
import { clients } from '../context/sockets';
import { Context, Next } from 'koa';
import { compareHash, getAuthToken, getHash, getJwtTokenForGuest, getJwtTokenForUser, isExistLogin, isExistPeerId } from './functions';
import { state } from "../admin";

export const protect = () => (ctx: Context, next: Next) => {
  const peerId = getPeerId(ctx.headers.authorization || '');

  if (peerId) {
    ctx.state.peerId = peerId;
    ctx.state.role = (ctx.headers.authorization || '').startsWith('User ') ? 'user' : 'guest';
    return next();
  } else {
    ctx.status = 401;
    ctx.message = 'Authorization error';
  }
};

mainRouter.post('/protection/access-login', async (ctx) => {
  const { login } = ctx.request.body;

  ctx.body = !(await isExistLogin(login))
});

mainRouter.post('/protection/access-peerId', async (ctx) => {
  const { peerId } = ctx.request.body;

  ctx.body = !(await isExistPeerId(peerId))
});

mainRouter.post('/protection/registry', async (ctx) => {
  const { login, password, confirmPassword, displayName, avatar, peerId, withAuthToken } = ctx.request.body;

  if (password !== confirmPassword) {
    ctx.status = 400;
    ctx.message = `Passwords not match`;
    return;
  }

  if (await isExistLogin(login)) {
    ctx.status = 400;
    ctx.message = `This login already exist`;
    return;
  }
  

  if (await isExistPeerId(peerId)) {
    ctx.status = 400;
    ctx.message = `This peerId already exist`;
    return;
  }

  const hash = await getHash(login, password);

  const authToken = withAuthToken ? await getAuthToken({ peerId, login, avatar, displayName, hash }) : undefined;

  await User.create({ peerId, login, avatar, displayName, hash, token: authToken });

  ctx.body = {
    peerId,
    login,
    displayName,
    avatar,
    token: getJwtTokenForUser(peerId),
    authToken,
  };
});

mainRouter.post('/protection/auth', async (ctx) => {
  const { login, password } = ctx.request.body;

  const user = await User.findOne({ where: { login } });

  if (!user) {
    ctx.status = 404;
    ctx.message = `User with this login not found`;
    return;
  }

  if (!(await compareHash(password, user.hash))) {
    ctx.status = 401;
    ctx.message = `Password incorrect`;
    return;
  }

  const { peerId, displayName, avatar } = user;

  ctx.body = {
    peerId,
    login,
    displayName,
    avatar,
    token: getJwtTokenForUser(peerId)
  };
});

mainRouter.post('/protection/auth-guest', async (ctx) => {
  const { peerId } = ctx.request.body;

  const notGuests = clients.every((client) => client.peerId !== peerId);
  const notUsers = !(await isExistPeerId(peerId));

  if (notGuests && notUsers) {
    ctx.body = getJwtTokenForGuest(peerId);
  } else {
    ctx.status = 400;
    ctx.message = 'Id not access';
  }
});

mainRouter.get('/protection/token', protect(), async (ctx) => {
  const user = await User.findOne({ where: { peerId: ctx.state.peerId } });

  if (user) {
    const token = user.token || await getAuthToken(user);
    await User.update({ token }, { where: { peerId: user.peerId } });
    ctx.body = token;
  } else {
    ctx.status = 404;
    ctx.message = 'User not found';
  }
});

mainRouter.delete('/protection/disable-token', protect(), async (ctx) => {
  await User.update({ token: null }, { where: { peerId: ctx.state.peerId } });
  ctx.status = 204;
});

mainRouter.post('/protection/auth-by-token', async (ctx) => {
  const { token } = ctx.request.body;

  const user = await User.findOne({ where: { token } });

  if (user) {
    const { peerId, displayName, avatar } = user;

    ctx.body = {
      peerId,
      displayName,
      avatar,
      token: getJwtTokenForUser(peerId),
    }
  } else {
    ctx.status = 404;
    ctx.message = 'user by token not found';
  }
});

state.pages.push(
  {
    path: '/protect',
    title: 'Защита',
    async content() {
      return [
        '<h1>Ваше приложение защищено. Приятного пользования!!!</h1>'
      ];
    }
  }
);
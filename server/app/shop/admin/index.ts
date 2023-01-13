import { admin, sequlizeQueryByParams, reduceArrayByParams, protect } from "../../admin";
import { ADMIN_ALL } from "../../admin/Users";
import { mainRouter } from "../../context";
import "./phones";

export const PHONES = 'PHONES';

admin.menu.push({
  path: '/shop/phones',
  auth: ({ grants }) => grants.includes(PHONES) || grants.includes(ADMIN_ALL),
  title: 'Телефоны',
  icon: 'https://sun6-20.userapi.com/s/v1/if1/x9RU72gtjHuydtp3BC_IC3Hi7HvohKo39nTYyIPxLGnp3Tae6rwz0P746EFiKhofmIPEJDwE.jpg?size=1280x1280&quality=96&crop=0,0,1280,1280&ava=1',
});

export {
  admin,
  sequlizeQueryByParams,
  reduceArrayByParams,
  mainRouter as router,
  protect
}
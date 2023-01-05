import { admin, sequlizeQueryByParams, reduceArrayByParams } from "../../admin";
import "./phones";

admin.menu.push({
  path: '/shop/phones',
  title: 'Телефоны',
  icon: 'https://sun6-20.userapi.com/s/v1/if1/x9RU72gtjHuydtp3BC_IC3Hi7HvohKo39nTYyIPxLGnp3Tae6rwz0P746EFiKhofmIPEJDwE.jpg?size=1280x1280&quality=96&crop=0,0,1280,1280&ava=1',
});

export { admin, sequlizeQueryByParams, reduceArrayByParams }
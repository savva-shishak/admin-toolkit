require('dotenv').config();

import { httpServer, mainRouter } from "./app/context";
import { sequelize } from "./app/context/database";
import logger from './logger';

import "./app/protection";
import { state } from "./app/admin/index";
import { reduceArrayByParams } from "./app/admin/tables/reduceArrayByParams";

async function runServers() {
  logger.info('Sinc with database');
  await sequelize.sync({ });
  logger.info('Database sincronized');

  logger.info('Starting media server');
  
  httpServer.listen(
    process.env.SERVER_PORT || 8080,
    () => logger.info(`Server started: http${process.env.SSL_MODE === 'off' ? '' : 's'}://localhost:${process.env.SERVER_PORT || 8080}`),
  );
}

runServers().then(() => logger.info('Servers success started'));

const data = [
  { id: '1', name: 'Savva', position: 'Programer', age: 20 },
  { id: '2', name: 'Sherlok', position: 'Detectiv', age: 200 },
  { id: '3', name: 'Vatson', position: 'Doctor',  age: 10 },
];

state.menu.push(
  {
    path: '/',
    title: 'Главная',
    icon: 'https://pixy.org/src/55/557994.png',
  },
  {
    path: '/protect',
    title: 'Защита',
    icon: 'https://www.pinclipart.com/picdir/big/93-938550_padlock-clipart-privacy-online-privacy-icon-png-download.png'
  },
)

state.pages.push(
  {
    path: '/',
    title: 'Главная',
    async content() {
      return [
        '<h1 style="text-align: center">Привет Мир!!!</h1>',
        {
          type: 'table',
          columns: [
            {
              key: 'id',
              title: 'ID',
              type: 'anchor',
              width: 100,
            },
            {
              key: 'name',
              title: 'Имя',
              type: 'str'
            },
            {
              key: 'position',
              title: 'Должность',
              type: 'str'
            },
            {
              key: 'age',
              title: 'Возраст',
              type: 'num'
            },
          ],
          getData: reduceArrayByParams(() => data.map((item) => ({
            ...item,
            id: {
              href: '/' + item.id,
              label: item.id
            }
          })))
        },
      ];
    }
  },
  {
    path: '/:id',
    title: ({ id }) => data.find((person) => person.id === id)?.name || 'Профиль',
    async content({ id }) {
      const person = data.find((person) => person.id === id);

      if (!person) {
        return [
          'Неизвестный пользователь'
        ];
      }

      return [
        `
          <form action="/persons/update" method="POST">
            <input type="hidden" value="${person.id}" name="id" >
            <input value="${person.name}" name="name">
            <input value="${person.position}" name="position">
            <input value="${person.age}" name="age">
            <button>Сохранить</button>
          </form>
        `
      ];
    }
  }
);

mainRouter.post('/persons/update', async (ctx) => {
  const { id, name, position, age } = ctx.request.body;

  const person = data.find((person) => person.id === id);

  if (person) {
    person.name = name;
    person.position = position;
    person.age = age;
  }

  ctx.body = '/';
});
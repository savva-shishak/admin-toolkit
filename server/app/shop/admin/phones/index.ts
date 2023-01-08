import { admin, sequlizeQueryByParams } from "..";
import { Phone } from "../../phones/Phone";
import { input } from '../../../admin';

import "./phone";

admin.pages.push(
  {
    path: '/shop/phones',
    title: 'Телефоны',
    async content() {
      return [
        {
          type: 'form',
          title: 'Новый телефон',
          inputs: [
            input({
              label: 'Название',
              name: 'name',
              value: '',
              required: true
            }),
            input({
              label: 'Модель',
              name: 'model',
              value: '',
              required: true
            }),
            input({
              label: 'Цена',
              name: 'price',
              value: '',
              type: 'number',
              required: true
            }),
            input({
              label: 'Количество',
              name: 'count',
              value: '',
              type: 'number',
              required: true
            }),
            input({
              label: 'Изображение',
              name: 'image',
              value: '',
              type: 'file',
              required: true
            }),
          ],
          actions: [
            {
              text: 'Добавить',
              async action({ name, price, count, model, image }) {                
                await Phone.create({ name, price, count, image, model });
                return 'reset';
              }
            }
          ]
        },
        {
          type: 'table',
          columns: [
            {
              key: 'id',
              title: 'ID',
              type: 'anchor'
            },
            {
              key: 'name',
              title: 'Название',
              type: 'str'
            },
            {
              key: 'model',
              title: 'Модель',
              type: 'str'
            },
            {
              key: 'price',
              title: 'Цена',
              type: 'num'
            },
            {
              key: 'count',
              title: 'Количество',
              type: 'num'
            },
            {
              key: 'image',
              title: 'Изображение',
              type: 'img'
            }
          ],
          getData: sequlizeQueryByParams(
            Phone,
            ['name', 'model'],
            ({ id, name, model, image, price, count }) => ({
              name, model, image, price, count,
              id: {
                label: id,
                href: '/shop/phones/' + id
              }
            })
          ),
        },
      ];
    }
  },
);

import React from 'react';
import { Space, Input, Button } from 'antd';
import { admin, sequlizeQueryByParams } from "..";
import { Phone } from "../../phones/Phone";

admin.pages.push(
  {
    path: '/shop/phones',
    title: 'Телефоны',
    async content() {
      return [
        {
          type: 'jsx',
          content: (
            <Space size="middle" direction="vertical">
              <h2>Добавить телефон</h2>
              <Space size="small" direction="horizontal">
                <Input name="name" placeholder="Название" />
                <Input name="price" placeholder="Название" />
                <Input name="count" placeholder="Количество" />
                <Input name="image" placeholder="Изображение" />
              </Space>
            </Space>
          )
        },
        {
          type: 'table',
          columns: [
            {
              key: 'id',
              title: 'ID',
              type: 'num'
            },
            {
              key: 'name',
              title: 'Название',
              type: 'num'
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
          getData: sequlizeQueryByParams(Phone, ['name']),
        }
      ];
    }
  }
)
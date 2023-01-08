import { admin } from "..";
import { Phone } from "../../phones/Phone";
import { input } from '../../../admin';

admin.pages.push(
  {
    path: '/shop/phones/:id',
    title: ({ id }) => Phone.findOne({ where: { id } }).then((phone: any) => phone? `Телефон ID ${phone.id}` : 'Телефон'),
    async content({ id }) {
      const phone: any = await Phone.findOne(({ where: { id } }));

      if (!phone) {
        return ['<h4 style="text-align: center">Телефон не найден</h4>'];
      }

      return [
        {
          type: 'form',
          title: phone.name + ' ' + phone.model,
          img: phone.image,
          inputs: [
            input({
              label: 'Название',
              name: 'name',
              value: phone.name,
              required: true
            }),
            input({
              label: 'Модель',
              name: 'model',
              value: phone.model,
              required: true
            }),
            input({
              label: 'Цена',
              name: 'price',
              value: phone.price,
              type: 'number',
              required: true
            }),
            input({
              label: 'Количество',
              name: 'count',
              value: phone.count,
              type: 'number',
              required: true
            }),
            input({
              label: 'Изображение',
              name: 'image',
              value: phone.image,
              type: 'file',
              required: true
            }),
          ],
          actions: [
            {
              text: 'На главную',
              type: 'light',
              action: () => '/shop/phones'
            },
            {
              text: 'Сохранить',
              async action({ name, model, price, count, image }) {
                await Phone.update({ name, model, price, count }, { where: { id: phone.id } });

                return '/shop/phones';
              } 
            },
            {
              text: 'Удалить',
              type: 'danger',
              async action() {
                await Phone.destroy({ where: { id: phone.id } });

                return '/shop/phones';
              }
            }
          ],
        }
      ];
    }
  }
);

import { INTEGER, Model, STRING, TEXT } from "sequelize";
import { sequelize } from "../../context/database";

export type TPhone = Omit<Phone, keyof Model>;

export class Phone extends Model<any, any> {
  constructor(
    public id: number = 0,
    public name: string = '',
    public price: number = 0,
    public count: number = 0,
    public image: string = '',
  ) {
    super();
  }
}

Phone.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    price: {
      type: INTEGER,
      allowNull: false,
    },
    count: {
      type: INTEGER,
      allowNull: false,
    },
    image: {
      type: TEXT,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'phones'
  }
);
import { INTEGER, Model, TEXT } from "sequelize";
import { sequelize } from "../../context/database";

export type TPhone = Omit<Phone, keyof Model>;

export class Phone extends Model<any, any> {
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
      type: TEXT,
      allowNull: false,
    },
    model: {
      type: TEXT,
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
    tableName: 'phone-2'
  }
);
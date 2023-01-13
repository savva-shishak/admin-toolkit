import { ARRAY, INTEGER, Model, STRING, TEXT } from "sequelize";
import { sequelize } from '../context/database';

export const ADMIN_ALL = "ADMIN_ALL";

export class User extends Model {
  declare public id: number;
  declare public grants: string[];
  declare public name: string;
  declare public login: string;
  declare public hashPassword: string;
}

User.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    grants: {
      type: ARRAY(STRING),
      allowNull: false,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    login: {
      type: STRING,
      allowNull: false,
    },
    hashPassword: {
      type: TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'adminusers'
  }
)
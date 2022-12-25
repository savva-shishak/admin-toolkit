import { sequelize } from "../context/database";
import { Model, STRING, TEXT } from "sequelize";

export type UserType = {
  peerId: string;
  login: string;
  hash: string;
  displayName: string;
  avatar?: string;
  token?: string;
}

export class User extends Model implements UserType {
  declare public peerId: string;
  declare public login: string;
  declare public hash: string;
  declare public displayName: string;
  declare public avatar?: string;
  declare public token?: string;
}

User.init(
  {
    peerId: {
      type: STRING,
      primaryKey: false,
    },
    login: {
      type: TEXT,
      allowNull: false,
    },
    hash: {
      type: TEXT,
      allowNull: false,
    },
    displayName: {
      type: STRING(255),
      allowNull: false,
    },
    avatar: {
      type: TEXT,
      allowNull: true,
    },
    token: {
      type: TEXT,
      allowNull: true,
    }
  },
  {
    tableName: 'users',
    sequelize,
  }
);

export function updateUser({ id, displayName, avatar }: { id: string, displayName: string, avatar?: string | null }) {
  User.update({ displayName, avatar }, { where: { peerId: id } });
};
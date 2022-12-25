import bcrypt from 'bcrypt';
import { User, UserType } from '../admin/User';
import jwt from 'jsonwebtoken';
import { secretKey } from '../context/protect';

export function getJwtTokenForUser(peerId: string) {
  return `User ${jwt.sign({ peerId }, secretKey)}`;
}

export function getJwtTokenForGuest(peerId: string) {
  return `Guest ${jwt.sign({ peerId }, 'guest' + secretKey)}`;
}

export async function getHash(login: string, password: string) {
  return await bcrypt.hash(password, password.length + login.length);
}

export async function compareHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function getAuthToken(user: UserType) {
  return await bcrypt.hash(user.peerId + secretKey + Math.random().toFixed(2).toString(), user.login.length)
}

export async function isExistPeerId(peerId: string) {
  return (await User.count({ where: { peerId } })) !== 0;
}

export async function isExistLogin(login: string) {
  return (await User.count({ where: { login } })) !== 0;
}
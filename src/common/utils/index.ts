import jwt_decode from 'jwt-decode';
import { TokenPayload } from '@constants';

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const getCurrentUserFromToken = (token: string) => {
  const { user } = jwt_decode(token);
  return user;
};

export const formmatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

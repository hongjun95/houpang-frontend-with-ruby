import { CoreEntity, CoreOutput } from './core.interface';
import { Order } from './order.interface';
import { Item } from './item.interface';
import { Review } from './review.interface';

export enum UserRole {
  Consumer = 'Consumer',
  Provider = 'Provider',
  Admin = 'Admin',
}

export interface User extends CoreEntity {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phone: string;
  address1: string;
  items: Item[];
  orders: Order[];
  reviews: Review[];
}

// sign up

export interface SignUpInput extends Pick<User, 'email' | 'name' | 'password' | 'phone' | 'address1'> {
  password_confirmation: string;
}
export interface SignUpOutput {
  token: string;
  csrf: string;
}
export interface SignUpForm extends Pick<User, 'email' | 'name' | 'password' | 'phone' | 'address1'> {
  images?: Array<File>;
  password_confirmation: string;
}

// sign in

export interface SignInInput {
  email: string;
  password: string;
}
export interface SignInOutput {
  token: string;
  csrf: string;
}

// edit profile

export interface EditProfileInput extends Pick<User, 'email' | 'name' | 'phone' | 'address1'> {}
export interface EditProfileOutput extends CoreOutput {}
export interface EditProfileForm extends Pick<User, 'email' | 'name' | 'phone' | 'address1'> {
  images?: Array<File>;
}

// Change password

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  password_confirmation: string;
}
export interface ChangePasswordOutput extends CoreOutput {}

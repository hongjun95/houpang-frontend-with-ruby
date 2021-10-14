import { atom } from 'recoil';
import { AuthState } from '@constants';

import { Like } from '@interfaces/like.interface';
import { IShoppingItem } from '@store';

const initialAuthState: AuthState = {
  token: null,
  csrf: null,
  currentUser: null,
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: initialAuthState,
});

export const itemNameAtom = atom<string>({
  key: 'itemNameAtom',
  default: '',
});

export const itemPriceAtom = atom<number>({
  key: 'itemPriceAtom',
  default: 0,
});

export const itemCategoryNameAtom = atom<string>({
  key: 'itemCategoryNameAtom',
  default: '',
});

export const itemStockAtom = atom<number>({
  key: 'itemStockAtom',
  default: 0,
});

export const itemImgFilesAtom = atom<File[]>({
  key: 'itemImgFilesAtom',
  default: [],
});

export const orderListAtom = atom({
  key: 'orderListAtom',
  default: [],
});

export const likeListAtom = atom<Like>({
  key: 'likeListAtom',
  default: {
    created_by: null,
    id: '',
    items: [],
  },
});

export const shoppingListAtom = atom<Array<IShoppingItem>>({
  key: 'shoppingListAtom',
  default: [],
});

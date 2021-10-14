import { Category } from './category.interface';
import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
import { OrderItem, OrderStatus } from './order.interface';
import { Review } from './review.interface';
import { User } from './user.interface';

export interface InfoItem {
  id: number;
  key: string;
  value: string;
}

export interface Item extends CoreEntity {
  name: string;
  provider: User;
  sale_price: number;
  stock: number;
  avgRating?: number;
  product_images: string[];
  category: Category;
  infos?: InfoItem[];
  orderItems: OrderItem[];
  reviews: Review[];
}

// Add item

export interface AddItemInput {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: string[];
  infos: Array<InfoItem>;
}
export interface AddItemOutput extends CoreOutput {
  item?: Item;
}
export interface AddItemForm {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: Array<File>;
}
export interface AddItemInfoForm {
  [key: string]: string;
}

// Find Item by Id

export interface FindItemByIdInput {
  itemId: string;
}
export interface FindItemByIdOutput extends CoreOutput {
  item?: Item;
}

// Get Items by Search Term

export interface GetItemsBySearchTermInput extends PaginationInput {
  sort: SortState;
  query: string;
}

export interface GetItemsBySearchTermOutput extends PaginationOutput {
  items?: Item[];
}

// Get items from provider

export const SortStates = [
  ['createdAt desc', '최신순'],
  ['price desc', '높은가격순'],
  ['price asc', '낮은가격순'],
] as const;
export type SortState = typeof SortStates[number][0];

export interface GetItemsFromProviderInput extends PaginationInput {
  sort?: SortState;
}
export interface GetItemsFromProviderOutput extends PaginationOutput {
  items?: Item[];
}

// Edit item

export interface EditItemInput {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: string[];
  infos: Array<InfoItem>;
  itemId: string;
}
export interface EditItemOutput extends CoreOutput {}
export interface EditItemForm {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: Array<File>;
}
export interface EditItemInfoForm {
  [key: string]: string;
}

// Delete item

export interface DeleteItemInput {
  itemId: string;
}
export interface DeleteItemOutput extends CoreOutput {}

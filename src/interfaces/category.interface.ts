import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
import { Item } from './item.interface';

export interface Category extends CoreEntity {
  title: string;
  coverImg: string;
  items: Item[];
}

export interface GetAllCategoriesOutput extends CoreOutput {
  categories?: Category[];
}

export interface GetItemsOnCategoryInput extends PaginationInput {
  slug?: string;
}
export interface GetItemsOnCategoryOutput extends PaginationOutput {
  items?: Item[];
}

export interface GetItemsByCategoryIdInput extends PaginationInput {
  categoryId: string;
  sort?: string;
}
export interface GetItemsByCategoryIdOutput extends PaginationOutput {
  items?: Item[];
  categoryName: string;
}

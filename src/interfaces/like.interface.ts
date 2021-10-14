import { CoreEntity, CoreOutput } from './core.interface';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface Like extends CoreEntity {
  createdBy: User;
  products: Product[];
}

export interface FindLikeListOutput extends CoreOutput {
  likeList?: Like;
}

export interface LikeProductInput {
  productId: string;
}
export interface LikeProductOutput extends CoreOutput {}

export interface UnlikeProductInput {
  productId: string;
}
export interface UnlikeProductOutput extends CoreOutput {}

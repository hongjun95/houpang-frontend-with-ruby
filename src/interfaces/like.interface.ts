import { CoreEntity, CoreOutput } from './core.interface';
import { Item } from './item.interface';
import { User } from './user.interface';

export interface Like extends CoreEntity {
  created_by: User;
  items: Item[];
}

export interface FindLikeListOutput extends CoreOutput {
  like?: Like;
}

export interface LikeItemInput {
  item_id: string;
}
export interface LikeItemOutput extends CoreOutput {}

export interface UnlikeItemInput {
  item_id: string;
}
export interface UnlikeItemOutput extends CoreOutput {}

import { CoreOutput, CoreEntity, PaginationInput, PaginationOutput } from './core.interface';
import { Item } from './item.interface';
import { User } from './user.interface';

export interface Review extends CoreEntity {
  commenter: User;
  reviewed_at: string;
  item: Item;
  content: string;
  rating: number;
  images: string[];
}

// create review
export interface CreateReviewInput extends Pick<Review, 'content' | 'rating' | 'images'> {
  item_id: string;
}
export interface CreateReviewOutput extends CoreOutput {
  review?: Review;
}
export interface CreateReviewForm extends Pick<Review, 'content'> {
  images: Array<File>;
}

// Get Review on Item
export interface GetReviewsOnItemInput extends PaginationInput {
  item_id: string;
}
export interface GetReviewsOnItemOutput extends PaginationOutput {
  reviews?: Review[];
  avg_rating?: number;
}

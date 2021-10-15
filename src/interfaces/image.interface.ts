import { CoreEntity } from './core.interface';

export interface Image extends CoreEntity {
  imagable_type: string;
  imagable_id: number;
  image_path: string;
}

export interface ImageOutput extends CoreEntity {
  image_path: string;
}

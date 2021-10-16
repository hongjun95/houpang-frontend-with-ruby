export interface CoreOutput {
  ok: boolean;
  error?: string;
}

export interface CoreEntity {
  id: string;
  created_at: string;
}

export interface PaginationInput {
  page?: number;
}

export interface PaginationOutput extends CoreOutput {
  total_pages?: number;
  total_results?: number;
  prevt_page?: number;
  has_prevt_page?: boolean;
  next_page?: number;
  has_next_page?: boolean;
}

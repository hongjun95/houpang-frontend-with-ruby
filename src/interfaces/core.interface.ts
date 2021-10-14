export interface CoreOutput {
  ok: boolean;
  error?: string;
}

export interface CoreEntity {
  id: string;
}

export interface PaginationInput {
  page?: number;
}

export interface PaginationOutput extends CoreOutput {
  totalPages?: number;
  totalResults?: number;
  prevtPage?: number;
  hasPrevtPage?: boolean;
  nextPage?: number;
  hasNextPage?: boolean;
}

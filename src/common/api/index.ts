import { Category, Item, Token } from '@constants';
import {
  FindLikeListOutput,
  LikeItemInput,
  LikeItemOutput,
  UnlikeItemInput,
  UnlikeItemOutput,
} from '@interfaces/like.interface';
import {
  CancelOrderItemInput,
  CancelOrderItemOutput,
  CreateOrderInput,
  CreateOrderOutput,
  GetOrdersFromConsumerInput,
  GetOrdersFromConsumerOutput,
  GetOrdersFromProviderInput,
  GetOrdersFromProviderOutput,
  UpdateOrerStatusInput,
  UpdateOrerStatusOutput,
} from '@interfaces/order.interface';
import {
  AddItemInput,
  AddItemOutput,
  DeleteItemInput,
  DeleteItemOutput,
  EditItemInput,
  EditItemOutput,
  FindItemByIdInput,
  FindItemByIdOutput,
  GetItemsBySearchTermInput,
  GetItemsBySearchTermOutput,
  GetItemsFromProviderInput,
  GetItemsFromProviderOutput,
} from '@interfaces/item.interface';
import {
  GetRefundsFromConsumerInput,
  GetRefundsFromConsumerOutput,
  GetRefundsFromProviderInput,
  GetRefundsFromProviderOutput,
  RequestRefundInput,
  RequestRefundOutput,
} from '@interfaces/refund.interface';
import {
  CreateReviewInput,
  CreateReviewOutput,
  GetReviewsOnItemInput,
  GetReviewsOnItemOutput,
} from '@interfaces/review.interface';
import { getToken } from '@store';
import { AxiosResponse } from 'axios';
import {
  GetAllCategoriesOutput,
  GetItemsByCategoryIdInput,
  GetItemsByCategoryIdOutput,
} from 'src/interfaces/category.interface';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  EditProfileInput,
  EditProfileOutput,
  SignInInput,
  SignInOutput,
  SignUpInput,
  SignUpOutput,
} from 'src/interfaces/user.interface';
import { PlainAPI, API, VERSION, API_URL } from './api.config';

export const refresh = (): Promise<{ data: Token }> =>
  PlainAPI.post(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  );

export const get = (url: string, params: any) => PlainAPI.get(url, params);

// User APIs

export const signupAPI = async (data: SignUpInput) => {
  let response: AxiosResponse<SignUpOutput>;
  try {
    response = await PlainAPI.post<SignUpOutput>('/signup', { user: data });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const loginAPI = async (data: SignInInput) => {
  let response: AxiosResponse<SignInOutput>;
  try {
    response = await PlainAPI.post('/login', { user: data });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const editProfileAPI = async (data: EditProfileInput) => {
  let response: AxiosResponse<EditProfileOutput>;
  try {
    response = await API.post('/edit-profile', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const changePasswordAPI = async (data: ChangePasswordInput) => {
  let response: AxiosResponse<ChangePasswordOutput>;
  try {
    response = await API.post('/change-password', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const logoutAPI = () => API.delete('/logout');

// category API
export const getCategories = async () => {
  let response: AxiosResponse<GetAllCategoriesOutput>;
  try {
    response = await PlainAPI.get<GetAllCategoriesOutput>('/categories');
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// Item APIs

export const getItemsByCategoryId = async ({
  category_id,
  sort = 'created_at desc',
  page = 1,
}: GetItemsByCategoryIdInput): Promise<GetItemsByCategoryIdOutput> => {
  let response: AxiosResponse<GetItemsByCategoryIdOutput>;
  try {
    response = await API.get<GetItemsByCategoryIdOutput>(`/items/category/${category_id}`, {
      params: {
        sort,
        page,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getItemsBySearchTermAPI = async ({
  page = 1,
  query,
  sort,
}: GetItemsBySearchTermInput): Promise<GetItemsBySearchTermOutput> => {
  let response: AxiosResponse<GetItemsBySearchTermOutput>;
  try {
    response = await API.get<GetItemsBySearchTermOutput>(`/items`, {
      params: {
        page,
        query,
        sort,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const findItemById = async ({ item_id }: FindItemByIdInput): Promise<FindItemByIdOutput> => {
  let response: AxiosResponse<FindItemByIdOutput>;
  try {
    response = await API.get<FindItemByIdOutput>(`/items/${item_id}`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getItemsFromProvider = async ({
  page,
  sort,
}: GetItemsFromProviderInput): Promise<GetItemsFromProviderOutput> => {
  let response: AxiosResponse<GetItemsFromProviderOutput>;
  try {
    response = await API.get<GetItemsFromProviderOutput>('/items/provider', {
      params: {
        page,
        sort,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const addItemAPI = async (data: AddItemInput): Promise<AddItemOutput> => {
  let response: AxiosResponse<AddItemOutput>;
  try {
    response = await API.post<AddItemOutput>('/items', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const editItem = async ({
  item_id,
  category_name,
  infos,
  name,
  sale_price,
  stock,
}: EditItemInput): Promise<EditItemOutput> => {
  const data = {
    category_name,
    infos,
    name,
    sale_price,
    stock,
  };
  let response: AxiosResponse<EditItemOutput>;
  try {
    response = await API.put<EditItemOutput>(`/items/${item_id}`, data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const deleteItem = async ({ item_id }: DeleteItemInput): Promise<DeleteItemOutput> => {
  let response: AxiosResponse<DeleteItemOutput>;
  try {
    response = await API.delete<DeleteItemOutput>(`/items/${item_id}`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// upload API

export const uploadImages = async (data) => {
  let response;
  try {
    response = await API.post('/images/dropzone', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const uploadMultipleImages = async (data) => {
  let response;
  try {
    response = await API.post('/images/uploads_multiple', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// Order APIs

export const getOrdersFromConsumerAPI = async ({
  consumer_id,
  page = 1,
}: GetOrdersFromConsumerInput): Promise<GetOrdersFromConsumerOutput> => {
  let response: AxiosResponse<GetOrdersFromConsumerOutput>;
  try {
    response = await API.get<GetOrdersFromConsumerOutput>('/orders/consumer', {
      params: {
        consumer_id,
        page,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getOrdersFromProviderAPI = async ({
  provider_id,
  page = 1,
}: GetOrdersFromProviderInput): Promise<GetOrdersFromProviderOutput> => {
  let response: AxiosResponse<GetOrdersFromProviderOutput>;
  try {
    response = await API.get<GetOrdersFromProviderOutput>('/orders/provider', {
      params: {
        provider_id,
        page,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const createOrderAPI = async (data: CreateOrderInput): Promise<CreateOrderOutput> => {
  let response: AxiosResponse<CreateOrderOutput>;
  try {
    response = await API.post<CreateOrderOutput>('/orders', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const cancelOrderItemAPI = async ({ order_item_id }: CancelOrderItemInput): Promise<CancelOrderItemOutput> => {
  let response: AxiosResponse<CancelOrderItemOutput>;
  try {
    response = await API.put<CancelOrderItemOutput>(`/orders/order-item/${order_item_id}`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const updateOrderStatusAPI = async ({
  order_item_id,
  status,
}: UpdateOrerStatusInput): Promise<UpdateOrerStatusOutput> => {
  let response: AxiosResponse<UpdateOrerStatusOutput>;
  try {
    response = await API.put<UpdateOrerStatusOutput>(`/orders/order-item/${order_item_id}/update`, null, {
      params: {
        status,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// Refund APIs

export const requestRefundAPI = async ({
  order_item_id,
  status,
  count,
  problem_title,
  problem_description,
  recall_day,
  recall_place,
  recall_title,
  recall_description,
  refund_pay,
  send_day,
  send_place,
}: RequestRefundInput): Promise<RequestRefundOutput> => {
  let response: AxiosResponse<RequestRefundOutput>;
  const body = {
    count,
    problem_title,
    problem_description,
    recall_day,
    recall_place,
    recall_title,
    recall_description,
    refund_pay,
    send_day,
    send_place,
  };
  try {
    response = await API.post<RequestRefundOutput>(`/refunds/order-item/${order_item_id}/refund`, body, {
      params: {
        status,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getRefundsFromConsumerAPI = async ({
  page = 1,
  consumer_id,
}: GetRefundsFromConsumerInput): Promise<GetRefundsFromConsumerOutput> => {
  let response: AxiosResponse<GetRefundsFromConsumerOutput>;
  try {
    response = await API.get<GetRefundsFromConsumerOutput>('/refunds/consumer', {
      params: {
        page,
        consumer_id,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getRefundsFromProviderAPI = async ({
  page = 1,
  provider_id,
}: GetRefundsFromProviderInput): Promise<GetRefundsFromProviderOutput> => {
  let response: AxiosResponse<GetRefundsFromProviderOutput>;
  try {
    response = await API.get<GetRefundsFromProviderOutput>('/refunds/provider', {
      params: {
        page,
        provider_id,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// Like APIs

export const findLikeListAPI = async (): Promise<FindLikeListOutput> => {
  let response: AxiosResponse<FindLikeListOutput>;
  try {
    response = await API.get<FindLikeListOutput>('/likes');
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const likeItemAPI = async ({ item_id }: LikeItemInput): Promise<LikeItemOutput> => {
  let response: AxiosResponse<LikeItemOutput>;
  try {
    response = await API.put<LikeItemOutput>(`/likes/items/${item_id}/add`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const unlikeItemAPI = async ({ item_id }: UnlikeItemInput): Promise<UnlikeItemOutput> => {
  let response: AxiosResponse<UnlikeItemOutput>;
  try {
    response = await API.put<UnlikeItemOutput>(`/likes/items/${item_id}/remove`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// review APIs

export const createReviewAPI = async ({
  item_id,
  content,
  rating,
  images,
}: CreateReviewInput): Promise<CreateReviewOutput> => {
  let response: AxiosResponse<CreateReviewOutput>;
  const data = {
    content,
    rating,
    images,
  };
  try {
    response = await API.post<CreateReviewOutput>(`/reviews/items/${item_id}`, data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getReviewOnItemAPI = async ({
  page = 1,
  item_id,
}: GetReviewsOnItemInput): Promise<GetReviewsOnItemOutput> => {
  let response: AxiosResponse<GetReviewsOnItemOutput>;
  try {
    response = await API.get<GetReviewsOnItemOutput>(`/reviews/item/${item_id}`, {
      params: {
        page,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// get Items
export const getItems = (params = null) => API.get<any>('/items', { params });
export const getCategory = (id, params = null) => API.get<Category>(`/categories/${id}`, { params });

// post api

export const getPosts = () => async (params = null) => {
  const { data } = await API.get('/posts', { params });
  return data;
};
export const getPost = (postId) => async () => {
  const { data } = await API.get<any>(`/posts/${postId}`);
  return data;
};
export const createPost = (params) => API.post('/posts', { post: params });
export const updatePost = (postId, params) => API.patch(`/posts/${postId}`, { post: params });
export const destroyPost = (postId) => API.delete(`/posts/${postId}`);

export { API_URL, VERSION };

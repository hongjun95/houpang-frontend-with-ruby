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
// export const getCategories = (params = null) => API.get<Category[]>('/categories', { params });
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
// export const getCategory = (slug: string) => API.get<GetAllCategoriesOutput>(`/items/${slug}`);

// Item APIs

export const getItemsByCategoryId = async ({
  categoryId,
  sort = 'createdAt desc',
  page = 1,
}: GetItemsByCategoryIdInput): Promise<GetItemsByCategoryIdOutput> => {
  let response: AxiosResponse<GetItemsByCategoryIdOutput>;
  try {
    response = await API.get<GetItemsByCategoryIdOutput>(`/categories/${categoryId}`, {
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

export const findItemById = async ({ itemId }: FindItemByIdInput): Promise<FindItemByIdOutput> => {
  let response: AxiosResponse<FindItemByIdOutput>;
  try {
    response = await API.get<FindItemByIdOutput>(`/items/${itemId}`);
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

export const addItem = async (data: AddItemInput): Promise<AddItemOutput> => {
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
  itemId,
  categoryName,
  images,
  infos,
  name,
  price,
  stock,
}: EditItemInput): Promise<EditItemOutput> => {
  const data = {
    categoryName,
    images,
    infos,
    name,
    price,
    stock,
  };
  let response: AxiosResponse<EditItemOutput>;
  try {
    response = await API.put<EditItemOutput>(`/items/${itemId}`, data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const deleteItem = async ({ itemId }: DeleteItemInput): Promise<DeleteItemOutput> => {
  let response: AxiosResponse<DeleteItemOutput>;
  try {
    response = await API.delete<DeleteItemOutput>(`/items/${itemId}`);
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
    response = await API.post('/uploads', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// Order APIs

export const getOrdersFromConsumerAPI = async ({
  consumerId,
  page = 1,
}: GetOrdersFromConsumerInput): Promise<GetOrdersFromConsumerOutput> => {
  let response: AxiosResponse<GetOrdersFromConsumerOutput>;
  try {
    response = await API.get<GetOrdersFromConsumerOutput>('/orders/consumer', {
      params: {
        consumerId,
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
  providerId,
  page = 1,
}: GetOrdersFromProviderInput): Promise<GetOrdersFromProviderOutput> => {
  let response: AxiosResponse<GetOrdersFromProviderOutput>;
  try {
    response = await API.get<GetOrdersFromProviderOutput>('/orders/provider', {
      params: {
        providerId,
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

export const cancelOrderItemAPI = async ({ orderItemId }: CancelOrderItemInput): Promise<CancelOrderItemOutput> => {
  let response: AxiosResponse<CancelOrderItemOutput>;
  try {
    response = await API.put<CancelOrderItemOutput>(`/orders/order-item/${orderItemId}`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const updateOrderStatusAPI = async ({
  orderItemId,
  orderStatus,
}: UpdateOrerStatusInput): Promise<UpdateOrerStatusOutput> => {
  let response: AxiosResponse<UpdateOrerStatusOutput>;
  try {
    response = await API.put<UpdateOrerStatusOutput>(`/orders/order-item/${orderItemId}/update`, null, {
      params: {
        orderStatus,
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
  orderItemId,
  status,
  count,
  problemTitle,
  problemDescription,
  recallDay,
  recallPlace,
  recallTitle,
  recallDescription,
  refundPay,
  sendDay,
  sendPlace,
}: RequestRefundInput): Promise<RequestRefundOutput> => {
  let response: AxiosResponse<RequestRefundOutput>;
  const body = {
    count,
    problemTitle,
    problemDescription,
    recallDay,
    recallPlace,
    recallTitle,
    recallDescription,
    refundPay,
    sendDay,
    sendPlace,
  };
  try {
    response = await API.post<RequestRefundOutput>(`/refunds/order-item/${orderItemId}/refund`, body, {
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
  consumerId,
}: GetRefundsFromConsumerInput): Promise<GetRefundsFromConsumerOutput> => {
  let response: AxiosResponse<GetRefundsFromConsumerOutput>;
  try {
    response = await API.get<GetRefundsFromConsumerOutput>('/refunds/consumer', {
      params: {
        page,
        consumerId,
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
  providerId,
}: GetRefundsFromProviderInput): Promise<GetRefundsFromProviderOutput> => {
  let response: AxiosResponse<GetRefundsFromProviderOutput>;
  try {
    response = await API.get<GetRefundsFromProviderOutput>('/refunds/provider', {
      params: {
        page,
        providerId,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// Like APIs

export const findLikeList = async (): Promise<FindLikeListOutput> => {
  let response: AxiosResponse<FindLikeListOutput>;
  try {
    response = await API.get<FindLikeListOutput>('/likes');
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const likeItemAPI = async ({ itemId }: LikeItemInput): Promise<LikeItemOutput> => {
  let response: AxiosResponse<LikeItemOutput>;
  try {
    response = await API.put<LikeItemOutput>(`/likes/items/${itemId}/add`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const unlikeItemAPI = async ({ itemId }: UnlikeItemInput): Promise<UnlikeItemOutput> => {
  let response: AxiosResponse<UnlikeItemOutput>;
  try {
    response = await API.put<UnlikeItemOutput>(`/likes/items/${itemId}/remove`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// review APIs

export const createReviewAPI = async ({
  itemId,
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
    response = await API.post<CreateReviewOutput>(`/reviews/items/${itemId}`, data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getReviewOnItemAPI = async ({
  page = 1,
  itemId,
}: GetReviewsOnItemInput): Promise<GetReviewsOnItemOutput> => {
  let response: AxiosResponse<GetReviewsOnItemOutput>;
  try {
    response = await API.get<GetReviewsOnItemOutput>(`/reviews/item/${itemId}`, {
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

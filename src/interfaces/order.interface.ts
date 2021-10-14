import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
import { Item } from './item.interface';
import { User } from './user.interface';

export enum OrderStatus {
  Checking = '확인중',
  Received = '주문 접수',
  Delivering = '배달중',
  Delivered = '배달 완료',
  Canceled = '주문 취소',
}

export interface Order extends CoreEntity {
  consumer: User;
  order_items: OrderItem[];
  total: number;
  destination: string;
  deliver_request: string;
  ordered_at: string;
}

export interface OrderItem extends CoreEntity {
  order: Order;
  item: Item;
  count: number;
  status: OrderStatus;
}

// Get Orders from Consumer

export interface GetOrdersFromConsumerInput extends PaginationInput {
  consumer_id: string;
}
export interface GetOrdersFromConsumerOutput extends PaginationOutput {
  orders?: Order[];
}

// Get Orders from Provider

export interface GetOrdersFromProviderInput extends PaginationInput {
  provider_id: string;
}
export interface GetOrdersFromProviderOutput extends PaginationOutput {
  order_items?: OrderItem[];
}

// Create order

export interface OrderForm {
  deliver_request?: string;
}
export interface CreateOrderItemInput {
  item_id: number;
  count: number;
}
export interface CreateOrderInput {
  create_order_items: CreateOrderItemInput[];
  destination: string;
  deliver_request: string;
}
export interface CreateOrderOutput extends CoreOutput {
  orderId?: string;
}

// Cancel order

export interface CancelOrderItemInput {
  orderItemId: string;
}
export interface CancelOrderItemOutput extends CoreOutput {
  orderItem?: OrderItem;
}

// Update order status

export interface UpdateOrerStatusInput {
  orderItemId: string;
  orderStatus: OrderStatus;
}
export interface UpdateOrerStatusOutput extends CoreOutput {
  orderItem?: OrderItem;
}

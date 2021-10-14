import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
import { Item } from './item.interface';
import { User } from './user.interface';

export enum OrderStatus {
  Checking = 'Checking',
  Received = 'Received',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
  Canceled = 'Canceled',
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
export interface CreateOrderInput extends Pick<Order, 'destination' | 'deliver_request'> {
  create_order_items: CreateOrderItemInput[];
}
export interface CreateOrderOutput extends CoreOutput {
  order_id?: string;
}

// Cancel order

export interface CancelOrderItemInput {
  order_item_id: string;
}
export interface CancelOrderItemOutput extends CoreOutput {
  order_item?: OrderItem;
}

// Update order status

export interface UpdateOrerStatusInput {
  order_item_id: string;
  status: OrderStatus;
}
export interface UpdateOrerStatusOutput extends CoreOutput {
  order_item?: OrderItem;
}

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
  orderItems: OrderItem[];
  total: number;
  destination: string;
  deliverRequest: string;
  orderedAt: string;
}

export interface OrderItem extends CoreEntity {
  order: Order;
  item: Item;
  count: number;
  status: OrderStatus;
}

// Get Orders from Consumer

export interface GetOrdersFromConsumerInput extends PaginationInput {
  consumerId: string;
}
export interface GetOrdersFromConsumerOutput extends PaginationOutput {
  orders?: Order[];
}

// Get Orders from Provider

export interface GetOrdersFromProviderInput extends PaginationInput {
  providerId: string;
}
export interface GetOrdersFromProviderOutput extends PaginationOutput {
  orderItems?: OrderItem[];
}

// Create order

export interface OrderForm {
  deliverRequest?: string;
}
export interface CreateOrderItemInput {
  itemId: string;
  count: number;
}
export interface CreateOrderInput {
  createOrderItems: CreateOrderItemInput[];
  destination: string;
  deliverRequest: string;
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

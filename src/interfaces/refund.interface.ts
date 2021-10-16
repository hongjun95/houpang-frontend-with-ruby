import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
import { OrderItem } from './order.interface';
import { User } from './user.interface';

export enum RefundStatus {
  Exchanged = 'Exchanged',
  Refunded = 'Refunded',
}

export interface Refund extends CoreEntity {
  order_item: OrderItem;
  count: number;
  problem_title: string;
  problem_description: string;
  status: RefundStatus;
  refundee: User;
  recall_place: string;
  recall_day: Date;
  recall_title: string;
  recall_description?: string;
  send_place?: string;
  send_day?: Date;
  refund_pay?: number;
}

export interface RequestRefundInput
  extends Partial<
    Pick<
      Refund,
      | 'count'
      | 'problem_title'
      | 'problem_description'
      | 'status'
      | 'refundee'
      | 'recall_place'
      | 'recall_day'
      | 'recall_title'
      | 'recall_description'
      | 'send_place'
      | 'send_day'
      | 'refund_pay'
    >
  > {
  order_item_id: string;
}
export interface RequestRefundOutput extends CoreOutput {
  order_item?: OrderItem;
}

// Get Refunds from Consumer

export interface GetRefundsFromConsumerInput extends PaginationInput {
  consumer_id: string;
}

export interface GetRefundsFromConsumerOutput extends PaginationOutput {
  refunds?: Refund[];
}

// Get Refunds from Consumer

export interface GetRefundsFromProviderInput extends PaginationInput {
  provider_id: string;
}
export interface GetRefundsFromProviderOutput extends PaginationOutput {
  refunds?: Refund[];
}

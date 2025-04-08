import { Address } from './address';
import { OrderLine } from './orderLine';

export interface Order {
  id: number;
  orderDate: Date;
  subTotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  cancellationDate?: Date;
  weight?: number;
  fkshippingAddress: number;
  fkshippingAddressNavigation?: Address;
  fkuserId: number;
  orderLines: OrderLine[];
}

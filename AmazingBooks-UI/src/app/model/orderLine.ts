import { Book } from './book';
import { Order } from './order';

export interface OrderLine {
  id: number;
  amount: number;
  quantity: number;
  weight?: number;
  fkorderId?: number;
  fkbookId: number;
  fkbook?: Book;
  fkorder?: Order;
}

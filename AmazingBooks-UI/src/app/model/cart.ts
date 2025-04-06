import { Book } from './book';

export interface Cart {
  id?: number;
  fkuserId: number;
  fkbookId: number;
  quantity: number;
  book?: Book;
}

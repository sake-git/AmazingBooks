export interface Book {
  id?: number;
  name: string;
  author: string;
  price: number;
  publicationDate?: Date;
  imgUrl?: string;
  description: string;
  language: string;
  isbn?: string;
  pages?: number;
  hardcover: boolean;
  weight: number;
  quantity: number;
  genre?: string;
}

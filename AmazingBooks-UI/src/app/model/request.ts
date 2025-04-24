export interface BookRequest {
  id?: number;
  fkUser: number;
  selfLink: string;
  title: string;
  author: string;
  status: string;
}

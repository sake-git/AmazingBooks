import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../model/book';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BookApiService {
  baseurl = environment.BookApi;

  constructor(private http: HttpClient) {}

  public GetAllBooks(
    id: number,
    name: string,
    author: string
  ): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.baseurl}?id=${id}&&name=${name}&&author=${author}`
    );
  }

  public GetBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseurl}/${id}`);
  }

  public SaveBook(book: Book) {
    console.log('Book api to add book called', book);
    return this.http.post(`${this.baseurl}`, book);
  }
}

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

  public getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseurl);
  }

  public getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseurl}/${id}`);
  }
}

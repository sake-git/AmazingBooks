import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GoogleBook } from '../model/googlebook';
import { BaseRouteReuseStrategy } from '@angular/router';
import { BookRequest } from '../model/request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestApiService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.RequestApi;

  public SaveRequest(request: BookRequest) {
    return this.http.post(this.baseUrl, request);
  }

  public GetRequest(status: string): Observable<BookRequest[]> {
    return this.http.get<BookRequest[]>(`${this.baseUrl}?status=${status}`);
  }

  public GetRequestByUser(userid: number): Observable<BookRequest[]> {
    return this.http.get<BookRequest[]>(`${this.baseUrl}/ByUser/${userid}`);
  }

  public UpdateRequest(request: BookRequest, id: number) {
    return this.http.put(`${this.baseUrl}/${id}`, request);
  }

  public ProcureBook(request: BookRequest) {
    return this.http.get(request.selfLink);
  }

  public SearchBook(author: string, title: string) {
    let url = `${environment.GoogleApiBookSearch}?q=`;
    if (title != '' && title != undefined) {
      url = `${url}intitle:"${title}"&inauthor:"${author}"`;
    } else if (author != '' && author != undefined) {
      url = `${url}inauthor:"${author}"`;
    }
    return this.http.get(url);
  }
}

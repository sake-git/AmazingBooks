import { Component, OnInit } from '@angular/core';
import { RequestApiService } from '../../services/request-api.service';
import { BookApiService } from '../../services/book-api.service';
import { BookRequest } from '../../model/request';
import { CommonModule } from '@angular/common';
import { Book } from '../../model/book';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-procure-book',
  imports: [CommonModule, FormsModule],
  templateUrl: './procure-book.component.html',
  styleUrl: './procure-book.component.css',
})
export class ProcureBookComponent implements OnInit {
  statusList = ['All', 'Created', 'Procured', 'Failed', 'Cancelled'];
  status = 'All';
  requestList: BookRequest[] = [];
  request: BookRequest | undefined;
  book: Book | undefined;
  message = '';
  errorMessage = '';

  constructor(
    private requestApi: RequestApiService,
    private bookApi: BookApiService
  ) {}

  ngOnInit(): void {
    this.GetRequest();
  }

  GetRequest() {
    console.log('Get request called', this.status);
    this.requestList = [];
    this.requestApi.GetRequest(this.status).subscribe({
      next: (data: BookRequest[]) => {
        this.requestList = data;
      },
      error: (error) => {},
    });
  }

  ProcureBook(req: BookRequest) {
    console.log('Book procurement called');
    this.message = '';
    this.errorMessage = '';
    this.requestApi.ProcureBook(req).subscribe({
      next: (data: any) => {
        if (data == null) {
          this.errorMessage = 'Book unavailabe';
          req.status = 'Failed';
          this.UpdateRequest(req, 0);
        } else {
          console.log('Vloume infor ', data.volumeInfo);
          this.book = {
            id: 0,
            name: data.volumeInfo.title.substring(0, 200),
            author: data.volumeInfo.authors.join(',').substring(0, 100),
            price:
              data.saleInfo?.listPrice?.amount ||
              Math.floor(Math.random() * 6) + 15,
            publicationDate: new Date(data.volumeInfo.publishedDate),
            imgUrl: data.volumeInfo?.imageLinks?.thumbnail ?? 'unknown',
            language: data.volumeInfo.language,
            description:
              data.volumeInfo.description?.substring(0, 799) ?? 'unknown',
            isbn: data.volumeInfo.industryIdentifiers
              ? data.volumeInfo.industryIdentifiers[0].identifier
              : '',
            pages: data.volumeInfo.pageCount,
            quantity: 0,
            genre:
              data.volumeInfo.categories?.length > 0
                ? data.volumeInfo.categories[0].substring(0, 50)
                : 'Unknown',
            hardcover: false,
          };
          this.bookApi.SaveBook(this.book).subscribe({
            next: (data: any) => {
              console.log('Book Data', data);
              this.message = 'Book available now';
              req.status = 'Procured';
              this.UpdateRequest(req, data.id);
              this.errorMessage = '';
              this.message = 'Book Procured';
            },
            error: (error) => {
              this.errorMessage =
                "Book available but couldn't be added to Database";
              this.message = '';
              console.log(error);
            },
          });
        }
      },
      error: (error) => {
        console.log(error);
        req.status = 'Failed';
        this.UpdateRequest(req, 0);
        this.message = '';
        this.errorMessage = 'Error Procuring Request';
      },
    });
  }

  UpdateRequest(req: BookRequest, id: number) {
    this.requestApi.UpdateRequest(req, id).subscribe({
      next: (data) => {
        this.message = 'Request Updated';
      },
      error: (error) => {
        this.errorMessage = 'Error Updating Request';
        console.log(error);
      },
    });
  }

  CancelRequest(req: BookRequest) {
    req.status = 'Cancelled';
    this.UpdateRequest(req, 0);
  }

  Clear() {
    this.message = '';
    this.errorMessage = '';
  }
}

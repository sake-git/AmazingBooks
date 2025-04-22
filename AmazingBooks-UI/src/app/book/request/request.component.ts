import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleBook } from '../../model/googlebook';
import { RequestApiService } from '../../services/request-api.service';
import { LanguagePipe } from '../../pipes/language.pipe';
import { UserApiService } from '../../services/user-api.service';
import { User } from '../../model/user';
import { BookRequest } from '../../model/request';

@Component({
  selector: 'app-request',
  imports: [CommonModule, FormsModule, LanguagePipe],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css',
})
export class RequestComponent implements OnInit {
  title: string = '';
  author: string = '';
  bookList: GoogleBook[] = [];
  errorMessage = '';
  message = '';
  user: User | undefined;
  request: BookRequest | undefined;
  requestList: BookRequest[] = [];

  isRequestDisplay = false;

  constructor(
    private requestApi: RequestApiService,
    private userApi: UserApiService
  ) {}

  ngOnInit(): void {
    this.user = this.userApi.GetUserIdFromLocal();
  }

  DisplayRequestHistory() {
    this.isRequestDisplay = true;
    this.requestApi.GetRequestByUser(this.user?.id!).subscribe({
      next: (data: BookRequest[]) => {
        this.requestList = data;
      },
    });
  }

  SearchBook() {
    this.bookList = [];
    this.requestApi.SearchBook(this.author, this.title).subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.items.length; i++) {
          var info = data.items[i];
          console.log(
            'Title - ' +
              info.volumeInfo.title +
              ' Author -' +
              info.volumeInfo.authors
          );
          console.log(info.saleInfo.saleability);
          if (
            info.volumeInfo.title
              .toLowerCase()
              .includes(this.title.toLowerCase()) &&
            info.volumeInfo.authors &&
            info.volumeInfo.authors
              .join(',')
              .toLowerCase()
              .includes(this.author.toLowerCase())
          ) {
            let book = {
              selfLink: info.selfLink,
              title: info.volumeInfo.title,
              authors: info.volumeInfo.authors,
              publishedDate: info.volumeInfo.publishedDate,
              imageLinks: info.volumeInfo?.imageLinks?.thumbnail ?? 'unknown',
              language: info.volumeInfo.language,
            };
            this.bookList.push(book);
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  AddRequest(book: GoogleBook) {
    this.request = {
      id: 0,
      fkUser: this.user?.id!,
      selfLink: book.selfLink,
      status: 'Created',
      title: book.title,
      author: book.authors.join(','),
    };

    this.requestApi.SaveRequest(this.request).subscribe({
      next: (data) => {
        console.log('request added');
        this.message = 'Request created';
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = 'Failed to create request';
      },
    });
  }

  Clear() {
    this.message = '';
    this.errorMessage = '';
  }
}

import { Component, OnInit } from '@angular/core';
import { Book } from '../../model/book';
import { BookApiService } from '../../services/book-api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  books: Book[] = [];
  errorMessage: string = '';
  name = '';
  author = ' ';
  id = 0;
  pages: number[] = [];

  constructor(
    private bookApi: BookApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.errorMessage = params['error'];
    });

    this.GetBookList();
  }

  GetBookList() {
    this.bookApi
      .GetAllBooks(this.id, this.name.trim(), this.author.trim())
      .subscribe({
        next: (data) => {
          this.books = data;
        },
        error: (error) => {
          this.errorMessage = error.message;
          console.log(error.message);
        },
      });
  }

  Clear() {
    this.name = '';
    this.author = '';
    this.id = 0;
    this.pages = [];
    this.GetBookList();
  }

  SearchList() {
    this.id = 0;
    this.pages = [];
    this.GetBookList();
  }

  GetPrev() {
    if (this.pages.length != 0) {
      this.id = this.pages.pop()!;
      this.GetBookList();
    }
  }
  GetNext() {
    this.pages.push(this.id);
    this.id = this.books[this.books.length - 1].id!;
    this.GetBookList();
  }
}

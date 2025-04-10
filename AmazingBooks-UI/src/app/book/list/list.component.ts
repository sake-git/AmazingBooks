import { Component, OnInit } from '@angular/core';
import { Book } from '../../model/book';
import { BookApiService } from '../../services/book-api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  name = ' ';
  author = ' ';
  id = 0;
  pages: number[] = [];

  constructor(private bookApi: BookApiService) {}

  ngOnInit(): void {
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
      console.log('Prev', this.id);
      this.GetBookList();
    }
  }
  GetNext() {
    this.pages.push(this.id);
    console.log('Innext', this.books[this.books.length - 1].id);
    this.id = this.books[this.books.length - 1].id!;
    this.GetBookList();
  }
}

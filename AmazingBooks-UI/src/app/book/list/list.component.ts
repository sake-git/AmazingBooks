import { Component, OnInit } from '@angular/core';
import { Book } from '../../model/book';
import { BookApiService } from '../../services/book-api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  books: Book[] = [];
  errorMessage: string = '';
  constructor(private bookApi: BookApiService) {}

  ngOnInit(): void {
    this.bookApi.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.log(error.message);
      },
    });
  }
}

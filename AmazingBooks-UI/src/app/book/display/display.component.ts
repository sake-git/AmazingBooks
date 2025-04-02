import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Book } from '../../model/Book';
import { BookApiService } from '../../services/book-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-display',
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  book: Book | undefined;
  quantity = 1;

  constructor(private bookApi: BookApiService, private router: ActivatedRoute) {
    this.router.params.subscribe((params) => {
      let id = params['id'];
      if (id != null) {
        this.bookApi.getBook(id).subscribe({
          next: (data) => {
            this.book = data;
          },
          error: (error) => {
            console.error('Something went wrong: ', error.message);
          },
        });
      } else {
        console.log('invalid Id');
      }
    });
  }
}

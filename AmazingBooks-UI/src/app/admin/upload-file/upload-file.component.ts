import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BookApiService } from '../../services/book-api.service';

@Component({
  selector: 'app-upload-file',
  imports: [],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css',
})
export class UploadFileComponent implements OnInit {
  progress = 0;
  message = '';
  @Output() onUploadFinish = new EventEmitter();

  constructor(private bookApi: BookApiService) {}
  ngOnInit(): void {}

  uploadFile = (files: any) => {
    if (files.length == 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.bookApi.UploadFile(formData).subscribe({
      next: (event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total!);
        } else if (event.type == HttpEventType.Response) {
          this.message = 'Upload Successful';
          this.onUploadFinish.emit(event.body);
        }
      },
      error: (error) => {
        console.log('error');
      },
    });
  };
}

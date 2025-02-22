import { Component } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
  providers: [FileUploadService]
})
export class FileUploadComponent {
  files: string[] = [];

  constructor(private uploadService: FileUploadService) {}

  ngOnInit(): void {
    this.fetchFiles();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe(() => {
        this.fetchFiles();
      });
    }
  }

  fetchFiles(): void {
    this.uploadService.getFiles().subscribe((data) => {
      this.files = data;
    });
  }

  downloadFile(filename: string): void {
    this.uploadService.downloadFile(filename).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

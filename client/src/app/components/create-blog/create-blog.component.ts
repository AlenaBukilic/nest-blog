import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { File } from '../../models/file.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../../app/services/blog-service/blog.service';
import { catchError, map, of, tap } from 'rxjs';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent {
  @ViewChild('fileUpload', { static: false }) fileUpload:
    | ElementRef
    | undefined;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0,
  };
  form!: FormGroup;
  userId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      body: ['', Validators.required],
      slug: [{ value: '', disabled: true }],
      headerImg: [''],
    });
  }

  createBlog(): void {
    this.blogService.create(this.form.getRawValue()).pipe(
        tap(() => this.router.navigate(['../']))
    ).subscribe();
  }

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0,
      };
      this.fileUpload!.nativeElement.value = '';
      this.uploadFile();
    }
  }

  onClick(): void {
    const fileInput = this.fileUpload!.nativeElement;
    fileInput.click();
  }

  uploadFile(): void {
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.blogService
      .uploadBlogImage(formData)
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file.progress = Math.round(
                (event.loaded * 100) / event.total,
              );
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          this.file.inProgress = false;
          return of(`${this.file.data.name} upload failed`);
        }),
      )
      .subscribe((event: any) => {

        console.log('event', event);
        if (typeof event === 'object') {
          this.form?.patchValue({ headerImg: event.body.filename });
        }
      });
  }
}

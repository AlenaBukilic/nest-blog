import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogsPaginated } from '../../models/blogs.model';
import { BlogService } from '../../services/blog-service/blog.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

    dataSource: Observable<BlogsPaginated> = this.blogService.indexAll(1, 10);

    constructor(private blogService: BlogService) {}

    ngOnInit(): void {
    }

    onPaginateChange(event: any): void {
        this.dataSource = this.blogService.indexAll(event.pageIndex + 1, event.pageSize);
    }
}

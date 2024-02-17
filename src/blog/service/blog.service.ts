import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, catchError, from, of, switchMap, throwError } from 'rxjs';
import { Blog, BlogDocument } from '../model/blog.schema';
import { User } from '../../user/model/user.schema';
import { UserService } from '../../user/service/user.service';
import { Model, Types } from 'mongoose';
import { BlogPublic } from '../model/blog.interface';
const slugify = require('slugify');

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private userService: UserService,
  ) {}

  _generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }

  _blogCreate(blog: Blog): Observable<Blog> {
    return from(this.blogModel.create(blog));
  }

  create(user: User, blog: Blog): Observable<Blog> {
    const userId = user.id;
    return this._generateSlug(blog.title).pipe(
      switchMap((slug: string) => {
        blog.slug = slug;
        blog.userId = userId;
        return this._blogCreate(blog);
      }),
      catchError((err: Error) => {
        return throwError(() => err);
      }),
    );
  }

  findByUserId(userId: string): Observable<Record<string, any>> {
    return from(this.blogModel.find({ userId }).populate('userId', 'name email' ).lean().exec());
  }

  findAll(): Observable<Record<string, any>> {
    return from(
      this.blogModel.find().populate('userId', 'name email').lean().exec(),
    );
  }

  findOne(id: string): Observable<Blog> {
    return from(
      this.blogModel
        .findOne({ _id: new Types.ObjectId(id) })
        .populate('userId', 'name email')
        .lean().exec(),
    );
  }
}

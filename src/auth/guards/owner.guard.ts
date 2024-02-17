import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { BlogService } from 'src/blog/service/blog.service';
import { User } from 'src/user/model/user.schema';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private blogService: BlogService, private userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> | any {
    const request = context.switchToHttp().getRequest();
    const blogId = request.params.id;
    const user = request.user;

    return this.userService.findOne(user.id).pipe(
      switchMap((user: User) =>
        this.blogService.findOne(blogId).pipe(
          map((blog) => {
            if (!blog) {
                return false;
            }
            const hasPermission =
              blog.userId._id.toString() === user.id.toString();
            return user && hasPermission;
          }),
        ),
      ),
      catchError((err: Error) => {
        return throwError(() => err);
      }),
    );
  }
}

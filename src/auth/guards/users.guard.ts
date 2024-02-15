import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/user/model/user.schema';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const { user } = request.user;

    return this.userService.findOne(user.id).pipe(
      map((user: User) => {
        const hasPermission = user.id.toString() === params.id;
        return user && hasPermission;
      }),
    );
  }
}

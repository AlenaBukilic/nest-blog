import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationData } from 'src/auth/types/types.exporter';
import { UserPublic } from '../models/user.interface';
import { User, UserRole } from '../models/user.schema';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User | string> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err: Error) => of(err.message)),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<{ access_token: string }> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param() params: { id: string }): Observable<UserPublic> {
    return this.userService.findOne(params.id);
  }

  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<PaginationData> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.paginate({
      page: Number(page),
      perPage: Number(limit),
    });
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(id, user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<any> | Error {
    return this.userService.updateRoleOfUser(id, user);
  }
}

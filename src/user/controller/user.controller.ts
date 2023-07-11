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
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationData } from 'src/types/types.exporter';
import { UserPublic } from '../models/user.interface';
import { User, UserRole } from '../models/user.schema';
import { UserService } from '../service/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../../helpers/edit-filename';

const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: editFileName,
  }),
};

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err: Error) => {
        return throwError(() => err);
      }),
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
    @Query('username') username: string | undefined,
  ): Observable<PaginationData> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.paginate(
      {
        page: Number(page),
        perPage: Number(limit),
      },
      { username },
    );
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

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<Record<string, any>> {
    const user: User = req.user.user;
    console.log(user);
    return of({ imagePath: file.filename });
  }
}

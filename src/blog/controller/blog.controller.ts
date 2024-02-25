import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Query,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { Blog } from '../model/blog.schema';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OwnerGuard } from 'src/auth/guards/owner.guard';
import { editFileName } from 'src/helpers/edit-filename';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from '../../blog/model/blog.interface';

const storage = {
  storage: diskStorage({
    destination: './uploads/blogImages',
    filename: editFileName,
  }),
};
@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blog: Blog, @Request() req): Observable<Blog> {
    const user = req.user;
    return this.blogService.create(user, blog);
  }

  //   @Get()
  //   findBlogs(@Query('userId') userId: string) {
  //     if (userId) {
  //       return this.blogService.findByUserId(userId);
  //     }
  //     return this.blogService.findAll();
  //   }

  @Get('user/:userId')
  findByUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('userId') userId: string,
  ): Observable<any> {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.paginate(
      {
        page: Number(page),
        perPage: Number(limit),
      },
      userId,
    );
  }

  @Get()
  index(@Query('page') page = 1, @Query('limit') limit = 10): Observable<any> {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.paginate({
      page: Number(page),
      perPage: Number(limit),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<Blog> {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() blog: Blog): Observable<Blog> {
    return this.blogService.updateOne(id, blog);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.blogService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<Image> {
    return of(file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('image/:imgname')
  findBlogImage(
    @Param('imgname') imgname: string,
    @Res() res,
  ): Observable<Record<string, any>> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/blogImages/' + imgname)),
    );
  }
}

import { Controller, Post, Get, Body, Request, UseGuards, Query, Param } from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { Blog } from '../model/blog.schema';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blog: Blog, @Request() req): Observable<Blog> {
    const user = req.user.user;
    return this.blogService.create(user, blog);
  }

  @Get()
  findBlogs(@Query('userId') userId: string) {
    if (userId) {
      return this.blogService.findByUserId(userId);
    }
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<Blog> {
    return this.blogService.findOne(id);
  }
}

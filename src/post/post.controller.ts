import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { createPostDto } from './dto/post.dto';
import { GetTokenData, checkActiveStatus } from 'libs/src/decorators/user.decorator';
import { TokenUserDto } from 'src/user/dto/user.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Create a New Post with Logged in User
   * 
   */
  async createUser(@Body() post: createPostDto, @GetTokenData() user: TokenUserDto, @checkActiveStatus() isActive: Boolean) {
    return await this.postService.createPost(post, user, isActive);
  }
}

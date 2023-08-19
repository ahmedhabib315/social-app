import { Controller, Post, UseGuards, Body, Put, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { DeletePostDto, CreatePostDto, UpdatePostDto, LikePostDto } from './dto/post.dto';
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
  async createUser(@Body() post: CreatePostDto, @GetTokenData() user: TokenUserDto, @checkActiveStatus() isActive: Boolean) {
    return await this.postService.createPost(post, user, isActive);
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Create a New Post with Logged in User
   * 
   */
  async updatePost(@Body() post: UpdatePostDto, @GetTokenData() user: TokenUserDto, @checkActiveStatus() isActive: Boolean) {
    return await this.postService.updatePost(post, user, isActive, false);
  }

  @Put('delete')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Create a New Post with Logged in User
   * 
   */
  async deletePost(@Body() post: DeletePostDto, @GetTokenData() user: TokenUserDto, @checkActiveStatus() isActive: Boolean) {
    return await this.postService.updatePost(post, user, isActive, true);
  }

  @Get('my-posts')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Get All Post owned by User it self
   * 
   */
  async getMyPosts(@GetTokenData() user: TokenUserDto, @checkActiveStatus() isActive: Boolean) {
    return await this.postService.getMyPosts(user, isActive);
  }

  @Get('all-posts')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Get All Posts For a Logged in User
   * 
   */
  async getAllPosts(@checkActiveStatus() isActive: Boolean) {
    return await this.postService.getAllPosts(isActive);
  }

  @Post('like')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Like a Post From User
   * 
   */
  async likePost(@checkActiveStatus() isActive: Boolean, @GetTokenData() user: TokenUserDto, @Body() postData: LikePostDto) {
    return await this.postService.updateLikeOnPost(isActive, user, postData, true);
  }

  @Post('unlike')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to UnLike a Post From User
   * 
   */
  async unlikePost(@checkActiveStatus() isActive: Boolean, @GetTokenData() user: TokenUserDto, @Body() postData: LikePostDto) {
    return await this.postService.updateLikeOnPost(isActive, user, postData, false);
  }
}

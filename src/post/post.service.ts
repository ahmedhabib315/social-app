import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { createPostDto } from './dto/post.dto';
import { TokenUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService){}

  /**
   * Method to Create a New Post with Logged in User
   * 
   */
  async createPost(postData: createPostDto, user: TokenUserDto, isActive: Boolean){
    if(isActive){
      const data: any = {...postData, authorId: user.email};
      return await this.prisma.posts.create({data});
    }
    else{
      throw new UnauthorizedException('Please Activate Your Account First');
    }
  }
}

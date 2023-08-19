import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, DeletePostDto, LikePostDto } from './dto/post.dto';
import { TokenUserDto } from 'src/user/dto/user.dto';
import { EXCEPTIONS } from 'constants/constants';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Method to Create a New Post with Logged in User
   * 
   */
  async createPost(postData: CreatePostDto, user: TokenUserDto, isActive: Boolean) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    const data: any = { ...postData, authorId: user.email, isDeleted: false };
    return await this.prisma.posts.create({ data });
  }

  /**
   * 
   * Method to Update or Delete own post made by user
   * 
   * @param data 
   * @param user 
   * @param isActive 
   * @param deletePost 
   * @returns 
   */
  async updatePost(data: UpdatePostDto | DeletePostDto, user: TokenUserDto, isActive: Boolean, deletePost: Boolean) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    const oldPostData = await this.getPostDataById(data.id);
    if (oldPostData) {
      const isMyPost = await this.checkOwnPost(oldPostData, user.email);
      if (isMyPost) {
        if (deletePost) {
          return await this.prisma.posts.update({
            where: {
              id: oldPostData.id
            },
            data: {
              isDeleted: true
            }
          });
        }
        else {
          return await this.prisma.posts.update({
            where: {
              id: oldPostData.id
            },
            data: data
          });
        }
      }
      else {
        new UnauthorizedException(EXCEPTIONS.updateOwnPost);
      }
    }
    else {
      new UnauthorizedException(EXCEPTIONS.noPostFound);
    }
  }

  /**
   * 
   * Get Post by Post Id
   * 
   * @param postId 
   * @returns 
   */
  async getPostDataById(postId: number) {
    return await this.prisma.posts.findFirst({
      where: {
        id: postId,
        isDeleted: false
      }
    });
  }

  /**
   * 
   * Check if the Post Belongs to Logged in User
   * 
   * @param postData 
   * @param email 
   * @returns 
   */
  async checkOwnPost(postData, email) {
    return postData.authorId == email;
  }


  async getMyPosts(user: TokenUserDto, isActive: Boolean) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    return await this.prisma.posts.findMany({
      where: {
        authorId: user.email,
        isDeleted: false
      },
      select: {
        title: true,
        content: true,
        image: true,
        likes: true,
        createdAt: true,
        comments: {
          where: {
            isDeleted: false
          },
          select: {
            commentedBy: true,
            comment: true,
            createdAt: true
          }
        }
      }
    });
  }

  /**
   * 
   * Get All Post from All users for a logged in User
   * 
   * @param isActive 
   * @returns 
   */
  async getAllPosts(isActive: Boolean) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    return await this.prisma.posts.findMany({
      where: {
        isDeleted: false
      },
      select: {
        title: true,
        content: true,
        image: true,
        likes: true,
        createdAt: true,
        comments: {
          where: {
            isDeleted: false
          },
          select: {
            commentedBy: true,
            comment: true,
            createdAt: true
          }
        }
      }
    });
  }

  /**
   * 
   * Like or Dislike a Post by User
   * 
   * @param isActive 
   * @param user 
   * @param postData 
   * @param addLike 
   * @returns 
   */
  async updateLikeOnPost(isActive: Boolean, user: TokenUserDto, postData: LikePostDto, addLike: Boolean) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    const post = await this.prisma.posts.findFirst({
      where: {
        id: postData.id,
        isDeleted: false
      },
      select: {
        likes: true
      }
    });
    if (post) {
      if (addLike) {
        const likes: any = post.likes.includes(user.email) ? post.likes : post.likes.push(user.email);
        return await this.prisma.posts.update({
          where: {
            id: postData.id,
          },
          data: {
            likes: likes
          }
        })
      }
      else {
        const likes: any = post.likes.filter((email) => email != user.email)
        return await this.prisma.posts.update({
          where: {
            id: postData.id,
          },
          data: {
            likes: likes
          }
        })
      }
    }
    else {
      throw new UnauthorizedException(EXCEPTIONS.noPostFound);
    }
  };
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { Status } from './enum/user.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, ResetPasswordDto, TokenUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }


  /**
   * Method to Create a New User
   * 
   */
  async createUser(data: any) {
    const user = await this.getUserData(data.email);
    if (user) {
      throw new UnauthorizedException('Email Already in Use');
    }
    data.status = Status.active;
    data.isDeleted = false;
    return await this.prisma.users.create({ data });
  }

  /**
   * Method to Login with an Active User
   * 
   */
  async login(data: LoginUserDto) {
    const user: any = await this.getUserData(data.email);
    if (user) {
      if (user.password == data.password) {
        if (user.status == Status.active) {
          delete user.password;
          const token = await this.generateToken(user)
          return { ...user, token: token };
        }
        else {
          throw new UnauthorizedException('Your Account is not Active. Please Activate First');
        }
      }
      else {
        throw new UnauthorizedException('Please Login with Correct Credentials');
      }
    }
    else {
      throw new UnauthorizedException('Please Login with Correct Credentials');
    }
  }

  /**
   * 
   * Method to Get User Details by Email
   * 
   * @param email 
   * @returns 
   */
  async getUserData(email: string) {
    return await this.prisma.users.findFirst({
      where: {
        email: email
      },
      select: {
        email: true,
        status: true,
        role: true,
        password: true,
      }
    });
  }

  /**
   * 
   * Method to generate JWT token 
   * 
   * @param data 
   * @returns 
   */
  async generateToken(data: any) {
    return await this.jwtService.sign(data);
  }

  /**
   * Method to Update Data of an Active User
   * 
   */
  async updateUser(isActive: Boolean, data: UpdateUserDto, user: TokenUserDto) {
    if (isActive) {
      return await this.prisma.users.update({
        where: {
          email: user.email
        },
        data: data
      });
    }
    else {
      throw new UnauthorizedException('Your Account is not Active. Please Activate First');
    }
  }

  /**
   * Method to Deactivate a User
   * 
   */
  async deactivateUser(user: TokenUserDto) {
    const updatedData = await this.prisma.users.update({
      where: {
        email: user.email
      },
      data: {
        status: Status.inactive
      },
      select: {
        email: true,
        status: true,
        role: true,
      }
    });
    const token = await this.generateToken(updatedData);
    return { ...updatedData, token: token }
  }

  /**
   * Method to Reset password of an active User
   * 
   */
  async resetPassword(user: TokenUserDto, isActive: Boolean, data: ResetPasswordDto) {
    if (isActive) {
      const oldUserData = await this.getUserData(user.email)
      if (oldUserData.password == data.oldPassword) {
        const updatedData = await this.prisma.users.update({
          where: {
            email: user.email
          },
          data: {
            password: data.newPassword
          },
          select: {
            email: true,
            status: true,
            role: true,
          }
        });
        const token = await this.generateToken(updatedData);
        return { ...updatedData, token: token }
      }
      else {
        throw new UnauthorizedException('Your Old Password is Incorrect. Please Enter Correct Password');
      }
    }
    else {
      throw new UnauthorizedException('Your Account is not Active. Please Activate First');
    }
  }

  /**
   * Method to Activate a user
   * 
   */
  async activateUser(user: TokenUserDto){
    const updatedData = await this.prisma.users.update({
      where: {
        email: user.email
      },
      data: {
        status: Status.active
      },
      select: {
        email: true,
        status: true,
        role: true,
      }
    });
    const token = await this.generateToken(updatedData);
    return { ...updatedData, token: token }
  }
}

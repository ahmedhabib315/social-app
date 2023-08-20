import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { Status } from './enum/user.enum';
import { CreateUserDto, LoginUserDto, ChangePasswordDto, TokenUserDto, UpdateUserDto, ForgetPasswordDto, ResetPasswordDto } from './dto/user.dto';
import { EXCEPTIONS, digits, otpLength } from 'constants/constants';
import { addHours } from 'date-fns';
import { AuthService } from 'libs/src/auth/auth.service';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) { }


  /**
   * Method to Create a New User
   * 
   */
  async createUser(userData: CreateUserDto) {
    const user = await this.getUserData(userData.email);
    if (user) {
      throw new UnauthorizedException(EXCEPTIONS.alreadyInUse);
    }
    userData.password = await this.authService.generateHashPassword(userData.password)
    const data = { ...userData, status: Status.active, isDeleted: false }

    return await this.prisma.users.create({ 
      data,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  /**
   * Method to Login with an Active User
   * 
   */
  async login(data: LoginUserDto) {
    const user: any = await this.getUserData(data.email);
    if (user) {
      if (await this.authService.checkPassword(data.password, user.password)) {
        if (user.status == Status.active) {
          delete user.password;
          const token = await this.authService.generateToken(user);
          return { ...user, token: token };
        }
        else {
          throw new UnauthorizedException(EXCEPTIONS.activateAccount);
        }
      }
      else {
        throw new UnauthorizedException(EXCEPTIONS.correctCredentials);
      }
    }
    else {
      throw new UnauthorizedException(EXCEPTIONS.correctCredentials);
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
   * Method to Update Data of an Active User
   * 
   */
  async updateUser(isActive: Boolean, data: UpdateUserDto, user: TokenUserDto) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    return await this.prisma.users.update({
      where: {
        email: user.email
      },
      data: data
    });
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
    const token = await this.authService.generateToken(updatedData);
    return { ...updatedData, token: token }
  }

  /**
   * Method to Reset password of an active User
   * 
   */
  async changePassword(user: TokenUserDto, isActive: Boolean, data: ChangePasswordDto) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    const oldUserData = await this.getUserData(user.email)
    if (await this.authService.checkPassword(oldUserData.password, data.oldPassword)) {
      const updatedData = await this.prisma.users.update({
        where: {
          email: user.email
        },
        data: {
          password: await this.authService.generateHashPassword(data.newPassword)
        },
        select: {
          email: true,
          status: true,
          role: true,
        }
      });
      const token = await this.authService.generateToken(updatedData);
      return { ...updatedData, token: token }
    }
    else {
      throw new UnauthorizedException(EXCEPTIONS.oldPasswordIncorrect);
    }
  }

  /**
   * Method to Activate a user
   * 
   */
  async activateUser(user: TokenUserDto) {
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
    const token = await this.authService.generateToken(updatedData);
    return { ...updatedData, token: token }
  }

  /**
   * 
   * Save an Otp in Db to verify reset password request
   * 
   * @param user 
   * @returns 
   */
  async forgetPassword(user: ForgetPasswordDto) {
    const userData = await this.getUserData(user.email);
    if (userData) {
      if (userData.status == Status.active) {
        const data: any = {
          otp: await this.generateOtp(),
          expired: false,
          expiryDate: addHours(new Date(), 4),
          userId: user.email
        }

        return await this.prisma.oTP.create({ data });
      }
      else {
        throw new UnauthorizedException(EXCEPTIONS.activateAccount);
      }
    }
    else {
      throw new UnauthorizedException(EXCEPTIONS.noRegisteredEmail);
    }
  }

  /**
   * 
   * Generate a new OTP
   * 
   * @returns 
   */
  async generateOtp() {
    let otp = '';
    for (let i = 1; i <= otpLength; i++) {
      const index = Math.floor(Math.random() * (digits.length));
      otp = otp + digits[index];
    }
    return parseInt(otp);
  }

  /**
   * 
   * Reset Password with correct OTP and Valid Email Address
   * 
   * @param data 
   * @returns 
   */
  async resetPassword(data: ResetPasswordDto) {
    const otpData = await this.prisma.oTP.findFirst({
      where: {
        otp: data.otp,
        expired: false,
        userId: data.email,
        expiryDate: {
          gte: new Date()
        }
      }
    });

    if (otpData) {
      await this.prisma.oTP.update({
        where: {
          id: otpData.id
        },
        data: {
          expired: true
        }
      });

      return await this.prisma.users.update({
        where: {
          email: data.email
        },
        data: {
          password: await this.authService.generateHashPassword(data.newPassword)
        },
        select: {
          email: true,
          status: true,
          role: true,
        }
      });
    }
    else {
      throw new UnauthorizedException(EXCEPTIONS.incorrectOtp);
    }
  }

  /**
   * 
   * Get Logged in Users Profile Data
   * 
   * @param data 
   * @param isActive 
   * @returns 
   */
  async getUserDetails(data: TokenUserDto, isActive: Boolean) {
    if (!isActive) {
      throw new UnauthorizedException(EXCEPTIONS.activateAccount);
    }
    return await this.prisma.users.findFirst({
      where: {
        email: data.email
      },
      select: {
        email: true,
        name: true,
        username: true,
        createdAt: true,
        role: true,
        Post: {
          where: {
            isDeleted: false
          },
          select: {
            title: true,
            content: true,
            image: true,
          }
        }
      }
    });
  }
}

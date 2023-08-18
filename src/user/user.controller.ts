import { Controller, Get, Post, Body, Put, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, ResetPasswordDto, TokenUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetTokenData, checkActiveStatus } from 'libs/src/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  /**
   * Method to Create a New User
   * 
   */
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }

  @Post('login')
   /**
   * Method to Login with an Active User
   * 
   */
  async login(@Body() user: LoginUserDto){
    return await this.userService.login(user);
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Update Data of an Active User
   * 
   */
  async updateuser(@checkActiveStatus() isActive: Boolean, @Body() data: UpdateUserDto, @GetTokenData() user: TokenUserDto){
    return await this.userService.updateUser(isActive, data, user);
  }

  @Put('deactivate')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Deactivate a User
   * 
   */
  async deactivateUser(@GetTokenData() user: TokenUserDto){
    return await this.userService.deactivateUser(user);
  }

  @Put('reset-password')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Reset password of an active User
   * 
   */
  async resetPassword(@GetTokenData() user: TokenUserDto, @checkActiveStatus() isActive: Boolean, @Body() data: ResetPasswordDto){
    return await this.userService.resetPassword(user, isActive, data);
  }


  @Put('activate')
  @UseGuards(AuthGuard('jwt'))
  /**
   * Method to Activate a user
   * 
   */
  async activateUser(@GetTokenData() user: TokenUserDto){
    return await this.userService.activateUser(user);
  }
}

import { IsEmail, IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from "class-validator"
import { Roles, Status } from "../enum/user.enum"

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  name: string

  @IsNotEmpty()
  password: string

  @IsString()
  username: string

  @IsEnum(Roles)
  role: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  username: string
}

export class LoginUserDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}

export class TokenUserDto {
  @IsEmail()
  @IsString()
  email: string

  @IsEnum(Roles)
  role: string

  @IsEnum(Status)
  status: string

  @IsOptional()
  iat: number

  @IsOptional()
  exp: number
}

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string

  @IsNotEmpty()
  newPassword: string
}

export class MailUserDto {
  @IsEmail()
  email: string

  @IsString()
  name: string
}

export class ForgetPasswordDto {
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsEmail()
  email: string

  @IsNumber()
  otp: number

  @IsString()
  newPassword
}
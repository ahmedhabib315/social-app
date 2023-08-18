import { IsEmail, IsString, IsNotEmpty, IsAlphanumeric, IsOptional, IsNumber, IsEnum, isEmail } from "class-validator"
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

export class LoginUserDto{
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}

export class TokenUserDto {
  @IsEmail()
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

export class ResetPasswordDto {
  @IsNotEmpty()
  oldPassword: string

  @IsNotEmpty()
  newPassword: string
}
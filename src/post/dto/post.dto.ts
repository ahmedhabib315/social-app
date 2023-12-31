import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreatePostDto {
  @IsString()
  title: string

  @IsString()
  content: string

  @IsOptional()
  image: string
}

export class UpdatePostDto {
  @IsNumber()
  id: number

  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  content: string

  @IsOptional()
  @IsString()
  image: string
}

export class DeletePostDto {
  @IsNumber()
  id: number
}

export class LikePostDto {
  @IsNumber()
  id: number
}

export class AddCommentDto{
  @IsNumber()
  postid: number

  @IsString()
  comment: string
}

export class DeleteCommentDto{
  @IsNumber()
  commentid: number
}

export class EditCommentDto{
  @IsNumber()
  commentid: number

  @IsString()
  @IsNotEmpty()
  comment: string
}
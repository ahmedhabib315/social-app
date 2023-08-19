import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { JwtStrategy } from 'libs/src/strategy/jwt.strategy';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, JwtStrategy],
})
export class PostModule {
  
}

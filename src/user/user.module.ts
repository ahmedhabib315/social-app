import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANTS } from 'constants/constants';
import { JwtStrategy } from 'libs/src/strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register(CONSTANTS.jwtOptions)],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy],
})
export class UserModule {}

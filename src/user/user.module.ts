import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { JwtStrategy } from 'libs/src/strategy/jwt.strategy';
import { MailModule } from 'libs/src/mail/mail.module';
import { AuthModule } from 'libs/src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANTS } from 'constants/constants';
import { AuthService } from 'libs/src/auth/auth.service';

@Module({
  imports: [AuthModule, MailModule, JwtModule.register(CONSTANTS.jwtOptions)],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy, AuthService],
})
export class UserModule { }

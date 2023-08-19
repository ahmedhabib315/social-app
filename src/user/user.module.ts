import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'libs/src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANTS } from 'constants/constants';
import { JwtStrategy } from 'libs/src/strategy/jwt.strategy';
import { MailService } from 'libs/src/mail/mail.service';
import { MailModule } from 'libs/src/mail/mail.module';

@Module({
  imports: [JwtModule.register(CONSTANTS.jwtOptions), MailModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy],
})
export class UserModule { }

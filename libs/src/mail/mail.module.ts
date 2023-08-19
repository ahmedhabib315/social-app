import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { CONSTANTS } from 'constants/constants';


@Module({
  imports: [MailerModule.forRoot(CONSTANTS.mailOptions)],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }

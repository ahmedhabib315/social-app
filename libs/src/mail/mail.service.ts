import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailUserDto } from 'src/user/dto/user.dto';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService){}


  async sendEmail(user: MailUserDto, token: string){
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      html: "<b>Hello world ✔</b>"
    });
  }

}
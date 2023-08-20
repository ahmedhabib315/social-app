import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const CONSTANTS = {
  jwtOptions: {
    secret: 'Social App is the Best',
    signOptions: { expiresIn: '1h' },
  },
  validationPipeOptions: {
    whitelist: true,
    transform: true
  },
  mailOptions: {
    transport: {
      host: 'smtp.example.com',
      secure: false,
      auth: {
        user: 'example.username',
        pass: 'example.password',
      },
    },
    defaults: {
      from: '"No Reply" <example@gmail.com>',
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      options: {
        strict: true,
      },
    },
  }
}

export const EXCEPTIONS = {
  activateAccount: "Your account is inactive. Please Activate First",
  correctCredentials: 'Incorrect Credentials. Please login with correct credentials',
  alreadyInUse: 'Email already in use',
  noRegisteredEmail: 'Incorrect Email. This email is not associated with any registered account',
  oldPasswordIncorrect: 'Your old password is incorrect. Please enter correct password',
  incorrectOtp: 'Please enter correct otp or generate a new one',
  updateOwnPost: 'You can only update your own Posts',
  noPostFound: 'No Post Found with this Id',
  commentDeleteAccess: 'You do not have access to delete this comment',
  commentEditAccess: 'You do not have access to edit this comment',
  noCommentFound: 'No comment found by this comment Id'
}

export const saltOrRounds = 10;
export const password = 'Social App is the Best';

export const digits = '0123456789';
export const otpLength = 4;
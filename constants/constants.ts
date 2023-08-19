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
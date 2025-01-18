import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
export type SendEmailDto = {
  sender?: string | Address;
  recipients: Address[];
  subject: string;
  
};
@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}
  getHello(): string {
    return 'Hello World!';
  }
  // SEND EMAIL
  async sendEmail(dto: SendEmailDto) {
    const { recipients, subject} = dto;

    try {
      const result = await this.mailerService.sendMail({
        from: dto.sender ?? {
          name: process.env.APP_NAME,
          address: process.env.DEFAULT_EMAIL,
        },
        to: recipients,
        subject,
        template:"welcome",
        context:{
          name: 'kenny',
          shopUrl: 'https://dorcaxcollection.com/shop',
          year: new Date().getFullYear(),
        }
      });



      return result;
    } catch (error) {
      console.log("error",error)
    }
    
  }
}

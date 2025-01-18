import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './Module/user/user.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './Module/cart/cart.module';
import { OrderModule } from './Module/order/order.module';
import { PrismaService } from './prisma.service';
import { CloudinaryModule } from './module/cloudinary/cloudinary.module';
import { CategoryModule } from './module/category/category.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    CloudinaryModule,
    CategoryModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // This allows self-signed certificates
        },
      },
      defaults: {
        from: `"${process.env.APP_NAME}" <${process.env.DEFAULT_EMAIL}>`
      },
      template: {
        dir: process.cwd() + '/src/template/',
        adapter: new HandlebarsAdapter(), // Adapter for Handlebars
        options: {
          strict: true, // Enforces strict rendering rules
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

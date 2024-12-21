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

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

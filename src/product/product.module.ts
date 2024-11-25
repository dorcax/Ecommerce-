import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[JwtModule,CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService,PrismaService],
})
export class ProductModule {}

import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports:[CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService,PrismaService],
})
export class ProductModule {}

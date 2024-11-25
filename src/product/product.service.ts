import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { CreateCategoryDto, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateCategoryDto,  } from './dto/update-category';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Express } from 'express';
@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  // create product
  async createProduct(dto: CreateProductDto,file:Express.Multer.File) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: dto.userId,
        },
      });

      if (!user) {
        throw new NotFoundException('user not found');
      }
      const category = await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });
      if (!category) {
        throw new NotFoundException('category not found');
      }
      // image uploading
      let imageUrl =dto.imageUrl
      if (!imageUrl && file) {
        const uploadResponse = await this.cloudinaryService.uploadFile(file).catch(() => {
          throw new InternalServerErrorException('Failed to upload image');
        });
        imageUrl = uploadResponse.secure_url;
      }
    
      if (!imageUrl) {
        throw new BadRequestException('Either imageUrl or file must be provided');
      }
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price:dto.price,
          stock: dto.stock,
          imageUrl,
          color:dto.color,
          variant:dto.variant,
          user: {
            connect: {
              id: dto.userId,
            },
          },
          category: {
            connect: {
              id: dto.categoryId,
            },
          },
        },
      });
      return product;
    } catch (error) {
      console.log("error",error)
      throw new InternalServerErrorException(
        'An error occurred while creating the product',
        error,
      );
    }
  }

  // create category ...
  async createCategory(dto: CreateCategoryDto,file:Express.Multer.File) {
    try {
      let imageUrl =dto.imageUrl
      if (!imageUrl && file) {
        const uploadResponse = await this.cloudinaryService.uploadFile(file).catch(() => {
          throw new InternalServerErrorException('Failed to upload image');
        });
        imageUrl = uploadResponse.secure_url;
      }
    
      if (!imageUrl) {
        throw new BadRequestException('Either imageUrl or file must be provided');
      }
      const category = await this.prisma.category.create({
        data: {
          name: dto.name,
          imageUrl
        },
      });
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


// find products

async findProducts(userId:string) {
   try {
    const products =await this.prisma.product.findMany({
      where:{
        userId:userId
      }
    })
    if(!products){
      throw new NotFoundException("products  not found ")
    }
    return products
   } catch (error) {
    throw new Error("error in generating all product")
   }
  }
  // find many category
  async findCategories() {
    try {
     const categories =await this.prisma.category.findMany({})
     if(!categories){
       throw new NotFoundException("category not found ")
     }
     return categories
    } catch (error) {
     throw new Error("error in generating all categories")
    }
   }

// edit product 
 async updateProduct(productId: string, dto: UpdateProductDto,file:Express.Multer.File) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: dto.userId,
        },
      });

      if (!user) {
        throw new NotFoundException('user not found');
      }
      const category = await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });
      if (!category) {
        throw new NotFoundException('category not found');
      }
      // image uploading
      let imageUrl =dto.imageUrl
      if (!imageUrl && file) {
        const uploadResponse = await this.cloudinaryService.uploadFile(file).catch(() => {
          throw new InternalServerErrorException('Failed to upload image');
        });
        imageUrl = uploadResponse.secure_url;
      }
    
      if (!imageUrl) {
        throw new BadRequestException('Either imageUrl or file must be provided');
      }
      const product =await this.prisma.product.update({
        where:{
          id:productId,
        },
        data:{
          name: dto.name,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          imageUrl,
          color:dto.color,
          variant:dto.variant,
          user: {
            connect: {
              id: dto.userId,
            },
          },
          category: {
            connect: {
              id: dto.categoryId,
            },
          },
        }
      })

      return product
    } catch (error) {
      throw new InternalServerErrorException("error while uploading the product",error)
    }
  }



  // update category

  async updateCategory(categoryId:string, dto: UpdateCategoryDto,file:Express.Multer.File) {
    try {

      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        throw new NotFoundException('category not found');
      }
      // image uploading
      let imageUrl =dto.imageUrl
      if (!imageUrl && file) {
        const uploadResponse = await this.cloudinaryService.uploadFile(file).catch(() => {
          throw new InternalServerErrorException('Failed to upload image');
        });
        imageUrl = uploadResponse.secure_url;
      }
    
      if (!imageUrl) {
        throw new BadRequestException('Either imageUrl or file must be provided');
      }
      const categoryItem =await this.prisma.category.update({
        where:{
          id:categoryId,
        },
        data:{
          name: dto.name,
          imageUrl,
        }
      })

      return categoryItem
    } catch (error) {
      console.log("jjjjjjjj",error)
      // throw new InternalServerErrorException("error while uploading the product",error)
    }
  }


  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto, PaginationDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/module/cloudinary/cloudinary.service';


@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  // create product
  async createProduct(dto: CreateProductDto, file: Express.Multer.File, req) {
    try {
      console.log('user', req.user);
      // find if user exist
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.sub,
        },
      });
      console.log('my user', user);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      // find if category exist

      const category = await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });
      if (!category) {
        throw new NotFoundException('category not found');
      }
      // image uploading
      let imageUrl = dto.imageUrl;
      if ( !file) {
        throw new BadRequestException('please upload your image');
      }
      if (file) {
        const uploadResponse = await this.cloudinaryService.uploadFile(file);
        imageUrl = uploadResponse.secure_url;
      }
// create new product
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          imageUrl,
          color: dto.color,
          variant: dto.variant,
          user: {
            connect: {
              id: req.user.sub,
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
      console.log('error', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the product',
        error,
      );
    }
  }

  // find products

  async findProducts(
    req,
    paginationDto:PaginationDto,
  ) {
     const{page="1",limit="4",search=""} =paginationDto
    //  calculate skip
    const pages=parseInt(page)
    const limits=parseInt(limit)
    const skip =(pages-1)*limits
    const take=limits
    console.log(take,skip)
    try {
      // check if the search is a valid number 
      const parsedSearch =search &&!isNaN(parseInt(search))?parseInt(search) :null
      // find many product 
      const products = await this.prisma.product.findMany({
        where: {
          userId: req.user.sub,
          ...(search ?{
            OR:[
             { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
             parsedSearch !== null ? { stock: { equals:parsedSearch} } :{},
            parsedSearch !== null ?{ price: { equals: parsedSearch } }:{},
            
            ]
          }:{})
        },

        include: {
          category: true,
        },
        take,
        skip,
       


      });
      console.log("my product")

      // count total product
      const total =await this.prisma.product.count({
        where:{
          userId:req.user.sub
        }
      })
      console.log("total",total)
      return {products,
        total,
        pages,limits,
        totalPages:Math.ceil(total/limits)
      };
    } catch (error) {
      throw new InternalServerErrorException('error in generating all product');
    }
    
  }

  //   // find product
  async findProduct(productId: string,req ) {
    try {
      console.log(productId,req.user.sub)
      if (!req.user.sub) {
        throw new NotFoundException('User not found');
      }
      const product = await this.prisma.product.findFirst({
        where: { AND: [{ id: productId }, { userId: req.user.sub }] },
        include: {
          user: true,
        },
      });
      // console.log("product",product)

      if (!product) {
        throw new NotFoundException(
          'The product ID does not exist or does not belong to the user.',
        );
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while fetching the product',
      );
    }
  }

  // // edit product
  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
    file: Express.Multer.File,
    req,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.sub,
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
      // find the existing product
      const existingProduct = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      console.log('existing', existingProduct);
      // find previous image and delete
      if (
        existingProduct.imageUrl &&
        existingProduct.imageUrl !== dto.imageUrl
      ) {
        const deletePreviousImage = await this.cloudinaryService.deleteFile(
          existingProduct.imageUrl,
        );
        console.log('deletefile', deletePreviousImage);
        if (!deletePreviousImage) {
          throw new InternalServerErrorException(
            'failed to delete previous image',
          );
        }
      }

      // image uploading
      let imageUrl = dto.imageUrl;
      if (!imageUrl && file) {
        const uploadResponse = await this.cloudinaryService
          .uploadFile(file)
          .catch(() => {
            throw new InternalServerErrorException('Failed to upload image');
          });
        imageUrl = uploadResponse.secure_url;
        console.log('rrrr', uploadResponse);
      }

      if (!imageUrl) {
        throw new BadRequestException(
          'Either imageUrl or file must be provided',
        );
      }
      const product = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          imageUrl,
          color: dto.color,
          variant: dto.variant,
          user: {
            connect: {
              id: req.user.sub,
            },
          },
          category: {
            connect: {
              id: dto.categoryId,
            },
          },
        },
      });
      if (!product) {
        throw new NotFoundException(
          "error in updating the product detial"
        );
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
       
        error,
      );
    }
  }

  //  delete product
  async deleteProduct(productId: string, req) {
    try {
      const product = await this.prisma.product.deleteMany({
        where: {
          AND: [{ id: productId }, { userId: req.user.sub }],
        },
      });

      if (product.count === 0) {
        throw new NotFoundException(
          'Error in deleting product. Product not found.',
        );
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while deleting the product',
      );
    }
  }

  // get statistics
  async getStatistics() {
    try {
      const today = new Date();
      console.log(today);
      const last7days = new Date(today);
      console.log(last7days);
      last7days.setDate(today.getDate() - 7);
      const totalProduct = await this.prisma.product.count();
      const totalOrder = await this.prisma.order.count({
        where: {
          createdAt: { gte: last7days },
        },
      });
      const totalUser = await this.prisma.user.count(
      //   {
      //   where: {
      //     createdAt: {
      //       gte: last7days,
      //     },
      //   },
      // }
    );
      const totalCategory = await this.prisma.category.count();

      return {
        totalProduct,
        totalOrder,
        totalUser,
        totalCategory,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  // getmonthlysales
  async getMonthlySales() {
    try {
      const getOrders
       = await this.prisma.order.findMany({
        select: {
          totalPrice: true,
          createdAt: true,
        },
      });
      //  get the tot
      const result = getOrders.reduce((acc, curr) => {
        const month = new Date(curr.createdAt).getMonth() + 1;
        acc[month] = (acc[month] || 0) + curr.totalPrice;
        return acc;
      }, {});
      // Convert the result into an array of 12 months, filling missing months with 0
      const monthlyData = Array(12)
        .fill(0)
        .map((_, index) => result[index + 1] || 0);
      return monthlyData;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error fetching monthly sales data',
      );
    }
  }
}

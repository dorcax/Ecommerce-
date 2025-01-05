import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,

  BadRequestException
} from '@nestjs/common';
import {  CreateProductDto } from './dto/create-product.dto';
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
  async createProduct(dto: CreateProductDto,file:Express.Multer.File,req) {
    try {
      console.log("user",req.user.payload.sub)
      const user = await this.prisma.user.findUnique({
        where: {
          id:req.user.payload.sub,
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
      if (!imageUrl && !file) {
        throw new BadRequestException('please upload your image');
       
      }
      if(file){
        const uploadResponse =await this.cloudinaryService.uploadFile(file)
        imageUrl =uploadResponse.secure_url
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
              id: req.user.payload.sub,
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

  
// find products

async findProducts(req) {
   try {
    const products =await this.prisma.product.findMany({
      where:{
        userId:req.user.payload.sub
      },
      include:{
        category:true
      }
    })
    if(!products){
      throw new NotFoundException("products  not found  ")
    }
    return products
   } catch (error) {
    throw new Error("error in generating all product")
   }
  }

  // find product
  async findProduct(productId:string,userId:string){
    try {
  
      if (!userId) {
        throw new NotFoundException('User not authenticated');
      }
      const product =await this.prisma.product.findFirst({
        where:{AND:[{id:productId},{userId:userId}]},
        include:{
          user:true

        }
     
      })
     
      if(!product) { 
        throw new NotFoundException('The product ID does not exist or does not belong to the user.')
      }
       
      return product
    } catch (error) {
    
    throw new InternalServerErrorException('An error occurred while fetching the product');
    }
  }
  
  
  
    
  
 


// edit product 
 async updateProduct(productId: string, dto: UpdateProductDto,file:Express.Multer.File,req) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.payload.sub,
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
      const existingProduct =await this.prisma.product.findUnique({
        where:{
          id:productId
          
        }
      })
      console.log("existing",existingProduct)
      // find previous image and delete
      if(existingProduct.imageUrl && existingProduct.imageUrl !==dto.imageUrl){
       const deletePreviousImage= await this.cloudinaryService.deleteFile(existingProduct.imageUrl)
       console.log("deletefile",deletePreviousImage)
       if(!deletePreviousImage){
        throw new InternalServerErrorException("failed to delete previous image")
       }
      }
     
      // image uploading
      let imageUrl =dto.imageUrl
      if (!imageUrl && file) {
        const uploadResponse = await this.cloudinaryService.uploadFile(file).catch(() => {
          throw new InternalServerErrorException('Failed to upload image');
        });
        imageUrl = uploadResponse.secure_url;
        console.log("rrrr",uploadResponse)
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
              id: req.user.payload.sub,
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



  
//  delete product 
async deleteProduct(productId: string, req) {
  try {
    const product = await this.prisma.product.deleteMany({
      where: {
        AND: [
          { id: productId },
          { userId: req.user.payload.sub },
        ],
      },
    });

    if (product.count === 0) {
      throw new NotFoundException('Error in deleting product. Product not found.');
    }

    return { message: 'Product deleted successfully' };
  } catch (error) {
    throw new InternalServerErrorException(error.message || 'An error occurred while deleting the product');
  }
}

// get statistics
async getStatistics(){
  try {
    const today = new Date();
    console.log(today)
    const last7days =new Date(today)
    console.log(last7days)
    last7days.setDate(today.getDate() -7)
    const totalProduct=await this.prisma.product.count()
    const totalOrder =await this.prisma.order.count({
      where:{
        createdAt:{gte:last7days}
      }
    })
    const totalUser =await this.prisma.user.count({
      where :{
        createdAt:{
          gte:last7days
        }
      }
    })
    const totalCategory=await this.prisma.category.count()

    return {
      totalProduct,
      totalOrder,
    totalUser,
    totalCategory
    }
  } catch (error) {
    console.log(error)
    throw new InternalServerErrorException(error);
    
  }
}
// getmonthlysales
async getMonthlySales(){
  try {
   const getOrders =await this.prisma.order.findMany({
    select:{
      totalPrice:true,
      createdAt:true
    }
   })
  //  get the tot
  const result =getOrders.reduce((acc,curr)=>{
    const month = new Date(curr.createdAt).getMonth()+1
    acc[month]=(acc[month] ||0)+curr.totalPrice
    return acc
  },{})
  // Convert the result into an array of 12 months, filling missing months with 0
  const monthlyData=Array(20).fill(0).map((_,index)=>result[index+1] ||0)
  return monthlyData
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Error fetching monthly sales data');
    
  }
}
}
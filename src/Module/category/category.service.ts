import { Injectable ,BadRequestException,InternalServerErrorException,NotFoundException} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private cloudinaryService:CloudinaryService,
    private prisma: PrismaService,
  ){}
 // create category ...
   async createCategory(dto: CreateCategoryDto,file:Express.Multer.File) {
     try {
       console.log('File:', file);
       console.log('DTO:', dto);
       if(!dto.imageUrl && !file){
         throw new BadRequestException("failed to upload image")
       }
       if (file) {
         const uploadResponse = await this.cloudinaryService.uploadFile(file)
         dto.imageUrl = uploadResponse.secure_url;
         console.log("dto image",dto.imageUrl)
       }
 
       const category = await this.prisma.category.create({
         data: {
           name: dto.name,
           description:dto.description,
           imageUrl: dto.imageUrl
         },
       });
       return category;
     } 
     catch (error) {
       console.log(error)
       throw new InternalServerErrorException(error.message ||"error in uploading images");
     }
   }
 
 
   // // find many category
     async findCategory() {
       console.log("findCategory method called");
       try {
         const categories = await this.prisma.category.findMany();
         console.log("Categories fetched:", categories);
         return categories;
       } catch (err) {
         console.error("Error fetching categories:", err);
         throw new InternalServerErrorException("Database query failed");
       }
     }
    //  get data 
    async getCategory (categoryId:string){
      try{
      const category =await this.prisma.category.findUnique({
        where:{
          id:categoryId
        }

      })
      return category
      }catch(error){
        console.error("Error fetching categories:", error);
        throw new InternalServerErrorException("Database query failed");
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
      const existingCategory =await this.prisma.category.findUnique({
        where:{
          id:categoryId
        }
      })

      if(existingCategory.imageUrl && existingCategory.imageUrl !==dto.imageUrl){
        const deletePreviousImage= await this.cloudinaryService.deleteFile(existingCategory.imageUrl)
        console.log("deletefile",deletePreviousImage)
        if(!deletePreviousImage){
         throw new InternalServerErrorException("failed to delete previous image")
        }
      }
      // uploading of image
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
      const categoryItem =await this.prisma.category.update({
        where:{
          id:categoryId,
        },
        data:{
          name: dto.name,
          description:dto.description,
          imageUrl,
        }
      })

      return categoryItem
    } catch (error) {
      console.log("jjjjjjjj",error)
      // throw new InternalServerErrorException("error while uploading the product",error)
    }
  }



 async removeCategory(categoryId: string) {
  try {
    const deletedCategory =await this.prisma.category.delete({
      where:{
        id:categoryId
      }
    })
if(!deletedCategory){
  throw new NotFoundException("category not found")
}
  } catch (error) {
    throw new InternalServerErrorException(error.message)
  }
  }
}

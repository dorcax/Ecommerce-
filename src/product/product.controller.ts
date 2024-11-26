import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateCategoryDto, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateCategoryDto } from './dto/update-category';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/role.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipe({ 
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,

  ) {
    return this.productService.createProduct(createProductDto,file);
  }

  // category route
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('category')
  createCategory(
    @UploadedFile(
      new ParseFilePipe({ 
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,

    @Body() createCategoryDto: CreateCategoryDto) {
    return this.productService.createCategory(createCategoryDto,file);
  }

  // find all product

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":userId")
  async findProducts(@Param("userId") userId:string){
    return this.productService.findProducts(userId);
  }

  // find all category
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("allcategories")
   findCategories(){
    return this.productService.findCategories();
  }



  // update product
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':productId')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile(
      new ParseFilePipe({ 
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
     @Body() updateProductDto: UpdateProductDto,
    @Param("productId") productId:string) {
    return this.productService.updateProduct( productId,updateProductDto,file);
  }


  // update category 
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':categoryId')
  @UseInterceptors(FileInterceptor('file'))
  updateCategory(
    @UploadedFile(
      new ParseFilePipe({ 
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
     @Body() updateCategoryDto: UpdateCategoryDto,
    @Param("categoryId") categoryId:string) {
    return this.productService.updateCategory( categoryId,updateCategoryDto,file);
  }

}
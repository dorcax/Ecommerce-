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
  Req,
  Res} from '@nestjs/common';
import { ProductService } from './product.service';
import {  CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  // create to product
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
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
    @Body() createProductDto: CreateProductDto ,
    @Req() req

  ) {
    const userId = req.user.sub;



    return this.productService.createProduct(createProductDto,file,req);
  }

  // category route
 
  // find all product

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findProducts(
    @Req() req
  ){
    return this.productService.findProducts(req);
  }
  
  // find each product 
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":productId")
  getProduct(
    @Param("productId") productId:string,
    @Req() req
  ){

    const userId = req.user.payload.sub;
    return this.productService.findProduct(productId,userId)
  }

  


  // update product
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
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
     @Req() req,
    @Param("productId") productId:string) {
    return this.productService.updateProduct( productId,updateProductDto,file,req);
  }


 
// delete product
@Roles(Role.USER,Role.ADMIN)
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Delete(":productId")
async deleteProduct(@Param("productId") productId:string,
@Req() req){
  return this.productService.deleteProduct(productId,req)
}
// get statistics
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get("/stat/statistics")
async getStatistics(){
  return this.productService.getStatistics()
}
// get monthly sales 
// @Roles(Role.ADMIN)
}
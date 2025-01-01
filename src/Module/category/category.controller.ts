import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards ,UseInterceptors,FileTypeValidator,UploadedFile,ParseFilePipe,MaxFileSizeValidator} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from '../auth/guards/role-guard';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.entity';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  // create category
 @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
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
    return this.categoryService.createCategory(createCategoryDto,file);
  }

// find all category
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get()
findCategories(){
  return this.categoryService.findCategory();
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
     return this.categoryService.updateCategory( categoryId,updateCategoryDto,file);
   }


// delete category
   @Roles(Role.USER)
   @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':categoryId')
  remove(@Param('categoryId') categoryId: string) {
    return this.categoryService.removeCategory(categoryId);
  }
}

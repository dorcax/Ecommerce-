import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsString, IsOptional } from 'class-validator';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsOptional()
  imageUrl: string;
}

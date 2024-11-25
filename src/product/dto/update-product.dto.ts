import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto,CreateCategoryDto } from './create-product.dto';
import {IsString,IsNumber,IsUrl, IsOptional} from "class-validator"
import { Transform } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
  name: string;
  @IsString()
  description: string;
  @Transform(({ value }) => parseFloat(value)) 
  @IsNumber()
  price: number;
  @IsString()
  userId: string;
  @IsString()
  categoryId: string;
  @Transform(({ value }) => parseFloat(value)) 
  @IsNumber()
  stock: number;
  @IsOptional()
  imageUrl: string;
  @IsString()
  color: string;
  @IsString()
  variant: string;
}




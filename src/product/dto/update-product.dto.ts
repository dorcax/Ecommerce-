import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value)) // Converts input string to float
  @IsNumber()
  price: number;

  @IsString()
  userId: string;

  @IsString()
  categoryId: string;

  @Transform(({ value }) => parseInt(value, 10)) // Converts input string to integer
  @IsNumber()
  stock: number;

  @IsString()
  color: string;

  @IsString()
  variant: string;


  @IsOptional()
  imageUrl?: string;
}


import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @Transform(({ value }) => parseFloat(value)) // Converts to float
  @IsNumber()
  price: number;
  @IsString()
  userId: string;
  @IsString()
  categoryId: string;
  @Transform(({ value }) => parseInt(value)) // Converts to float
  @IsNumber()
  stock: number;
 @IsOptional()
  imageUrl: string;
  @IsString()
  color: string;
  @IsString()
  variant: string;
}

export class CreateCategoryDto {


  @IsString()
  name: string;




  @IsOptional()
  imageUrl:string
}

import { IsNumber, IsString, IsOptional, IsNotEmpty, IsInt,Min } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty({message:"Name is required"})
  name: string;

  @IsString()
  @IsNotEmpty({message:"Description is required"})
  description: string;

  @Transform(({ value }) => parseFloat(value)) // Converts input string to float
  @IsNumber()
  @IsNotEmpty({message:"Price is required"})
  price: number;

  // @IsString()
  // userId: string;

  @IsString()
  @IsNotEmpty({message:"Category is required"})
  categoryId: string;

  @Transform(({ value }) => parseInt(value, 10)) // Converts input string to integer
  @IsNumber()
  @IsNotEmpty({message:"stock is required"})
  stock: number;

  @IsString()
  @IsNotEmpty({message:"color is required"})
  color: string;

  @IsString()
  @IsNotEmpty({message:"variant is required"})
  variant: string;


  @IsOptional()
  @IsNotEmpty({message:"imageUrl is required"})

  imageUrl?: string;
}

// pagination dto
export class PaginationDto{
  @IsOptional()
  @IsString()
  page?:string

  @IsOptional()
  @IsString()
  limit?:string
  
  @IsOptional()
  @IsString()
  search?:string
}



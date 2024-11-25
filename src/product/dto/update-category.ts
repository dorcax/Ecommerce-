

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-product.dto';
import {IsString,IsNumber,IsUrl, IsOptional} from "class-validator"
export class UpdateCategoryDto extends PartialType(CreateCategoryDto){
    @IsString()
    name: string;
    @IsOptional()
    imageUrl:string
}
import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsInt, IsNotEmpty, IsString,IsNumber } from "class-validator"
export class UpdateCartDto extends PartialType(CreateCartDto) {
    
    
    @IsNumber()
    @IsNotEmpty()
    quantity:number

    @IsString()
    @IsNotEmpty()
    productId:string
}

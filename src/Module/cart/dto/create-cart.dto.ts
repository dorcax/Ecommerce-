import { IsInt, IsNotEmpty, IsString,IsOptional } from "class-validator"

export class CreateCartDto {
    @IsString()
    @IsNotEmpty()
    userId:string
    
    @IsOptional()
    @IsNotEmpty()
    quantity?:number

    @IsOptional()
    @IsNotEmpty()
    productId?:string
}

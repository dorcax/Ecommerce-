import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateCartDto {
    @IsString()
    @IsNotEmpty()
    userId:string
    
    @IsInt()
    @IsNotEmpty()
    quantity:number

    @IsString()
    @IsNotEmpty()
    productId:string
}

import { IsString, IsUUID } from "class-validator"

export class Product {
    @IsString()
    name:string
    @IsString()
    description:string
    @IsString()
    price:number
    @IsUUID()
    userId:string
    @IsUUID()
    categoryId:string
}





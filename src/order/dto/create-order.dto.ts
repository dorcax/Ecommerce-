import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    userId:string
    
    @IsInt()
    @IsNotEmpty()
    quantity:number
    
    @IsNumber()
    @IsNotEmpty()
    totalPrice:number

    @IsString()
    @IsNotEmpty()
    productId:string
}


export class OrderStatusDto{
    status:OrderStatus
}




export enum OrderStatus{
PENDING="pending",
PROCESSING="processing",
SHIPPING="shippng",
DELIVERED ="delivered",
CANCELLED="cancelled"
}
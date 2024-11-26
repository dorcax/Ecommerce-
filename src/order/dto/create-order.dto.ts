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
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
}
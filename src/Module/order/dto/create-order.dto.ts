import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateOrderDto {
    
    @IsNumber()
    @IsNotEmpty()
    quantity:number
    
    // @IsNumber()
    // @IsNotEmpty()
    // totalPrice:number

    @IsString()
    @IsNotEmpty()
    productId:string
}


export class OrderStatusDto{
    status:OrderStatus
   
}




export enum OrderStatus{
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
}
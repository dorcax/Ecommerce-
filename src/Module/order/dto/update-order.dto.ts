import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsNumber()
    @IsNotEmpty()
    quantity:number
}

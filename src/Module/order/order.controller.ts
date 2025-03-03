import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderStatusDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  
  
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
    
  // update order status
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(":userId/:orderId")
  updateOrderStatus(@Body() orderStatusDto: OrderStatusDto,
          @Param("userId") userId:string,
        @Param("orderId") orderId:string) {
    return this.orderService.orderStatus(orderStatusDto,userId,orderId);
  }
}

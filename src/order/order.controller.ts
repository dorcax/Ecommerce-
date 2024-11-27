import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderStatusDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/role.entity';

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
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(":userId")
  updateOrderStatus(@Body() orderStatusDto: OrderStatusDto,
          @Param("userId") userId:string) {
    return this.orderService.orderStatus(orderStatusDto,userId);
  }
}

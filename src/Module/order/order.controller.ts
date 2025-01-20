import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderStatusDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.entity';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create( @Req() req) {
    return this.orderService.createOrder(req);
  }
  // get user order
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':orderId')
  getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrder(orderId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":userId")
  getUserOrder(@Param('userId') userId: string,@Req() req) {
    return this.orderService.getUserOrders(userId,req);
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAllOrders() {
    return this.orderService.allOrders();
  }

  // update order status
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId/:orderId')
  updateOrderStatus(
    @Body() orderStatusDto: OrderStatusDto,
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.orderStatus(orderStatusDto, userId, orderId);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':productId/:orderId')
  updateOrder(
  @Param('productId') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.updateOrder(productId, orderId);
  }
}

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CreateOrderDto, OrderStatusDto ,OrderStatus} from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder( req) {
    try {
      // check if user exist and the cart
      const user = await this.prisma.user.findUnique({
        where: {
          id: req.user.sub,
        },
        include: {
          cart:{
            include:{
              cartProduct:{
                include:{
                  product:true
                }
              }
            }
          }
        },
      });
      // if not user
      if (!user || !user.cart.cartProduct.length
      ) {
        throw new NotFoundException('user not found or cart is empty');
      }
      // calculate totalprice
      const totalPrice = user.cart.cartProduct.reduce((sum,cartItems)=>{
        const item =cartItems.product.price *cartItems.quantity
        return item + sum
      },0);

      const newOrder = await this.prisma.order.create({
        data: {
          totalPrice,
          userId: req.user.sub,
          orderProducts: {
            create:user.cart.cartProduct.map((cartItem)=>({
              quantity:cartItem.quantity,
              product:{
                connect:{
                  id:cartItem.product.id
                }
              }
            }
            
            ))
        
          },
        },

        include: {
          orderProducts: {
            include: {
              product: true, // Include product details in the order
            },
          },
        },
      });
      return newOrder;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to process the order',
      );
    }
  }

  // get single order
  async getOrder(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          orderProducts: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!order) {
        throw new NotFoundException('order not found');
      }
      return order;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch the order',
      );
    }
  }

  // get all order for use

  async getUserOrders(userId,req) {
    try {
      const order = await this.prisma.order.findMany({
        where: {
          userId
        },
        include: {
          orderProducts: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!order) {
        throw new NotFoundException('no order found for this particular user');
      }
      return order;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'error fetching user order',
      );
    }
  }

  // get all order
  async allOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          orderProducts: {
            include: {
              product: true,
            },
          },
        },
      });
      if (orders.length === 0) {
        throw new NotFoundException('no order found ');
      }
      return orders;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'error fetching  orders',
      );
    }
  }
  // order status  by admin
  async orderStatus(dto: OrderStatusDto, userId: string, orderId) {
    try {
      const order = await this.prisma.order.findFirst({
        where: {
          AND: [{ id: orderId }, { userId: userId }],
        },
      });
      if (!order) {
        throw new NotFoundException('Order not found for the given user ID');
      }
      // update the order status
      const updateOrder = await this.prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: dto.status,
        },
      });
      return updateOrder;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to update the order status',
      );
    }
  }
  // update quantity
  
}

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderStatusDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma:PrismaService){}
  async createOrder({userId,quantity,productId,totalPrice}: CreateOrderDto) {
    try {
      // find the price of the product 
      const product=await this.prisma.product.findUnique({
        where:{
         id: userId
        },
        select:{
          price:true
        }
      })
      if (!product) {
        throw new NotFoundException('Product not found for the given product ID');
      }
      const total =product.price*quantity
       // create new order 
        const newOrder =await this.prisma.order.create({
          data:{
            totalPrice:total,
            user:{
              connect:{
                id:userId
              }
            },
            orderProducts:{
             create:{
              productId,
              quantity
             }
            }
          }
        })
        return newOrder
    }

   catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to process the order',
      );
    }
  
  }



  // order status  
  async orderStatus(dto:OrderStatusDto ,userId:string,orderId){
    try {
      const order =await this.prisma.order.findFirst({
        where:{
         AND:[
          {id:orderId},{userId:userId}
         ]
        }
      })
      if(!order){
        throw new NotFoundException("Order not found for the given user ID")
      }
      // update the order status
      const updateOrder =await this.prisma.order.update({
        where:{
          id:order.id
        },
        data:{
          status:dto.status
        }
      })
      return updateOrder
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to update the order status',
      );
    }
  }
  // fetch order with userId

  async fetchOrders(userId:string){
    try {
      
      const orders =await this.prisma.order.findMany({
        where:{
          userId:userId
        }
        ,
        include:{
          orderProducts:true
        }
      })
      if (!orders || orders.length === 0) {
        throw new NotFoundException("No orders found for the given user ID");
      }
      return orders
    } catch (error) {
      throw new InternalServerErrorException(error.message ||"failed to fetch orders"
       )
    }

  }
  // fetch single order

  async fetchOrder(userId:string,orderId:string){
    try {
      
      const order =await this.prisma.order.findFirst({
        where:{
        AND:[{  id:orderId},{ userId:userId}]
        },
        include:{
          orderProducts:true
        }
      }) 
      if(!order ){
        throw new NotFoundException("Order not found for the given ID and user");
      }
      return order
    } catch (error) {
      throw new InternalServerErrorException(error.message ||"failed to fetch order "
      )
    }
  }
}

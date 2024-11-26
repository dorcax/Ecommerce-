import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderStatusDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma:PrismaService){}
  async createOrder({userId,quantity,productId,totalPrice}: CreateOrderDto) {
    try {
      // find the an order exist 
      const order= await this.prisma.order.findFirst({
        where:{
          userId
        },include:{
          orderProducts:true
        }

      })
      if(!order){
        // create new order 
        const newOrder =await this.prisma.order.create({
          data:{
            totalPrice,
            user:{
              connect:{
                id:userId
              }
            }
          }
        })
        return newOrder
      }


      // checkk if orderProduct exist in order
      const existingOrderProduct = order.orderProducts.find((orderItem)=>orderItem.productId===productId)
      if(existingOrderProduct){
        // update the quantity of the existing  order 
        const updateOrderQuantity =await this.prisma.orderProduct.update({
          where:{
            id:existingOrderProduct.id
          },
          data:{
            quantity:existingOrderProduct.quantity+quantity
          }
        })
        return updateOrderQuantity
      }
      else{
        const newOrderProduct=await this.prisma.orderProduct.create({
          data:{
            quantity,
            order:{
              connect:{
                id:order.id
              }
            },
            product:{
              connect:{
                id:productId
              }
            }
          }
        })
        return {
          message: 'Product added to order successfully',
          newOrderProduct,
        };
      }
      
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to process the order',
      );
    }
  
  }

  // order status  
  async orderStatus(dto:OrderStatusDto ,userId:string){
    try {
      const order =await this.prisma.order.findFirst({
        where:{
        userId
        }
      })
      if(!order){
        throw new NotFoundException("order id not found")
      }
      // update the order status
      const updateOrder =await this.prisma.order.update({
        where:{
          id:order.id
        },
        data:{
          // status:dto.status
        }
      })
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to update the order status',
      );
    }
  }
}

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma.service';
import { connect } from 'http2';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
 async createCart({userId,quantity,productId}:CreateCartDto){
  try {
    // find if the cart exist 

    const cart =await this.prisma.cart.findUnique({
      where:{
        userId:userId
      },include:{
        cartProduct:true
      }
    })
    // if the cart does not exist 
    if(!cart){
      // create new Cart
      const newCart =await this.prisma.cart.create({
        data:{
          user:{
            connect:{
              id:userId
            }
          }
        }
      })
    }

    // check if the product exist in the cart
    const existingCartProduct = cart.cartProduct.find((cartItem)=>cartItem.productId===productId)
    // if there is existing product then we update the quantity
    if(existingCartProduct){
     const cartProductUpdate =await this.prisma.cartProduct.update({
      where:{
        id:existingCartProduct.id
      },data:{
        quantity:existingCartProduct.quantity+quantity
      }
     })
    }else{
      return this.prisma.cartProduct.create({
        data:{
          quantity,
          cart:{
           connect:{
             id:cart.id
           }
     
          },
          product:{
           connect:{
             id:productId
           }
          }
        }
      })
    }

  } catch (error) {
    throw new InternalServerErrorException(error)
  }

  }


  //remove cart 
 async removeCart (productId:string,userId:string){
    try {
      // find if the cart exist 
      const cart =await this.prisma.cart.findUnique({
        where:{
          userId
        }
      })
      if(!cart){
        throw new NotFoundException("cart not found")
      }

      // check if product exist 
      const cartProduct =await this.prisma.cartProduct.findFirst({
        where:{
          productId,
          cartId:cart.id
        }
      })
      if(!cartProduct){
        throw new NotFoundException("product not found")
      }
      const removeCart=await this.prisma.cartProduct.delete({
        where:{
          id:cartProduct.id
        }
      })
      return removeCart
    } catch (error) {
      throw new InternalServerErrorException(error)
    }

  } 
}
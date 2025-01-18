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
      // create new cart
      const newCart =await this.prisma.cart.create({
        data:{
          user:{
            connect:{
              id:userId
            }
          },
          cartProduct:{
            create:{
              productId,
              quantity
            }
          }
        }
      })
     return newCart
    }
    console.log("cart",cart)   
  } catch (error) {
    throw new InternalServerErrorException(error.message|| 'Error creating a new cart')
  }

  }

  // get cart with userId 

  async findCart(cartId:string){
    try {
      const cart =await this.prisma.cart.findUnique({
        where:{
          id:cartId
        },
        include:{
          cartProduct:true
        }
      })
      return cart
    } catch (error) {
      throw new NotFoundException(error.message||"cart not found ") 
    }
  }


  // update the cart
  async updateCart()=>{
    

    
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
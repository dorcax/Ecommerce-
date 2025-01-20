import { Injectable, InternalServerErrorException, NotFoundException,B } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma.service';
import { connect } from 'http2';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
 async createCart({userId,quantity,productId}:CreateCartDto){
 try {
  const cart =await this.prisma.cart.create({
    data:{
      userId,
      cartProduct:{
        create:{
          quantity,
          productId
        }
      }
    }
  })
  return cart
    } catch (error) {
      throw new NotFoundException(error.message||"cart not found ") 
    }
  }


  // get cart
async getCart(req){
try {
  const carts = await this.prisma.cart.findUnique({
    where:{
      userId:req.user.sub
    },
    include:{
      cartProduct:true
    }
  })
  if(!carts){
    throw new NotFoundException("cart not found")
  }
  return carts
} 
catch (error) {
  throw new InternalServerErrorException(error)
}
 
}


  // update the cart
  async updateCart({productId,quantity}:UpdateCartDto,req){
    try {
      // check if the cart exist 
      const cart =await this.prisma.cart.findUnique({
        where:{
          userId:req.user.sub
        },
        include:{
          cartProduct:true,
          
        }
      })
      // if cart ===null
      if(!cart){
        throw new NotFoundException(`Cart for user ${cart.userId} not found`)
      }

      // check if the product is already in the cart
      const existingCart =cart.cartProduct.find((item)=>item.productId ===productId)
      if(existingCart){
        // update the cart
        await this.prisma.cartProduct.update({
          where:{
            id:existingCart.id
          },
          data:{
            quantity:existingCart.quantity+quantity

          }
        })
      }
      else{
        await this.prisma.cartProduct.create({
          data:{
            cartId: cart.id,
              quantity,
              productId
              }
            
        })
      
      }
    //  find the updated product
      const updateProduct =await this.prisma.cart.findUnique({
        where:{
          id:cart.id
        },
        include:{
          cartProduct:true
        }
      })
      return updateProduct
    }
     catch (error) {
      throw new InternalServerErrorException(error ||"error in updating the cart")
    }
    


  }

  //remove cart 
 async removeCart (productId:string,req){
    try {
      // find if the cart exist 
      const cart =await this.prisma.cart.findUnique({
        where:{
          userId:req.user.sub
        },
        include:{
          cartProduct:true
        }
      })
      if(!cart){
        throw new NotFoundException("cart not found")
      }

      // check if product exist 
      const cartProduct =cart.cartProduct.find((items)=>items.productId ===productId)
      if(!cartProduct){
        throw new NotFoundException("product not found")
      }
      const removeCartProduct=await this.prisma.cartProduct.delete({
        where:{
          id:cartProduct.id
        }
      })

      // check for the remaiinig  cart
      const remainingItems =await this.prisma.cartProduct.findMany({
       where:{
        cartId:cart.id
       }
      })
      if(remainingItems.length ===0){
        await this.prisma.cart.delete({
          where:{
            id:cart.id
          }
        })
        return { message: "Product removed and empty cart deleted successfully" };
      }
      return { message: "Product removed from cart successfully" };

    } catch (error) {
      throw new InternalServerErrorException(error)
    }

  } 

}
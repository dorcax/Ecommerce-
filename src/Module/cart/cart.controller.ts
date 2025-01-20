import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards,Req} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}


   @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  // get cart
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req);
  }


  // update cart 
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get()
  updateCart(@Body() updateCartDto:UpdateCartDto,@Req() req){
    return this.cartService.updateCart(updateCartDto,req)
  }

  // REMOVE CART
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(":productId")
  removeCart( @Param("productId") productId:string,@Req() req){
return this.cartService.removeCart(productId,req)
  }

}

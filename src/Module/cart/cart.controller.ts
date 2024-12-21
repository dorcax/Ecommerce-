import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards} from '@nestjs/common';
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


   @Roles(Role.USER)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }


  // REMOVE CART
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(":userId/:productId")
  removeCart(@Param("userId") userId:string,
               @Param("productId") productId:string){

  }

}

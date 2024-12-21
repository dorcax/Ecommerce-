import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { RolesGuard } from './guards/role-guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './entities/role.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.SignIn(createAuthDto);
  }

  // login user in
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }



  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user)
    return req.user;
  }
  
}

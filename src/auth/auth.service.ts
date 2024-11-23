import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from "bcrypt"
import { UserService } from 'src/user/user.service';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './local-auth.guard';

@Injectable()
export class AuthService {
  constructor(private prisma:PrismaService,
    private userService:UserService,
    private jwt:JwtService

  ){}
  async SignIn(createAuthDto: CreateAuthDto) {
    const{name,email,password} =createAuthDto
    const userExist =await this.prisma.user.findUnique({
      where:{
        email:email
      }
    })
    // if user is found 
    if(userExist){
      throw new ConflictException("user already exist")
    }

    const user =await this.prisma.user.create({
      data:{
        name,
        email,
        password:await bcrypt.hash(password,10)
      }
    })
    return user
  }

  // validate user 
  async validateUser(email:string,password:string){

    try {
      const user = await this.userService.findUser(email)
      if (!user) {
        throw new NotFoundException('Invalid credentials'); 
      }
      // compare the password
      const isMatch =await bcrypt.compare(password,user.password)
      if(!isMatch){
        throw new BadRequestException("invalid details")
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }


  }

  // login user 
 
  async login(user:any){
    const payload ={sub:user.id, email:user.email}
    return{
      access_token: this.jwt.sign(payload)
    }
  }


  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

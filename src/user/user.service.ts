import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

 async findUser(email:string) {
    try {
      const user  =await this.prisma.user.findUnique({
        where:{
          email:email
        }
      }) 
      if(!user){
        throw new NotFoundException("user not found")
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

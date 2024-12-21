import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/Module/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt-strategy';
import { UserModule } from 'src/Module/user/user.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_sECRET,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
})
export class AuthModule {}

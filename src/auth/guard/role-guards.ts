import { Injectable,CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../entities/role.entity";





@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // get where the role is 

        const isRequiredRole =this.reflector.getAllAndOverride<Role[]>('role',[
            context.getHandler(),
            context.getClass()
        ])

        if(!isRequiredRole){
            return true
        }
        // get user that is making that request 
        const {user} =context.switchToHttp().getRequest()
        if(!user){
            throw new UnauthorizedException()
        }

        // get some role from the user that is making that request 

        return isRequiredRole.some((role)=>user.role.includes(role))
    }
}
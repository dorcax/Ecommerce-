import { CanActivate, ExecutionContext, Injectable ,UnauthorizedException} from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Role } from "../entities/role.entity";


@Injectable()

export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // whatis the required role
   const requiredRole = this.reflector.getAllAndOverride<Role[]>("role",[
    context.getHandler(),
    // context.getClass()
   ])
    if(!requiredRole){
        return true
    }
        // get user from user context
        const {user} =context.switchToHttp().getRequest()
        console.log("user",user)
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
          }
          // is at least one of the require roles a role that the user is making
          return requiredRole.some((role)=>user.role.includes(role))
    }

}

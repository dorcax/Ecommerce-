// import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import { Observable } from "rxjs";




// @Injectable()

// export class JwtAuthGuard extends AuthGuard("jwt"){
//  async   canActivate(context: ExecutionContext):  Promise<boolean>{
//         const isAuthorized =(await super.canActivate(context)) as boolean

//         if(!isAuthorized){
//             throw new UnauthorizedException("invalid credentials")
//         }
//        return true
        
//     }
//     handleRequest(err:any, user:any, info:any) {
//         // You can throw an exception based on either "info" or "err" arguments
//         if (err || !user) {
//           throw err || new UnauthorizedException();
//         }
//         return user;
//       }
// }
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized access');
    }
    return user;
  }
}

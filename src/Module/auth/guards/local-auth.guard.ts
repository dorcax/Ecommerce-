import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";


@Injectable()
export  class LocalAuthGuard extends AuthGuard("local"){
    async canActivate(context: ExecutionContext):Promise<boolean> {
        // const  result =(await super.canActivate(context)) as boolean
        // const request =context.switchToHttp().getRequest()
        // await super.logIn(request)
        const result = await super.canActivate(context);
        return true
    } 
}
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import{ExtractJwt} from "passport-jwt"



@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:process.env.JWT_SECRET,
            ignoreExpiration:false
        })
    }
    async validate(payload:any){
        return{
            sub:payload.id,
            email:payload.email
        }
    }

}
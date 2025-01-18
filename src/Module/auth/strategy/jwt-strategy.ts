import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-local";
import{ExtractJwt,Strategy} from "passport-jwt"
import { Role } from "../entities/role.entity";



@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:process.env.JWT_SECRET,
            ignoreExpiration:false
        })
    }
    async validate(payload:{sub:string,email:string,role:Role}){
        
            return { sub: payload.sub, email: payload.email, role: payload.role };
        
        
    }

}
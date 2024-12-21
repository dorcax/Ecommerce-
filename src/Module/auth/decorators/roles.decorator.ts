import { SetMetadata } from "@nestjs/common"
import { Role } from "../entities/role.entity"


export const Roles =(...roles:Role[])=>SetMetadata("role",roles)
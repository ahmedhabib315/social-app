import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { CONSTANTS } from "constants/constants";
import { Strategy, ExtractJwt } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONSTANTS.jwtOptions.secret
    })
  }

  validate(payload: any): any {
    return payload;
  }
}
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'constants/constants';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  /**
   * 
   * Generate a Hash with Password to save in DB
   * 
   * @param password 
   * @returns 
   */
  async generateHashPassword(password: string) {
    const salt = await bcrypt.genSalt(saltOrRounds);
    return await bcrypt.hash(password, salt);
  }

  /**
   * 
   * Check if the given password is correct
   * 
   * @param password 
   * @param hash 
   * @returns 
   */
  async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * 
   * Method to generate JWT token 
   * 
   * @param data 
   * @returns 
   */
  async generateToken(data: any) {
    return await this.jwtService.sign(data);
  }
}
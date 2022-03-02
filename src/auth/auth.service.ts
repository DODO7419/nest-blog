import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly userService: UsersService;
  private readonly jwtService: JwtService;
  constructor(userService: UsersService, jwtService: JwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  /**
   * validate user name and password
   * @param username
   * @param password
   */
  async validate(username: string, password: string): Promise<any> {
    // console.log(username, password);
    const user = await this.userService.find(username);
    // console.log(user.phone, password);
    // 注：实际中的密码处理应通过加密措施
    if (user && user.password === password) {
      const { password, ...userInfo } = user;
      return userInfo;
    } else {
      return null;
    }
  }

  /**
   * user login
   * @param user
   */
  async login(user: any, res: Response) {
    const { id, phone } = user;
    // console.log(user, 'user', id, phone);
    const toekn = this.jwtService.sign({ phone: phone, id: id });
    res.cookie('Set-Cookie', toekn);
    return res.send({
      token: toekn,
      // user:user._,
      ...user,
      status: 'ok',
      type: 'account',
      currentAuthority: 'admin',
    });
  }
}

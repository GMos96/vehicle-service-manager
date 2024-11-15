import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constants';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

}

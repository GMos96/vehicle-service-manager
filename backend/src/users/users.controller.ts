import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/constants';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  @Public()
  async registerUser(@Body() user: User) {
    return this.userService.createUser(user);
  }
}

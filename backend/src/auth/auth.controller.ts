import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { Public } from './constants';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @Post('login')
    @Public()
    async login(@Body() user: Partial<User>) {
      return this.authService.login(user);
    }
}

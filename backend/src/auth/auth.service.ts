import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcyrpt from 'bcrypt';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(private usersService: UsersService, private jwtService: JwtService) {}
  
    async validateUser(username: string, password: string): Promise<Partial<User>> {
        const user: User | null = await this.usersService.findByEmail(username);

        if (user === null) {
            throw new BadRequestException('User does not exist');
        }

        const match = await bcyrpt.compare(password, user.password);
        if (match) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException();
    }

    async login(user: Partial<User>): Promise<{ accessToken: string }> {
        await this.validateUser(user?.emailAddress, user?.password);
        const payload = { username: user?.emailAddress, sub: user.id };
        return {
          accessToken: this.jwtService.sign(payload),
        };
      }
  }

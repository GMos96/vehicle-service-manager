import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcyrpt from 'bcrypt';

@Injectable()
export class UsersService {

    private readonly HASH_ROUNDS = 16;
    private readonly logger = new Logger(UsersService.name);

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async findByEmail(emailAddress: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ emailAddress }).catch(error => {
            this.logger.error(error);
            return null;
        });
    }

    async createUser(user: User) {
        if (await this.findByEmail(user?.emailAddress) !== null) {
            throw new BadRequestException("Duplicate User");
        }

        const hashedPassword = await bcyrpt.hash(user.password, this.HASH_ROUNDS);
        return await this.usersRepository.save({ ...user, password: hashedPassword });
    }

}

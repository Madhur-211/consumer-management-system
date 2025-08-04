import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectPinoLogger(UsersService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    this.logger.info('Creating user: %o', userDto);
    return this.userModel.create(userDto as any);
  }

  async findAll(): Promise<User[]> {
    this.logger.info('Fetching all users');
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    this.logger.info(`Fetching user with id: ${id}`);
    return this.userModel.findByPk(id);
  }

  async update(
    id: string,
    updateData: Partial<CreateUserDto>,
  ): Promise<[number, User[]]> {
    this.logger.info(`Updating user ${id} with data: %o`, updateData);
    return this.userModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    this.logger.warn(`Deleting user with id: ${id}`);
    return this.userModel.destroy({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Looking up user by email: ${email}`);
    return this.userModel.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'schema_name'],
    });
  }
}

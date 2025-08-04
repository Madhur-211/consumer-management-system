import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './../models/user.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PinoLogger } from 'nestjs-pino';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.usersService.create(createUserDto);
      this.logger.info({ event: 'user_created', user });
      return user;
    } catch (error) {
      this.logger.error({ event: 'user_create_failed', error });
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersService.findAll();
      this.logger.info({ event: 'users_fetched', count: users.length });
      return users;
    } catch (error) {
      this.logger.error({ event: 'users_fetch_failed', error });
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    try {
      const user = await this.usersService.findOne(id);
      this.logger.info({ event: 'user_fetched', user });
      return user;
    } catch (error) {
      this.logger.error({ event: 'user_fetch_failed', id, error });
      throw new HttpException('Failed to fetch user', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    try {
      const updated = await this.usersService.update(id, updateUserDto);
      this.logger.info({ event: 'user_updated', user: updated });
      return updated;
    } catch (error) {
      this.logger.error({ event: 'user_update_failed', id, error });
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<number> {
    try {
      const deleted = await this.usersService.remove(id);
      this.logger.info({ event: 'user_deleted', id });
      return deleted;
    } catch (error) {
      this.logger.error({ event: 'user_delete_failed', id, error });
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

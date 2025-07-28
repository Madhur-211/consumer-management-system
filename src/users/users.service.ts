import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    return this.userModel.create(userDto as any);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async update(
    id: string,
    updateData: Partial<CreateUserDto>,
  ): Promise<[number, User[]]> {
    return this.userModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    return this.userModel.destroy({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'schema_name'],
    });
  }
}

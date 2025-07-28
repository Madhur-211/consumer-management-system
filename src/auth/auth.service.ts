import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { CreateShadowUserDto} from './dto/create-shadow-user.dto';
import { User } from '../models/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const plainUser = user.get({ plain: true });
      const { password, ...userWithoutPassword } = plainUser;
      return userWithoutPassword;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, schema: user.schema_name, };
    console.log('JWT payload before signing:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto): Promise<User> {
  const { name, email, password, schema_name } = signupDto;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await this.usersService.create({
    name,
    email,
    password: hashedPassword,
    schema_name,
  });

  const shadowUserData: CreateShadowUserDto = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: hashedPassword,
    schema_name: user.schema_name,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };

  const ShadowUserModel = User.schema(schema_name);

  const shadowUser = ShadowUserModel.build(shadowUserData as any);
  await shadowUser.save();

  return user;
}

}

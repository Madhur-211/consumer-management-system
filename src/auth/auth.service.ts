import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { CreateShadowUserDto} from './dto/create-shadow-user.dto';
import { User } from '../models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const plainUser = user.get({ plain: true });
        const { password, ...userWithoutPassword } = plainUser;
        this.logger.info(`User validated: ${email}`);
        return userWithoutPassword;
      }
      this.logger.warn(`Invalid login attempt for: ${email}`);
      return null;
    } catch (error) {
      this.logger.error(`Error during validateUser: ${error.message}`);
      throw error;
    }
  }

  async login(user: User) {
    try {
      const payload = {
        sub: user.id,
        email: user.email,
        schema: user.schema_name,
      };
      this.logger.info(`User login: ${user.email}`);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  async signup(signupDto: SignupDto): Promise<User> {
  try {
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

      this.logger.info(`User signed up: ${email}`);
      return user;
    } catch (error) {
      this.logger.error(`Signup failed: ${error.message}`);
      throw error;
    }
  }

}

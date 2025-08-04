import { Controller, Post, Body, UseGuards, Request,InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PinoLogger } from 'nestjs-pino';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try{
      this.logger.info({email:loginDto.email},'User login attempted');
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const result=await this.authService.login(user);
      this.logger.info({ email: loginDto.email }, 'User login successful');
      return result;
    }catch (error) {
      this.logger.error(
        {
          message: 'Login failed',
          email: loginDto.email,
          error: error.message,
          stack: error.stack,
        },
        'Error in login',
      );
      throw new InternalServerErrorException('Login failed');
    }
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    try{
      this.logger.info({ email: dto.email }, 'User signup initiated');
      const result=await this.authService.signup(dto);
      this.logger.info({ email: dto.email }, 'User signup successful');
      return result;
    }catch (error) {
      this.logger.error(
        {
          message: 'Signup failed',
          email: dto.email,
          error: error.message,
          stack: error.stack,
        },
        'Error in signup',
      );
      throw new InternalServerErrorException('Signup failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  // @Span('AuthController.getProfile')
  async getProfile(@Request() req: any) {
    try {
      this.logger.info({ userId: req.user?.id }, 'Fetching current user profile');
      return req.user;
    } catch (error) {
      this.logger.error(
        {
          message: 'Fetching profile failed',
          userId: req.user?.id,
          error: error.message,
          stack: error.stack,
        },
        'Error in getProfile',
      );
      throw new InternalServerErrorException('Failed to fetch profile');
    }
  }
}

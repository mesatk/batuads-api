import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Geçersiz email veya şifre');
    }

    const access_token = await this.jwtService.signAsync({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      access_token,
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new UnauthorizedException('Bu email adresi zaten kullanımda');
      }

      const user = this.userRepository.create({
        ...registerDto,
        role: 'user',
      });

      const savedUser = await this.userRepository.save(user);
      console.log('Kaydedilen kullanıcı:', savedUser);

      const access_token = await this.jwtService.signAsync({
        userId: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      });

      return {
        user: savedUser,
        access_token,
      };
    } catch (error) {
      console.error('Kayıt hatası:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Kayıt işlemi sırasında bir hata oluştu',
      );
    }
  }
}

import { Document, Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userModel.findOne({
      $or: [
        {
          username: registerDto.username,
        },
        {
          email: registerDto.email,
        },
      ],
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hash(registerDto.password, 10);

    const createdUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    await createdUser.save();

    return {
      message: 'User has been created successfully',
    };
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.email && !loginDto.username) {
      throw new HttpException(
        'Email or username is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    let user: Document<User> & User;

    if (loginDto.email) {
      user = await this.userModel.findOne({ email: loginDto.email });
    }

    if (loginDto.username) {
      user = await this.userModel.findOne({
        username: loginDto.username,
      });
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await compare(loginDto.password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return {
      message: 'User has been logged in successfully',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

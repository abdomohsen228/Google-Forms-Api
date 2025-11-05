import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { LoginRequestDto } from './dtos/loginRequest.dto';
import { LoginResponseDto } from './dtos/loginResponse.dto';
import errorMessages from 'src/config/errorMessages.json';
import { RegisterRequestDto } from './dtos/registerRequest.dto';
import { RegisterResponseDto } from './dtos/registerResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const userObject = await this.userModel.findOne({ email });

    if (!userObject) {
      throw new BadRequestException(
        errorMessages.user_errors.invalid_email_or_password,
      );
    }

    const isMatch = await bcrypt.compare(password, userObject.passwordHash);
    if (!isMatch) {
      throw new BadRequestException(
        errorMessages.user_errors.invalid_email_or_password,
      );
    }
    const userId: string = userObject._id.toString();

    const token = this.generateJwt({
      id: userId,
      username: userObject.username || userObject.email,
    });

    return {
      message: 'Login successful',
      token,
      user: {
        email: userObject.email,
      },
    };
  }

  public async register(
    registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const { email, password } = registerDto;

    await this.validateUser(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      email,
      passwordHash: hashedPassword,
    });

    return {
      message: 'Registration successful',
      user: {
        email: newUser.email,
      },
    };
  }

  private async validateUser(email: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(errorMessages.user_errors.user_exist);
    }
  }

  private generateJwt(payload: { id: string; username: string }): string {
    const secret = process.env.JWT_SECRET || 'default_secret_key';
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }
}

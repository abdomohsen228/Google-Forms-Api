import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/loginRequest.dto';
import { RegisterRequestDto } from './dtos/registerRequest.dto';
// import { RegisterRequestDto } from './dtos/registerRequest.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}
  @Post('/register')
  public register(@Body() body: RegisterRequestDto) {
    return this.authServices.register(body);
  }
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() body: LoginRequestDto) {
    return this.authServices.login(body);
  }
}

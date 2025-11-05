import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/loginRequest.dto';
import { RegisterRequestDto } from './dtos/registerRequest.dto';
import { LoginResponseDto } from './dtos/loginResponse.dto';
// import { RegisterRequestDto } from './dtos/registerRequest.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}
  @Post('/register')
  public register(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authServices.register(registerRequestDto);
  }
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authServices.login(loginRequestDto);
  }
}

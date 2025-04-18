export class LoginResponseDto {
  message: string;
  token: string;
  user: {
    email: string;
  };
}

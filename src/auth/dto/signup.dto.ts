import { IsNotEmpty, IsEmail, MinLength} from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  schema_name: string
}

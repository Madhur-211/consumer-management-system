import { IsString, IsEmail } from 'class-validator';

export class CreateConsumerDto {
  @IsString()
  first_name: string;
  
  @IsString()
  last_name: string;

  @IsEmail()
  email: string
  
  @IsString()
  phone: string;

  @IsString()
  address: string
  
  @IsString()
  created_by?: string;

  @IsString()
  updated_by?: string;
}

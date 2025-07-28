import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCustomFieldDto {
  @IsString()
  @IsNotEmpty()
  field_name: string;

  @IsString()
  @IsNotEmpty()
  field_type: string;

  @IsBoolean()
  @IsOptional()
  is_required?: boolean;
}

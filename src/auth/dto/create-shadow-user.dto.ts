export class CreateShadowUserDto {
  id: number;
  name: string;
  email: string;
  schema_name: string;
  password?: string;
  created_at;
  updated_at;
}

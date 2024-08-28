import { IsNumber, IsString } from 'class-validator';

export class AddGymDto {
  @IsString()
  name: string;
  @IsString()
  gymAddress: string;
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
}

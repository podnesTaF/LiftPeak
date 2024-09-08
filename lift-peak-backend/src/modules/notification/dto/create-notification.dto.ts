import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsEnum(NotificationType, { message: 'Invalid notification type' })
  @IsNotEmpty()
  type: NotificationType;

  @IsNumber()
  @IsNotEmpty({ message: 'Sender ID is required' })
  senderId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Recipient ID is required' })
  recipientId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Post ID must be a number' })
  postId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Workout ID must be a number' })
  workoutId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Comment ID must be a number' })
  commentId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Group ID must be a number' })
  groupId?: number;

  @IsOptional()
  @IsString()
  message?: string;
}

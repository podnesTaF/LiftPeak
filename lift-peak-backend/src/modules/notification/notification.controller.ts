import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../users/decorators/user.decorator';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@GetUser() user: AuthenticatedUser) {
    return this.notificationService.getUserNotifications(user.id);
  }

  @Get('unseen')
  @UseGuards(JwtAuthGuard)
  async getUnreadNotifications(@GetUser() user: AuthenticatedUser) {
    return this.notificationService.getUnseenNotificationsCount(user.id);
  }

  @Patch('seen')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@GetUser() user: AuthenticatedUser) {
    return this.notificationService.markAllAsRead(user.id);
  }
}

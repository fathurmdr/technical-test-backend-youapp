import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/getProfile')
  async getProfile(@Req() req: Request & { user: { id: string } }) {
    return await this.profileService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateProfile')
  async updateProfile(
    @Req() req: Request & { user: { id: string } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
  }
}

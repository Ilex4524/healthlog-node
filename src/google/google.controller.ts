import { Controller, Inject, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Request } from 'express';

@Controller('google')
export class GoogleController {
  @Inject()
  private googleService: GoogleService;

  @Get('link')
  getAuthLink() {
    return this.googleService.getAuthLink();
  }

  @Get('callback')
  callback(@Query('code') code: string): Promise<string> {
    return this.googleService.callback(code);
  }
}

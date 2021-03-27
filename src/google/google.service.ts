import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  static SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  authClient = null;

  constructor(private configService: ConfigService) {
    this.authClient = new google.auth.OAuth2({
      clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    });
  }

  get scope(): string {
    return GoogleService.SCOPES.join(' ');
  }

  getAuthLink(): string {
    return this.authClient.generateAuthUrl({
      access_type: 'offline',
      scope: this.scope,
    });
  }

  async callback(code: string) {
    try {
      const accessData = await this.authClient.getToken(code);
      this.authClient.setCredentials(accessData);
      return accessData.access_token;
    } catch (error) {
      throw new Error(`Invalid code received: ${error.message}`);
    }
  }
}

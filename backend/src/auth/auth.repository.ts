import { Injectable } from '@nestjs/common';
import { mockUser } from 'src/mock/mock';
import { encrypt } from './utils';

@Injectable()
export class AuthRepository {
  getUser(
    username: string,
  ): { username: string; encryptedPassword: string } | null {
    if (username !== mockUser.username) return null;
    const encryptedPassword = encrypt(mockUser.password);

    return {
      username: mockUser.username,
      encryptedPassword,
    };
  }
}

import { bcryptCompare, bcryptHash, generateJwt } from 'src/utils/utils';
import { Bank } from './bank.abstract';

export class SantanderBank extends Bank {
  constructor() {
    super();
  }
  login(
    username: string,
    password: string,
    user: { username: string; encryptedPassword: string },
  ): { token: string } {
    if (!bcryptCompare(password, user.encryptedPassword)) {
      throw new Error('Invalid credentials');
    }

    const token = generateJwt(username);
    return { token };
  }

  encryptPassword(password: string): string {
    return bcryptHash(password);
  }
}

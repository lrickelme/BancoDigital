import { decrypt, encrypt, generateJwt } from 'src/utils/utils';
import { Bank } from './bank.abstract';

export class CaixaBank extends Bank {
  constructor() {
    super();
  }

  login(
    username: string,
    password: string,
    user: { username: string; encryptedPassword: string },
  ): { token: string } {
    const decoded = decrypt(user.encryptedPassword);

    if (decoded !== password) {
      throw new Error('Invalid credentials');
    }

    const token = generateJwt(username);
    return { token };
  }

  encryptPassword(password: string): string {
    return encrypt(password);
  }
}

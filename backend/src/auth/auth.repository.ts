import { Injectable, UnauthorizedException } from '@nestjs/common';
import { mockUser } from 'src/mock/mock';
import { CaixaBank } from 'src/bank/caixa';
import { SantanderBank } from 'src/bank/santander';
import { Bank } from 'src/bank/bank.abstract';

@Injectable()
export class AuthRepository {
  getUser(
    username: string,
    bank: string,
  ): { username: string; encryptedPassword: string } | null {
    if (username !== mockUser.username) return null;
    const bankIsntance: Bank = this.getBankInstance(bank);
    const encryptedPassword = bankIsntance.encryptPassword(mockUser.password);
    return {
      username: mockUser.username,
      encryptedPassword,
    };
  }

  private getBankInstance(bank: string) {
    switch (bank) {
      case 'caixa':
        return new CaixaBank();
      case 'santander':
        return new SantanderBank();
      default:
        throw new UnauthorizedException('Banco não suportado');
    }
  }
}

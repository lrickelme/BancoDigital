import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { Bank } from 'src/bank/bank.abstract';
import { CaixaBank } from 'src/bank/caixa';
import { SantanderBank } from 'src/bank/santander';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  login(username: string, password: string, bank: string): { token: string } {
    const user = this.authRepository.getUser(username, bank);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const bankIstance: Bank = this.getBankInstance(bank);

    return bankIstance.login(username, password, user);
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

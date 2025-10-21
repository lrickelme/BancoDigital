import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { decrypt, generateJwt } from './utils';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  login(username: string, password: string): { token: string } {
    const user = this.authRepository.getUser(username);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const decryptedPassword = decrypt(user.encryptedPassword);

    if (password !== decryptedPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const token = generateJwt(user.username);

    return { token };
  }
}

export abstract class Bank {
  constructor() {}

  abstract login(
    username: string,
    password: string,
    user: { username: string; encryptedPassword: string },
  ): { token: string };

  abstract encryptPassword(password: string): string;
}

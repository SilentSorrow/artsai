import * as crypto from 'crypto';

export default class Crypro {
  private static hashAlgoritm = process.env.HASH_ALGORITM;
  private static iterations = Number(process.env.HASH_ITERATIONS);
  private static keylen = Number(process.env.HASH_KEYLEN);

  static createRandomString(size: number = 64): string {
    return crypto.randomBytes(size).toString('hex');
  }

  static hashPassword(password: string): CryptoData {
    const salt = this.createRandomString();
    const hash = crypto.pbkdf2Sync(password, salt, this.iterations, this.keylen, this.hashAlgoritm).toString('hex');

    return { salt, hash };
  }

  static checkPassword(input: string, hashedPassword: string, salt: string): boolean {
    const hash = crypto.pbkdf2Sync(input, salt, this.iterations, this.keylen, this.hashAlgoritm).toString('hex');

    return hash === hashedPassword;
  }
}

type CryptoData = {
  hash: string;
  salt: string;
};

import { ValidationError } from '../errors';

export default class Validator {
  private static options = {
    passMinLength: 8,
    usernameMinLength: 5,
    digitsCount: 1,
    specialCharactersMinCount: 1,
    specialCharactersPattern: /[^A-Za-z0-9]+/g,
    digitsPattern: /[0-9]+/g,
  };

  static validateUsername(username: string) {
    const errors = [];
    const usernameChars = username.split('');

    if (username.length < this.options.usernameMinLength) {
      errors.push({
        message: `Username should be at least ${this.options.usernameMinLength} characters long`,
      });
    }

    const specialCharactersCount = usernameChars.filter((ch) => ch.match(this.options.specialCharactersPattern)).length;
    if (specialCharactersCount) {
      errors.push({
        message: `Username shouldn't contain special characters`,
      });
    }

    if (errors.length) {
      throw new ValidationError('Username validation error', errors);
    }

    return username;
  }

  static validatePassword(password: string) {
    const errors = [];
    const passwordChars = password.split('');

    if (password.length < this.options.passMinLength) {
      errors.push({
        message: `Password should be at least ${this.options.passMinLength} characters long`,
      });
    }

    const specialCharactersMinCount = passwordChars.filter((ch) => ch.match(this.options.specialCharactersPattern))
      .length;
    if (specialCharactersMinCount < this.options.specialCharactersMinCount) {
      errors.push({
        message: `Password should contain at least ${this.options.specialCharactersMinCount} special characters`,
      });
    }

    const digitsCount = passwordChars.filter((ch) => ch.match(this.options.digitsPattern)).length;
    if (digitsCount < this.options.digitsCount) {
      errors.push({
        message: `Password should contain at least ${this.options.digitsCount} digits`,
      });
    }

    if (errors.length) {
      throw new ValidationError('Password validation error', errors);
    }

    return password;
  }

  static isEmailValid(email: string) {
    // eslint-disable-next-line max-len
    const regexp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regexp.test(String(email).toLowerCase());
  }
}

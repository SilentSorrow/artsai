import { HttpError } from 'routing-controllers';

class ValidationError extends HttpError {
  constructor(public message: string, public errors: any[] = []) {
    super(409, message);
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}

export { ValidationError };

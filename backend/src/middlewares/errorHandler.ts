import { Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export default class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response): void {
    const errorBody = {
      name: error.name,
      message: error.message,
      errors: error.errors,
    };

    res.status(error.httpCode || 500);
    res.json({
      error: errorBody,
    });
  }
}

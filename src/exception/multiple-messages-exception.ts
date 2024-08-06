import { HttpException, HttpStatus } from '@nestjs/common';

export class MultipleMessagesException extends HttpException {
  constructor(errors: any[], status: HttpStatus) {
    super({ errors, status }, status);
  }
}

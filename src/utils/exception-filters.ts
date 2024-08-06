import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.debug(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? this.extractMessage(exception.getResponse())
        : 'Internal server error';

    if (exception['code'] == '23505') {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message =
        exception['table'] +
        ' ' +
        exception['detail'].match(/\(([^)]+)\)/)[1] +
        ' already used';
    }

    // If it's an internal server error, format the response message
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Internal server error';
    }

    if (status === HttpStatus.FAILED_DEPENDENCY) {
      return response.status(status).json({
        message: {
          errors: exception.response.errors,
          status: status,
        },
      });
    }
    // if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
    //   status =exception.response.status;
    //   message = this.extractValidationMessage(exception.response.errors);

    //   return response.status(status).json({
    //     message: message,
    //     status: status,
    //   });
    // }
    
    // if (exception.response.message === 'Unauthorized') {
    //   return response.status(status).json({
    //     message: {
    //       message: exception.response.message,
    //       status: status,
    //     },
    //   });
    // }

    //Standard format
    response.status(status).json({
      message: message,
      status: status,
    });
  }

  private extractMessage(response: any): string {
    return response && response.message ? response.message : response;
  }

  private extractValidationMessage(response: any): string {
    // Handle validation error messages from an object
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      const messages = Object.values(response).join(', ');
      return messages;
    }

    return response.message || 'Validation failed';
  }
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        let responseData: any = { data, statusCode };

        // If there's a message property in the data, move it to the top level
        if (data?.message) {
          responseData.message = data.message;
          // Consider removing the message from data if it's no longer needed inside
          delete data.message;
        } else {
          responseData.message = data == null ? "Empty record" : Array.isArray(data.data) ? data.data.length > 0 ? "Success" : "Empty records" : "Success"
        }

        if (data != null) {
          if (Array.isArray(data.data)) {
            responseData.data = {
              "records": responseData.data.data, "currentPage": responseData.data.currentPage,
              "totalRecords": responseData.data.totalRecords,
              "hasNextPage": responseData.data.hasNextPage
            }
          }
        }

        return responseData;
      }),
    );
  }
}

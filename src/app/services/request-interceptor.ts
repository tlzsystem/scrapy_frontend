import {HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent} from "@angular/common/http";
import { Observable } from "rxjs";

export class RequestInterceptor implements HttpInterceptor {



    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | 
                       HttpResponse<any> | HttpUserEvent<any>> {
          
            var newRequest = request.clone({
                setHeaders: {
                   // Authorization: 'Basic 34954489cef24031afb3ade02be8bd4d'
                }            
            });
            return next.handle(newRequest);
        }
        
}


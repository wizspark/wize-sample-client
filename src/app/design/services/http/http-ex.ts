import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpHeaders } from './http-headers';
import { HttpResponseHandler } from './http-response-handler.service';
import { ExceptionService } from '../exception.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { CoreHttpService, UIConfigService, AppConfigService } from '../../../wize-ng2-core/core/shared/services/index';

@Injectable()
export class HttpEx {
  private _baseUrl: string;
  private _counter: number = 0;

  constructor(private _http: Http,
              private _httpResponseHandler: HttpResponseHandler,
              private _headerService: HttpHeaders,
              private _exceptionService: ExceptionService,
              private _spinnerService: SpinnerService,
  private appConfigService: AppConfigService) {

    this._baseUrl = `${this.appConfigService.getConfig('host')}/api/`;
  }

  public get(url: string, options?: RequestOptionsArgs) {
    return this._request(RequestMethod.Get, url, null, options);
  }

  public post(url: string, body: string, options?: RequestOptionsArgs) {
    return this._request(RequestMethod.Post, url, body, options);
  }

  public put(url: string, body: string, options?: RequestOptionsArgs) {
    return this._request(RequestMethod.Put, url, body, options);
  }

  public delete(url: string, options?: RequestOptionsArgs) {
    return this._request(RequestMethod.Delete, url, null, options);
  }

  public patch(url: string, body: string, options?: RequestOptionsArgs) {
    return this._request(RequestMethod.Patch, url, body, options);
  }

  private _request(reqMethod: RequestMethod,
                   url: string,
                   reqBody?: string,
                   options?: RequestOptionsArgs): Observable<any> {
    let requestOptions = new RequestOptions(Object.assign({
      method: reqMethod,
      url: this._baseUrl + url,
      body: reqBody,
      headers: this._headerService.headers
    }, options));
    return Observable.create((observer) => {
      this._counter++;
      this._spinnerService.show();
      this._http.request(new Request(requestOptions))
        .catch(this._exceptionService.catchBadResponse)
        .finally(() => {
          this._counter--;
          if (this._counter === 0) {
            this._spinnerService.hide();
          }
        })
        .subscribe(
          (res) => {
            observer.next(res);
            observer.complete();
          },
          (err) => {
            switch (err.status) {
              case 401:
                this._httpResponseHandler.handle401();
                observer.complete();
                break;
              case 500:
                this._httpResponseHandler.handle500();
                observer.complete();
                break;
              default:
                observer.error(err);
                break;
            }
          });
    });
  }
}

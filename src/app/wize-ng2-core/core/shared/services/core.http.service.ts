import {Injectable} from '@angular/core';
import {Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { WizeCoreHttpHandler } from '../interfaces';
import { SpinnerService } from './spinner.service';

@Injectable()
export class CoreHttpService extends Http {
  private httpHandler: WizeCoreHttpHandler = null;
  private _spinCounter: number = 0;

  constructor (backend: XHRBackend, options: RequestOptions, private spinnerService: SpinnerService) {
    super(backend, options);
  }

  setHandler(handler: WizeCoreHttpHandler) {
    this.httpHandler = handler;
  }

  get(url: string, options?: RequestOptionsArgs, spinner?: boolean): Observable<Response> {
    return this.wrap(super.get(url, options), spinner);
  }

  post(url: string, body: any, options?: RequestOptionsArgs, spinner?: boolean): Observable<Response> {
    return this.wrap(super.post(url, body, options), spinner);
  }

  put(url: string, body: any, options?: RequestOptionsArgs, spinner?: boolean): Observable<Response> {
    return this.wrap(super.put(url, body, options), spinner);
  }

  delete (url: string, options?: RequestOptionsArgs, spinner?: boolean): Observable<Response> {
    return this.wrap(super.delete(url, options), spinner);
  }

  patch(url: string, body: any, options?: RequestOptionsArgs, spinner?: boolean): Observable<Response> {
    return this.wrap(super.patch(url, body, options), spinner);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {

    if (this.httpHandler) {
      this.httpHandler.configureRequest(url, options);
    }
    if (typeof url !== 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        // we have to add the token to the url object
        url.headers.set('Accept', 'application/json');
        url.headers.set('Content-Type', 'application/json');
      }
    }
    return super.request(url, options).catch(this.catchError(this));
  }

  catchError (self: CoreHttpService) {
    return this.httpHandler ? this.httpHandler.handleError(self) : this.catchHttpError(self);
  }

  catchHttpError (self: CoreHttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log(res);
      return Observable.throw(res);
    };
  }

  private wrap(observable: Observable<Response>, spinner: boolean) {
    if (spinner) {
      this.spinnerService.show();
      this._spinCounter++;
    }
    return observable.finally(() => {
      if (spinner) {
        this._spinCounter--;
        if (this._spinCounter === 0) {
          this.spinnerService.hide();
        }
      }
    });
  }
}

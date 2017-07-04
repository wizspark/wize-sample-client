import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CoreHttpService extends Http {

  constructor (backend: XHRBackend, options: RequestOptions) {
    let authData = JSON.parse( localStorage.getItem('authLoginData')); // your custom token getter function here
    let idToken = "";
    if(authData){
      idToken = authData.idToken;
    }
    options.headers.set('Authorization', `Bearer ${idToken}`);
    super(backend, options);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    let authData = JSON.parse( localStorage.getItem('authLoginData'));
    let idToken = "";
    if(authData){
      idToken = authData.idToken;
    }
    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        // let's make option object
        options = {headers: new Headers()};
      }
      options.headers.set('Authorization', `Bearer ${idToken}`);
    } else {
      // we have to add the token to the url object
      url.headers.set('Authorization', `Bearer ${idToken}`);
    }
    return super.request(url, options).catch(this.catchAuthError(this));
  }

  catchAuthError (self: CoreHttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log(res);
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
      }
      return Observable.throw(res);
    };
  }
}

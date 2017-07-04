import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  Request,
  RequestOptionsArgs,
  Response,
  Headers
} from '@angular/http';

import { WizeCoreHttpHandler } from '../../wize-ng2-core/core/shared/index';
import { CoreHttpService } from '../../wize-ng2-core/core/shared/index';
import { CoreToastManager } from './core-toast-manager';


@Injectable()
export class HttpHandlerService implements WizeCoreHttpHandler {
  constructor (private _http: CoreHttpService, private toastsManager: CoreToastManager) {
    this._http.setHandler(this);
  }

  configureRequest(url: string|Request, options?: RequestOptionsArgs) {
    const idToken = localStorage.getItem('id_token');
    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        // let's make option object
        options = {headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })};
      }
      options.headers.set('Authorization', `Bearer ${idToken}`);
    } else {
      // we have to add the token to the url object
      url.headers.set('Accept', 'application/json');
      url.headers.set('Content-Type', 'application/json');
      url.headers.set('Authorization', `Bearer ${idToken}`);
    }
  }

  handleError(service: CoreHttpService) {
    return (res: Response) => {
      this.toastsManager.error(res.statusText || '', 'Server Error');
      return Observable.throw(res);
    };
  }
}

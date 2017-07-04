import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
//import { IdentityService } from '../../../user/services/identity.service';
//import { LocalStorage } from '../../../user/services/local-storage';
//import { isString, isArray } from 'util';
import { errors } from './errors';

// TODO: fix messages by adding standard messages against server responses in errors & messages files
let responses = {};
Object.assign(
  responses,
  errors
  // require('./messages')
);

let messageKeys = responses;

@Injectable()
export class HttpResponseHandler {
  constructor(private router: Router, ) {
  }

  public handleError(error: Response, allowArrayResult = false): any {
    let errorMessage: any = error.json();
    return this.getMessage(errorMessage, allowArrayResult);
  }

  public handleSuccess(args): any {
    return this.getMessage(args);
  }

  public handle401(): any {
    //this._identityService.update(null);
    //this._localStorage.removeItem('profile');
    //this._localStorage.removeItem('id_profile');
    this.router.navigate(['/home']);
  }

  public handle500(): any {
    // TODO: notify user with an error popup dialog or smth else
  }

  private getMessage(source, allowArrayResult = false) {
    if (!!source && Reflect.has(messageKeys, source.key)) {
      if (source.message) {
        if (source.message) {
          return source.message;
        }
        if (source.message) {
          if (allowArrayResult) {
            return source.message;
          } else {
            return source.message[0];
          }
        }
      } else {
        return messageKeys[source.key].default;
      }
    } else {
      return `Unexpected server error`;
    }
  }
}

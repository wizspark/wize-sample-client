import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
//import { IdentityService } from '../../../user/services/identity.service';

@Injectable()
export class HttpHeaders {
  private _headers: Headers;
  private _RESTAPIHeaders: Headers;

  constructor() {
  }

  public setRESTAPIkey(key: string, name: string) {
    this._RESTAPIHeaders = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    if (!!key && !!name) {
      this._RESTAPIHeaders.append('Authorization', 'Basic ' + btoa(name + ':' + key));
    }
  }

  public get headers(): Headers {
    this._headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    // Not in use
    this._headers.append('Authorization', 'Bearer ' + "string");
    return this._headers;
  }

  public get RESTAPIHeaders(): Headers {
    return this._RESTAPIHeaders;
  }
}

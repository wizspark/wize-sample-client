import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ExceptionService {

  public catchBadResponse: (errorResponse: any) => Observable<any> = (errorResponse: any) => {
    let res = <Response> errorResponse;
    let err = res.json();
    let emsg = err ?
      (err.message ? err.message : (err.isTrusted ? 'System Error' : JSON.stringify(err))) :
      (res.statusText || 'unknown error');
    // this._toastService.activate(`${emsg}`, '', 'error');
    return Observable.throw(res);
  }
}

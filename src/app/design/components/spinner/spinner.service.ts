import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface SpinnerState {
  show: boolean;
}

@Injectable()
export class SpinnerService {
  public spinnerSubject = new Subject<SpinnerState>();
  public spinnerState = this.spinnerSubject.asObservable();

  constructor(@Optional() @SkipSelf() prior: SpinnerService) {
    if (prior) {
      return prior;
    }
    // console.log('created spinner service')
  }

  public show() {
    this.spinnerSubject.next(<SpinnerState> {show: true});
  }

  public hide() {
    this.spinnerSubject.next(<SpinnerState> {show: false});
  }
}

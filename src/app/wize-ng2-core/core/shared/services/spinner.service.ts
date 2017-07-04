import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface SpinnerState {
  show: boolean;
  msg: string;
}

@Injectable()
export class SpinnerService {
  public spinnerSubject = new Subject<SpinnerState>();
  public spinnerState = this.spinnerSubject.asObservable();

  constructor(@Optional() @SkipSelf() prior: SpinnerService) {
    if (prior) {
      return prior;
    }
  }

  public show(msg?: string) {
    this.spinnerSubject.next(<SpinnerState> {show: true, msg});
  }

  public hide() {
    this.spinnerSubject.next(<SpinnerState> {show: false});
  }
}

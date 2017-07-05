import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { SpinnerService, SpinnerState } from '../../shared/services/spinner.service';

@Component({
  selector: 'spinner',
  template: `<div class="loader" [class.hidden]="!visible"><p class="loading-message" *ngIf="message">{{message}}</p></div>`,
  styleUrls: ['spinner.css']
})

export class SpinnerComponent implements OnDestroy, OnInit {
  public visible = false;
  public message: string;
  private spinnerStateChanged: Subscription;

  constructor(private spinnerService: SpinnerService) {
  }

  public ngOnInit() {
    this.spinnerStateChanged = this.spinnerService.spinnerState
      .subscribe((state: SpinnerState) => {
        this.visible = state.show;
        this.message = state.msg;
      });
  }

  public ngOnDestroy() {
    this.spinnerStateChanged.unsubscribe();
  }
}

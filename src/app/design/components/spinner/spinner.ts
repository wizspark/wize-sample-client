import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { SpinnerService, SpinnerState } from './spinner.service';

@Component({
  selector: 'spinner',
  template: `<div class="pre-loader" [class.hidden]="!visible">
  <div class="sk-fading-circle">
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
  </div>
</div>`
})

export class SpinnerComponent implements OnDestroy, OnInit {
  private visible = false;

  private spinnerStateChanged: Subscription;

  constructor(private spinnerService: SpinnerService) {
  }

  public ngOnInit() {
    this.spinnerStateChanged = this.spinnerService.spinnerState
      .subscribe((state: SpinnerState) => {
        this.visible = state.show;
      });
  }

  public ngOnDestroy() {
    this.spinnerStateChanged.unsubscribe();
  }
}

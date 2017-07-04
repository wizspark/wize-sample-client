import { ElementRef, Input, OnChanges, Directive, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: `input[type=text][strictLength]`,
  host: {
    '(keypress)': 'onKeyPress($event)'
  },
})
export class StrictInputLengthDirective implements OnInit, OnDestroy, OnChanges {

  @Input('strictMinLength') minLength: number;
  @Input('strictMaxLength') maxLength: number;

  private el: any;

  constructor(private element: ElementRef){
    this.el = element.nativeElement;
  }

  ngOnInit(){

  }

  ngOnDestroy(){

  }

  ngOnChanges(event){
    // On Input Changes
  }

  onKeyPress(event){
    if(this.maxLength){
      event.target.value = event.target.value.length>=this.maxLength?event.target.value.substr(0,this.maxLength-1):event.target.value;
    }
  }

}

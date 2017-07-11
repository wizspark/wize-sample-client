import { Component, ViewChild } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { ModalComponent } from '../modal/modal';
import { IConfirmation } from '../../interfaces/confimation';

const KEY_ESC = 27;

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.scss']
})

export class ConfirmationComponent {
  @ViewChild('modal') public modal: ModalComponent;
  public positiveOnClick: (e: any) => void;
  public negativeOnClick: (e: any) => void;
  public _confirmation: IConfirmation;

  private selected: string;

  private _default: IConfirmation = {
    title: 'Confirmation',
    message: 'Do you want to cancel your changes?',
    firstButton: 'OK',
    secondButton: 'Cancel'
  };

  constructor(private confirmationService: ConfirmationService) {
    this.confirmationService.activate = this.activate.bind(this);
    this._confirmation = {
      title: 'Confirmation',
      message: 'Do you want to cancel your changes?',
      firstButton: 'OK',
      secondButton: 'Cancel'
    };
  }

  public closed() {
    this.modal.close();
  }

  public dismissed() {
    this.negativeOnClick(false);
  }

  public open() {
    this.modal.open();
  }

  private activate(confirmation = this._default) {
    this._confirmation = confirmation;
    let promise = new Promise<boolean>((resolve, reject) => {
      this.negativeOnClick = (e: any) => resolve(false);
      this.positiveOnClick = (e: any) => resolve(true);
      this.open();
    });

    return promise;
  }
}

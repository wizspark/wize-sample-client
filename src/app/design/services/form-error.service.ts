import { Injectable } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DEFAULT_ERROR_MESSAGE_MAP } from './validators/error-definitions';

@Injectable()
export class FormErrorService {

  public getErrorMessage(control: NgModel, fieldName: string = 'Field'): string {
    let errors = control.errors;
    for (let errorCode in errors) {
      if (errors.hasOwnProperty(errorCode)) {
        // let errorValue = errors[errorCode];
        let messageStr: string = DEFAULT_ERROR_MESSAGE_MAP[errorCode];
        return messageStr ? this.format(messageStr, fieldName) : '';
      }
    }
  }

  public format(template: string, ...args: any[]) {
    return template.replace(/{(\d+)}/g, (match, num) => typeof args[num] !== undefined ? args[num] : match);
  }
}

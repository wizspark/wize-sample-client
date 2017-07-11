import { Injectable } from '@angular/core';
import { IConfirmation } from '../../interfaces/confimation';

@Injectable()
export class ConfirmationService {
  public activate: (_confirmation ?: IConfirmation) => Promise<boolean>;
}

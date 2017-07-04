import { Injectable } from '@angular/core';
import { WizeCoreAuthProvider } from '../../wize-ng2-core/core/shared';

@Injectable()
export class AdminGuardService implements WizeCoreAuthProvider {
  constructor () {
  }
  installAuthProvider () {
    // this.wizeCoreAuthGuard.addGuard('./page', this);
  }
  isAuthenticated(): Boolean {
    return true;
  }
  isAuthorized(): Boolean {
    return true;
  }
}

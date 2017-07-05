import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppConfigService } from '../../wize-ng2-core/core/shared/services/app.config.service';
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService,
              private appConfigService: AppConfigService,
              private router: Router) {
  }

  canLoad(route: Route) {
    if (this.appConfigService.getConfig('auth') && this.authService.isAuthenticated()) {
      return true;
    }
    else if (!this.appConfigService.getConfig('auth')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    if (this.appConfigService.getConfig('auth') && this.authService.isAuthenticated()) {
      return true;
    }
    else if (!this.appConfigService.getConfig('auth')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}

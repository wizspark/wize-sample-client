import { Injectable } from '@angular/core';
import {
  CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanLoad, Route,
  CanActivateChild
} from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/'], {replaceUrl: true});
      return false;
    }
    return true;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(next, state);
  }

  canLoad(route: Route) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/'], {replaceUrl: true});
      return false;
    }
    return true;
  }
}

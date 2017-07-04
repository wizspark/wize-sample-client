import { Injectable } from '@angular/core';
import { AuthService } from '../../../../root/services/auth.service';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, Router
} from '@angular/router';

@Injectable()
export class WizeActivationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private authService: AuthService) {
  }

  canLoad(route: Route) {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
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

import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService) {
  }

  canLoad(route: Route) {
    return this.authService.isAuthenticated() && this.authService.user.isAdmin;
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    return this.authService.isAuthenticated() && this.authService.user.isAdmin;
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UserRolesResolve implements CanActivate, Resolve<boolean> {
  constructor(private authService: AuthService,
              private permissionService: PermissionService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.permissionService.getRoles()
      .map(rolesMap => {
        if (!rolesMap || rolesMap.length === 0 || rolesMap['roles'].length === 0) {
          // Forcefully remove auth0 authentication info
          this.authService.user = null;
          localStorage.removeItem('id_token');
          this.router.navigate(['/login'], {queryParams: {error: 'Unauthorized access'}});
          return false;
        }
        this.authService.user.roles = rolesMap['roles'];
        this.authService.user.isAdmin = this.permissionService.isAdmin(rolesMap['roles']);

        let userProfile = JSON.parse(localStorage.getItem('profile'));
        userProfile.roles = rolesMap['roles'];
        userProfile.isAdmin = this.authService.user.isAdmin;
        localStorage.setItem('profile', JSON.stringify(userProfile));
        return true;
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.resolve(route);
  }
}

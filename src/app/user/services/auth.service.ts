import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';

import { AppConfigService } from '../../wize-ng2-core/core/shared';


@Injectable()
export class AuthService {
  user: any = {};

  private options: any;
  private lock: any;

  constructor(private router: Router,
              private appConfigService: AppConfigService) {
    let appUrl = window.location.protocol + '//' + window.location.host;
    this.options = {
      closable: false,
      container: 'login-view',
      initialScreen: 'login',
      theme: {
        logo: './assets/img/wizni-logo.png',
        labeledSubmitButton: false
      },
      languageDictionary: {
        title: 'Wizni, Inc'
      },
      auth: {
        redirectUrl: appUrl,
        responseType: 'token',
        params: {
          state: JSON.stringify({pathname: window.location.pathname}),
          scope: 'openid name email companyName user_metadata app_metadata'
        }
      }
    };

    let auth0Options = this.appConfigService.getConfig('auth0Options');
    this.lock = new Auth0Lock(auth0Options.clientId, auth0Options.domain, this.options);

    this.user = JSON.parse(localStorage.getItem('profile')) || {};

    this.router.events
      .filter(event => event instanceof NavigationStart)
      .filter((event: NavigationStart) => (/access_token|id_token|error/).test(event.url))
      .subscribe(() => {
        this.lock.resumeAuth(window.location.hash, (error, authResult) => {
          if (error || !authResult) {
              return console.log(error);
          }
          localStorage.setItem('id_token', authResult.idToken);
          Object.assign(this.user, authResult.idTokenPayload);
          localStorage.setItem('profile', JSON.stringify(this.user));
          this.router.navigate(['/']);
        });
      });
  }

  login() {
    this.lock.show();
  };

  isAuthenticated() {
    return tokenNotExpired('id_token') && localStorage.getItem('id_token');
  };

  logout() {
    this.user = undefined;
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    //localStorage.removeItem('roles');
    this.router.navigate(['/login']);
    // let appUrl = window.location.protocol + '//' + window.location.host;
    // this.lock.logout({returnTo: appUrl});
  };
}

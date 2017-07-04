import { Injectable } from '@angular/core';
import { WizeCoreAuthProvider } from '../../wize-ng2-core/core/shared/index';
import { tokenNotExpired } from 'angular2-jwt';

// Avoid name not found warnings
import Auth0Lock from "auth0-lock";

@Injectable()
export class AuthService implements WizeCoreAuthProvider {
  // Configure Auth0
  options = {
  closable: false,
  container: '',
  initialScreen: 'login',
  theme: {
    logo: './assets/img/wizni-logo.png',
    labeledSubmitButton: false
  },
  socialButtonStyle: 'small',
  languageDictionary: {
    title: 'Wizni, Inc'
  },
  auth: {
    redirectUrl: "http://localhost:4201/loan-pricing",
    responseType: 'token',
    params: {
      state: JSON.stringify({pathname: window.location.pathname}),
      scope: 'openid name email companyName user_metadata app_metadata'
    }
  },
  additionalSignUpFields: [
    {
      name: 'name',
      placeholder: 'Full Name',
      validator: function (name) {
        return {
          valid: name.length >= 5,
          hint: 'Must have 5 or more chars' // optional
        };
      }
    },
    {
      name: 'companyName',
      placeholder: 'Company Name*',
      validator: function (companyName) {
        return {
          valid: companyName.length >= 5,
          hint: 'Must have 5 or more chars' // optional
        };
      }
    },
    {
      name: 'phoneNumber',
      placeholder: 'Phone Number (Optional)',
      validator: function (phoneNumber) {
        let phone = phoneNumber.trim();
        return {
          valid: (phone && phone.length > 0) ? phone.match(/\d/g).length === 10 : true
        };
      }
    }
  ]
};
  lock = new Auth0Lock('jNn1V2ORu1rN1TzgEv1SvDldgnz18W0Y', 'anjanikumar2109.auth0.com', this.options);

  constructor() {
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
    });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired('id_token');
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
  }

  installAuthProvider () {
  }
  isAuthenticated(): Boolean {
    return true;
  }
  isAuthorized(): Boolean {
    return true;
  }
}

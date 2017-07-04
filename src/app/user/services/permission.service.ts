import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { AppConfigService, CoreHttpService } from '../../wize-ng2-core/core/shared';

@Injectable()
export class PermissionService {
  private apiBaseUrl: string;

  constructor(private http: CoreHttpService,
              private appConfigService: AppConfigService) {
    this.apiBaseUrl = appConfigService.getConfig('host') + '/api';
  }

  getRoles() {
    return Observable.create((observer) => {
      this.http.get(`${this.apiBaseUrl}/wizeusers/current`)
        .map((response: Response) => response.json())
        .finally(() => observer.complete())
        .subscribe(roles => {
          //localStorage.setItem('roles', JSON.stringify(roles));
          observer.next(roles);
        }, error => {
          localStorage.setItem('roles', null);
          observer.next([]);
        });
    });
  }

  isAdmin(roles: string[]): boolean {
    return !!(roles || []).find((role) => role === 'Administrator');
  }
}

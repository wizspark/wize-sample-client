import { Injectable } from '@angular/core';
import { Response, RequestOptionsArgs } from '@angular/http';
import { CoreHttpService } from '../../../core/shared/services/core.http.service';
import { AppConfigService } from '../../../core/shared/services/app.config.service';

@Injectable()
export class SettingsApiService {
  private apiBaseUrl: string;

  constructor(private http: CoreHttpService,
              private appConfigService: AppConfigService) {
    this.apiBaseUrl = this.appConfigService.getConfig('host');
  }

  getSettings() {
    return this.http.get('', <RequestOptionsArgs>{
      url: `${this.apiBaseUrl}/api/settings`
    }, true).map((response: Response) => {
      return response.json();
    });
  }

  saveSettings(settings) {
    let verb = settings.id != null ? 'patch' : 'post';
    let url = `${this.apiBaseUrl}/api/settings` + (settings.id != null ? `/${settings.id}` : '');
    return this.http[verb]('', JSON.stringify(settings), <RequestOptionsArgs>{
      url: url
    }, true).map((response: Response) => {
      return response.json();
    });
  }
}

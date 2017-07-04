import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { CoreHttpService } from '../../../core/shared/services/core.http.service';
import { AppConfigService } from '../../../core/shared/services/app.config.service';

@Injectable()
export class TemplateApiService {
  private apiBaseUrl: string;

  constructor(private http: CoreHttpService,
              private appConfigService: AppConfigService) {
    this.apiBaseUrl = this.appConfigService.getConfig('host');
  }

  getTemplates() {
    return this.http.get(`${this.apiBaseUrl}/api/templates`)
      .map((response: Response) => {
        return response.json();
      }, true);
  }

  addTemplate(template: any) {
    let body = JSON.stringify(template);
    return this.http.post(`${this.apiBaseUrl}/api/templates`, body)
      .map((response: Response) => response.json());
  }

  updateTemplate(template: any) {
    let body = JSON.stringify(template);
    return this.http.patch(`${this.apiBaseUrl}/api/templates/${template.id}`, body)
      .map((response: Response) => response.json());
  }
}

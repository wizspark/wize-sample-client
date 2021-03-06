import { Injectable } from '@angular/core';
import { Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CoreHttpService } from '../../../core/shared/services/core.http.service';
import { AppConfigService } from '../../../core/shared/services/app.config.service';

@Injectable()
export class AuditApiService {
  private apiBaseUrl: string;

  constructor(private http: CoreHttpService,
              private appConfigService: AppConfigService) {
    this.apiBaseUrl = this.appConfigService.getConfig('host');
  }

  getAuditHistory(model: any, fromDate: any, toDate: any, sortQuery: any): Observable<any[]> {
    let params: URLSearchParams = new URLSearchParams();
    let firmFilter: any = { };
    if (model) {
      firmFilter = {oldValue: {"createdAt" : { $lt: toDate, $gte: fromDate } },
        "model" : model };
    } else {
      firmFilter = {oldValue: {"createdAt" : { $lt: toDate, $gte: fromDate } } };
    }
    params.set('where', JSON.stringify(firmFilter));
    if (sortQuery) {
      params.set('sort', JSON.stringify(sortQuery));
    }
    return this.http
      .get(``, <RequestOptionsArgs>{url: `${this.apiBaseUrl}/api/wizeaudits`, search: params}, true)
      .map((response: Response) => response.json());
  }

  getVersionedModels() {
    return this.http
      .get(``, <RequestOptionsArgs>{
        url: `${this.apiBaseUrl}/api/wizeauditmodels`
      }, true)
      .map((response: any) => response.json());
  }

}

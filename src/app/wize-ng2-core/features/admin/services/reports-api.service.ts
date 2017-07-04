import { Injectable } from '@angular/core';
import { Response, RequestOptionsArgs } from '@angular/http';
import { CoreHttpService } from '../../../core/shared/services/core.http.service';
import { AppConfigService } from '../../../core/shared/services/app.config.service';
import { ReportCategory } from "../reports/interfaces/report-category";
import { SpinnerService } from '../../../core/shared/services/spinner.service';

@Injectable()
export class ReportApiService {
  private apiBaseUrl: string;

  constructor(private spinnerService: SpinnerService,
              private http: CoreHttpService,
              private appConfigService: AppConfigService) {
    this.apiBaseUrl = this.appConfigService.getConfig('host') + '/api';
  }

  getMetaData() {

    return this.http.get(`${this.apiBaseUrl}/metadata/dbschema`, null, true)
      .map((response: Response) => {
        return response.json();
      }, true);
  }

  getReportsCategories() {

    return this.http.get(`${this.apiBaseUrl}/reportcategories?association=[{"model":"ReportCategoryField","order":{"id":"asc"}}]&order={"id":"asc"}`, null, true)
      .map((response: Response) => {
        return response.json();
      }, true);
  }

  updateReportCategories(query: ReportCategory){
    let body = JSON.stringify(query);
    return this.http
      .patch(``, body, <RequestOptionsArgs>{
        url: `${this.apiBaseUrl}/reportcategories/save/${query.id}`
      }, true)
      .map(res => res.json());
  }

  createReportCategories(query: ReportCategory){
    let body = JSON.stringify(query);
    return this.http
      .post(``, body, <RequestOptionsArgs>{
        url: `${this.apiBaseUrl}/reportcategories`
      },true)
      .map(res => res.json());
  }

  deleteReportCategory(id) {
    return this.http.delete(`${this.apiBaseUrl}/reportcategories/${id}`, null, true)
      .map((response: Response) => {
        return response.json();
      }, true);
  }
}

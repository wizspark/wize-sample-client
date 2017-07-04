import { Injectable } from '@angular/core';
import {RequestOptionsArgs, Response, URLSearchParams} from '@angular/http';
import { CoreHttpService, UIConfigService, AppConfigService } from '../../wize-ng2-core/core/shared/services/index';
import { StringMapWrapper } from '../../design/services/collection';
import { Query } from "../../reports/interfaces/query";
import { ChartSettings } from '../interfaces/chartSettings';
import { SpinnerService } from '../../wize-ng2-core/core/shared/services/spinner.service';

@Injectable()
export class ReportsApiService {
  private apiBaseUrl: string;

  constructor(private spinnerService: SpinnerService,
              private _http: CoreHttpService,
              private appConfigService: AppConfigService,
              private _uiConfigService: UIConfigService) {
    this.apiBaseUrl = this.appConfigService.getConfig('host') + '/api';
  }

  getMetaData(params: any) {
    return this._http.get('', <RequestOptionsArgs>{
      url: `${this.apiBaseUrl}/metadata/dbschema`,
      search: this.prepareURLSearchParams(params)
    }, true).map((response: Response) => {
      return response.json();
    });
  }

  getReportsCategories() {
    return this._http.get(`${this.apiBaseUrl}/reportcategories?association=[{"model":"ReportCategoryField","order":{"id":"asc"}}]&order={"id":"asc"}`)
      .map((response: Response) => {
        return response.json();
      }, true);
  }

  getAllReports(params: any) {
    return this._http.get('', <RequestOptionsArgs>{
      url: `${this.apiBaseUrl}/chartsettings`,
      search: this.prepareURLSearchParams(params)
    }, true).map((response: Response) => {
      return response.json();
    });
  }

  postQuery(params: any, query: Query) {
    let body = JSON.stringify(query);

    return this._http
      .post(``, body, <RequestOptionsArgs>{
        url: `${this.apiBaseUrl}/metadata/executeQuery`,
        search: this.prepareURLSearchParams(params)
      }, true)
      .map(res => res.json());
  }

  updateChartSettings(chartSettings: ChartSettings) {
    let body = JSON.stringify(chartSettings);
    return this
      ._http.patch('',body, <RequestOptionsArgs>{
        url: `${this.apiBaseUrl}/chartsettings/${chartSettings.id}`
      }, true)
      .map((response: Response) => response.json());
  }

  deleteChartSettings(id: any) {
    this.spinnerService.show();
    return this
      ._http.delete('', <RequestOptionsArgs>{
        url: `${this.apiBaseUrl}/chartsettings/${id}`
      }, true)
      .map((response: Response) => response.json());
  }

  saveChartSettings(chartSettings: ChartSettings) {
    let body = JSON.stringify(chartSettings);
    return this
      ._http.post('',body, <RequestOptionsArgs>{
        url: `${this.apiBaseUrl}/chartsettings`
      }, true)
      .map((response: Response) => response.json());
  }

  fetchStaticData(url: string) {
    return this._http.get('', <RequestOptionsArgs>{
      url: `${this.apiBaseUrl}/chartdata`
    }, true).map((response: Response) => {
      return response.json();
    });
  }

  private prepareURLSearchParams(rawParams) {
    let params = new URLSearchParams();
    StringMapWrapper.forEach(rawParams, (value, key) => {
      params.set(key, value);
    });
    return params;
  }

}

import {Injectable} from '@angular/core';
import {Http, URLSearchParams, RequestOptionsArgs} from '@angular/http';
import {Subject, Observable} from 'rxjs';
import {CoreHttpService, UIConfigService, AppConfigService, PluralService} from '../../../core/shared/services/index';

@Injectable()
export class AdminService {
  apiUrl: string;

  constructor(private _http: CoreHttpService,
              private _appConfigService: AppConfigService,
              private _uiConfigService: UIConfigService,
              private _pluralService: PluralService) {
    this.apiUrl = `${this._appConfigService.getConfig('host')}`;
  }

  // APIs for CRUD
  getRows(model: string, query?: string, association?: Array<any>, offset?: number, limit?: number, sortField?: string, sortOrder?: number) {
    let params: URLSearchParams = new URLSearchParams();
    if (association && association.length > 0) {
      params.set('association', JSON.stringify(association));
    }
    if (query) {
      params.set('where', query);
    }
    if (sortField && sortOrder) {
      let sortBy = {};
      sortBy[sortField] = (sortOrder === 1) ? 'ASC' : 'DESC';
      params.set('order', JSON.stringify(sortBy));
    }
    //if (groupBy && groupBy !== '') {
    //  params.set('groupBy', groupBy);
    //}
    if (offset && limit) {
      params.set('offset', offset.toString());
      params.set('limit', (offset + limit).toString());
    }
    return this._http
      .get(``, <RequestOptionsArgs>{
        url: `${this.apiUrl}${model}`, search: params
      }, true)
      .map((response: any) => response.json())

  }

  getRowDetail(path: string, id: string) {
    //let params: URLSearchParams = new URLSearchParams();
    //urlSearchParams.set('association', JSON.stringify([{all: true}]));
    //params.set('where', JSON.stringify({ id: id }));
    return this._http
      .get(``, <RequestOptionsArgs>{
        url: `${this.apiUrl}${path}/${id}`
      }, true)
      .map((response: any) => response.json());

  }

  addRow(api: string, row: any) {
    let body = JSON.stringify(row);
    return this._http
      .post(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}${api}`
      }, true)
      .map(res => res.json());
  }

  associateRow(api: string, row: any) {
    let body = JSON.stringify(row);
    return this._http
      .patch(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}${api}`
      }, true)
      .map(res => res.json());
  }

  deleteRow(api: string, rows: any, belongsToMany?: boolean) {
    if (belongsToMany) {
      return this._http
        .patch(``, rows, <RequestOptionsArgs>{
          url: `${this.apiUrl}${api}`
        }, true)
        .map((response: any) => response.json());
    }
    else {
      return this._http
        .delete(``, <RequestOptionsArgs>{
          url: `${this.apiUrl}${api}/${rows.id}`
        }, true)
        .map((response: any) => response.json());
    }
  }

  updateRow(api: string, id: any, row: any) {
    row.id = id;
    let body = JSON.stringify(row);
    return this._http
      .patch(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}${api}/${id}`
      }, true);
  }

  addAssociatedEntity(entity: string) {

  }

  removeAssociatedEntity(entity: string) {

  }


  exportData(modelName: string, filter?: Object, sort?: String, columns?: string) {
    let _this = this,
      xhr = new XMLHttpRequest(),
      url = `${this.apiUrl}export/${modelName}?association=false`;
    if (filter && filter !== '') {
      url = `${url}&where=${JSON.stringify(filter)}`;
    }
    if (sort && sort !== '') {
      url = `${url}&sort=${JSON.stringify(sort)}`;
    }
    if (columns && columns !== '') {
      url = `${url}&columns=${columns}`;
    }
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    //xhr.setRequestHeader('Authorization', this.httpHeaders.headers.get('Authorization'));
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let fileName = modelName;
        //_this.downloadService.downloadFile(this.response, fileName, xhr.getResponseHeader('Content-Type'));
      }
    };
    xhr.send();
  }

  // Models

  getScopedAndVersionedModels(fetchAuditInfo) {
    if (fetchAuditInfo) {
      return Observable.forkJoin(
        this._http
          .get(``, <RequestOptionsArgs>{
            url: `${this.apiUrl}/api/wizescopemodels`
          }, true)
          .map((response: any) => response.json()),
        this._http
          .get(``, <RequestOptionsArgs>{
            url: `${this.apiUrl}/api/wizeauditmodels`
          }, true)
          .map((response: any) => response.json())
      );
    } else {
      // Fetch ACL info only
      return Observable.forkJoin(
        this._http
          .get(``, <RequestOptionsArgs>{
            url: `${this.apiUrl}/api/wizescopemodels`
          }, true)
          .map((response: any) => response.json())
      );
    }
  }

  getScopeModels() {
    return this._http
      .get(``, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizescopemodels`
      }, true)
      .map((response: any) => response.json());
  }

  updateScopeModel(model: any) {
    let body = JSON.stringify({modelName: model.name});
    return this._http
      .post(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizescopemodels`
      }, true)
      .map(res => res.json());
  }

  deleteScopeModel(id) {
    return this._http
      .delete(``, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizescopemodels/${id}`
      }, true)
      .map((response: any) => response.json());
  }

  getVersionedModels() {
    return this._http
      .get(``, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizeauditmodels`
      }, true)
      .map((response: any) => response.json());
  }

  updateVersionedModel(model: any) {
    let body = JSON.stringify({modelName: model.name, displayField: model.displayField.name});
    return this._http
      .post(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizeauditmodels`
      }, true)
      .map(res => res.json());
  }

  deleteVersionedModel(id) {
    return this._http
      .delete(``, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizeauditmodels/${id}`
      }, true)
      .map((response: any) => response.json());
  }

  //Resources

  updateEnity(apiPath, data) {
    let body = JSON.stringify(data);
    return this._http
      .patch(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}${apiPath}`
      }, true)
      .map(res => res.json());
  }

  // Email Template
  getTemplates() {
    return this._http
      .get(``, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizetemplates`
      }, true)
      .map((response: any) => response.json());
  }

  addTemplate(template: any) {
    let body = JSON.stringify(template);
    return this._http
      .post(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizetemplates`
      }, true)
      .map(res => res.json());
  }

  updateTemplate(template: any) {
    let body = JSON.stringify(template);
    return this._http
      .patch(``, body, <RequestOptionsArgs>{
        url: `${this.apiUrl}/api/wizetemplates/${template.id}`
      }, true)
      .map(res => res.json());
  }

}

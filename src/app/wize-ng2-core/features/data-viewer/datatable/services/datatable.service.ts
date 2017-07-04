import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { Subject, Observable } from 'rxjs';
import { CoreHttpService, UIConfigService, AppConfigService, PluralService } from '../../../../core/shared/services/index';

@Injectable()
export class DataTableService {
  apiUrl: string;
  // Observable sources
  private searchSource = new Subject<any>();
  private importSource = new Subject<any>();
  private exportSource = new Subject<any>();
  private columnSource = new Subject<any>();
  private filterSource = new Subject<any>();
  private addSource = new Subject<any>();
  private titleFilterSource = new Subject<any>();

  private showAddEditModalSource = new Subject<any>();
  private closeAddEditModalSource = new Subject<any>();
  private showImportModalSource = new Subject<any>();
  private showFilterModalSource = new Subject<any>();
  private showDetailsModalSource = new Subject<any>();
  // Observable streams
  search$ = this.searchSource.asObservable();
  import$ = this.importSource.asObservable();
  export$ = this.exportSource.asObservable();
  column$ = this.columnSource.asObservable();
  filter$ = this.filterSource.asObservable();
  add$ = this.addSource.asObservable();
  titleFilter$ = this.titleFilterSource.asObservable();
  showAddEditModal$ = this.showAddEditModalSource.asObservable();
  closeAddEditModal$ = this.closeAddEditModalSource.asObservable();

  showImportModal$ = this.showImportModalSource.asObservable();
  showFilterModal$ = this.showFilterModalSource.asObservable();
  showDetailsModal$ = this.showDetailsModalSource.asObservable();
  // Service commands
  search(text: string) {
    this.searchSource.next(text);
  }

  import(fileName: string) {
    this.importSource.next(fileName);
  }

  export(fileName: string){
    this.exportSource.next(fileName);
  }

  columns(column: any){
    this.columnSource.next(column);
  }

  filter(item: any){
    this.filterSource.next(item);
  }

  add(item: any) {
    this.addSource.next(item);
  }

  titleFilter(item: any){
    this.titleFilterSource.next(item);
  }

  showAddEditModal(item: any){
    this.showAddEditModalSource.next(item);
  }

  showViewDetails(item: any){
    this.showDetailsModalSource.next(item);
  }

  closeModal(item: any){
    this.closeAddEditModalSource.next(item);
  }

  showImportDataModal(data:any){
    this.showImportModalSource.next(data)
  }

  showFilterModal(data: any){
    this.showFilterModalSource.next(data);
  }

  constructor(
      private _http: CoreHttpService,
      private _appConfigService: AppConfigService,
      private _uiConfigService: UIConfigService,
      private _pluralService: PluralService) {
        this.apiUrl = `${this._appConfigService.getConfig('host')}`;
  }

  getColumns(entity: any, filter?: any ) {
    let columns: any[] = [];
     entity.attributes.forEach((p) =>  {
        let column: any = p;
        column['value'] = null;
        column['displayName'] = p.displayName || p.name;
        column['noView'] = p.viewOptions.noView;
        columns.push(column);
    });
    if (filter)
        return columns.filter((c) => {return c['viewOptions']['noView'] === !filter});
    return columns;
  }

  getRelationships(entity:any){
    return entity.relationships;
  }

  getColumnsWithValue(columns, row, isEdit){
    columns.forEach((c) => {
      c.value = isEdit ? row[c.name] : null;
    });
    return columns.filter((c) => { return c.name !== 'id' && c.name !== 'createdAt' && c.name !== 'updatedAt' && c.name !== 'createdBy' && c.name !== 'modifiedBy' });
  }

  getDataFromJSON(path){
    return this._http.get(`@local-srv/${path}`).map((res) => res.json());
  }

  getAPIPath(primaryEntity:any, entity:any, key: string, recordId?: number, isAssociated?: boolean, belongToMany?: boolean){
    if(entity.primary) {
      return primaryEntity.apis[key];
    }
    else {
      let apiPath;
      switch (key){
        case "get":
            if(isAssociated)
              apiPath = entity.apis[key];
            else
              apiPath = `${primaryEntity.apis[key]}/${recordId}/get${this._pluralService.pluralize(entity.name)}`;
          break;
        case "post":
          if(isAssociated)
            apiPath = `${primaryEntity.apis[key]}/${recordId}/add${this._pluralService.pluralize(entity.name)}`;
          else
            apiPath = `${primaryEntity.apis[key]}/${recordId}/create${entity.name}`;
          break;
        case "patch":
          apiPath = `${primaryEntity.apis[key]}/${recordId}/set${this._pluralService.pluralize(entity.name)}`;
          break;
        case "delete":
            if(belongToMany)
              apiPath = `${primaryEntity.apis[key]}/${recordId}/set${this._pluralService.pluralize(entity.name)}`;
                else
              apiPath = `${primaryEntity.apis[key]}/${recordId}/remove${this._pluralService.pluralize(entity.name)}`;
          break;
      }
      return apiPath;
    }
  }

  // APIs for CRUD
  getRows(model: string, query?: string, association?: Array<any>, offset?:number, limit?:number, sortField?:string, sortOrder?:number, groupOrderQuery?: any){
    let params: URLSearchParams = new URLSearchParams();
    if(association && association.length > 1) {
      params.set('association', JSON.parse(JSON.stringify(association)));
    }
    if (query) {
      params.set('where', JSON.stringify(query));
    }
    if (sortField && sortOrder) {
      let sortBy = {};
      sortBy[sortField] = (sortOrder === 1)  ? 'ASC' : 'DESC';
      if(groupOrderQuery){
        params.set('order', JSON.parse(JSON.stringify(groupOrderQuery)));
      }
      else{
        params.set('order', JSON.stringify(sortBy));
      }
    }
    //if (groupBy && groupBy !== '') {
    //  params.set('groupBy', groupBy);
    //}
    if (offset && limit) {
      params.set('offset', <string>offset.toString());
      params.set('limit', <string>limit.toString());
    }

    return this._http
        .get(``, <RequestOptionsArgs>{
          url: `${this.apiUrl}${model}`, search: params
        }, true)
        .map((response: any) => response.json())

  }

  getRowDetail(path: string, id: string){
    //let params: URLSearchParams = new URLSearchParams();
    //urlSearchParams.set('association', JSON.stringify([{all: true}]));
    //params.set('where', JSON.stringify({ id: id }));
    return this._http
        .get(``, <RequestOptionsArgs>{
          url: `${this.apiUrl}${path}/${id}`
        }, true)
        .map((response: any) => response.json());

  }

  addRow(api: string, row: any){
    let body = JSON.stringify(row);
    return this._http
        .post(``, body, <RequestOptionsArgs>{
          url: `${this.apiUrl}${api}`
        }, true)
        .map(res => res.json());
  }

  associateRow(api: string, row: any){
    let body = JSON.stringify(row);
    return this._http
        .patch(``, body, <RequestOptionsArgs>{
          url: `${this.apiUrl}${api}`
        }, true)
        .map(res => res.json());
  }

  deleteRow(api:string, rows:any, belongsToMany?: boolean){
    if(belongsToMany){
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

  updateRow(api: string, id: any, row: any){
    row.id = id;
    let body = JSON.stringify(row);
    return this._http
        .patch(``, body, <RequestOptionsArgs>{
          url: `${this.apiUrl}${api}/${id}`
        }, true);
  }

  addAssociatedEntity(entity:string){

  }

  removeAssociatedEntity(entity:string){

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

}

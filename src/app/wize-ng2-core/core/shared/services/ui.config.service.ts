import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CoreHttpService } from './core.http.service';
import { AppConfigService } from './app.config.service';

const orderBy = require('lodash/orderBy');

@Injectable()
export class UIConfigService {

  private config:any = [];

  constructor(private _http:CoreHttpService, private configService:AppConfigService) {
  }

  /**
   * This method:
   * Loads the configuration file containing information needed before any route loads
   */
  public load() {
    return new Promise((resolve, reject) => {
      const host = this.configService.getConfig('host');
      const uiconfigEndpoint = `${host}/api/metadata/pages`; //'@local-srv/ui.config.json';
      this._http.get(uiconfigEndpoint).map((res) => res.json())
        .catch((error:any):any => {
          console.log('Configuration file "ui.config.json" could not be read');
          resolve(true);
          return Observable.throw(error.json().error || 'Server error');
        }).subscribe((config:any) => {
        this.config = config;
        resolve(true);
      });
    });
  }

  /**
   * Get Application Routes
   * @returns {any}
   */
  getRoutes():any [] {
    const routerItems = [];
    this.config.routes.filter(route => !route.hidden).forEach((route) => {
      if (route.entities && route.entities.length > 0 && route.pageType !== 'custom') {
        routerItems.push({
          index: route.index,
          url: `/wize/page/${route.route}`,
          label: route.name,
          pageType: route.pageType
        });
      } else {
        routerItems.push({
          index: route.index,
          url: `/${route.route}`,
          label: route.title || route.name,
          pageType: route.pageType
        });
      }
    });
    return orderBy(routerItems, 'index', 'asc');
  }

  /**
   * Get Config
   * @returns {T[]}
   */
  getConfig():any[] {
    return (this.config.routes || []).filter(route => !route.hidden);
  }

  /**
   * Get Config By Route
   * @param route
   * @returns {undefined|T}
   */
  getConfigByRoute(route:string):any {
    return this.config.routes.find((r) => r.route === route || r.routeId === route);
  }

  /**
   * Get Module Information
   * @param module
   * @returns {any}
   */
  getModule(module:string) {
    return this.config.modules ? this.config.modules[module] : null;
  }
}

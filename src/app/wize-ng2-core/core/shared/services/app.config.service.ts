import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CoreHttpService } from './core.http.service';
import { environment } from '../../../../../environments/environment'
class ConfigData {
  public host: string;
  public auth0Options: {
    clientId: string;
    domain: string
  };
}

@Injectable()
export class AppConfigService {

  private config: Object = null;

  constructor(private _http: CoreHttpService) {
  }

  /**
   * Use to get the data found in the config file
   */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * This method:
   * Loads the configuration file containing information needed before any route loads
   */
  public load() {
    return new Promise((resolve, reject) => {
      this._http.get(`@local-srv/config.${environment.name}.json`).map((res) => res.json())
        .catch((error: any): any => {
          console.log('Configuration file "config.json" could not be read');
          resolve(true);
          return Observable.throw(error.json().error || 'Server error');
        }).subscribe( (config: ConfigData) => {
        this.config = config;
        resolve(true);
      });
    });
  }
}

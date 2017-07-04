import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { HttpBaseService } from './http.base.service';
import { Observable } from 'rxjs/Rx';
import { CoreHttpService } from "./core.http.service";

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

  constructor(private http: CoreHttpService) {
    console.log('Creating new instance..');
  }

  /**
   * Use to get the data found in the config file
   */
  public getConfig(key: any) {
    console.log(key);
    return this.config[key];
  }

  /**
   * This method:
   * Loads the configuration file containing information needed before any route loads
   */
  public load() {
    return new Promise((resolve, reject) => {
      this.http.get('app-config/config.json').map((res) => res.json())
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

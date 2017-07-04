
import {
  RequestOptions,
  Request,
  RequestOptionsArgs
} from '@angular/http';

export abstract class WizeCoreHttpHandler {
  abstract handleError(service: any);
  abstract configureRequest(url: string|Request, options?: RequestOptionsArgs);
}

export abstract class WizeCoreAuthProvider {
  abstract isAuthenticated (): Boolean;
  abstract isAuthorized(): Boolean;
}



export interface IConfig { host: string ;}

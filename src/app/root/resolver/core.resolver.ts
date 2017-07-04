import 'rxjs/add/observable/of';
import { ToastOptions } from 'ng2-toastr';

export class CustomOption extends ToastOptions {
  public animate = 'flyRight';
  public newestOnTop = false;
  public showCloseButton = true;
  public positionClass = 'toast-bottom-right';
  public toastLife = 10000;
}

// an array of services to resolve routes with data
export const APP_RESOLVER_PROVIDERS = [
  {provide: ToastOptions, useClass: CustomOption}
];

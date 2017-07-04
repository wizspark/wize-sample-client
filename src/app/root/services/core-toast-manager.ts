import { Injectable } from '@angular/core';
import { ToastsManager, Toast } from 'ng2-toastr';

@Injectable()
export class CoreToastManager {
  constructor(private toastr: ToastsManager) {
  }

  error(message: string, title?: string, options?: any): Promise<Toast> {
    let content = this.prepareToast(message, title, 'danger', '224');
    return this.toastr.custom(content, null, Object.assign({}, options, {enableHTML: true}));
  }

  info(message: string, title?: string, options?: any): Promise<Toast> {
    let content = this.prepareToast(message, title, 'info', '223');
    return this.toastr.custom(content, null, Object.assign({}, options, {enableHTML: true}));
  }

  success(message: string, title?: string, options?: any): Promise<Toast> {
    let content = this.prepareToast(message, title, 'success', '223');
    return this.toastr.custom(content, null, Object.assign({}, options, {enableHTML: true}));
  }

  warning(message: string, title?: string, options?: any): Promise<Toast> {
    let content = this.prepareToast(message, title, 'warning', '224');
    return this.toastr.custom(content, null, Object.assign({}, options, {enableHTML: true}));
  }

  custom(message: string, title?: string, options?: any): Promise<Toast> {
    return this.toastr.custom(message, title, options);
  }

  private prepareToast(message: string, title: string, type: string, iconset: string) {
    return `<div class="media">
      <div class="media-left media-middle bg-${type} py-2 px-2 text-white">
        <span class="iconset-${iconset}"></span>
      </div>
      <div class="media-body media-middle pl-1 py-1">
        <h6>${title}</h6>
        <p class="m-0 text-muted">${message}</p>
      </div>
    </div>`
  }
}

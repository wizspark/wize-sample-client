import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AppConfigService } from './app.config.service';
import { UIConfigService } from './ui.config.service';

@Injectable()
export class BootstrapService {

  private config: Object = null;

  constructor(private configService: AppConfigService,
              private uiConfigService: UIConfigService) {
  }

  /**
   * This method:
   * Loads the configuration file containing information needed before any route loads
   */
  public load() {
    return new Promise((resolve, reject) => {
      this.configService.load().then(() => {
        this.uiConfigService.load().then(() => {
          resolve(true);
        });
      });
    });
  }
}

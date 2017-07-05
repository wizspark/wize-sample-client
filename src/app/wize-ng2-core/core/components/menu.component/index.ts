import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UIConfigService } from '../../shared/services/index';
import { MenuItem } from 'primeng/primeng';
import { AuthService } from '../../../../user/services/auth.service';
import { AppConfigService } from '../../shared/services/app.config.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './nav-bar.html',
  styleUrls: ['nav-bar.scss'],
})

export class MenuBarComponent implements OnInit {
  public items:MenuItem[];
  public isReport:boolean = false;

  constructor(private uiConfigService:UIConfigService,
              private authService:AuthService,
              private router:Router,
              private route:ActivatedRoute, private appConfigService: AppConfigService) {
  }

  ngOnInit() {
    const routes = this.uiConfigService.getRoutes();
    this.items = routes.filter((p) => p.pageType !== 'module');
  }

  get user() {
    return this.authService.user;
  }

  logout() {
    this.authService.logout();
  }

  redirectURL(url) {
    if (url === "/reports") {
      this.isReport = true;
      var d = new Date();
      var n = d.getTime();
      this.router.navigate([url], { queryParams: {q: n}, relativeTo: this.route });
    } else {
      this.isReport = false;
    }
  }

  /**
   * Check Module is installed or not
   * @param module
   * @returns {*}
     */
  isModuleInstalled(module: string){
    return this.uiConfigService.getModule(module)
  }

  navigateToHome() {
    this.router.navigate([this.appConfigService.getConfig('defaultRoute')])
  }
}

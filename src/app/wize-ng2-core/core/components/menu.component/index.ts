import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UIConfigService } from '../../shared/services';
import { MenuItem } from 'primeng/primeng';
import { AuthService } from '../../../../user/services/auth.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './nav-bar.html',
  styleUrls: ['nav-bar.scss'],
})

export class MenuBarComponent implements OnInit {
  private items:MenuItem[];
  private isReport:boolean = false;
  private isAdmin:boolean = false;

  constructor(private uiConfigService:UIConfigService,
              private authService:AuthService, private router:Router, private route:ActivatedRoute) {
  }

  ngOnInit() {
    let routes = this.uiConfigService.getRoutes();
    if (routes.find((p) => p.url === '/admin')) {
      this.isAdmin = true;
    }
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
      this.router.navigate([url], {queryParams: {q: n}, relativeTo: this.route});
    } else {
      this.isReport = false;
    }
  }
}

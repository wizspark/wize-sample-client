import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreToastManager } from '../../../root/services/core-toast-manager';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['login.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private toastr: CoreToastManager) {
  }

  ngOnInit() {
    this.showLogin();
    if (this.route.snapshot.queryParams['error']) {
      setTimeout(_ => this.toastr.error(this.route.snapshot.queryParams['error'], 'Error'), 500);
    }
  }

  showLogin() {
    this.authService.login();
  }
}

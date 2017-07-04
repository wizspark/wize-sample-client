import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../../root/services/auth.service'
@Component({
    templateUrl: './login.view.html',
    styleUrls: ['./login.view.css']
})

export class LoginViewComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.login();
    }

}

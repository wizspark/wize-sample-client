import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PermissionService } from './services/permission.service';
import { AuthGuard } from './guards/auth.gaurd';
import { AuthService } from './services/auth.service';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserRolesResolve } from './resolves/user-roles.resolve';
import { ToastModule } from 'ng2-toastr';
import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    UserRoutingModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    AuthService
  ]
})
export class UserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserModule,
      providers: [
        AuthService,
        PermissionService,
        AuthGuard,
        AdminGuard,
        AuthenticatedGuard,
        UserRolesResolve
      ]
    };
  }
}

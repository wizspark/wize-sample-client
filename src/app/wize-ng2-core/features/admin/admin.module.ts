import {NgModule} from '@angular/core';
import {SelectModule} from 'ng2-select';
import {LayoutComponent} from './layout/components/layout/layout.component';
import {SidebarComponent} from './layout/components/sidebar/sidebar.component';
import {ModelsComponent} from './models/models.component';
import {OrganizationUnitComponent} from './organization-unit/organization-unit.component';
import {DataTableModule, TreeModule, TreeTableModule, TreeNode} from 'primeng/primeng';
import {RolesComponent} from './roles/roles.component';
import {CommonModule} from '@angular/common';
import {CustomFormsModule} from 'ng2-validation';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminRoutingModule} from './admin.routes';
import {DataTableService} from "../data-viewer/datatable/services/datatable.service";
import {PluralService} from "../../core/shared/services/pluralize.service";
import {UsersComponent} from "./users/users.component";
import {DisclosuresComponent} from './disclosures/disclosures.component';
import {PricingLookupsComponent} from './pricing-lookups/pricing-lookups.component';
import {CodeEditorModule} from "../../../editor/index";
import {AdminService} from './services/admin.services';
import {RoleUsersComponent} from './roles/role-users/role-users.component';
import {PricingTemplatesComponent} from './pricing-templates/pricing-templates.component';
import {ReportCategoryComponent, ReportCategoryListComponent} from './reports/index';
import {TemplateApiService} from './services/template-api.service';
import {SettingsApiService} from './services/settings-api.service';
import {AuditApiService} from './services/audit-api.service';
import {ReportApiService} from './services/reports-api.service';
import {DynamicHeight} from './services/reports.service';
import {SettingsComponent} from './settings/settings.component';
import {RuleEventRegistryComponent} from './rule-event-registry/rule-event-registry.component';
import {RuleActivitiesComponent} from './rule-event-registry/rule-activities/rule-activities.component';
import {RuleTasksComponent} from './rule-event-registry/rule-tasks/rule-tasks.component';
import {RuleBuilderModule} from '../rule-builder/index';

import { AuthService } from '../../../user/services/auth.service';

import {
  MODAL_DIRECTIVES,
  ConfirmationComponent,
  ConfirmationService,
  DateRangeSelectorComponent
} from './shared/index';
import {AddOrganizationComponent} from './organization-unit/add-org-unit/add-org-unit.component';
import {AddUserComponent} from './users/add-user/add-user.component';
import {AddRoleComponent} from './roles/add-role/add-role.component';
import {AddDisclosureComponent} from './disclosures/add-disclosure/add-disclosure.component';
import {AddPricingLookupDataComponent} from './pricing-lookups/add-pricing-lookup-data/add-pricing-lookup-data.component';
import {AddRuleEventRegistryComponent} from './rule-event-registry/add-rule-event-registry/add-rule-event-registry.component';
import {OrganizationUsersComponent} from './organization-unit/organization-users/users.component';
import {PricingLookupDataComponent} from './pricing-lookups/pricing-lookup-data/pricing-lookup-data.component';
import {EmailTemplateComponent} from './email-template/email-template.component';
import {AuditComponent} from './audit/audit.component';
import { ModalModule } from '../modal/index';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    RolesComponent,
    UsersComponent,
    DisclosuresComponent,
    PricingLookupsComponent,
    ModelsComponent,
    OrganizationUnitComponent,
    PricingTemplatesComponent,
    ReportCategoryComponent,
    ReportCategoryListComponent,
    SettingsComponent,
    RuleEventRegistryComponent,
    RuleActivitiesComponent,
    RuleTasksComponent,
    RoleUsersComponent,
    MODAL_DIRECTIVES,
    ConfirmationComponent,
    AddOrganizationComponent,
    AddUserComponent,
    AddRoleComponent,
    AddDisclosureComponent,
    AddPricingLookupDataComponent,
    AddRuleEventRegistryComponent,
    OrganizationUsersComponent,
    PricingLookupDataComponent,
    EmailTemplateComponent,
    AuditComponent,
    DateRangeSelectorComponent
  ],
  imports: [
    CommonModule,
    SelectModule,
    AdminRoutingModule,
    DataTableModule,
    TreeTableModule,
    FormsModule,
    ReactiveFormsModule,
    CodeEditorModule,
    CustomFormsModule,
    ModalModule,
    RuleBuilderModule
  ],
  providers: [AuthService, DataTableService, PluralService, AdminService, TemplateApiService, SettingsApiService, ConfirmationService, AuditApiService, ReportApiService, DynamicHeight],
  exports: [MODAL_DIRECTIVES]
})

export class AdminModule {
}

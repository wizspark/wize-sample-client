import {RouterModule, Route} from '@angular/router';
import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout/components/layout/layout.component';
import {RolesComponent} from './roles/roles.component';
import {UsersComponent} from './users/users.component';
import {DisclosuresComponent} from './disclosures/disclosures.component';
import {PricingLookupsComponent} from './pricing-lookups/pricing-lookups.component';
import {ModelsComponent} from './models/models.component';
import {OrganizationUnitComponent} from './organization-unit/organization-unit.component';
import {RoleUsersComponent} from './roles/role-users/role-users.component';
import {PricingTemplatesComponent} from './pricing-templates/pricing-templates.component';
import {SettingsComponent} from './settings/settings.component';
import {OrganizationUsersComponent} from './organization-unit/organization-users/users.component';
import {PricingLookupDataComponent} from './pricing-lookups/pricing-lookup-data/pricing-lookup-data.component';
import {EmailTemplateComponent} from './email-template/email-template.component';
import {AuditComponent} from './audit/audit.component';
import {ReportCategoryListComponent} from "./reports/index";
import {RuleEventRegistryComponent} from './rule-event-registry/rule-event-registry.component';
import {RuleActivitiesComponent} from './rule-event-registry/rule-activities/rule-activities.component';
import {RuleTasksComponent} from './rule-event-registry/rule-tasks/rule-tasks.component';

@NgModule({
  imports: [
    RouterModule.forChild([
        <Route>{
          path: '',
          component: LayoutComponent,
          children: [
            {
              path: 'users',
              component: UsersComponent
            },
            {
              path: 'roles',
              component: RolesComponent
            },
            {
              path: 'disclosures',
              component: DisclosuresComponent
            },
            {
              path: 'pricing-lookups',
              component: PricingLookupsComponent
            },
            {
              path: 'pricing-lookups/:id',
              component: PricingLookupDataComponent
            },
            {
              path: 'roles/:id',
              component: RoleUsersComponent
            },
            {
              path: 'models',
              component: ModelsComponent
            },
            {
              path: 'organization-unit',
              component: OrganizationUnitComponent
            },
            {
              path: 'organization-unit/:id',
              component: OrganizationUsersComponent
            },
            {
              path: 'pricing-templates',
              component: PricingTemplatesComponent
            },
            {
              path: 'reports',
              component: ReportCategoryListComponent
            },
            {
              path: 'email-template',
              component: EmailTemplateComponent
            },
            {
              path: 'settings',
              component: SettingsComponent
            },
            {
              path: 'audit',
              component: AuditComponent
            },
            {
              path: 'rule-event-registry',
              component: RuleEventRegistryComponent
            },
            {
              path: 'rule-activities',
              component: RuleActivitiesComponent
            },
            {
              path: 'rule-tasks',
              component: RuleTasksComponent
            }
          ]
        }
      ]
    )],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule {
}

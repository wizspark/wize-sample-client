import { NgModule } from '@angular/core';
import { RuleBuilderComponent } from './components/rule-builder/rule-builder.component';
import { RuleGroupComponent } from './components/rule-group/rule-group.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterWithRulesComponent } from './components/filters/filter.component';
import { ModalModule } from '../modal/index';
import { RuleBuilderService } from './services/rule-builder.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    RuleBuilderComponent,
    RuleGroupComponent,
    FilterWithRulesComponent
  ],
  exports: [
    RuleBuilderComponent,
    FilterWithRulesComponent
  ],
  providers: [
    RuleBuilderService
  ]
})
export class RuleBuilderModule {
}

import { Component, ViewChild } from '@angular/core';
import { RuleBuilderService } from '../../services/rule-builder.service';
import { RuleGroup, RuleField } from '../../interfaces/rule-builder.interface';
import { ModalComponent } from '../../../modal/modal.component';

@Component({
  selector: 'rule-builder',
  templateUrl: 'rule-builder.html',
  styleUrls: ['rule-builder.scss']
})
export class RuleBuilderComponent {
  @ViewChild('modal') modal: ModalComponent;
  group: RuleGroup;
  query: string;
  fields: RuleField[];

  private positiveClose: () => void;

  constructor(private ruleBuilder: RuleBuilderService) {
  }

  ngOnInit() {
    this.group = {operator: this.ruleBuilder.getGroupOperators()[0], rules: []};
    this.fields = this.ruleBuilder.getFields();
  }

  createNewRule() {
    this.group = {operator: this.ruleBuilder.getGroupOperators()[0], rules: []};
  }

  activate(query: string) {
    this.query = query;
    this.group = this.ruleBuilder.parseQuery(query);
    return new Promise<string>(resolve => {
      this.positiveClose = () => resolve(this.query);
      this.open();
    });
  }

  getRuntimeQuery() {
    return this.group ? this.ruleBuilder.generateQuery(this.group) : '';
  }

  save() {
    this.query = this.group ? this.ruleBuilder.generateQuery(this.group) : this.query;
    this.positiveClose();
    this.dismissed();
  }

  open() {
    this.modal.show();
  }

  dismissed() {
    this.modal.hide();
  }
}

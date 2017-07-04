import { Component, OnInit } from '@angular/core';
import { TemplateApiService } from '../services/template-api.service';
import * as _ from 'lodash';
import { CoreToastManager } from '../../../../root/services/core-toast-manager';

@Component({
  selector: 'pricing-templates',
  templateUrl: './pricing-templates.html'
})
export class PricingTemplatesComponent implements OnInit {
  private templates: any[] = [];
  private selectedIndex: number = 0;
  private selectedTemplate: any;

  constructor(private toastr: CoreToastManager,
              private templateApiService: TemplateApiService) {
  }

  ngOnInit() {
    this.getTemplates();
  }

  get editorConfig() {
    return {
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      readOnly: false,
      smartIndent: true,
      showCursorWhenSelecting: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      mode: {name: 'javascript', globalVars: true},
      autofocus: false,
      viewportMargin: Infinity
    }
  }

  private getTemplates() {
    this.templates = [];
    this.templateApiService.getTemplates()
      .subscribe((data: any) => {
        this.templates = _.sortBy(data, 'name');
        this.setSelected(this.selectedIndex);
      });
  }

  private setSelected(index) {
    this.selectedTemplate = Object.assign({}, this.templates[index]);
  }

  private save() {
    let observable;
    if (this.selectedTemplate.id) {
      observable = this.templateApiService.updateTemplate(this.selectedTemplate);
    } else {
      observable = this.templateApiService.addTemplate(this.selectedTemplate);
    }

    observable.subscribe(_ => {
      this.toastr.success('Template saved successfully', 'Success!');
      this.getTemplates();
    }, error => {
      this.toastr.error('Error while saving template', 'Oops!');
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsApiService } from '../services/settings-api.service';
import { CoreToastManager } from '../../../../root/services/core-toast-manager';

@Component({
  selector: 'settings',
  templateUrl: './settings.html'
})
export class SettingsComponent implements OnInit {
  private settings: any;
  private configEntries: any[];
  private form: FormGroup;

  private static getCleanKey(key: string) {
    return key.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }

  constructor(private settingsApiService: SettingsApiService,
              private builder: FormBuilder,
              private toastr: CoreToastManager) {
    this.configEntries = [];
    this.form = builder.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getSettings();
  }

  saveSettings() {
    let config: any = {};
    this.configEntries.forEach(entry => {
      if (entry.key && SettingsComponent.getCleanKey(entry.key)) {
        config[entry.key] = entry.value;
      }
    });
    Object.assign(this.settings, {config: config});
    this.settingsApiService.saveSettings(this.settings)
      .subscribe((response: any) => {
        this.toastr.success('Settings saved successfully', 'Success!');
        this.settings = response;
        this.configEntries = this.mapToConfigEntries(response.config);
      });
  }

  addEntry(entry) {
    this.configEntries.push({key: entry.key, value: entry.value});
    this.form.reset();
  }

  removeEntry(entry) {
    let index = this.configEntries.findIndex(item => item === entry);
    this.configEntries.splice(index, 1);
  }

  get fixedConfigEntries() {
    return (this.configEntries || []).filter(entry => entry.fixed);
  }

  get customConfigEntries() {
    return (this.configEntries || []).filter(entry => !entry.fixed);
  }

  private getSettings() {
    this.settingsApiService.getSettings()
      .subscribe((response: any) => {
        if (response.count === 0) {
          this.settings = {};
        } else {
          this.settings = response.rows[0];
        }
        this.configEntries = this.mapToConfigEntries(this.settings.config);
      });
  }

  private mapToConfigEntries(config: any) {
    config = config || {};
    let fixedEntries = [];
    fixedEntries.push({
      key: 'blackOut',
      value: config['blackOut'],
      fixed: true,
      type: 'boolean',
    });
    fixedEntries.push({
      key: 'serviceEnabled',
      value: config['serviceEnabled'],
      fixed: true,
      type: 'boolean'
    });
    let otherEntries = Object.keys(config || {}).filter(key => {
      return key !== 'blackOut' && key !== 'serviceEnabled';
    }).map(key => {
      return {key, value: config[key]};
    });
    return fixedEntries.concat(otherEntries);
  }
}

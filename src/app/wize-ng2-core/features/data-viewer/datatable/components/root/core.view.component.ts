import { Component, ViewEncapsulation, ContentChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UIConfigService } from '../../../../../core/shared/services/index';
import { DataTableInputConfig, IDataTableInputConfig } from "../../interfaces/datatable.interface";
import { PrimeTemplate } from 'primeng/components/common/shared';
import { SpinnerService } from '../../../../../core/shared/services/index';


@Component({
  selector: 'data-view',
  templateUrl: './core.view.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./core.view.scss']
})
export class DataViewComponent {
  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;
  dataTableInputConfig: IDataTableInputConfig;
  primaryEntity: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _uiConfigService: UIConfigService, private spinnerService: SpinnerService) {
    this._activatedRoute.params.subscribe((route) => {
      this.spinnerService.show();
      this.primaryEntity = null;
      let self = this;
      setTimeout(function () {
        let routes = self._uiConfigService.getConfig();
        let options = self._uiConfigService.getConfigByRoute(self._activatedRoute.snapshot.params['route']);
        self.primaryEntity = options.entities.find((entity) => {
          return entity['primary'] === true;
        });
        self.dataTableInputConfig = new DataTableInputConfig(
          routes,
          self.primaryEntity.name,
          !options.actions.noHeader,
          self.primaryEntity.viewOptions.isSelection,
          options.actions.headerOptions
        );
        self.spinnerService.hide();
      }, 500);
    });
  }

  ngAfterContentInit() {
    console.log(this.templates);
  }
}

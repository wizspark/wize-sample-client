import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FilterTextComponent } from './components/filter-text/filter-text';
import { EntityService } from './services/entity.service';
import { ExceptionService } from './services/exception.service';
import { AppConfigService } from './services/app.config.service';
import { CoreHttpService } from './services/core.http.service';
import { DownloadService } from './services/download.service';
import { StringMapWrapper } from './services/collection';
import { SpinnerService } from './components/spinner/spinner.service';
import { FilterTextService } from './components/filter-text/filter-text.service';
import { HttpEx } from './services/http/http-ex';
import { HttpResponseHandler } from './services/http/http-response-handler.service';
import { HttpHeaders } from './services/http/http-headers';
import { SpinnerComponent } from './components/spinner/spinner';
import { COMMON_VALIDATORS } from './services/validators/directives/index';
import { FormErrorService } from './services/form-error.service';
import { MODAL_DIRECTIVES } from './components/modal/index';
import { ConfirmationComponent } from './components/confirmation/confirmation';
import { ConfirmationService } from './components/confirmation/confirmation.service';
import { TrimPipe } from './pipes/trim';
import { InitCapsPipe } from './pipes/init-caps.pipe';
import { NumberMaskDirective } from './directives/forms/number-mask';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    FilterTextComponent,
    ConfirmationComponent,
    MODAL_DIRECTIVES,
    SpinnerComponent,
    COMMON_VALIDATORS,
    TrimPipe,
    InitCapsPipe,
    NumberMaskDirective
  ],
  providers: [
    EntityService,
    ExceptionService,
    SpinnerService,
    FilterTextService,
    HttpEx,
    HttpResponseHandler,
    HttpHeaders,
    FormErrorService,
    ConfirmationService,
    AppConfigService,
    CoreHttpService,
    CoreHttpService,
    DownloadService,
    StringMapWrapper
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FilterTextComponent,
    ConfirmationComponent,
    MODAL_DIRECTIVES,
    SpinnerComponent,
    COMMON_VALIDATORS,
    TrimPipe,
    InitCapsPipe,
    NumberMaskDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DesignModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: DesignModule,
      providers: [
        EntityService,
        ExceptionService,
        SpinnerService,
        FilterTextService,
        HttpEx,
        FormErrorService,
        AppConfigService,
        CoreHttpService,
        CoreHttpService,
        DownloadService,
        StringMapWrapper
      ]
    };
  }
}

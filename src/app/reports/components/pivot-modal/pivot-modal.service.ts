import { Injectable } from '@angular/core';

@Injectable()
export class PivotModalService {
  activate: (pivotConfig?: any) => Promise<any>;
}

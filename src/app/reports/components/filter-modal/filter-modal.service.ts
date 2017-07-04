import { Injectable } from '@angular/core';

@Injectable()
export class FilterModalService {
  activate: (filterConfig?: any) => Promise<any>;
}

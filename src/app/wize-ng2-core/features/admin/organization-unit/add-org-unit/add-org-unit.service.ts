import { Injectable } from '@angular/core';

@Injectable()
export class AddOrgUnitService {
  activate: (data: any) => Promise<boolean>;
}

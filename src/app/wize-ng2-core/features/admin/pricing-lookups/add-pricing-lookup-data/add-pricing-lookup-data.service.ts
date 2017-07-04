import { Injectable } from '@angular/core';

@Injectable()
export class AddPricingLookupDataService {
    activate: (data: any) => Promise<boolean>;
}

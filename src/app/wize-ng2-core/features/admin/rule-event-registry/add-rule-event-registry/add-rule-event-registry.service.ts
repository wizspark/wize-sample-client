import { Injectable } from '@angular/core';

@Injectable()
export class AddRuleEventRegistryService {
    activate: (data: any) => Promise<boolean>;
}

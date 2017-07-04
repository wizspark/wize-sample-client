import { Injectable } from '@angular/core';

@Injectable()
export class AddDisclosureService {
    activate: (data: any) => Promise<boolean>;
}

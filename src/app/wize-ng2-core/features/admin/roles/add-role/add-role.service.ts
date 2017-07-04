import { Injectable } from '@angular/core';

@Injectable()
export class AddRoleService {
    activate: (data: any) => Promise<boolean>;
}
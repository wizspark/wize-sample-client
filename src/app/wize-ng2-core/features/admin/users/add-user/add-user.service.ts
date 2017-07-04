import { Injectable } from '@angular/core';

@Injectable()
export class AddUserService {
    activate: (data: any) => Promise<boolean>;
}
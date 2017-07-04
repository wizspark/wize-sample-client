import { Injectable } from '@angular/core';
import inflection from 'inflection';

@Injectable()
export class PluralService {
  pluralize(value: string) {
   return inflection.pluralize(value);
  }
}

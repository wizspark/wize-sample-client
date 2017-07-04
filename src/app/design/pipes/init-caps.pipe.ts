import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'myInitCaps'})
export class InitCapsPipe implements PipeTransform {
  public transform(value: string, args: any[]) {
    return value ? value
      .toLowerCase()
      .replace(/(?:^|\s)[a-z]/g, (m) => {
        return m.toUpperCase();
      }) : value;
  }
}

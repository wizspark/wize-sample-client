import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arrayFilter'
})

export class ArrayFilterPipe implements PipeTransform {
    transform(items: any[], args: any[]): any {
        return items.filter((item) => { return item[args[0]][args[1]] === args[2] });
    }
}

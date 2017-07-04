import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {
    transform(value: string, limit: number, trail: string): any {
        if (value) {
            limit = limit || 10;
            trail = trail || '...';
            return value.length > limit ? '<span title="' + value + '">' + value.substring(0, limit) + trail + '</span>' : value;
        }
        return '';
    }
    //transform(val, args) {
    //    if (args === undefined) {
    //        return val;
    //    }
    //
    //    if (val && val.length > args) {
    //        return val.substring(0, args) + '...';
    //    } else {
    //        return val ? val : 'N/A';
    //    }
    //}
}
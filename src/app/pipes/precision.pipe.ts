import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'precision' })
export class PrecisionPipe implements PipeTransform {
    transform (value: number | string | undefined, precision?: number) {
        value = Number(value);
        if (isNaN(value)) {
            return;
        }
        return value.toPrecision(precision);
    }
}

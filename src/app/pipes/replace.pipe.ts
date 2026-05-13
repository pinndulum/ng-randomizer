import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: false, name: 'replace' })
export class ReplacePipe implements PipeTransform {
    transform(value: string, searchValue: string | RegExp, replaceValue: string): string {
        if (!value || !searchValue) {
            return value;
        }
        return value.replace(searchValue, replaceValue ?? '');
    }
}

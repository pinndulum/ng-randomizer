import { AfterViewInit, Component, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { PiProgress, PiService } from '@app/services/pi.service';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-pi',
    templateUrl: './pi.component.html',
    styleUrls: ['./pi.component.scss'],
    imports: [AsyncPipe, DecimalPipe]
})
export class PiComponent implements AfterViewInit {
    private pi = inject(PiService);


    protected precision = 900;
    protected readonly progress?: Observable<PiProgress>;

    constructor() {
        this.progress = this.pi.progress().pipe(
            concatMap(x => of(x).pipe(delay(0))),
            tap(x => {
                console.log('pi progress:', { ...x });
            })
        );
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.pi.calculate(this.precision).subscribe();
        }, 300);
    }

    protected readonly superlative = () =>
        this.precision > 5000 ? 'staggering' : 'modest';
}

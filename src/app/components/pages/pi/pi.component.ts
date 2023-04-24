import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { PiProgress, PiService } from 'src/app/services/pi.service';

@Component({
    selector: 'app-pi',
    templateUrl: './pi.component.html',
    styleUrls: ['./pi.component.scss']
})
export class PiComponent implements OnInit, AfterViewInit {

    public precision = 900;
    public readonly progress?: Observable<PiProgress>;

    constructor(
        private pi: PiService
    ) {
        this.progress = this.pi.progress().pipe(
            concatMap(x => of(x).pipe(delay(0))),
            tap(x => {
                console.log('pi progress:', { ...x });                    
            })
        );
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.pi.calculate(this.precision).subscribe();            
        }, 300);
    }

    superlative = () =>
        this.precision > 10000 ? 'staggering' : 'modest';
}

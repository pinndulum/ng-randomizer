import { Component } from '@angular/core';
import dates from 'src/app/utils/dates';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    public readonly year = dates.current.year();

    scrollTop () {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

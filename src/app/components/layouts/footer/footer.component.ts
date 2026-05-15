import { Component, HostListener, signal } from '@angular/core';
import dates from '../../../utils/dates';
import { RouterLink } from '@angular/router';
import { appVersions } from '../../../app-versions';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [RouterLink]
})
export class FooterComponent {
    protected readonly year = dates.current.year();
    protected readonly appVersion = appVersions.app;
    protected readonly mockRandomizerVersion = appVersions.mockRandomizer;
    protected readonly showBackToTop = signal(false);

    @HostListener('window:scroll')
    protected onWindowScroll (): void {
        this.showBackToTop.set(window.scrollY > 100);
    }

    protected scrollTop () {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

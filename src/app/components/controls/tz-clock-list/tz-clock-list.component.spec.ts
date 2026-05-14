import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TzClockComponent } from '../tz-clock/tz-clock.component';
import { TzClockListComponent } from './tz-clock-list.component';

describe('TzClockListComponent', () => {
    let component: TzClockListComponent;
    let fixture: ComponentFixture<TzClockListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TzClockComponent, TzClockListComponent],
            providers: [provideRouter([])]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TzClockListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('renders the world clock page heading and default clocks', () => {
        const heading = fixture.nativeElement.querySelector('h1') as HTMLElement;
        const clocks = fixture.nativeElement.querySelectorAll('app-tz-clock');

        expect(heading.textContent?.trim()).toBe('World Clock');
        expect(clocks.length).toBe(5);
    });
});

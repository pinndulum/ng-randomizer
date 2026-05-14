import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatSelect } from '@angular/material/select';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PiService } from '../../../services/pi.service';

import { PiComponent } from './pi.component';

describe('PiComponent', () => {
    let component: PiComponent;
    let fixture: ComponentFixture<PiComponent>;
    let calculateSpy: jasmine.Spy;

    const withMockClock = (test: () => void): void => {
        jasmine.clock().install();
        try {
            test();
        } finally {
            jasmine.clock().uninstall();
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PiComponent],
            providers: [provideRouter([]), provideNoopAnimations()]
        })
            .compileComponents();

        calculateSpy = spyOn(TestBed.inject(PiService), 'calculate').and.returnValue(of([]));
        fixture = TestBed.createComponent(PiComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => withMockClock(() => {
        fixture.detectChanges();
        jasmine.clock().tick(320);

        expect(component).toBeTruthy();
    }));

    it('shows loading text before digit progress is emitted', () => withMockClock(() => {
        fixture.detectChanges();
        const loadingText = fixture.nativeElement.querySelector('.pi-loading-text') as HTMLElement;

        expect(loadingText.textContent?.trim()).toBe('Loading...');
        jasmine.clock().tick(320);
    }));

    it('defers the initial calculation long enough for navigation chrome to settle', () => withMockClock(() => {
        fixture.detectChanges();

        expect(calculateSpy).not.toHaveBeenCalled();

        jasmine.clock().tick(319);

        expect(calculateSpy).not.toHaveBeenCalled();

        jasmine.clock().tick(1);

        expect(calculateSpy).toHaveBeenCalledOnceWith(900, undefined, undefined, 'bellard-nth-digit');
    }));

    it('updates displayed precision while the slider moves and calculates on mouseup', () => withMockClock(() => {
        fixture.detectChanges();
        const slider = fixture.nativeElement.querySelector('#pi_precision') as HTMLInputElement;
        const formula = fixture.debugElement.query(By.directive(MatSelect)).componentInstance as MatSelect;

        expect(formula.value).toBe('bellard-nth-digit');
        expect(slider.min).toBe('8');
        expect(slider.max).toBe('1800');
        expect(calculateSpy).not.toHaveBeenCalled();

        slider.value = '1500';
        slider.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const label = fixture.nativeElement.querySelector('label[for="pi_precision"]') as HTMLElement;

        expect(label.textContent).toContain('1,500 points');
        expect(calculateSpy).not.toHaveBeenCalled();

        slider.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(calculateSpy).toHaveBeenCalledTimes(1);
        expect(calculateSpy).toHaveBeenCalledWith(1500, undefined, undefined, 'bellard-nth-digit');

        jasmine.clock().tick(320);

        expect(calculateSpy).toHaveBeenCalledTimes(1);
    }));

    it('changes formula and clamps precision to the selected formula limit', () => withMockClock(() => {
        fixture.detectChanges();
        const slider = fixture.nativeElement.querySelector('#pi_precision') as HTMLInputElement;
        const formula = fixture.debugElement.query(By.directive(MatSelect));

        slider.value = '1500';
        slider.dispatchEvent(new Event('input'));
        formula.triggerEventHandler('selectionChange', { value: 'rabinowitz-wagon-spigot' });
        fixture.detectChanges();

        const label = fixture.nativeElement.querySelector('label[for="pi_precision"]') as HTMLElement;

        expect(label.textContent).toContain('15 points');
        expect(slider.max).toBe('15');
        expect(calculateSpy).toHaveBeenCalledOnceWith(15, undefined, undefined, 'rabinowitz-wagon-spigot');

        jasmine.clock().tick(320);

        expect(calculateSpy).toHaveBeenCalledTimes(1);
    }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';
import { appVersions } from '../../../app-versions';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterComponent],
            providers: [provideRouter([])]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render package versions', () => {
        const textContent = fixture.nativeElement.textContent as string;

        expect(textContent).toContain(`ng-randomizer v${appVersions.app}`);
        expect(textContent).toContain(`@joxnathan/mock-randomizer v${appVersions.mockRandomizer}`);
    });
});

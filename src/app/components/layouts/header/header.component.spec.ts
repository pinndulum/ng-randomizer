import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SIDEBAR_TOGGLE_CLASS } from '../layout.constants';
import { SidebarStateService } from '../sidebar-state.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [provideRouter([])]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        window.document.body.classList.remove(SIDEBAR_TOGGLE_CLASS);
        sessionStorage.removeItem(SIDEBAR_TOGGLE_CLASS);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle sidebar state from the header button', () => {
        const button = fixture.nativeElement.querySelector('button[aria-controls="sidebar"]') as HTMLButtonElement;
        const expanded = button.getAttribute('aria-expanded');

        button.click();
        fixture.detectChanges();

        expect(window.document.body.classList.contains(SIDEBAR_TOGGLE_CLASS)).toBeTrue();
        expect(button.getAttribute('aria-expanded')).not.toBe(expanded);
    });

    it('should close mobile sidebar state from the home logo link', () => {
        const sidebarState = TestBed.inject(SidebarStateService);
        const closeSpy = spyOn(sidebarState, 'closeOnMobileNavigation');
        const logo = fixture.nativeElement.querySelector('.app-logo') as HTMLAnchorElement;

        logo.click();

        expect(closeSpy).toHaveBeenCalledTimes(1);
    });
});

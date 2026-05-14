import { TestBed } from '@angular/core/testing';
import { SIDEBAR_NARROW_QUERY, SIDEBAR_TOGGLE_CLASS, SIDEBAR_WIDE_QUERY } from './layout.constants';
import { SidebarStateService } from './sidebar-state.service';

describe('SidebarStateService', () => {
    const createService = (): SidebarStateService => TestBed.inject(SidebarStateService);

    beforeEach(() => {
        TestBed.resetTestingModule();
        window.document.body.classList.remove(SIDEBAR_TOGGLE_CLASS);
        sessionStorage.removeItem(SIDEBAR_TOGGLE_CLASS);
    });

    afterEach(() => {
        window.document.body.classList.remove(SIDEBAR_TOGGLE_CLASS);
        sessionStorage.removeItem(SIDEBAR_TOGGLE_CLASS);
    });

    it('should reset stale sidebar state to the viewport default', () => {
        window.document.body.classList.add(SIDEBAR_TOGGLE_CLASS);
        sessionStorage.setItem(SIDEBAR_TOGGLE_CLASS, 'true');

        const service = createService();

        expect(window.document.body.classList.contains(SIDEBAR_TOGGLE_CLASS)).toBeFalse();
        expect(sessionStorage.getItem(SIDEBAR_TOGGLE_CLASS)).toBeNull();
        expect(service.expanded()).toBe(window.matchMedia(SIDEBAR_WIDE_QUERY).matches);
    });

    it('should toggle the manual sidebar override and expanded signal', () => {
        const service = createService();
        const initiallyExpanded = service.expanded();

        service.toggle();

        expect(window.document.body.classList.contains(SIDEBAR_TOGGLE_CLASS)).toBeTrue();
        expect(service.expanded()).toBe(!initiallyExpanded);

        service.toggle();

        expect(window.document.body.classList.contains(SIDEBAR_TOGGLE_CLASS)).toBeFalse();
        expect(service.expanded()).toBe(initiallyExpanded);
    });

    it('should close the sidebar after mobile navigation only on narrow screens', () => {
        const service = createService();

        window.document.body.classList.add(SIDEBAR_TOGGLE_CLASS);
        service.closeOnMobileNavigation();

        expect(window.document.body.classList.contains(SIDEBAR_TOGGLE_CLASS))
            .toBe(!window.matchMedia(SIDEBAR_NARROW_QUERY).matches);
    });
});

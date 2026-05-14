import { DOCUMENT } from '@angular/common';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { SIDEBAR_NARROW_QUERY, SIDEBAR_TOGGLE_CLASS, SIDEBAR_WIDE_QUERY } from './layout.constants';

@Injectable({
    providedIn: 'root'
})
export class SidebarStateService implements OnDestroy {
    readonly expanded = signal(false);

    private readonly document = inject(DOCUMENT);
    private readonly narrowMediaQuery = window.matchMedia(SIDEBAR_NARROW_QUERY);
    private readonly wideMediaQuery = window.matchMedia(SIDEBAR_WIDE_QUERY);

    constructor() {
        this.resetToViewportDefault();
        this.wideMediaQuery.addEventListener('change', this.resetToViewportDefault);
    }

    ngOnDestroy(): void {
        this.wideMediaQuery.removeEventListener('change', this.resetToViewportDefault);
    }

    toggle(): void {
        this.document.body.classList.toggle(SIDEBAR_TOGGLE_CLASS);
        this.syncExpanded();
    }

    closeOnMobileNavigation(): void {
        if (this.narrowMediaQuery.matches) {
            this.close();
        }
    }

    private close(): void {
        this.document.body.classList.remove(SIDEBAR_TOGGLE_CLASS);
        this.syncExpanded();
    }

    private readonly resetToViewportDefault = (): void => {
        this.document.body.classList.remove(SIDEBAR_TOGGLE_CLASS);
        sessionStorage.removeItem(SIDEBAR_TOGGLE_CLASS);
        this.syncExpanded();
    };

    private readonly syncExpanded = (): void => {
        const isManuallyToggled = this.document.body.classList.contains(SIDEBAR_TOGGLE_CLASS);

        this.expanded.set(this.wideMediaQuery.matches ? !isManuallyToggled : isManuallyToggled);
    };
}

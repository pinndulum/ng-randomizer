import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SIDEBAR_NAV_ITEMS } from '../../../routing/route-paths';
import { SidebarStateService } from '../sidebar-state.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [RouterLink]
})
export class SidebarComponent {
    private readonly sidebarState = inject(SidebarStateService);

    protected readonly randomizerNavItems = SIDEBAR_NAV_ITEMS
        .filter(item => item.section === 'randomizer');
    protected readonly referenceNavItems = SIDEBAR_NAV_ITEMS
        .filter(item => item.section === 'reference');

    protected readonly closeMobileSidebar = (): void => this.sidebarState.closeOnMobileNavigation();
}

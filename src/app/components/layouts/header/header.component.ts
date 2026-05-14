import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarStateService } from '../sidebar-state.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [RouterLink],
})
export class HeaderComponent {
    private readonly sidebarState = inject(SidebarStateService);

    protected readonly sidebarExpanded = this.sidebarState.expanded;

    protected readonly sidebarToggle = (): void => this.sidebarState.toggle();

    protected readonly closeMobileSidebar = (): void => this.sidebarState.closeOnMobileNavigation();
}

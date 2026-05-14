import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SIDEBAR_NAV_ITEMS } from '@app/routing/route-paths';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [RouterLink]
})
export class SidebarComponent {
  protected readonly navItems = SIDEBAR_NAV_ITEMS;
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTE_LINKS } from '../../../routing/route-paths';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [RouterLink]
})
export class HomeComponent {
    protected readonly links = ROUTE_LINKS;
}

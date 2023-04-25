import { Routes } from '@angular/router';
import { TzClockListComponent } from '../components/controls/tz-clock-list/tz-clock-list.component';
import { BuzzWordsComponent } from '../components/pages/buzz-words/buzz-words.component';
import { ChangeLogHistoryComponent } from '../components/pages/change-log-history/change-log-history.component';
import { FlipACoinComponent } from '../components/pages/flip-a-coin/flip-a-coin.component';
import { HomeComponent } from '../components/pages/home/home.component';
import { MockObjectComponent } from '../components/pages/mock-object/mock-object.component';
import { PiComponent } from '../components/pages/pi/pi.component';
import { PseudoIdentityComponent } from '../components/pages/pseudo-identity/pseudo-identity.component';

export const routes: Routes = [{
    path: 'random/buzz-words',
    component: BuzzWordsComponent,
    canActivate: [],
    data: {}
}, {
    path: 'random/flip-a-coin',
    component: FlipACoinComponent,
    canActivate: [],
    data: { min: 9, max: 25, inclusive: true }
}, {
    path: 'random/pseudo-identity',
    component: PseudoIdentityComponent,
    canActivate: [],
    data: { }
}, {
    path: 'random/change-log-history',
    component: ChangeLogHistoryComponent,
    canActivate: [],
    data: {}
}, {
    path: 'random/object/mock-dsl',
    component: MockObjectComponent,
    canActivate: [],
    data: {}
}, {
    path: 'not-so-random/pi',
    component: PiComponent,
    canActivate: [],
    data: {}
}, {
    path: 'not-so-random/world-clock',
    component: TzClockListComponent,
    canActivate: [],
    data: {}
}, {
    path: '',
    component: HomeComponent
}, {
    path: '**', redirectTo: ''
}];

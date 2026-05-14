import { Routes } from '@angular/router';
import { ROUTE_PATHS } from './route-paths';

export const routes: Routes = [{
    path: ROUTE_PATHS.random.buzzWords,
    loadComponent: () => import('../components/pages/buzz-words/buzz-words.component')
        .then(c => c.BuzzWordsComponent)
}, {
    path: ROUTE_PATHS.random.shakespeareInsults,
    loadComponent: () => import('../components/pages/shakespeare-insults/shakespeare-insults.component')
        .then(c => c.ShakespeareInsultsComponent)
}, {
    path: ROUTE_PATHS.random.flipACoin,
    loadComponent: () => import('../components/pages/flip-a-coin/flip-a-coin.component')
        .then(c => c.FlipACoinComponent),
    data: { min: 9, max: 25, inclusive: true }
}, {
    path: ROUTE_PATHS.random.pseudoIdentity,
    loadComponent: () => import('../components/pages/pseudo-identity/pseudo-identity.component')
        .then(c => c.PseudoIdentityComponent)
}, {
    path: ROUTE_PATHS.random.changeLogHistory,
    loadComponent: () => import('../components/pages/change-log-history/change-log-history.component')
        .then(c => c.ChangeLogHistoryComponent)
}, {
    path: ROUTE_PATHS.random.mockDsl,
    loadComponent: () => import('../components/pages/mock-object/mock-object.component')
        .then(c => c.MockObjectComponent)
}, {
    path: ROUTE_PATHS.notSoRandom.pi,
    loadComponent: () => import('../components/pages/pi/pi.component')
        .then(c => c.PiComponent)
}, {
    path: ROUTE_PATHS.notSoRandom.worldClock,
    loadComponent: () => import('../components/controls/tz-clock-list/tz-clock-list.component')
        .then(c => c.TzClockListComponent)
}, {
    path: ROUTE_PATHS.home,
    loadComponent: () => import('../components/pages/home/home.component')
        .then(c => c.HomeComponent)
}, {
    path: '**', redirectTo: ROUTE_PATHS.home
}];

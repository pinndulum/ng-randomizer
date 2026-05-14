export const ROUTE_PATHS = {
  home: '',
  random: {
    buzzWords: 'random/buzz-words',
    shakespeareInsults: 'random/shakespeare-insults',
    flipACoin: 'random/flip-a-coin',
    pseudoIdentity: 'random/pseudo-identity',
    changeLogHistory: 'random/change-log-history',
    mockDsl: 'random/object/mock-dsl'
  },
  notSoRandom: {
    pi: 'not-so-random/pi',
    worldClock: 'not-so-random/world-clock'
  }
} as const;

export const ROUTE_LINKS = {
  home: '/',
  buzzWords: `/${ROUTE_PATHS.random.buzzWords}`,
  shakespeareInsults: `/${ROUTE_PATHS.random.shakespeareInsults}`,
  flipACoin: `/${ROUTE_PATHS.random.flipACoin}`,
  pseudoIdentity: `/${ROUTE_PATHS.random.pseudoIdentity}`,
  changeLogHistory: `/${ROUTE_PATHS.random.changeLogHistory}`,
  mockDsl: `/${ROUTE_PATHS.random.mockDsl}`,
  pi: `/${ROUTE_PATHS.notSoRandom.pi}`,
  worldClock: `/${ROUTE_PATHS.notSoRandom.worldClock}`
} as const;

export interface SidebarNavItem {
  iconClass: string;
  label: string;
  routerLink: string;
}

export const SIDEBAR_NAV_ITEMS: readonly SidebarNavItem[] = [
  { iconClass: 'bi bi-bug', label: 'Buzzwords', routerLink: ROUTE_LINKS.buzzWords },
  { iconClass: 'bi bi-chat-quote', label: 'Shakespeare Insults', routerLink: ROUTE_LINKS.shakespeareInsults },
  { iconClass: 'bi bi-coin', label: 'Flip A Coin', routerLink: ROUTE_LINKS.flipACoin },
  { iconClass: 'bi bi-person', label: 'Pseudo Identity', routerLink: ROUTE_LINKS.pseudoIdentity },
  { iconClass: 'bi bi-clock-history', label: 'Change Log History', routerLink: ROUTE_LINKS.changeLogHistory },
  { iconClass: 'bi bi-stickies', label: 'Mock DSL Fill', routerLink: ROUTE_LINKS.mockDsl }
];

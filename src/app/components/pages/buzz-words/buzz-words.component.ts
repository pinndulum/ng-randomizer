import { OnInit, Component, AfterViewInit, inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { MockService } from '@app/services/mock.service';
import { AsyncPipe } from '@angular/common';
import { ROUTE_LINKS } from '@app/routing/route-paths';

@Component({
    selector: 'app-buzz-words',
    templateUrl: './buzz-words.component.html',
    styleUrls: ['./buzz-words.component.scss'],
    imports: [RouterLink, AsyncPipe]
})
export class BuzzWordsComponent implements OnInit, AfterViewInit {
  private rtr = inject(Router);
  private rte = inject(ActivatedRoute);
  private mock = inject(MockService);


  protected readonly word_lists = buzz_words;
  protected readonly buzz_words$: Observable<string>;

  private readonly word_sub: Subject<string> = new Subject();

  constructor() {
    this.buzz_words$ = this.word_sub.pipe(
      delay(0)
    );
  }

  ngOnInit(): void {
    this.rte.queryParamMap.pipe(
      tap(params => {
        this.load_query(params);
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.load_query(
      new URLSearchParams(location.search)
    );
  }

  protected readonly load = (x?: number, y?: number, z?: number) => {
    const words: string[] = [];
    [x, y, z].forEach((n, i) => {
      let word = buzz_words[i][Number(n)];
      if (!word) {
        word = this.mock.realistic.from(buzz_words[i]);
      }
      words.push(word);
    });
    this.word_sub.next(words.join(' '));

    const params = new URLSearchParams(location.search);
    ['x', 'y', 'z'].forEach((n, i) => {
      params.set(n, buzz_words[i].indexOf(words[i]).toString());
    });
    this.rtr.navigate([ROUTE_LINKS.buzzWords], {
      replaceUrl: !location.search,
      queryParams: {
        ...Array.from(params.entries())
          .map(([k, v]) => ({[k]: v}))
          .reduce((next, curr) => ({...next, ...curr}), {})
      },
      queryParamsHandling: 'merge'
    });
  };

  private load_query = (params: ParamMap | URLSearchParams) => {
    const [x, y, z] = [
      Number(params.get('x') ?? -1),
      Number(params.get('y') ?? -1),
      Number(params.get('z') ?? -1)
    ];
    this.load(x, y, z);
  };
}

const buzz_words: [string[], string[], string[]] = [[
  'integrated',
  'total',
  'systemized',
  'parallel',
  'functional',
  'responsive',
  'optimal',
  'synchronized',
  'compatible',
  'balanced'
], [
  'management',
  'organizational',
  'monitored',
  'reciprocal',
  'digital',
  'logistical',
  'transitional',
  'incremental',
  'third-generation',
  'policy'
], [
  'options',
  'flexibility',
  'capability',
  'mobility',
  'programming',
  'concept',
  'time-phase',
  'projection',
  'hardware',
  'contingency'
]];

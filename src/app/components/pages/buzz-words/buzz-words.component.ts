import { OnInit, Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { MockService } from 'src/app/services/mock.service';

@Component({
  selector: 'app-buzz-words',
  templateUrl: './buzz-words.component.html',
  styleUrls: ['./buzz-words.component.scss']
})
export class BuzzWordsComponent implements OnInit, AfterViewInit {

  public readonly word_lists = buzz_words;
  public readonly buzz_words$: Observable<string>;

  private readonly word_sub: Subject<string> = new Subject();
  
  constructor(
    private rtr: Router,
    private rte: ActivatedRoute,
    private mock: MockService
  ) {
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

  load = (x?: number, y?: number, z?: number) => {
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
    this.rtr.navigate(['/random/buzz-words'], {
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

import { Location } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, withLatestFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockService } from 'src/app/services/mock.service';

@Component({
  selector: 'app-buzz-words',
  templateUrl: './buzz-words.component.html',
  styleUrls: ['./buzz-words.component.scss']
})
export class BuzzWordsComponent implements AfterViewInit {

  public readonly word_lists = buzz_words;
  public readonly buzz_words$: Observable<string>;
  private readonly word_sub: Subject<any> = new Subject();
  
  constructor(
    private loc: Location,
    private mock: MockService,
    private route: ActivatedRoute
  ) {
    this.buzz_words$ = this.word_sub.pipe();
  }

  ngAfterViewInit(): void {
    this.route.params.pipe(
      withLatestFrom(this.route.queryParams),
      tap(([parms, query]) => {
        const [x, y, z] = [
          query['x'], query['y'], query['z']
        ];
        const words = [
          buzz_words[0][+x], buzz_words[1][+y], buzz_words[2][+z]
        ].filter(x => !!x);
        if (words.length === 3) {
          this.word_sub.next(words.join(' '));
        } else {
          this.load();
        }
      })
    ).subscribe();
  }

  load = () => {
    const words = [
      this.mock.realistic.from(buzz_words[0]),
      this.mock.realistic.from(buzz_words[1]),
      this.mock.realistic.from(buzz_words[2])
    ];
    this.word_sub.next(words.join(' '));

    const params = new URLSearchParams(location.search);
    const [x, y, z] = words.map((x, i) =>
      buzz_words[i].indexOf(x).toString()
    );
    params.set('x', x);
    params.set('y', y);
    params.set('z', z);
    const search = params.toString();
    if (search !== location.search) {
      const state = this.loc.getState();
      this.loc.replaceState('random/buzz-words', search, state);
    }
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

import { Location } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockService } from 'src/app/services/mock.service';

@Component({
  selector: 'app-buzz-words',
  templateUrl: './buzz-words.component.html',
  styleUrls: ['./buzz-words.component.scss']
})
export class BuzzWordsComponent implements AfterViewInit {

  public readonly word_lists = buzz_words;
  public readonly buzz_words$: Observable<string>;

  private readonly word_sub: Subject<string> = new Subject();
  
  constructor(
    private loc: Location,
    private mock: MockService
  ) {
    this.buzz_words$ = this.word_sub.pipe(
      delay(0)
    );
  }

  ngAfterViewInit(): void {
    const query = new URLSearchParams(location.search);
    const [x, y, z] = [
      Number(query.get('x') ?? -1),
      Number(query.get('y') ?? -1),
      Number(query.get('z') ?? -1)
    ];
    this.load(x, y, z);
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

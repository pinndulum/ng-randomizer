import { AfterViewInit, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
  
  constructor(private mock: MockService) {
    this.buzz_words$ = this.word_sub.pipe();
  }

  ngAfterViewInit(): void {
    this.load();
  }

  load = () => {
    const words = [
      this.mock.realistic.from(buzz_words[0]),
      this.mock.realistic.from(buzz_words[1]),
      this.mock.realistic.from(buzz_words[2])
    ];
    this.word_sub.next(words.join(' '));
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

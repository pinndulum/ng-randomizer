import { AfterViewInit, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MockService } from 'src/app/services/mock.service';

@Component({
  selector: 'app-shakespeare-insults',
  templateUrl: './shakespeare-insults.component.html',
  styleUrls: ['./shakespeare-insults.component.scss']
})
export class ShakespeareInsultsComponent implements AfterViewInit {

  public readonly word_lists = insults;
  public readonly insults$: Observable<string>;
  private readonly word_sub: Subject<any> = new Subject();
  
  constructor(private mock: MockService) {
    this.insults$ = this.word_sub.pipe();
  }

  ngAfterViewInit(): void {
    this.load();
  }

  load = () => {
    const words = [
      this.mock.realistic.from(insults[0]),
      this.mock.realistic.from(insults[1]),
      this.mock.realistic.from(insults[2])
    ];
    this.word_sub.next(words.join(' '));
  };
}

const insults: [string[], string[], string[]] = [[
  'artless',
  'bawdy',
  'beslubbering',
  'bootless',
  'churlish',
  'cockered',
  'clouted',
  'craven',
  'currish',
  'dankish',
  'dissembling',
  'droning',
  'errant',
  'fawning',
  'fobbing',
  'froward',
  'frothy',
  'gleeking',
  'goatish',
  'gorbellied',
  'impertinent',
  'infectious',
  'jarring',
  'loggerheaded',
  'lumpish',
  'mammering',
  'mangled'
], [
  'base-court',
  'bat-fowling',
  'beef-witted',
  'beetle-headed',
  'boil-brained',
  'clapper-clawed',
  'clay-brained',
  'common-kissing',
  'crook-pated',
  'dismal-dreaming',
  'dizzy-eyed',
  'doghearted',
  'dread-bolted',
  'earth-vexing',
  'elf-skinned',
  'fat-kidneyed',
  'fen-sucked',
  'flap-mouthed',
  'fly-bitten',
  'folly-fallen',
  'fool-born',
  'full-gorged',
  'guts-griping',
  'half-faced',
  'hasty-witted',
  'hedge-born',
  'hell-hated'
], [
  'apple-john',
  'baggage',
  'barnacle',
  'bladder',
  'boar-pig',
  'bugbear',
  'bum-bailey',
  'canker-blossom',
  'clack-dish',
  'clotpole',
  'coxcomb',
  'codpiece',
  'death-token',
  'dewberry',
  'flap-dragon',
  'flax-wench',
  'flirt-gill',
  'foot-licker',
  'fustilarian',
  'giglet',
  'gudgeon',
  'haggard',
  'harpy',
  'hedge-pig',
  'horn-beast',
  'hugger-muggen',
  'joithead'
]];

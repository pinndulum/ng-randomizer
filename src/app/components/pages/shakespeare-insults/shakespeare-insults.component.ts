import { Location } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, withLatestFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  
  constructor(
    private loc: Location,
    private mock: MockService,
    private route: ActivatedRoute
  ) {
    this.insults$ = this.word_sub.pipe();
  }

  ngAfterViewInit(): void {
    this.route.params.pipe(
      withLatestFrom(this.route.queryParams),
      tap(([parms, query]) => {
        const [x, y, z] = [
          query['x'], query['y'], query['z']
        ];
        const words = [
          insults[0][+x], insults[1][+y], insults[2][+z]
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
      this.mock.realistic.from(insults[0]),
      this.mock.realistic.from(insults[1]),
      this.mock.realistic.from(insults[2])
    ];
    this.word_sub.next(words.join(' '));
    
    const params = new URLSearchParams(location.search);
    const [x, y, z] = words.map((x, i) =>
      insults[i].indexOf(x).toString()
    );
    params.set('x', x);
    params.set('y', y);
    params.set('z', z);
    const search = params.toString();
    if (search !== location.search) {
      const state = this.loc.getState();
      this.loc.replaceState('random/shakespeare-insults', search, state);
    }
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

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { MockService } from 'src/app/services/mock.service';

const utter = SpeechSynthesisUtterance;

@Component({
  selector: 'app-shakespeare-insults',
  templateUrl: './shakespeare-insults.component.html',
  styleUrls: ['./shakespeare-insults.component.scss']
})
export class ShakespeareInsultsComponent implements OnInit, AfterViewInit {

  public readonly word_lists = insults;
  public readonly synth?: SpeechSynthesis;
  public readonly insults$: Observable<string>;

  private readonly word_sub: Subject<string> = new Subject();
  
  constructor(
    private rtr: Router,
    private rte: ActivatedRoute,
    private mock: MockService
  ) {
    this.synth = speechSynthesis;
    this.insults$ = this.word_sub.pipe(
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
      let word = insults[i][Number(n)];
      if (!word) {
        word = this.mock.realistic.from(insults[i]);
      }
      words.push(word);
    });
    this.word_sub.next(words.join(' '));
    
    const params = new URLSearchParams(location.search);
    ['x', 'y', 'z'].forEach((n, i) => {
      params.set(n, insults[i].indexOf(words[i]).toString());
    });
    this.rtr.navigate([location.pathname], {
      replaceUrl: !location.search,
      queryParams: {
        ...Array.from(params.entries())
          .map(([k, v]) => ({[k]: v}))
          .reduce((next, curr) => ({...next, ...curr}), {})
      },
      queryParamsHandling: 'merge'
    });
  };

  sayit = async (text?: string, voice?: number) => {
    const synth = this.synth;
    if (!synth || !text) {
      return;
    }

    let voices = synth.getVoices();
    if (!voices.length) {    
      await new Promise(resolve =>
        synth.onvoiceschanged = resolve
      );
      voices = synth.getVoices();
    }

    const vndx = [voice, 2, 0].first(x => !!voices[Number(x)]);
    if(!vndx) {
      return;
    }

    const speech = new utter(text);
    speech.voice = voices[vndx];
    if (synth.speaking) {
      synth.cancel();
    }
    synth.speak(speech);
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

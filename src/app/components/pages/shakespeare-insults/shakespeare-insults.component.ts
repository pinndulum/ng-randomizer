import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { MockService } from '../../../services/mock.service';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { ROUTE_LINKS } from '../../../routing/route-paths';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-shakespeare-insults',
    templateUrl: './shakespeare-insults.component.html',
    styleUrls: ['./shakespeare-insults.component.scss'],
    imports: [RouterLink, MatTooltip, AsyncPipe]
})
export class ShakespeareInsultsComponent implements OnInit, AfterViewInit {
  private rtr = inject(Router);
  private rte = inject(ActivatedRoute);
  private mock = inject(MockService);
  private alert = inject(AlertService);


  protected readonly word_lists = insults;
  protected readonly synth?: SpeechSynthesis;
  protected readonly canSpeak: boolean;
  protected readonly insults$: Observable<string>;

  private readonly Utterance?: typeof SpeechSynthesisUtterance;
  private readonly word_sub: Subject<string> = new Subject();

  constructor() {
    this.synth = globalThis.speechSynthesis;
    this.Utterance = globalThis.SpeechSynthesisUtterance;
    this.canSpeak = !!this.synth && !!this.Utterance;
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

  protected readonly load = (x?: number, y?: number, z?: number) => {
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
    this.rtr.navigate([ROUTE_LINKS.shakespeareInsults], {
      replaceUrl: !location.search,
      queryParams: {
        ...Array.from(params.entries())
          .map(([k, v]) => ({[k]: v}))
          .reduce((next, curr) => ({...next, ...curr}), {})
      },
      queryParamsHandling: 'merge'
    });
  };

  protected readonly sayit = async (text?: string, voice?: number) => {
    const synth = this.synth;
    const Utterance = this.Utterance;
    if (!synth || !Utterance || !text) {
      return;
    }

    let voices = synth.getVoices();
    if (!voices.length) {
      await new Promise(resolve =>
        synth.onvoiceschanged = resolve
      );
      voices = synth.getVoices();
    }

    const vndx = [voice, 2, 0].find(x => x !== undefined && !!voices[Number(x)]);
    if (vndx === undefined) {
      return;
    }

    const speech = new Utterance(text);
    speech.voice = voices[Number(vndx)];
    if (synth.speaking) {
      synth.cancel();
    }
    synth.speak(speech);
  };

  protected readonly showSourceImageDialog = (): void => {
    void this.alert.showDialog({
      title: 'Original Shakespeare Insult Kit',
      opts: {
        buttons: [],
        image: {
          src: 'assets/img/342889694_3530523573894436_7672415123078190943_n.jpg',
          alt: 'Original Shakespeare Insult Kit'
        },
        maxWidth: 'calc(100vw - 2rem)',
        width: 'min(1100px, calc(100vw - 2rem))'
      }
    }, false);
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

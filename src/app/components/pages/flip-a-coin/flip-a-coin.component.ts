import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, of, Subject } from 'rxjs';
import { concatMap, delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { MockService } from 'src/app/services/mock.service';

const coin_sides = ['heads', 'tails'] as const;
type side = typeof coin_sides[number];

@Component({
  selector: 'app-flip-a-coin',
  templateUrl: './flip-a-coin.component.html',
  styleUrls: ['./flip-a-coin.component.scss']
})
export class FlipACoinComponent implements AfterViewInit {

  public flipping = false;
  public readonly flip$: Observable<side>;
  public readonly results: { dt: Date; side: side; spins: number; }[] = [];

  private range!: { min: number; max: number; inclusive: boolean; };
  private readonly spins_sub: Subject<number> = new Subject();

  constructor(
    private mock: MockService,
    private route: ActivatedRoute
  ) {
    this.flip$ = this.spins_sub.pipe(
      switchMap<number, Observable<[number, side]>>(spins => of([
        spins, this.mock.realistic.from([...coin_sides])
      ])),
      mergeMap(([spins, side]) => from([...Array(spins).keys()]).pipe(
        concatMap(spin => of(spin + 1).pipe(delay(400))),
        tap(spin => {
          console.log('flipping...', { side, spin, of: spins});
        }),
        map(spin => {
          this.flipping = spin !== spins;
          side = coin_sides.find(x => x !== side) ?? side;
          return side;
        }),
        tap(side => {
          if (!this.flipping) {
            this.results.push({ dt: new Date(), side, spins });
          }
        })
      ))
    );
  }

  ngAfterViewInit(): void {
    const { min, max, inclusive } = this.route.snapshot.data;
    this.range = { min: min ?? 1, max: max ?? 11, inclusive: inclusive ?? false };
    this.flip();
  }

  flip = () => {
    const { min, max, inclusive } = this.range;
    this.spins_sub.next(this.mock.random.int({ min, max }, inclusive));
  };

  sum = () => {
    const sides = this.results.reduce((sum, cur) => {
      sum.heads += cur.side === 'heads' ? 1 : 0;
      sum.tails += cur.side === 'tails' ? 1 : 0;
      return sum;
    }, { heads: 0, tails: 0 });
    const spins = this.results.reduce((sum, cur) => sum + cur.spins, 0);
    return { ...sides, spins };
  };

  avg = (side: side | 'spins') => {
    const [sum, count] = [this.sum(), this.results.length];
    switch (side) {
      case 'heads':
        return (sum.heads / count) * 100;
      case 'tails':
        return (sum.tails / count) * 100;
      case 'spins':
        return sum.spins / count;
    }
  };
}

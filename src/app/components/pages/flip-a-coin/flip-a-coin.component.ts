import { AfterViewInit, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { from, Observable, of, Subject } from 'rxjs';
import { concatMap, delay, startWith, switchMap, tap } from 'rxjs/operators';
import { MockService } from '../../../services/mock.service';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe, DecimalPipe, DatePipe } from '@angular/common';

const coin_sides = ['heads', 'tails'] as const;
const flip_duration_ms = 400;
const half_flip_duration_ms = flip_duration_ms / 2;
type side = typeof coin_sides[number];
type CoinFlipPhase = 'idle' | 'closing' | 'opening';

interface CoinFlipState {
    side: side;
    phase: CoinFlipPhase;
    flipping: boolean;
}

interface CoinFlipFrame {
    delayMs: number;
    state: CoinFlipState;
}

interface CoinFlipPlan {
    finalSide: side;
    frames: CoinFlipFrame[];
    spins: number;
}

@Component({
    selector: 'app-flip-a-coin',
    templateUrl: './flip-a-coin.component.html',
    styleUrls: ['./flip-a-coin.component.scss'],
    imports: [RouterLink, MatTooltip, AsyncPipe, DecimalPipe, DatePipe]
})
export class FlipACoinComponent implements AfterViewInit {
    private mock = inject(MockService);
    private route = inject(ActivatedRoute);

    protected flipping = false;
    protected readonly coinImages: Record<side, string> = {
        heads: 'assets/img/Quarter Heads.png',
        tails: 'assets/img/Quarter Tails.png'
    };
    protected readonly flip$: Observable<CoinFlipState>;
    protected readonly results: { dt: Date; side: side; spins: number; }[] = [];

    private currentSide: side = this.mock.realistic.from([...coin_sides]);
    private range!: { min: number; max: number; inclusive: boolean; };
    private readonly spins_sub: Subject<number> = new Subject();

    constructor() {
        this.flip$ = this.spins_sub.pipe(
            switchMap(spins => {
                const plan = this.buildFlipPlan(spins);

                return from(plan.frames).pipe(
                    concatMap(frame => of(frame.state).pipe(delay(frame.delayMs))),
                    tap(state => {
                        this.currentSide = state.side;
                        this.flipping = state.flipping;

                        if (!state.flipping) {
                            this.results.push({ dt: new Date(), side: plan.finalSide, spins: plan.spins });
                        }
                    })
                );
            }),
            startWith({
                side: this.currentSide,
                phase: 'idle' as const,
                flipping: false
            })
        );
    }

    private buildFlipPlan(spins: number): CoinFlipPlan {
        const plannedSpins = Math.max(1, Math.trunc(spins));
        const frames: CoinFlipFrame[] = [];
        let side = this.currentSide;

        frames.push({
            delayMs: 0,
            state: { side, phase: 'closing', flipping: true }
        });

        for (const spin of Array.range(1, plannedSpins)) {
            side = this.oppositeSide(side);
            frames.push({
                delayMs: half_flip_duration_ms,
                state: { side, phase: 'opening', flipping: true }
            });

            if (spin < plannedSpins) {
                frames.push({
                    delayMs: half_flip_duration_ms,
                    state: { side, phase: 'closing', flipping: true }
                });
            }
        }

        frames.push({
            delayMs: half_flip_duration_ms,
            state: { side, phase: 'idle', flipping: false }
        });

        return { finalSide: side, frames, spins: plannedSpins };
    }

    private oppositeSide(side: side): side {
        return coin_sides.find(x => x !== side) ?? side;
    }

    ngAfterViewInit(): void {
        const { min, max, inclusive } = this.route.snapshot.data;
        this.range = { min: min ?? 1, max: max ?? 11, inclusive: inclusive ?? false };
        this.flip();
    }

    protected readonly flip = () => {
        const { min, max, inclusive } = this.range;
        this.spins_sub.next(this.mock.random.int({ min, max }, inclusive));
    };

    protected readonly sum = () => {
        const sides = this.results.reduce((sum, cur) => {
            sum.heads += cur.side === 'heads' ? 1 : 0;
            sum.tails += cur.side === 'tails' ? 1 : 0;
            return sum;
        }, { heads: 0, tails: 0 });
        const spins = this.results.reduce((sum, cur) => sum + cur.spins, 0);
        return { ...sides, spins };
    };

    protected readonly avg = (side: side | 'spins') => {
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

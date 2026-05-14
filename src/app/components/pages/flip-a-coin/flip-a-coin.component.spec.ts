import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FlipACoinComponent } from './flip-a-coin.component';

type CoinSide = 'heads' | 'tails';

interface TestCoinFlipState {
    side: CoinSide;
    phase: 'idle' | 'closing' | 'opening';
    flipping: boolean;
}

interface TestCoinFlipPlan {
    finalSide: CoinSide;
    frames: { delayMs: number; state: TestCoinFlipState; }[];
    spins: number;
}

interface TestableFlipACoinComponent {
    buildFlipPlan(spins: number): TestCoinFlipPlan;
    currentSide: CoinSide;
}

describe('FlipACoinComponent', () => {
    const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    let component: FlipACoinComponent;
    let fixture: ComponentFixture<FlipACoinComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlipACoinComponent],
            providers: [provideRouter([])]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FlipACoinComponent);
        component = fixture.componentInstance;
        Object.defineProperty(component, 'coinImages', {
            value: {
                heads: transparentPixel,
                tails: transparentPixel
            }
        });
    });

    it('should create', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('plans the final side from the selected spin count', () => {
        const testable = component as unknown as TestableFlipACoinComponent;
        testable.currentSide = 'heads';

        expect(testable.buildFlipPlan(2).finalSide).toBe('heads');
        expect(testable.buildFlipPlan(3).finalSide).toBe('tails');
    });

    it('plans each spin as an edge-on image swap', () => {
        const testable = component as unknown as TestableFlipACoinComponent;
        testable.currentSide = 'heads';

        const plan = testable.buildFlipPlan(3);

        expect(plan.spins).toBe(3);
        expect(plan.frames.map(frame => frame.state)).toEqual([
            { side: 'heads', phase: 'closing', flipping: true },
            { side: 'tails', phase: 'opening', flipping: true },
            { side: 'tails', phase: 'closing', flipping: true },
            { side: 'heads', phase: 'opening', flipping: true },
            { side: 'heads', phase: 'closing', flipping: true },
            { side: 'tails', phase: 'opening', flipping: true },
            { side: 'tails', phase: 'idle', flipping: false }
        ]);
    });
});

import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { concatMap, delay, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import {
    DEFAULT_PI_FORMULA,
    PI_FORMULA_OPTIONS,
    PiFormula,
    PiFormulaOption,
    PiProgress,
    PiService
} from '../../../services/pi.service';

const MIN_PRECISION = 8;
const DEFAULT_PRECISION = 900;
const INITIAL_CALCULATION_DELAY_MS = 320;

interface PiCalculationRequest {
    precision: number;
    formula: PiFormula;
}

@Component({
    selector: 'app-pi',
    templateUrl: './pi.component.html',
    styleUrls: ['./pi.component.scss'],
    imports: [RouterLink, AsyncPipe, DecimalPipe, MatFormFieldModule, MatSelectModule]
})
export class PiComponent implements OnInit {
    private readonly pi = inject(PiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly calculationSub = new Subject<PiCalculationRequest>();
    private readonly progressSub = new BehaviorSubject<PiProgress | null>(null);
    private committedPrecision = 0;
    private committedFormula: PiFormula = DEFAULT_PI_FORMULA;
    private initialCalculationTimer?: ReturnType<typeof setTimeout>;
    private renderedPrecision = 0;

    protected readonly formulaOptions = PI_FORMULA_OPTIONS;
    protected readonly minPrecision = MIN_PRECISION;
    protected selectedFormula: PiFormula = DEFAULT_PI_FORMULA;
    protected maxPrecision = this.selectedFormulaOption().maxPrecision;
    protected precision = DEFAULT_PRECISION;
    protected calculationPending = true;
    protected readonly progress: Observable<PiProgress | null> = this.progressSub.asObservable();

    constructor() {
        this.pi.progress().pipe(
            concatMap(progress => of(progress).pipe(delay(this.progressDelayMs(progress)))),
            filter(progress => progress.len === this.committedPrecision && progress.formula === this.committedFormula),
            takeUntilDestroyed()
        )
            .subscribe(progress => {
                this.renderedPrecision = progress.len;
                this.calculationPending = false;
                this.progressSub.next(progress);
            });

        this.calculationSub.pipe(
            distinctUntilChanged((previous, current) =>
                previous.precision === current.precision && previous.formula === current.formula),
            switchMap(request => this.pi.calculate(request.precision, undefined, undefined, request.formula)),
            takeUntilDestroyed()
        )
            .subscribe();

        this.destroyRef.onDestroy(() => {
            if (this.initialCalculationTimer) {
                clearTimeout(this.initialCalculationTimer);
            }
        });
    }

    ngOnInit(): void {
        this.initialCalculationTimer = setTimeout(() => {
            this.initialCalculationTimer = undefined;
            this.commitPrecision();
        }, INITIAL_CALCULATION_DELAY_MS);
    }

    protected readonly updatePrecision = (value: string | number): void => {
        const precision = this.clampPrecision(Number(value));

        if (precision === this.precision) {
            return;
        }

        this.precision = precision;
        this.calculationPending = true;
    };

    protected readonly updateFormula = (value: string): void => {
        if (!this.isPiFormula(value) || value === this.selectedFormula) {
            return;
        }

        this.selectedFormula = value;
        this.maxPrecision = this.selectedFormulaOption().maxPrecision;
        this.precision = this.clampPrecision(this.precision);
        this.calculationPending = true;
        this.commitPrecision();
    };

    protected readonly commitPrecision = (value?: string | number): void => {
        if (value != null) {
            this.precision = this.clampPrecision(Number(value));
        }

        if (this.precision === this.committedPrecision && this.selectedFormula === this.committedFormula) {
            this.calculationPending = this.renderedPrecision !== this.committedPrecision;
            return;
        }

        this.committedPrecision = this.precision;
        this.committedFormula = this.selectedFormula;
        this.calculationPending = true;
        this.progressSub.next(null);
        this.calculationSub.next({
            precision: this.precision,
            formula: this.selectedFormula
        });
    };

    protected readonly progressPercent = (progress: PiProgress): number =>
        Math.min(100, Math.round((progress.content.len / progress.len) * 100));

    protected selectedFormulaLabel(): string {
        return this.selectedFormulaOption().label;
    }

    protected selectedFormulaDescription(): string {
        return this.selectedFormulaOption().description;
    }

    protected selectedFormulaExpression(): string {
        return this.selectedFormulaOption().expression;
    }

    protected selectedFormulaPostExpressionText(): string | undefined {
        return this.selectedFormulaOption().postExpressionText;
    }

    protected readonly superlative = (): string => {
        if (this.precision >= 1500) {
            return 'impressive';
        }

        if (this.precision >= DEFAULT_PRECISION) {
            return 'generous';
        }

        return 'compact';
    };

    private selectedFormulaOption(): PiFormulaOption {
        const selected = this.formulaOptions.find(option => option.value === this.selectedFormula);

        if (selected) {
            return selected;
        }

        const fallback = this.formulaOptions.find(option => option.value === DEFAULT_PI_FORMULA);

        if (fallback) {
            return fallback;
        }

        throw new Error('Missing default Pi formula option.');
    }

    private clampPrecision(value: number): number {
        if (Number.isNaN(value)) {
            return DEFAULT_PRECISION;
        }

        return Math.min(this.maxPrecision, Math.max(MIN_PRECISION, Math.trunc(value)));
    }

    private progressDelayMs(progress: PiProgress): number {
        if (progress.len <= 120) {
            return 20;
        }

        if (progress.len <= DEFAULT_PRECISION) {
            return 4;
        }

        return 1;
    }

    private isPiFormula(value: string): value is PiFormula {
        return this.formulaOptions.some(option => option.value === value);
    }
}

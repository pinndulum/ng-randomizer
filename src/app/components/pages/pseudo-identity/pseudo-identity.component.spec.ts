import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PseudoIdentityComponent } from './pseudo-identity.component';
import { Gender, MockService, PseudoIdentity } from '../../../services/mock.service';

type IdentityGenerationMode = 'random' | 'male' | 'female';

interface TestablePseudoIdentityComponent {
    identityActionMenuOpen: boolean;
    selectedIdentityMode: IdentityGenerationMode;
    closeIdentityActionMenu(): void;
    load(ident?: PseudoIdentity): void;
    orderedIdentityGenerationActions(): readonly { label: string; mode: IdentityGenerationMode; }[];
    recycle(ident: PseudoIdentity, key: string): void;
    selectIdentityMode(mode: IdentityGenerationMode, event: MouseEvent): void;
    selectedIdentityActionLabel(): string;
    toggleIdentityActionMenu(event: MouseEvent): void;
}

describe('PseudoIdentityComponent', () => {
    let component: PseudoIdentityComponent;
    let fixture: ComponentFixture<PseudoIdentityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClipboardModule, PseudoIdentityComponent],
            providers: [provideRouter([])]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PseudoIdentityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changes the primary identity action label when an option is selected', () => {
        const testable = component as unknown as TestablePseudoIdentityComponent;

        expect(testable.selectedIdentityActionLabel()).toBe('New Random Identity');

        testable.selectIdentityMode('female', new MouseEvent('click'));

        expect(testable.selectedIdentityActionLabel()).toBe('New Female Identity');
        expect(testable.identityActionMenuOpen).toBeFalse();
    });

    it('orders the current identity action first', () => {
        const testable = component as unknown as TestablePseudoIdentityComponent;

        testable.selectedIdentityMode = 'male';

        expect(testable.orderedIdentityGenerationActions().map(action => action.label)).toEqual([
            'New Male Identity',
            'New Random Identity',
            'New Female Identity'
        ]);
    });

    it('runs the male identity action when the male option is selected', () => {
        const mock = TestBed.inject(MockService);
        const identitySpy = spyOn(mock.realistic, 'identity').and.callThrough();
        const testable = component as unknown as TestablePseudoIdentityComponent;

        testable.selectIdentityMode('male', new MouseEvent('click'));

        expect(identitySpy).toHaveBeenCalledTimes(1);
        expect(identitySpy).toHaveBeenCalledWith(Gender.Male);
    });

    it('runs the female identity action when the female option is selected', () => {
        const mock = TestBed.inject(MockService);
        const identitySpy = spyOn(mock.realistic, 'identity').and.callThrough();
        const testable = component as unknown as TestablePseudoIdentityComponent;

        testable.selectIdentityMode('female', new MouseEvent('click'));

        expect(identitySpy).toHaveBeenCalledTimes(1);
        expect(identitySpy).toHaveBeenCalledWith(Gender.Female);
    });

    it('keeps random identity generation gender-neutral by default', () => {
        const mock = TestBed.inject(MockService);
        const identitySpy = spyOn(mock.realistic, 'identity').and.callThrough();
        const testable = component as unknown as TestablePseudoIdentityComponent;

        testable.load();

        expect(identitySpy).toHaveBeenCalledWith();
    });

    it('returns to random identity mode when gender is recycled', () => {
        const testable = component as unknown as TestablePseudoIdentityComponent;
        const ident = TestBed.inject(MockService).realistic.identity(Gender.Female);

        testable.selectedIdentityMode = 'female';
        testable.recycle(ident, 'gender');

        expect(testable.selectedIdentityActionLabel()).toBe('New Random Identity');
        expect(testable.selectedIdentityMode).toBe('random');
    });
});

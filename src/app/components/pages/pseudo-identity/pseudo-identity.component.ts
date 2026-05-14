import { AsyncPipe, JsonPipe, NgTemplateOutlet } from '@angular/common';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Gender, MockService, NameComponents, PseudoIdentity } from '../../../services/mock.service';
import dates from '../../../utils/dates';

type PseudoIdentityTab = 'details' | 'contact' | 'secret';
type IdentityGenerationMode = 'random' | 'male' | 'female';
type IdentityRecycleKey =
    | 'id'
    | 'created'
    | 'gender'
    | 'name.first'
    | 'name.middle'
    | 'name.last'
    | 'bio'
    | 'company'
    | 'phone'
    | 'email'
    | 'address.street'
    | 'address.city'
    | 'address.state'
    | 'address.zip'
    | 'address.tz'
    | 'pwd'
    | 'ssn'
    | 'cc.card'
    | 'cc.exp'
    | 'cc.cvv';
type IdentityFieldValue = Date | number | string | undefined;

interface IdentityGenerationAction {
    label: string;
    mode: IdentityGenerationMode;
}

interface IdentityField {
    id: string;
    label: string;
    key: IdentityRecycleKey;
}

@Component({
    selector: 'app-pseudo-identity',
    templateUrl: './pseudo-identity.component.html',
    styleUrls: ['./pseudo-identity.component.scss'],
    imports: [RouterLink, CdkCopyToClipboard, AsyncPipe, JsonPipe, NgTemplateOutlet]
})
export class PseudoIdentityComponent {
    private mock = inject(MockService);

    protected loading = false;
    protected activeTab: PseudoIdentityTab = 'details';
    protected identityActionMenuOpen = false;
    protected selectedIdentityMode: IdentityGenerationMode = 'random';
    protected readonly identityGenerationActions: readonly IdentityGenerationAction[] = [{
        label: 'New Random Identity',
        mode: 'random'
    }, {
        label: 'New Male Identity',
        mode: 'male'
    }, {
        label: 'New Female Identity',
        mode: 'female'
    }];
    protected readonly nameFields: readonly IdentityField[] = [
        { id: 'ident_name_first', label: 'First', key: 'name.first' },
        { id: 'ident_name_middle', label: 'Middle', key: 'name.middle' },
        { id: 'ident_name_last', label: 'Last', key: 'name.last' }
    ];
    protected readonly detailFields: readonly IdentityField[] = [
        { id: 'ident_id', label: 'ID', key: 'id' },
        { id: 'ident_created', label: 'Created', key: 'created' },
        { id: 'ident_gender', label: 'Gender', key: 'gender' }
    ];
    protected readonly postBioDetailFields: readonly IdentityField[] = [
        { id: 'ident_company', label: 'Company', key: 'company' }
    ];
    protected readonly contactFields: readonly IdentityField[] = [
        { id: 'ident_phone', label: 'Phone', key: 'phone' },
        { id: 'ident_email', label: 'Email', key: 'email' },
        { id: 'ident_address_street', label: 'Address', key: 'address.street' },
        { id: 'ident_address_city', label: 'City', key: 'address.city' },
        { id: 'ident_address_state', label: 'State', key: 'address.state' },
        { id: 'ident_address_zip', label: 'Zip', key: 'address.zip' },
        { id: 'ident_address_tz', label: 'Timezone', key: 'address.tz' }
    ];
    protected readonly secretFields: readonly IdentityField[] = [
        { id: 'ident_ssn', label: 'SSN', key: 'ssn' },
        { id: 'ident_cc_card', label: 'Card #', key: 'cc.card' },
        { id: 'ident_cc_exp', label: 'Exp Date', key: 'cc.exp' },
        { id: 'ident_cc_cvv', label: 'CVV Code', key: 'cc.cvv' }
    ];
    protected readonly ident$: Observable<PseudoIdentity>;

    private readonly ident: BehaviorSubject<PseudoIdentity>;

    constructor() {
        this.ident = new BehaviorSubject(this.mock.realistic.identity());
        this.ident$ = this.ident.pipe(
            tap(() => { this.loading = false; }),
        );
    }

    @HostListener('document:click')
    protected closeIdentityActionMenu(): void {
        this.identityActionMenuOpen = false;
    }

    protected selectedIdentityActionLabel(): string {
        return this.identityGenerationActions
            .find(action => action.mode === this.selectedIdentityMode)?.label ?? 'New Random Identity';
    }

    protected orderedIdentityGenerationActions(): readonly IdentityGenerationAction[] {
        const current = this.identityGenerationActions
            .find(action => action.mode === this.selectedIdentityMode) ?? this.identityGenerationActions[0];
        return [
            current,
            ...this.identityGenerationActions.filter(action => action.mode !== current.mode)
        ];
    }

    protected toggleIdentityActionMenu(event: MouseEvent): void {
        event.stopPropagation();
        this.identityActionMenuOpen = !this.identityActionMenuOpen;
    }

    protected selectIdentityMode(mode: IdentityGenerationMode, event: MouseEvent): void {
        event.stopPropagation();
        this.selectedIdentityMode = mode;
        this.load();
    }

    protected identityFieldValue(ident: PseudoIdentity, key: IdentityRecycleKey): IdentityFieldValue {
        switch (key) {
            case 'id':
                return ident.id;
            case 'created':
                return ident.created;
            case 'gender':
                return ident.gender;
            case 'name.first':
                return ident.name.first;
            case 'name.middle':
                return ident.name.middle;
            case 'name.last':
                return ident.name.last;
            case 'bio':
                return ident.bio;
            case 'company':
                return ident.company;
            case 'phone':
                return ident.phone;
            case 'email':
                return ident.email;
            case 'address.street':
                return ident.address.street;
            case 'address.city':
                return ident.address.city;
            case 'address.state':
                return ident.address.state;
            case 'address.zip':
                return ident.address.zip;
            case 'address.tz':
                return ident.address.tz;
            case 'pwd':
                return ident.pwd;
            case 'ssn':
                return ident.ssn;
            case 'cc.card':
                return ident.cc.card;
            case 'cc.exp':
                return `${ident.cc.month.toString().padStart(2, '0')}/${ident.cc.year}`;
            case 'cc.cvv':
                return ident.cc.cvv;
        }
    }

    protected readonly load = (ident?: PseudoIdentity) => {
        this.loading = true;
        this.identityActionMenuOpen = false;
        this.ident.next(ident ?? this.createIdentity());
    };

    protected readonly recycle = (ident: PseudoIdentity, key: IdentityRecycleKey) => {
        let gender = Gender[ident.gender as keyof typeof Gender];
        let state = ident.address.state;
        switch (key) {
            case 'id':
                ident.id = this.mock.random.guid();
                break;
            case 'created':
                ident.created = this.mock.random.date(undefined, dates.addDays(dates.now(), -20));
                break;
            case 'gender':
                if (this.selectedIdentityMode !== 'random') {
                    this.selectedIdentityMode = 'random';
                }
                gender = this.mock.realistic.names.gender();
                ident.gender = Gender[gender];
                ident.name = this.mock.realistic.names.name(NameComponents.Full, gender);
                break;
            case 'name.first':
                ident.name.first = this.mock.realistic.names.firstname(gender, ident.name.first ?? '');
                break;
            case 'name.middle':
                ident.name.middle = this.mock.realistic.names.middlename(gender, ident.name.middle ?? '');
                break;
            case 'name.last':
                ident.name.last = this.mock.realistic.names.lastname(ident.name.last ?? '');
                break;
            case 'bio': {
                let bio = ident.bio;
                while (bio === ident.bio) {
                    bio = this.mock.realistic.typeset();
                }
                ident.bio = bio;
                break;
            }
            case 'company':
                ident.company = this.mock.realistic.company();
                break;
            case 'phone':
                ident.phone = this.mock.realistic.phonenum(state);
                break;
            case 'email':
                ident.email = this.mock.realistic.email_address();
                break;
            case 'address.street':
                ident.address.street = this.mock.realistic.street();
                break;
            case 'address.city':
                ident.address.city = this.mock.realistic.city();
                break;
            case 'address.state':
                state = this.mock.realistic.state();
                ident.address.state = state;
                ident.address.zip = this.mock.realistic.postal_code(state);
                ident.address.tz = this.mock.realistic.timezone(state);
                ident.phone = this.mock.realistic.phonenum(state);
                break;
            case 'address.zip':
                ident.address.zip = this.mock.realistic.postal_code(state);
                break;
            case 'address.tz':
                ident.address.tz = this.mock.realistic.timezone(state);
                break;
            case 'pwd':
                ident.pwd = this.mock.random.string(12, 'mixed');
                break;
            case 'ssn':
                ident.ssn = this.mock.realistic.ssn();
                break;
            case 'cc.card':
                ident.cc = this.mock.realistic.credit_card();
                break;
            case 'cc.exp': {
                const year = dates.current.year();
                ident.cc.month = this.mock.random.int({ min: 1, max: 12 }, true);
                ident.cc.year = this.mock.random.int({ min: year + 1, max: year + 11 });
                break;
            }
            case 'cc.cvv': {
                const ccdgt = ident.cc.card[0];
                ident.cc.cvv = this.mock.random.numeric(ccdgt === '3' ? 4 : 3);
                break;
            }
        }
        this.load({ ...ident });
    };

    private createIdentity(): PseudoIdentity {
        switch (this.selectedIdentityMode) {
            case 'male':
                return this.mock.realistic.identity(Gender.Male);
            case 'female':
                return this.mock.realistic.identity(Gender.Female);
            case 'random':
                return this.mock.realistic.identity();
        }
    }
}

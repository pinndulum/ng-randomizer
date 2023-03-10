import { AfterViewInit, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Gender, MockService, NameComponents } from 'src/app/services/mock.service';
import dates from 'src/app/utils/dates';

@Component({
  selector: 'app-pseudo-identity',
  templateUrl: './pseudo-identity.component.html',
  styleUrls: ['./pseudo-identity.component.scss']
})
export class PseudoIdentityComponent implements AfterViewInit {

  public loading = false;
  public readonly ident$: Observable<any>;

  private readonly ident: Subject<any> = new Subject();

  constructor(private mock: MockService) {
    this.ident$ = this.ident.pipe(
      tap(() => { this.loading = false; }),
    );
  }

  ngAfterViewInit(): void {
    this.load();
  }

  load = (ident?: any) => {
    this.loading = true;
    this.ident.next(ident ?? this.mock.realistic.identity());
  };

  recycle = (ident: any, key: string) => {
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
        gender = this.mock.realistic.names.gender();
        ident.gender = Gender[gender];
        ident.name = this.mock.realistic.names.name(NameComponents.Full, gender);
        break
      case 'name.first':
        ident.name.first = this.mock.realistic.names.firstname(gender, ident.name.first);
        break;
      case 'name.middle':
        ident.name.middle = this.mock.realistic.names.middlename(gender, ident.name.middle);
        break;
      case 'name.last':
        ident.name.last = this.mock.realistic.names.lastname(ident.name.last);
        break;
      case 'bio':
        let bio = ident.bio;
        while (bio === ident.bio) {
          bio = this.mock.realistic.typeset();
        }
        ident.bio = bio;
        break;
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
      case 'cc.exp':
        const today = dates.current();
        ident.cc.month = this.mock.random.int({min: 1, max: 12}, true);
        ident.cc.year = this.mock.random.int({ min: today.year + 1, max: today.year + 11 });
        break;
      case 'cc.cvv':
        const ccdgt = ident.cc.card[0];
        ident.cc.cvv = this.mock.random.numeric(ccdgt === '3' ? 4 : 3);
        break;
    }
    this.load({ ...ident });
  };
}

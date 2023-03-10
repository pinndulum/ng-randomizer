import { Injectable } from '@angular/core';
import mock from '@joxnathan/mock-randomizer';
import { Gender, Name, NameComponents } from '@joxnathan/mock-randomizer/dist/lib/name.generator';
import { NumericRange } from '@joxnathan/mock-randomizer/dist/lib/numeric.range';
import { ndx_sig_of } from '../interfaces/index-signature-of-t.interface';
import dates from '../utils/dates';

export { Gender, Name, NameComponents, NumericRange };

@Injectable({ providedIn: 'root' })
export class MockService {

  complex = {
    list: <T>(template: T | ndx_sig_of<unknown>, range?: NumericRange, inner?: ndx_sig_of<NumericRange>) =>
      mock.filledList<T>(template, range, inner),
    object: <T>(template: T | ndx_sig_of<unknown>, opts?: ndx_sig_of<any>) =>
      mock.filledObject<T>(template, opts)
  };

  random = {
    guid: () => mock.guid.newGuid(),
    bool: () => mock.random.nextBool(),
    int: (range?: NumericRange, inclusive?: boolean) => mock.random.nextInt(range, inclusive),
    decimal: (range?: NumericRange) => mock.random.nextDec(range),
    date: (start?: Date, end?: Date) => mock.random.nextDate(start, end),
    numeric: (size?: number, format?: string) => mock.random.nextNumericString(size, format),
    string: (size?: number, cased?: 'upper' | 'lower' | 'mixed', format?: string) => mock.random.nextString(size, cased, format),
  };

  realistic = {
    from: <T>(from: T[], except?: T[]) => mock.realistic.nextItem<T>(from, except),

    names: {
      gender: () => this.realistic.from([Gender.Female, Gender.Male]),
      book_title: (...ignore: string[]) => mock.names.nextTitle(...ignore),
      firstname: (gender?: Gender, ...ignore: string[]) => mock.names.nextFirstName(gender, ...ignore),
      middlename: (gender?: Gender, ...ignore: string[]) => mock.names.nextMiddleName(gender, ...ignore),
      lastname: (...ignore: string[]) => mock.names.nextLastName(undefined, ...ignore),
      fullname: (gender?: Gender, ...ignore: string[]) => mock.names.nextFullName(gender, ...ignore),
      name: (component: NameComponents, gender?: Gender, ...ignore: string[]) => mock.names.nextName(component, gender, ...ignore)
    },

    city: () => mock.realistic.nextCity(),
    street: (format?: 'full' | 'abbrev') => mock.realistic.nextStreet(format),
    state: (format?: 'full' | 'abbrev') => mock.realistic.nextUSState(format),
    postal_code: (state?: string, format?: 'standard' | 'plusfour') => mock.realistic.nextUSPostCode(state, format),
    timezone: (state?: string, format?: 'full' | 'name' | 'abbrev') => mock.realistic.nextUsTimeZone(state, format),
    phone: (state?: string) => mock.realistic.nextUSPhone(state),
    phonenum: (state?: string) => mock.realistic.nextUSPhoneString(state),
    email: (local?: string, domain?: string, tld?: string) => mock.realistic.nextEmail(local, domain, tld),
    email_address: () => mock.realistic.nextEmailString(),
    company: () => mock.realistic.nextCompanyName(),
    typeset: () => mock.realistic.nextTypeSet(),
    nouns: (range?: NumericRange) => mock.realistic.nextNouns(range),
    version: (build?: boolean, patch?: boolean) => mock.realistic.nextVersion(build, patch),

    ssn: () => {
      const { area, grp, serial } = {
        area: `${this.random.int({ min: 1, max: 1000 })}`.padStart(3, '0'),
        grp: `${this.random.int({ min: 1, max: 99 })}`.padStart(2, '0'),
        serial: `${this.random.int({ min: 1, max: 10000 })}`.padStart(4, '0')
      };
      return `${area}-${grp}-${serial}`;
    },
    credit_card: () => {
      const today = dates.current();
      const ccdgt = this.random.int({ min: 3, max: 6 }, true);
      const ccfmt = ccdgt === 3 ? 'xxx-xxxxxx-xxxxx' : 'xxx-xxxx-xxxx-xxxx';
      return this.complex.object({
        card: `luhn:${ccfmt.replace('-', '').length}:${ccdgt}${ccfmt}`,
        month: 'number:1:12:true',
        year: `number:${today.year + 1}:${today.year + 11}`,
        cvv: `numstring:${ccdgt === 3 ? 4 : 3}`
      });
    },
    identity: (gender?: Gender) => {
      gender = gender ?? this.realistic.names.gender();
      const state = this.realistic.state();
      return {
        id: this.random.guid(),
        created: this.random.date(undefined, dates.addDays(dates.now(), -20)),
        gender: Gender[gender],
        name: this.realistic.names.name(NameComponents.Full, gender),
        ssn: this.realistic.ssn(),
        cc: this.realistic.credit_card(),
        phone: this.realistic.phonenum(state),
        email: this.realistic.email_address(),
        bio: this.realistic.typeset(),
        address: {
          street: this.realistic.street(),
          city: this.realistic.city(),
          state,
          zip: this.realistic.postal_code(state),
          tz: this.realistic.timezone(state)
        },
        company: this.realistic.company(),
        pwd: this.random.string(12, 'mixed')
      };
    }
  };
}

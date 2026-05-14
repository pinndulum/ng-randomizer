import { Injectable } from '@angular/core';
import { filledList, filledObject } from '@joxnathan/mock-randomizer/lib/filler';
import type { FillListOptions, FillOptions } from '@joxnathan/mock-randomizer/lib/filler';
import { Guid as guid } from '@joxnathan/mock-randomizer/lib/guid';
import { NameGenerator as names } from '@joxnathan/mock-randomizer/lib/name.generator';
import { Random as random } from '@joxnathan/mock-randomizer/lib/random';
import { Realistic as realistic } from '@joxnathan/mock-randomizer/lib/realistic';
import { Gender, Name, NameComponents } from '@joxnathan/mock-randomizer/lib/name.generator';
import { NumericRange } from '@joxnathan/mock-randomizer/lib/numeric.range';
import clock, { type ClockInput } from '@joxnathan/mock-randomizer/lib/utils/date.util';
import { ndx_sig_of } from '../interfaces/index-signature-of-t.interface';
import dates from '../utils/dates';

export { Gender, Name, NameComponents, NumericRange };
export type { ClockInput };

export interface CreditCardIdentity {
  card: string;
  month: number;
  year: number;
  cvv: string;
}

export interface IdentityAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  tz: string;
}

export interface PseudoIdentity {
  id: string;
  created: Date;
  gender: string;
  name: Name;
  ssn: string;
  cc: CreditCardIdentity;
  phone: string;
  email: string;
  bio: string;
  address: IdentityAddress;
  company: string;
  pwd: string;
  show_pwd?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MockService {

  complex = {
    list: <T>(template: T | ndx_sig_of<unknown>, opts?: FillListOptions | NumericRange, inner?: ndx_sig_of<NumericRange>) =>
      filledList<T>(template, this.toListOptions(opts, inner)),
    object: <T>(template: T | ndx_sig_of<unknown>, opts?: FillOptions) =>
      filledObject<T>(template, opts)
  };

  random = {
    guid: () => guid.newGuid(),
    bool: () => random.nextBool(),
    int: (range?: NumericRange, inclusive?: boolean) => random.nextInt(range, inclusive),
    decimal: (range?: NumericRange) => random.nextDec(range),
    date: (start?: Date, end?: Date) => random.nextDate(start, end),
    numeric: (size?: number, format?: string) => random.nextNumericString(size, format),
    string: (size?: number, cased?: 'upper' | 'lower' | 'mixed', format?: string) => random.nextString(size, cased, format),
    withSeed: <T>(seed: string | number, fn: () => T) => random.withSeed(seed, fn)
  };

  clock = {
    withClock: <T>(value: ClockInput, fn: () => T) => clock.withClock(value, fn)
  };

  realistic = {
    from: <T>(from: T[], except?: T[]) => realistic.nextItem<T>(from, except),

    names: {
      gender: () => this.realistic.from([Gender.Female, Gender.Male]),
      book_title: (...ignore: string[]) => names.nextTitle(...ignore),
      firstname: (gender?: Gender, ...ignore: string[]) => names.nextFirstName(gender, ...ignore),
      middlename: (gender?: Gender, ...ignore: string[]) => names.nextMiddleName(gender, ...ignore),
      lastname: (...ignore: string[]) => names.nextLastName(...ignore),
      fullname: (gender?: Gender, ...ignore: string[]) => names.nextFullName(gender, ...ignore),
      name: (component: NameComponents, gender?: Gender, ...ignore: string[]) => names.nextName(component, gender, ...ignore)
    },

    city: () => realistic.nextCity(),
    street: (format?: 'full' | 'abbrev') => realistic.nextStreet(format),
    state: (format?: 'full' | 'abbrev') => realistic.nextUSState(format),
    postal_code: (state?: string, format?: 'standard' | 'plusfour') => realistic.nextUSPostCode(state, format),
    timezone: (state?: string, format?: 'full' | 'name' | 'abbrev') => realistic.nextUsTimeZone(state, format),
    phone: (state?: string) => realistic.nextUSPhone(state),
    phonenum: (state?: string) => realistic.nextUSPhoneString(state),
    email: (local?: string, domain?: string, tld?: string) => realistic.nextEmail(local, domain, tld),
    email_address: () => realistic.nextEmailString(),
    company: () => realistic.nextCompanyName(),
    typeset: () => realistic.nextTypeSet(),
    nouns: (range?: NumericRange) => realistic.nextNouns(range),
    version: (build?: boolean, patch?: boolean) => realistic.nextVersion(build, patch),

    ssn: () => {
      const { area, grp, serial } = {
        area: `${this.random.int({ min: 1, max: 1000 })}`.padStart(3, '0'),
        grp: `${this.random.int({ min: 1, max: 99 })}`.padStart(2, '0'),
        serial: `${this.random.int({ min: 1, max: 10000 })}`.padStart(4, '0')
      };
      return `${area}-${grp}-${serial}`;
    },
    credit_card: (): CreditCardIdentity => {
      const year = dates.current.year();
      const ccdgt = this.random.int({ min: 3, max: 6 }, true);
      const ccfmt = ccdgt === 3 ? 'xxx-xxxxxx-xxxx' : 'xxx-xxxx-xxxx-xxx';
      const luhnlen = ccfmt.replace(/-/g, '').length + 1;
      return this.complex.object<CreditCardIdentity>({
        card: { $mock: 'luhn', length: luhnlen, format: `${ccdgt}${ccfmt}` },
        month: { $mock: 'number', min: 1, max: 12, inclusive: true },
        year: { $mock: 'number', min: year + 1, max: year + 11 },
        cvv: { $mock: 'numstring', length: ccdgt === 3 ? 4 : 3 }
      });
    },
    identity: (gender?: Gender): PseudoIdentity => {
      gender ??= this.realistic.names.gender();
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

  private toListOptions(opts?: FillListOptions | NumericRange, inner?: ndx_sig_of<NumericRange>): FillListOptions | undefined {
    if (!opts && !inner) {
      return undefined;
    }

    if (this.isFillListOptions(opts)) {
      return {
        ...opts,
        ...inner
      };
    }

    return {
      range: opts,
      ...inner
    };
  }

  private isFillListOptions(opts?: FillListOptions | NumericRange): opts is FillListOptions {
    return !!opts && (
      'range' in opts ||
      'seed' in opts ||
      'allowLegacyDsl' in opts ||
      '$version' in opts
    );
  }
}

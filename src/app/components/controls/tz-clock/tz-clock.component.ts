import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, input, signal } from '@angular/core';
import dates from '@app/utils/dates';

export interface TZAbbrev {
  name: string;
  offset?: number;
}

export interface TZItem {
  title: string;
  abbrevs: {
    standard: TZAbbrev;
    daylight?: TZAbbrev;
  };
  location?: string;
  offset?: string;
}

export const tzGMT: TZItem = {
  title: 'GMT',
  location: 'Europe/Africa/North America/Antarctica',
  abbrevs: {
    standard: { name: 'GMT', offset: +0 }
  }
};

const HOURS_TO_MS = 60 * 60 * 1000;
const NORTH_AMERICA_LOCATION = 'North America';

const nthSundayOfMonth = (year: number, monthIndex: number, nth: number): number => {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const firstSunday = 1 + ((7 - firstDay) % 7);
  return firstSunday + ((nth - 1) * 7);
};

const isNorthAmericanDaylightSavingTime = (dt: Date, standardOffset: number): boolean => {
  const localDt = new Date(dt.getTime() + (standardOffset * HOURS_TO_MS));
  const monthIndex = localDt.getUTCMonth();

  if (monthIndex < 2 || monthIndex > 10) {
    return false;
  }

  if (monthIndex > 2 && monthIndex < 10) {
    return true;
  }

  const year = localDt.getUTCFullYear();
  const day = localDt.getUTCDate();

  if (monthIndex === 2) {
    return day >= nthSundayOfMonth(year, 2, 2);
  }

  return day < nthSundayOfMonth(year, 10, 1);
};

const offsetToTimeZone = (offset: number): string => {
  const sign = offset < 0 ? '-' : '+';
  const absoluteMinutes = Math.round(Math.abs(offset) * 60);
  const hours = Math.trunc(absoluteMinutes / 60).toString().padStart(2, '0');
  const minutes = (absoluteMinutes % 60).toString().padStart(2, '0');
  return `${sign}${hours}${minutes}`;
};

@Component({
    selector: 'app-tz-clock',
    templateUrl: './tz-clock.component.html',
    styleUrls: ['./tz-clock.component.scss'],
    imports: [DatePipe]
})
export class TzClockComponent implements OnInit, OnDestroy {

  public readonly zone = input<TZItem>(tzGMT);

  public readonly dt = signal(dates.now());

  private destroyed = false;
  private timer?: ReturnType<typeof setTimeout>;

  public get isDST (): boolean {
    const zone = this.zone();
    const standardOffset = zone.abbrevs.standard.offset;
    return Boolean(
      zone.abbrevs.daylight &&
      standardOffset != null &&
      zone.location?.includes(NORTH_AMERICA_LOCATION) &&
      isNorthAmericanDaylightSavingTime(this.dt(), standardOffset)
    );
  }

  public get tz (): TZAbbrev {
    const zone = this.zone();
    const daylight = zone.abbrevs.daylight;
    return this.isDST && daylight ? daylight : zone.abbrevs.standard;
  }

  public get tzOffset (): string {
    return offsetToTimeZone(this.tz.offset ?? 0);
  }

  ngOnInit (): void {
    this.tick();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  private tick = () => {
    if (this.destroyed) {
      return;
    }

    const ms = dates.now().getMilliseconds();
    this.timer = setTimeout(this.tick, 1000 - ms);
    this.dt.set(dates.now());
  };
}

import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import dates from 'src/app/utils/dates';

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

@Component({
  selector: 'app-tz-clock',
  templateUrl: './tz-clock.component.html',
  styleUrls: ['./tz-clock.component.scss']
})
export class TzClockComponent implements OnInit {

  @Input()
  public zone: TZItem = tzGMT;

  public dt: Date = dates.now();


  public get isDST () {
    return this.zone.abbrevs.daylight && moment(this.dt).isDST();
  }

  public get tz () {
    return this.isDST ? this.zone.abbrevs.daylight : this.zone.abbrevs.standard;
  }

  ngOnInit (): void {
    this.tick();
  }

  private tick = () => {
    const ms = dates.now().getMilliseconds();
    setTimeout(this.tick, 1000 - ms);
    this.dt = dates.now();
  };
}

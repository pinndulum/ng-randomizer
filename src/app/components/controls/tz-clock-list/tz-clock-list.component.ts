import { Component, Input, OnInit } from '@angular/core';
import { tzGMT, TZItem } from '../tz-clock/tz-clock.component';

@Component({
  selector: 'app-tz-clock-list',
  templateUrl: './tz-clock-list.component.html',
  styleUrls: ['./tz-clock-list.component.scss']
})
export class TzClockListComponent implements OnInit {
  @Input()
  public items: TZItem[] = [{
    title: 'Pacific',
    location: 'North America',
    abbrevs: {
      standard: {
        name: 'PST', offset: -8
      },
      daylight: {
        name: 'PDT', offset: -7
      }
    },
  }, {
    title: 'Mountain',
    location: 'North America',
    abbrevs: {
      standard: {
        name: 'MST', offset: -7
      },
      daylight: {
        name: 'MDT', offset: -6
      }
    }
  }, {
    title: 'Central',
    location: 'North America',
    abbrevs: {
      standard: {
        name: 'CST', offset: -6
      },
      daylight: {
        name: 'CDT', offset: -5
      }
    }
  }, {
    title: 'Eastern',
    location: 'North America',
    abbrevs: {
      standard: {
        name: 'EST', offset: -5
      },
      daylight: {
        name: 'EDT', offset: -4
      }
    }
  }, tzGMT];

  ngOnInit (): void {
  }
}

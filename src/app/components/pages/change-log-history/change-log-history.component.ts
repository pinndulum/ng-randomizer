import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap, skip, switchMap, take, tap, toArray } from 'rxjs/operators';
import { ndx_sig_of } from 'src/app/interfaces/index-signature-of-t.interface';
import { MockService } from 'src/app/services/mock.service';

interface HistoryItem {
  Id: string;
  TimeStamp: Date;
  User: {
    Id: number;
    Name: string;
    Email: string;
  };
  Data: {
    Id: string;
    ChangeType: 'Insert' | 'Update' | 'Delete';
    RecordId: number;
    TableName: 'Claimant' | 'Processor' | 'Advisor' | 'Supervisor' | 'Client' | 'Vendor';
    FieldName: 'Id' | 'Name' | 'Address' | 'City' | 'State' | 'Zip';
    PrevValue?: ndx_sig_of<unknown>;
    CurrValue?: ndx_sig_of<unknown>;
  }[];
}
@Component({
  standalone: false,
  selector: 'app-change-log-history',
  templateUrl: './change-log-history.component.html',
  styleUrls: ['./change-log-history.component.scss']
})
export class ChangeLogHistoryComponent implements OnInit {

  public readonly change_history$: Observable<HistoryItem[]>;

  private mock_logs$!: Observable<HistoryItem[]>;
  private readonly page_sub: BehaviorSubject<number> = new BehaviorSubject(0);

  public readonly pg = {
    perpg: 10,
    current: 0,
    pages: [0],
    pgcount: (count: number) => {
      const perpg = this.pg.perpg;
      return Math.floor(count / perpg) + (count % perpg > 0 ? 1 : 0);
    },
    prev: () => {
      this.pg.current--;
      this.page_sub.next(this.pg.current);
    },
    goto: (pg: number) => {
      this.pg.current = pg;
      this.page_sub.next(this.pg.current);
    },
    next: () => {
      this.pg.current++;
      this.page_sub.next(this.pg.current);
    }
  };

  constructor(private mock: MockService) {
    this.change_history$ = this.page_sub.pipe(
      switchMap(x => this.mock_logs$.pipe(
        mergeMap(x => x),
        skip(x * this.pg.perpg),
        take(this.pg.perpg),
        toArray()
      ))
    );
  }

  ngOnInit(): void {
    this.mock_logs$ = of(
      this.mock.complex.list<HistoryItem>({
        Id: { $mock: 'guid' },
        TimeStamp: { $mock: 'date', min: 'now', max: 'now' },
        User: {
          Id: { $mock: 'number', min: 100, max: 501 },
          Name: { $mock: 'string', size: 8 },
          Email: { $mock: 'email' }
        },
        Data: [{
          Id: { $mock: 'guid' },
          ChangeType: { $mock: 'choose', choices: ['Insert', 'Update', 'Delete'] },
          RecordId: { $mock: 'number', min: 10, max: 41 },
          TableName: { $mock: 'choose', choices: ['Claimant', 'Processor', 'Advisor', 'Supervisor', 'Client', 'Vendor'] },
          FieldName: { $mock: 'choose', choices: ['Id', 'Name', 'Address', 'City', 'State', 'Zip'] }
        }]
      }, { range: { min: 11, max: 75 }, Data: { min: 1, max: 4 } }).map(entry => {
        const getData = () => this.mock.complex.object({
          Id: { $mock: 'number', min: 1000, max: 2001 },
          version: { $mock: 'ver' },
          Name: { $mock: 'string' },
          Value: { $mock: 'string', minLength: 4, maxLength: 8 },
          FullName: { $mock: 'fullname' },
          FirstName: { $mock: 'firstname' },
          LastName: { $mock: 'lastname' },
          Company: { $mock: 'company' },
          Street: { $mock: 'street' },
          City: { $mock: 'city' },
          State: { $mock: 'state' },
          Zip: { $mock: 'zip' },
          Tz: { $mock: 'tz' },
          Phone: { $mock: 'phone' },
          Email: { $mock: 'email' },
          Book: { $mock: 'title' },
          TypeSet: { $mock: 'typeset' },
          Locations: [{ $mock: 'city' }],
          HasApproval: { $mock: 'boolean' },
          CreatedOn: { $mock: 'date', min: 'today-12M', max: 'now-1M' },
          CreatedBy: { $mock: 'string' },
          ModifiedOn: { $mock: 'date', min: 'today-7D', max: 'now' },
          ModifiedBy: { $mock: 'string' }
        }, { Locations: { min: 1, max: 3 } });
        for (const data of entry.Data || []) {
          const vals = {
            prev: ['Delete', 'Update'].includes(data.ChangeType) ? getData() : undefined,
            curr: ['Insert', 'Update'].includes(data.ChangeType) ? getData() : undefined
          };
          data.PrevValue = vals.prev;
          data.CurrValue = vals.curr;
        }
        return entry;
      })
    ).pipe(
      tap(items => {
        this.pg.pages.splice(0);
        const pgcount = this.pg.pgcount(items.length);
        this.pg.pages.push(...Array(pgcount).keys());
      })
    );
  }

  change_type_icon = (type: 'Insert' | 'Update' | 'Delete') => {
    const icon = 'bi-clipboard';
    switch (type) {
      case 'Insert':
        return `${icon}-plus`;
      case 'Update':
        return `${icon}-check`;
      case 'Delete':
        return `${icon}-minus`;
    }
  };
}

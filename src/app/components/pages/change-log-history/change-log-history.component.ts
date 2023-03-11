import { AfterViewInit, Component } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
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
  selector: 'app-change-log-history',
  templateUrl: './change-log-history.component.html',
  styleUrls: ['./change-log-history.component.scss']
})
export class ChangeLogHistoryComponent implements AfterViewInit {

  public readonly change_history$: Observable<HistoryItem[]>;

  private mock_logs$!: Observable<HistoryItem[]>;
  private readonly page_sub: Subject<number> = new Subject();

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

  ngAfterViewInit(): void {
    this.mock_logs$ = of(
      this.mock.complex.list<HistoryItem>({
        Id: 'guid',
        TimeStamp: 'date:now:now',
        User: { Id: 'number:100:501', Name: 'string:8', Email: 'email' },
        Data: [{
          Id: 'guid',
          ChangeType: 'choose:Insert,Update,Delete',
          RecordId: 'number:10:41',
          TableName: 'choose:Claimant,Processor,Advisor,Supervisor,Client,Vendor',
          FieldName: 'choose:Id,Name,Address,City,State,Zip'
        }]
      }, { min: 11, max: 75 }, { Data: { max: 4 } }).map(entry => {
        const getData = () => this.mock.complex.object({
          Id: 'number:1000:2001',
          version: 'ver',
          Name: '',
          Value: '',
          FullName: 'fullname',
          FirstName: 'firstname',
          LastName: 'lastname',
          Company: 'company',
          Street: 'street',
          City: 'city',
          State: 'state',
          Zip: 'zip',
          Tz: 'tz',
          Phone: 'phone',
          Email: 'email',
          Book: 'title',
          TypeSet: 'typeset',
          Locations: [],
          HasApproval: 'boolean',
          CreatedOn: 'date:today-12M:now-1M',
          CreatedBy: '',
          ModifiedOn: 'date:today-7d:now',
          ModifiedBy: ''
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
    this.page_sub.next(0);
  }

  change_type_icon = (type: 'Insert' | 'Update' | 'Delete') => {
    let icon = 'bi-clipboard';
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

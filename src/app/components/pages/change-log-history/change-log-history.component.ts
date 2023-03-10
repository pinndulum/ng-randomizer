import { AfterViewInit, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    Id: number;
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

  public change_history$ ?: Observable<HistoryItem[]>;

  constructor(private mock: MockService) {
  }

  ngAfterViewInit(): void {
    this.change_history$ = of(
      this.mock.complex.list<HistoryItem>({
        Id: 'guid',
        TimeStamp: 'date:now:now',
        User: { Id: 'number:100:501', Name: 'string:8', Email: 'email' },
        Data: [{
          Id: 'number:1000:2001',
          ChangeType: 'choose:Insert,Update,Delete',
          RecordId: 'number:10:41',
          TableName: 'choose:Claimant,Processor,Advisor,Supervisor,Client,Vendor',
          FieldName: 'choose:Id,Name,Address,City,State,Zip'
        }]
      }, { min: 11, max: 75 }, { Data: { max: 4 } }).map(entry => {
        const getData = () => this.mock.complex.object({
          Id: 'guid',
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
    );
  }

}

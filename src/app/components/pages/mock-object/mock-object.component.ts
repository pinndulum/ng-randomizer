import { Component } from '@angular/core';
import { ndx_sig_of } from 'src/app/interfaces/index-signature-of-t.interface';
import { MockService } from 'src/app/services/mock.service';

interface EditorObj {
    data: ndx_sig_of<unknown>;
    error?: string | null;
    mock?: unknown;
}

@Component({
  standalone: false,
  selector: 'app-mock-object',
  templateUrl: './mock-object.component.html',
  styleUrls: ['./mock-object.component.scss']
})
export class MockObjectComponent {

  public readonly editobj: EditorObj;

  constructor (private mock: MockService) {
    this.editobj = {
      data: {
        Id: { $mock: 'guid' },
        TimeStamp: { $mock: 'date', min: 'now', max: 'now' },
        User: {
          Id: { $mock: 'number', min: 100, max: 501 },
          Name: { $mock: 'string', size: 8 },
          Email: { $mock: 'email' }
        },
        Data: [{
          Id: { $mock: 'number', min: 1000, max: 2001 },
          ChangeType: { $mock: 'choose', choices: ['Insert', 'Update', 'Delete'] },
          RecordId: { $mock: 'number', min: 10, max: 41 },
          TableName: { $mock: 'choose', choices: ['Claimant', 'Processor', 'Advisor', 'Supervisor', 'Client', 'Vendor'] },
          FieldName: { $mock: 'choose', choices: ['Id', 'Name', 'Address', 'City', 'State', 'Zip'] },
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
        }]
      }
    };
    this.mockdata();
  }

  public readonly templateChanged = (value: unknown) => {
    this.editobj.data = value as ndx_sig_of<unknown>;
    this.editobj.error = null;
  };

  public readonly templateErrorChanged = (message: string | null) => {
    this.editobj.error = message;
  };

  public mockdata = () => {
    if (this.editobj.error) {
      return;
    }

    try {
      this.editobj.mock = this.mock.complex.object(this.editobj.data, {
        Data: { min: 1, max: 4 },
        Locations: { min: 1, max: 3 }
      });
      this.editobj.error = null;
    } catch (error) {
      this.editobj.error = error instanceof Error ? error.message : `${error}`;
    }
  };
}

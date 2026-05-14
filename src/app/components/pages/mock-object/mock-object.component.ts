import { Component, inject } from '@angular/core';
import { ndx_sig_of } from '@app/interfaces/index-signature-of-t.interface';
import { MockService } from '@app/services/mock.service';
import { RouterLink } from '@angular/router';
import { JsonEditorComponent } from '../../controls/json-editor/json-editor.component';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { JsonPipe } from '@angular/common';

interface EditorObj {
    data: ndx_sig_of<unknown>;
    error?: string | null;
    mock?: unknown;
}

@Component({
    selector: 'app-mock-object',
    templateUrl: './mock-object.component.html',
    styleUrls: ['./mock-object.component.scss'],
    imports: [RouterLink, JsonEditorComponent, CdkCopyToClipboard, JsonPipe]
})
export class MockObjectComponent {
  private mock = inject(MockService);


  protected readonly editobj: EditorObj;

  constructor () {
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

  protected readonly templateChanged = (value: unknown) => {
    this.editobj.data = value as ndx_sig_of<unknown>;
    this.editobj.error = null;
  };

  protected readonly templateErrorChanged = (message: string | null) => {
    this.editobj.error = message;
  };

  protected readonly mockdata = () => {
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

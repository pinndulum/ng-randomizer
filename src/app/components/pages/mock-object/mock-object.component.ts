import { Component } from '@angular/core';
import { JsonEditorOptions } from '@maaxgr/ang-jsoneditor';
import { ndx_sig_of } from 'src/app/interfaces/index-signature-of-t.interface';
import { MockService } from 'src/app/services/mock.service';

interface EditorObj {
    opts: JsonEditorOptions;
    data: ndx_sig_of<unknown>;
    mock?: object;
}

@Component({
  selector: 'app-mock-object',
  templateUrl: './mock-object.component.html',
  styleUrls: ['./mock-object.component.scss']
})
export class MockObjectComponent {

  public readonly editobj: EditorObj;

  constructor (private mock: MockService) {
    this.editobj = {
      opts: this.makeOptions(),
      data: {
        Id: 'guid',
        TimeStamp: 'date:now:now',
        User: { 
          Id: 'number:100:501',
          Name: 'string:8',
          Email: 'email'
        },
        Data: [{
          Id: 'number:1000:2001',
          ChangeType: 'choose:Insert,Update,Delete',
          RecordId: 'number:10:41',
          TableName: 'choose:Claimant,Processor,Advisor,Supervisor,Client,Vendor',
          FieldName: 'choose:Id,Name,Address,City,State,Zip',
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
        }]
      }
    };
    this.mockdata();
  }

  public mockdata = () => {
    this.editobj.mock = this.mock.complex.object(this.editobj.data);
  };

  private makeOptions = () => {
    const opts = new JsonEditorOptions();
    opts.mode = 'text';
    opts.expandAll = true;
    opts.onChangeText = str => {
      this.editobj.data = JSON.parse(str)
    };
    return opts;
  };
}

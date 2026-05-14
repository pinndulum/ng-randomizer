import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ndx_sig_of } from '../../../interfaces/index-signature-of-t.interface';
import { MockService } from '../../../services/mock.service';
import { JsonEditorComponent } from '../../controls/json-editor/json-editor.component';

interface EditorObj {
    data: ndx_sig_of<unknown>;
    error?: string | null;
    mock?: unknown;
}

@Component({
    selector: 'app-mock-object',
    templateUrl: './mock-object.component.html',
    styleUrls: ['./mock-object.component.scss'],
    imports: [RouterLink, FormsModule, JsonEditorComponent, CdkCopyToClipboard, JsonPipe]
})
export class MockObjectComponent {
  private mock = inject(MockService);

  private readonly fillOptions = {
    Data: { min: 1, max: 4 },
    Locations: { min: 5, max: 10 }
  };

  protected readonly editobj: EditorObj;
  protected seed = '';
  protected replayEnabled = false;
  protected clockEnabled = true;
  protected clockValue = '2026-05-14T12:00';
  protected replayStatus = '';

  private lastSeed = '';
  private lastClock = '';
  private lastSnapshot = '';

  constructor () {
    this.editobj = {
      data: this.createDefaultTemplate()
    };
    this.seed = this.createSeed();
    this.reloadContent();
  }

  protected readonly templateChanged = (value: unknown) => {
    this.editobj.data = value as ndx_sig_of<unknown>;
    this.editobj.error = null;
    this.resetReplaySnapshot();
  };

  protected readonly templateErrorChanged = (message: string | null) => {
    this.editobj.error = message;
  };

  protected readonly generateSeed = () => {
    this.seed = this.createSeed();
    this.replayEnabled = true;
    this.reloadContent();
  };

  protected readonly replayModeChanged = (enabled: boolean) => {
    this.replayEnabled = enabled;
    if (enabled && !this.seed.trim()) {
      this.seed = this.createSeed();
    }
    this.resetReplaySnapshot();
    this.replayStatus = enabled
      ? 'Replay enabled. Reload Content will reuse the visible seed for the current DSL template.'
      : 'Replay disabled. Reload Content will generate a fresh unseeded result.';
  };

  protected readonly clockModeChanged = (enabled: boolean) => {
    this.clockEnabled = enabled;
    if (enabled && !this.clockValue.trim()) {
      this.clockValue = '2026-05-14T12:00';
    }
    this.resetReplaySnapshot();
    this.replayStatus = enabled
      ? 'Fixed clock enabled. Reload Content will resolve relative date DSL values inside mock-randomizer withClock.'
      : 'Fixed clock disabled. Relative date DSL values use the real current clock.';
  };

  protected readonly reloadContent = () => {
    if (this.editobj.error) {
      return;
    }

    const seed = this.replayEnabled ? this.seed.trim() : '';
    const clockValue = this.replayEnabled && this.clockEnabled ? this.clockValue.trim() : '';
    const previousSeed = this.lastSeed;
    const previousClock = this.lastClock;
    const previousSnapshot = this.lastSnapshot;

    try {
      this.editobj.mock = this.generateMock(seed || undefined, clockValue || undefined);
      this.editobj.error = null;
    } catch (error) {
      this.editobj.error = error instanceof Error ? error.message : `${error}`;
      this.replayStatus = this.editobj.error;
      return;
    }

    const snapshot = JSON.stringify(this.editobj.mock);

    this.replayStatus = this.describeReplay(seed, clockValue, previousSeed, previousClock, previousSnapshot, snapshot);
    this.lastSeed = seed;
    this.lastClock = clockValue;
    this.lastSnapshot = snapshot;
  };

  private generateMock(seed?: string, clockValue?: string): unknown {
    const generate = (): unknown => {
      const createMock = (): unknown => this.generateMockObject();

      return seed ? this.mock.random.withSeed(seed, createMock) : createMock();
    };

    return clockValue ? this.mock.clock.withClock(clockValue, generate) : generate();
  }

  private generateMockObject(): unknown {
    const template = this.cloneTemplate();
    const dataTemplate = this.extractArrayTemplate(template, 'Data');

    if (dataTemplate === undefined) {
      return this.mock.complex.object(template, this.fillOptions);
    }

    delete template['Data'];

    const mockObject = this.mock.complex.object<ndx_sig_of<unknown>>(template, this.fillOptions);
    mockObject['Data'] = this.generateDataList(dataTemplate);

    return mockObject;
  }

  private generateDataList(dataTemplate: unknown): unknown[] {
    const count = this.mock.random.int(this.fillOptions.Data, true);

    return Array.from({ length: count }, () =>
      this.mock.complex.object(this.cloneValue(dataTemplate), this.fillOptions));
  }

  private extractArrayTemplate(template: ndx_sig_of<unknown>, key: string): unknown | undefined {
    const value = template[key];

    return value instanceof Array ? value[0] : undefined;
  }

  private cloneTemplate(): ndx_sig_of<unknown> {
    return this.cloneValue(this.editobj.data);
  }

  private cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }

  private createDefaultTemplate(): ndx_sig_of<unknown> {
    return {
      Id: { $mock: 'guid' },
      TimeStamp: { $mock: 'date', min: 'now', max: 'now' },
      User: {
        Id: { $mock: 'number', min: 100, max: 501 },
        Name: { $mock: 'string', size: 8 },
        Email: { $mock: 'email' }
      },
      Data: [{
        $vars: {
          firstName: { $mock: 'firstname' },
          lastName: { $mock: 'lastname' },
          fullName: { $mock: 'compose', format: '{firstName} {lastName}' }
        },
        Id: { $mock: 'number', min: 1000, max: 2001 },
        ChangeType: { $mock: 'choose', choices: ['Insert', 'Update', 'Delete'] },
        RecordId: { $mock: 'number', min: 10, max: 41 },
        TableName: { $mock: 'choose', choices: ['Claimant', 'Processor', 'Advisor', 'Supervisor', 'Client', 'Vendor'] },
        FieldName: { $mock: 'choose', choices: ['Id', 'Name', 'Address', 'City', 'State', 'Zip'] },
        version: { $mock: 'ver' },
        Name: { $mock: 'string' },
        Value: { $mock: 'string', minLength: 4, maxLength: 8 },
        FullName: { $mock: 'compose', format: '{fullName}' },
        FirstName: { $mock: 'compose', format: '{firstName}' },
        LastName: { $mock: 'compose', format: '{lastName}' },
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
        Locations: [{
          $mock: 'string',
          minLength: 5,
          maxLength: 12,
          case: 'mixed'
        }],
        HasApproval: { $mock: 'boolean' },
        CreatedOn: { $mock: 'date', min: 'today-12M', max: 'now-1M' },
        CreatedBy: { $mock: 'string' },
        ModifiedOn: { $mock: 'date', min: 'today-7D', max: 'now' },
        ModifiedBy: { $mock: 'string' }
      }]
    };
  }

  private createSeed(): string {
    return `mock-dsl:v1:${this.mock.random.string(6, 'lower')}-${this.mock.random.numeric(4)}`;
  }

  private resetReplaySnapshot(): void {
    this.lastSeed = '';
    this.lastClock = '';
    this.lastSnapshot = '';
  }

  private describeReplay(
    seed: string,
    clockValue: string,
    previousSeed: string,
    previousClock: string,
    previousSnapshot: string,
    snapshot: string
  ): string {
    if (!this.replayEnabled) {
      return 'Fresh unseeded mock result generated. Enable replay to reuse a seed.';
    }

    if (!seed) {
      return 'Fresh unseeded mock result generated. Enter a seed value to make the result replayable.';
    }

    const clockLabel = clockValue ? ` with fixed clock "${clockValue}"` : '';

    if (previousSeed !== seed || previousClock !== clockValue || !previousSnapshot) {
      return `Seed "${seed}"${clockLabel} generated a mock result. Press Reload Content again to replay it.`;
    }

    if (previousSnapshot === snapshot) {
      return `Replay matched the previous result for "${seed}"${clockLabel} with no data changes.`;
    }

    return `Seed "${seed}" replayed, but the result changed. Check whether the DSL template or fill options changed.`;
  }
}

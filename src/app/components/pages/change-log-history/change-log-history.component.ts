import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ndx_sig_of } from '../../../interfaces/index-signature-of-t.interface';
import { AlertService } from '../../../services/alert.service';
import { MockService } from '../../../services/mock.service';

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

type HistoryDataItem = HistoryItem['Data'][number];

@Component({
    selector: 'app-change-log-history',
    templateUrl: './change-log-history.component.html',
    styleUrls: ['./change-log-history.component.scss'],
    imports: [RouterLink, FormsModule, CdkCopyToClipboard, MatTooltip, AsyncPipe, JsonPipe, DatePipe]
})
export class ChangeLogHistoryComponent implements OnInit {
  private mock = inject(MockService);
  private alert = inject(AlertService);


  protected readonly change_history$: Observable<HistoryItem[]>;
  protected seed = '';
  protected replayEnabled = false;
  protected clockEnabled = true;
  protected clockValue = '2026-05-14T12:00';
  protected replayStatus = '';
  protected historyCount = 0;

  private readonly logs_sub: BehaviorSubject<HistoryItem[]> = new BehaviorSubject<HistoryItem[]>([]);
  private readonly page_sub: BehaviorSubject<number> = new BehaviorSubject(0);
  private lastSeed = '';
  private lastClock = '';
  private lastSnapshot = '';

  protected readonly pg = {
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

  constructor() {
    this.change_history$ = combineLatest([this.logs_sub, this.page_sub]).pipe(
      map(([logs, page]) => logs.slice(
        page * this.pg.perpg,
        (page + 1) * this.pg.perpg
      ))
    );
  }

  ngOnInit(): void {
    this.seed = this.createSeed();
    this.refreshContent();
  }

  protected readonly refreshContent = () => {
    const seed = this.replayEnabled ? this.seed.trim() : '';
    const clockValue = this.replayEnabled && this.clockEnabled ? this.clockValue.trim() : '';
    const previousSeed = this.lastSeed;
    const previousClock = this.lastClock;
    const previousSnapshot = this.lastSnapshot;
    let logs: HistoryItem[];

    try {
      logs = this.generateHistory(seed || undefined, clockValue || undefined);
    } catch (error) {
      this.replayStatus = error instanceof Error ? error.message : `${error}`;
      return;
    }

    const snapshot = JSON.stringify(logs);

    this.historyCount = logs.length;
    this.resetPagination(logs.length);
    this.replayStatus = this.describeReplay(seed, clockValue, previousSeed, previousClock, previousSnapshot, snapshot, logs.length);
    this.lastSeed = seed;
    this.lastClock = clockValue;
    this.lastSnapshot = snapshot;
    this.page_sub.next(this.pg.current);
    this.logs_sub.next(logs);
  };

  protected readonly generateSeed = () => {
    this.seed = `change-history:v1:${this.mock.random.string(6, 'lower')}-${this.mock.random.numeric(4)}`;
    this.replayEnabled = true;
    this.refreshContent();
  };

  protected readonly replayModeChanged = (enabled: boolean) => {
    this.replayEnabled = enabled;
    if (enabled && !this.seed.trim()) {
      this.seed = this.createSeed();
    }
    this.lastSeed = '';
    this.lastClock = '';
    this.lastSnapshot = '';
    this.replayStatus = enabled
      ? 'Replay enabled. Reload Content will reuse the visible seed so the synthetic dataset can be regenerated.'
      : 'Replay disabled. Reload Content will generate a fresh unseeded synthetic dataset.';
  };

  protected readonly clockModeChanged = (enabled: boolean) => {
    this.clockEnabled = enabled;
    if (enabled && !this.clockValue.trim()) {
      this.clockValue = '2026-05-14T12:00';
    }
    this.lastSeed = '';
    this.lastClock = '';
    this.lastSnapshot = '';
    this.replayStatus = enabled
      ? 'Fixed clock enabled. Reload Content will run date generation inside mock-randomizer withClock.'
      : 'Fixed clock disabled. Relative date expressions such as now and today use the real current clock.';
  };

  protected readonly change_type_icon = (type: 'Insert' | 'Update' | 'Delete') => {
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

  protected readonly showDetailDialog = (data: HistoryDataItem): void => {
    void this.alert.showDialog({
      title: `Change Log Details -> ${data.ChangeType}: ${data.TableName}.${data.FieldName}`,
      message: this.getDetailDialogMessage(data),
      opts: {
        buttons: [],
        maxWidth: 'calc(100vw - 2rem)',
        width: 'min(900px, calc(100vw - 2rem))'
      }
    }, false);
  };

  private generateHistory(seed?: string, clockValue?: string): HistoryItem[] {
    const generate = (): HistoryItem[] => this.mock.complex.list<HistoryItem>({
      Id: { $mock: 'guid' },
      TimeStamp: {
        $mock: 'date',
        min: 'now-10D',
        max: 'now'
      },
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
    }, {
      range: { min: 11, max: 75 },
      Data: { min: 1, max: 4 },
      ...(seed ? { seed } : {})
    }).map(entry => {
      const getData = (valueSeed?: string) => this.mock.complex.object({
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
        CreatedOn: { $mock: 'date', min: 'today-12M', max: 'today-1M' },
        CreatedBy: { $mock: 'string' },
        ModifiedOn: { $mock: 'date', min: 'today-7D', max: 'now' },
        ModifiedBy: { $mock: 'string' }
      }, {
        Locations: { min: 1, max: 3 },
        ...(valueSeed ? { seed: valueSeed } : {})
      });

      for (const data of entry.Data || []) {
        const dataSeed = seed ? `${seed}:${entry.Id}:${data.Id}` : undefined;
        const vals = {
          prev: ['Delete', 'Update'].includes(data.ChangeType) ? getData(dataSeed ? `${dataSeed}:prev` : undefined) : undefined,
          curr: ['Insert', 'Update'].includes(data.ChangeType) ? getData(dataSeed ? `${dataSeed}:curr` : undefined) : undefined
        };
        data.PrevValue = vals.prev;
        data.CurrValue = vals.curr;
      }
      return entry;
    });

    return clockValue ? this.mock.clock.withClock(clockValue, generate) : generate();
  }

  private resetPagination(count: number): void {
    this.pg.current = 0;
    this.pg.pages.splice(0);
    const pgcount = this.pg.pgcount(count);
    this.pg.pages.push(...Array(pgcount).keys());
  }

  private createSeed(): string {
    return `change-history:v1:${this.mock.random.string(6, 'lower')}-${this.mock.random.numeric(4)}`;
  }

  private getDetailDialogMessage(data: HistoryDataItem): string {
    return [
      data.CurrValue ? this.getDetailTable('Current Value', data.CurrValue) : '',
      data.PrevValue ? this.getDetailTable('Previous Value', data.PrevValue) : ''
    ].filter(Boolean).join('');
  }

  private getDetailTable(title: string, value: ndx_sig_of<unknown>): string {
    return `
      <section class="dialog-detail-section">
        <h2 class="dialog-detail-heading">${this.escapeHtml(title)}</h2>
        <table class="dialog-detail-table">
          <thead>
            <tr>
              <th scope="col">Version</th>
              <th scope="col">Created By</th>
              <th scope="col">Created On</th>
              <th scope="col">Modified By</th>
              <th scope="col">Modified On</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${this.escapeHtml(value['version'])}</td>
              <td>${this.escapeHtml(value['CreatedBy'])}</td>
              <td>${this.escapeHtml(this.formatDialogDate(value['CreatedOn']))}</td>
              <td>${this.escapeHtml(value['ModifiedBy'])}</td>
              <td>${this.escapeHtml(this.formatDialogDate(value['ModifiedOn']))}</td>
            </tr>
          </tbody>
        </table>
      </section>`;
  }

  private formatDialogDate(value: unknown): string {
    return value instanceof Date ? value.toLocaleString() : `${value ?? ''}`;
  }

  private escapeHtml(value: unknown): string {
    return `${value ?? ''}`
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private describeReplay(
    seed: string,
    clockValue: string,
    previousSeed: string,
    previousClock: string,
    previousSnapshot: string,
    snapshot: string,
    count: number
  ): string {
    if (!this.replayEnabled) {
      return `Fresh unseeded dataset generated with ${count} records. Enable replay to reuse a seed.`;
    }

    if (!seed) {
      return `Fresh unseeded dataset generated with ${count} records. Enter a seed value to make the dataset replayable.`;
    }

    const clockLabel = clockValue ? ` with fixed clock "${clockValue}"` : '';

    if (previousSeed !== seed || previousClock !== clockValue || !previousSnapshot) {
      return `Seed "${seed}"${clockLabel} generated ${count} records. Press Reload Content again to replay the same dataset.`;
    }

    if (previousSnapshot === snapshot) {
      return `Replay matched the previous state for "${seed}"${clockLabel} with ${count} records and no data changes.`;
    }

    return `Seed "${seed}" replayed, but the dataset changed. Check whether the template or generation options changed.`;
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ndx_sig_of } from '../../../interfaces/index-signature-of-t.interface';

import { MockObjectComponent } from './mock-object.component';

interface TestableEditorObj {
  data: ndx_sig_of<unknown>;
  error?: string | null;
  mock?: unknown;
}

interface TestableMockObjectComponent {
  editobj: TestableEditorObj;
  seed: string;
  replayEnabled: boolean;
  clockEnabled: boolean;
  clockValue: string;
  replayStatus: string;
  reloadContent(): void;
  replayModeChanged(enabled: boolean): void;
}

describe('MockObjectComponent', () => {
  let component: MockObjectComponent;
  let fixture: ComponentFixture<MockObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockObjectComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MockObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('labels the primary generation action as reload content', () => {
    const button = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

    expect(button.some(item => item.textContent?.includes('Reload Content'))).toBeTrue();
  });

  it('uses a v2-friendly default template for generated location strings and shared name parts', () => {
    const testable = component as unknown as TestableMockObjectComponent;
    const dataTemplate = (testable.editobj.data['Data'] as unknown[])[0] as ndx_sig_of<unknown>;
    const vars = dataTemplate['$vars'] as ndx_sig_of<unknown>;
    const locations = dataTemplate['Locations'] as ndx_sig_of<unknown>[];
    const locationString = locations[0] as ndx_sig_of<unknown>;

    expect(vars['firstName']).toEqual({ $mock: 'firstname' });
    expect(vars['lastName']).toEqual({ $mock: 'lastname' });
    expect(dataTemplate['FullName']).toEqual({ $mock: 'compose', format: '{fullName}' });
    expect(dataTemplate['FirstName']).toEqual({ $mock: 'compose', format: '{firstName}' });
    expect(dataTemplate['LastName']).toEqual({ $mock: 'compose', format: '{lastName}' });
    expect(locationString['$mock']).toBe('string');
    expect(locationString['minLength']).toBe(5);
    expect(locationString['maxLength']).toBe(12);
    expect(locationString['case']).toBe('mixed');
  });

  it('generates shared names and distinct random location strings', () => {
    const testable = component as unknown as TestableMockObjectComponent;

    testable.replayModeChanged(true);
    testable.seed = 'mock-dsl:location-strings';
    testable.reloadContent();

    const mock = testable.editobj.mock as { Data: ndx_sig_of<unknown>[] };
    const item = mock.Data[0];

    expect(item['FullName']).toBe(`${item['FirstName']} ${item['LastName']}`);
    expect(item['$vars']).toBeUndefined();
    expect(mock.Data.length).toBeGreaterThanOrEqual(1);
    expect(mock.Data.length).toBeLessThanOrEqual(4);

    for (const dataItem of mock.Data) {
      const itemLocations = dataItem['Locations'] as unknown[];
      const uniqueLocations = new Set(itemLocations);

      expect(itemLocations.length).toBeGreaterThanOrEqual(5);
      expect(itemLocations.length).toBeLessThanOrEqual(10);
      expect(itemLocations.every(location => typeof location === 'string')).toBeTrue();
      expect(uniqueLocations.size).toBeGreaterThan(1);
    }
  });

  it('replays the same mock result with seed and fixed clock', () => {
    const testable = component as unknown as TestableMockObjectComponent;

    testable.replayModeChanged(true);
    testable.seed = 'mock-dsl:test-seed';
    testable.clockEnabled = true;
    testable.clockValue = '2026-05-14T12:00';

    testable.reloadContent();
    const firstResult = JSON.stringify(testable.editobj.mock);

    testable.reloadContent();

    expect(JSON.stringify(testable.editobj.mock)).toBe(firstResult);
    expect(testable.replayStatus).toContain('Replay matched');
  });
});

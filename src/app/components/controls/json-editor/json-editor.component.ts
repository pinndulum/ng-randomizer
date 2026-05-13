import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import type JSONEditor from 'jsoneditor';
import type { JSONEditorMode, JSONEditorOptions } from 'jsoneditor';

@Component({
  standalone: false,
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() data: unknown = {};
  @Input() mode: JSONEditorMode = 'text';
  @Input() modes: JSONEditorMode[] = ['tree', 'text', 'view'];
  @Input() indentation = 2;

  @Output() dataChange = new EventEmitter<unknown>();
  @Output() errorChange = new EventEmitter<string | null>();

  @ViewChild('host', { static: true }) private readonly host!: ElementRef<HTMLDivElement>;

  private editor?: JSONEditor;
  private destroyed = false;
  private latestText = '';

  constructor(private readonly zone: NgZone) { }

  async ngAfterViewInit(): Promise<void> {
    const { default: JSONEditorCtor } = await import('jsoneditor');
    if (this.destroyed) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.latestText = this.stringify(this.data);
      this.editor = new JSONEditorCtor(this.host.nativeElement, this.makeOptions(), this.data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editor || !changes['data']) {
      return;
    }

    this.zone.runOutsideAngular(() => this.updateEditor(this.data));
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.editor?.destroy();
  }

  private makeOptions(): JSONEditorOptions {
    return {
      mode: this.mode,
      modes: this.modes,
      mainMenuBar: true,
      navigationBar: true,
      statusBar: true,
      onChangeJSON: value => this.emitValue(value),
      onChangeText: value => this.emitText(value),
      onError: error => this.emitError(error.message)
    };
  }

  private updateEditor(data: unknown): void {
    const nextText = this.stringify(data);
    if (nextText === this.latestText) {
      return;
    }

    this.latestText = nextText;
    try {
      this.editor?.updateText(nextText);
    } catch {
      this.editor?.set(data);
    }
  }

  private emitText(text: string): void {
    try {
      this.emitValue(JSON.parse(text));
    } catch (error) {
      this.emitError(error instanceof Error ? error.message : `${error}`);
    }
  }

  private emitValue(value: unknown): void {
    this.latestText = this.stringify(value);
    this.zone.run(() => {
      this.errorChange.emit(null);
      this.dataChange.emit(value);
    });
  }

  private emitError(message: string): void {
    this.zone.run(() => this.errorChange.emit(message));
  }

  private stringify(value: unknown): string {
    return JSON.stringify(value, null, this.indentation);
  }
}
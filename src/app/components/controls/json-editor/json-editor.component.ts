import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, effect, inject, input, model, output, viewChild } from '@angular/core';
import type JSONEditor from 'jsoneditor';
import type { JSONEditorMode, JSONEditorOptions } from 'jsoneditor';

@Component({
    selector: 'app-json-editor',
    templateUrl: './json-editor.component.html',
    styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);


  public readonly data = model<unknown>({});
  public readonly mode = input<JSONEditorMode>('text');
  public readonly modes = input<JSONEditorMode[]>(['tree', 'text', 'view']);
  public readonly indentation = input(2);

  public readonly errorChange = output<string | null>();

  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');

  private editor?: JSONEditor;
  private destroyed = false;
  private latestText = '';

  constructor() {
    effect(() => {
      const data = this.data();
      if (!this.editor) {
        return;
      }

      this.zone.runOutsideAngular(() => this.updateEditor(data));
    });
  }

  async ngAfterViewInit(): Promise<void> {
    const { default: JSONEditorCtor } = await import('jsoneditor');
    if (this.destroyed) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const data = this.data();
      this.latestText = this.stringify(data);
      this.editor = new JSONEditorCtor(this.host().nativeElement, this.makeOptions(), data);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.editor?.destroy();
  }

  private makeOptions(): JSONEditorOptions {
    return {
      mode: this.mode(),
      modes: this.modes(),
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
      this.data.set(value);
    });
  }

  private emitError(message: string): void {
    this.zone.run(() => this.errorChange.emit(message));
  }

  private stringify(value: unknown): string {
    return JSON.stringify(value, null, this.indentation());
  }
}

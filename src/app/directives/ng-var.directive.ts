/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/// Example:
/// <ng-container *ngVar="user$ | async; let user">

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ngVar]'
})
export class NgVarDirective {
    private hasView = false;
    private context: {
        $implicit: unknown;
        ngVar: unknown;
    } = {
            $implicit: null,
            ngVar: null
        };

    constructor (
        private tRef: TemplateRef<any>,
        private vcRef: ViewContainerRef
    ) {
    }

    @Input()
    set ngVar (context: unknown) {
        this.context.$implicit = this.context.ngVar = context;
        if (!this.hasView) {
            this.vcRef.createEmbeddedView(this.tRef, this.context);
            this.hasView = true;
        }
    }
}

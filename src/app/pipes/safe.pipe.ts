import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

export type SafeValue = string | File;
export type SafeTransform = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';
export type SafeResult = SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl;

/* html example:
        <div [innerHtml]="html | safe: 'html'"></div>
   url example 1:
        <a [href]="url | safe: 'url'" />
   url example 2:
        <a [href]="files[key] | safe: 'url'" />
   resource url example 1:
        <a [href]="files[key].url | safe: 'resourceUrl'" />
   resource url example 2:
        <a [href]="files[key] | safe: 'resourceUrl'" />
*/

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
    protected readonly fn: { [key in SafeTransform]: (v: string) => SafeResult; };

    constructor (protected sani: DomSanitizer) {
        this.fn = {
            html: this.sani.bypassSecurityTrustHtml,
            style: this.sani.bypassSecurityTrustStyle,
            script: this.sani.bypassSecurityTrustScript,
            url: this.sani.bypassSecurityTrustUrl,
            resourceUrl: this.sani.bypassSecurityTrustResourceUrl
        };
    }

    public transform (value: SafeValue, type: SafeTransform = 'url'): SafeResult {
        type = type ?? 'url';
        if (value instanceof File) {
            value = window.URL.createObjectURL(value);
            type = type === 'url' || type === 'resourceUrl' ? type : 'url';
        }

        if (typeof value !== 'string') {
            throw Error(`Invalid safe transformation of "${typeof value}" to "${type}"`);
        }

        if (!this.fn[type]) {
            throw Error(`Invalid safe type specified: ${type}`);
        }
        return this.fn[type](value);
    }
}

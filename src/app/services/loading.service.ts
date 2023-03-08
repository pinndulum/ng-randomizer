/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private readonly loadingMap = new Map<string, number>();
    public readonly loadingSub = new BehaviorSubject<boolean>(false);

    setLoading (loading: boolean, url: string): void {
        if (!url) {
            return;
        }

        if (loading === false) {
            this.loadingMap.delete(url);
        } else {
            const count = this.loadingMap.get(url) ?? 0;
            this.loadingMap.set(url, count + 1);
        }

        loading = this.loadingMap.size > 0;
        if (loading !== this.loadingSub.value) {
            this.loadingSub.next(loading);
        }
    }
}

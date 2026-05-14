import { TestBed } from '@angular/core/testing';

import { PiService } from './pi.service';

describe('PiService', () => {
    let service: PiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('calculates pi progress asynchronously so the UI can keep painting', done => {
        const progress: number[] = [];
        let completed = false;

        service.progress().subscribe(value => {
            progress.push(value.content.len);
        });

        service.calculate(18).subscribe(result => {
            completed = true;

            expect(result.length).toBe(2);
            expect(result.every(item => item.formula === 'bellard-nth-digit')).toBeTrue();
            expect(progress).toEqual([9, 18]);
            done();
        });

        expect(completed).toBeFalse();
        expect(progress).toEqual([]);
    });

    it('calculates the Rabinowitz-Wagon spigot formula as a limited preview', done => {
        const progress: string[] = [];

        service.progress().subscribe(value => {
            progress.push(value.formula);
        });

        service.calculate(15, undefined, undefined, 'rabinowitz-wagon-spigot').subscribe(result => {
            expect(result.length).toBe(1);
            expect(result[0].formula).toBe('rabinowitz-wagon-spigot');
            expect(result[0].content.len).toBe(15);
            expect(result[0].content.str).toBe('3.141592653589793');
            expect(progress).toEqual(['rabinowitz-wagon-spigot']);
            done();
        });

        expect(progress).toEqual([]);
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidebarComponent],
            providers: [provideRouter([])]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('groups randomizer demos separately from reference demos', () => {
        const headings = Array.from(
            fixture.nativeElement.querySelectorAll('.nav-heading') as NodeListOf<HTMLElement>
        )
            .map(heading => heading.textContent?.trim());

        expect(headings).toEqual(['Randomizer Demos', 'Reference Demos']);
        expect(fixture.nativeElement.querySelector('.nav-separator')).toBeTruthy();
    });
});

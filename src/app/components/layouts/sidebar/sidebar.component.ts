import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @ViewChild('rpt_item') private readonly rpt_item!: ElementRef<HTMLLIElement>;

  needsauth: Observable<boolean> = EMPTY;

  constructor (
    private loc: Location
  ) {
  }

  async ngOnInit (): Promise<void> {
  }
}

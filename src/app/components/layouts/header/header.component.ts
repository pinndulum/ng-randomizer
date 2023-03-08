import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit  {

  constructor (
  ) {
  }

  ngOnInit (): void {
    if (sessionStorage.getItem('toggle-sidebar') === 'true') {
      this.sidebarToggle();
    }
  }

  sidebarToggle = () => {
    const classes = window.document.body.classList;
    classes.toggle('toggle-sidebar');
    sessionStorage.removeItem('toggle-sidebar');
    if (classes.contains('toggle-sidebar')) {
      sessionStorage.setItem('toggle-sidebar', 'true');
    }
  };
}

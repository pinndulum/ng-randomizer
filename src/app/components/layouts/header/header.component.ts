import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [RouterLink],
})
export class HeaderComponent implements OnInit  {
  ngOnInit (): void {
    if (sessionStorage.getItem('toggle-sidebar') === 'true') {
      this.sidebarToggle();
    }
  }

  protected readonly sidebarToggle = () => {
    const classes = window.document.body.classList;
    classes.toggle('toggle-sidebar');
    sessionStorage.removeItem('toggle-sidebar');
    if (classes.contains('toggle-sidebar')) {
      sessionStorage.setItem('toggle-sidebar', 'true');
    }
  };
}

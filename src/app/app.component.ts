import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'testing-proyect';
  actualTheme: string = 'dark';

  toggleTheme() {
    const html: HTMLElement = document.getElementById('html')!;
    this.actualTheme = html.getAttribute('data-theme')!;
    if (this.actualTheme === 'dark') {
      html?.setAttribute('data-theme','light')
      this.actualTheme = 'light';
    } else {
      html?.setAttribute('data-theme', 'dark');
      this.actualTheme = 'dark';
    }
  }
}

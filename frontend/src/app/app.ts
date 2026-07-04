import { Component, signal } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  protected readonly showSidebar = signal(true);

  toggleSidebar() {
    this.showSidebar.update(value => !value);
  }
}

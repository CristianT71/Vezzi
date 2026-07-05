import { Component, signal } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { Login } from './pages/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sidebar, Header, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  protected readonly showSidebar = signal(true);

  protected readonly showHeader = signal(true);

  protected readonly showLogin = signal(true);

  toggleSidebar() {
    this.showSidebar.update(value => !value);
  }
}

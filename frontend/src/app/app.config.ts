import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { icons, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider(icons),
    },
  ],
};

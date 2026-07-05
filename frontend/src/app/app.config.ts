import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { icons, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider(icons),
    },
  ],
};

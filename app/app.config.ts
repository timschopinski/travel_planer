import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient } from '@angular/common/http';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hyjjpueikyijruovnbnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ampwdWVpa3lpanJ1b3ZuYm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MzA4NzcsImV4cCI6MjA5NDIwNjg3N30.D4FYN8rw4jGbPXVV6lEd7D9QjE81n0qXfRE6YoYlnJs',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }

)
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {provide:'SUPABASE',useValue:supabase}
  ]
};

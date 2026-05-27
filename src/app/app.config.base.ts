import { InjectionToken } from '@angular/core';
import { environment as env } from '../environments/environment';

export interface AppConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const environment: AppConfig = {
  supabaseUrl: env.supabaseUrl,
  supabaseKey: env.supabaseKey
};

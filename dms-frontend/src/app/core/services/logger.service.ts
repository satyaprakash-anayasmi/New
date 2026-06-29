import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  
  info(message: string, ...optionalParams: any[]) {
    // We can add logic to send logs to backend or filter by environment
    // For now we map to console for structured logging without directly using console.log everywhere
    console.info(`[INFO] ${message}`, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN] ${message}`, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    console.error(`[ERROR] ${message}`, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]) {
    console.debug(`[DEBUG] ${message}`, ...optionalParams);
  }
}

import { Injectable } from '@angular/core';
import uiJson from '../../../assets/config/ui-text.json';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private readonly config = uiJson;

    get(path: string): string {
        const parts = path.split('.');
        let current: any = this.config;
        for (const part of parts) {
            if (current[part] === undefined) return path;
            current = current[part];
        }
        return current;
    }

    get text() {
        return this.config;
    }
}

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.example.smartbazar',
    appName: 'Smart Bazar',
    webDir: 'dist/smart-bazar/browser',
    server: {
        androidScheme: 'https',
        cleartext: true,
        allowNavigation: ['192.168.31.152', 'new-production-7d1f.up.railway.app']
    }
};

export default config;

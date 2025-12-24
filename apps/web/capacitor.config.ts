import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.kingdomconnect.mobile',
    appName: 'Kingdom Connect',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;

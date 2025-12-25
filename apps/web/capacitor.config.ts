import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.kingdomconnect.mobile',
    appName: 'Kingdom Connect',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        GoogleAuth: {
            scopes: ['profile', 'email'],
            serverClientId: '988931700986-fv35ptbjvdpub09m0fl7s491nr0abkup.apps.googleusercontent.com', // Web Client ID
            forceCodeForRefreshToken: true,
            androidClientId: '988931700986-72gffgvk9sq9o91ddl1gk48suo7dl6ru.apps.googleusercontent.com' // Android Client ID
        }
    }
};

export default config;

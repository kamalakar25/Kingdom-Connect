import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';

export const BackButtonHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleBackButton = async () => {
            // Check if we can go back
            // navigate(-1) works if there is history.
            // If we are on the main tabs, we might want to exit the app or go to home.

            // List of main routes where back button should probably exit app or confirm exit
            const mainRoutes = ['/', '/bible', '/quiz', '/content', '/live'];

            if (location.pathname === '/' || mainRoutes.includes(location.pathname)) {
                // We are on a main tab.
                // Ideally, if not on home, go to home? Or just exit?
                // Standard Android behavior: If specific tab selected, maybe go home?
                // If on Home, exit.
                if (location.pathname !== '/') {
                    navigate('/');
                } else {
                    CapacitorApp.exitApp();
                }
            } else {
                // Sub-page (e.g., settings, specific content). Go back.
                navigate(-1);
            }
        };

        const listener = CapacitorApp.addListener('backButton', () => {
            handleBackButton();
        });

        return () => {
            listener.then(handler => handler.remove());
        };
    }, [navigate, location]);

    return null;
};

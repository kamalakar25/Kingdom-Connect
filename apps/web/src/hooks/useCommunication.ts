import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';

export const useAnnouncements = () => {
    return useQuery({
        queryKey: ['announcements'],
        queryFn: () => apiClient('/communication/announcements')
    });
};

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: () => apiClient('/communication/events')
    });
};

export const useLiveConfig = () => {
    return useQuery({
        queryKey: ['live-config'],
        queryFn: () => apiClient('/integrations/config')
    });
};

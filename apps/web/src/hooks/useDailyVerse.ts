import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';

export const useDailyVerse = (lang: string = 'en') => {
    return useQuery({
        queryKey: ['daily-verse', lang],
        queryFn: () => apiClient(`/daily-verse/today?lang=${lang}`).then(res => res.data),
    });
};

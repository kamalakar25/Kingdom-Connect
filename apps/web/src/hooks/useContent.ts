import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';

export const useSermons = () => {
    return useQuery({
        queryKey: ['sermons'],
        queryFn: () => apiClient('/sermons')
    });
};

export const useSundaySchoolResources = (classId?: number) => {
    return useQuery({
        queryKey: ['sunday-school', classId],
        queryFn: () => apiClient(`/sunday-school${classId ? `?classId=${classId}` : ''}`)
    });
};

export const useMediaAssets = (type?: string) => {
    return useQuery({
        queryKey: ['media', type],
        queryFn: () => apiClient(`/media${type ? `?type=${type}` : ''}`)
    });
};

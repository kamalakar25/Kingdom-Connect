import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';

export const useBibleVersions = () => {
    return useQuery({
        queryKey: ['bible-versions'],
        queryFn: () => apiClient('/bible/versions').then(res => res.data)
    });
};

export const useBibleBooks = (versionId: string | null) => {
    return useQuery({
        queryKey: ['bible-books', versionId],
        queryFn: () => apiClient(`/bible/versions/${versionId}/books`).then(res => res.data),
        enabled: !!versionId
    });
};

export const useBibleChapters = (bookId: string | null) => {
    return useQuery({
        queryKey: ['bible-chapters', bookId],
        queryFn: () => apiClient(`/bible/books/${bookId}/chapters`).then(res => res.data),
        enabled: !!bookId
    });
};

export const useBibleChapter = (versionId: string, bookId: string, chapter: number) => {
    return useQuery({
        queryKey: ['bible-chapter', versionId, bookId, chapter],
        queryFn: () => apiClient(`/bible/versions/${versionId}/books/${bookId}/chapters/${chapter}`).then(res => res.data),
        enabled: !!versionId && !!bookId && !!chapter
    });
};

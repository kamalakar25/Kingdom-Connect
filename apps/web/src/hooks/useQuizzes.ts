import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../utils/api';

export const useQuizzes = (audience?: 'YOUTH' | 'ELDERS') => {
    return useQuery({
        queryKey: ['quizzes', audience],
        queryFn: () => apiClient(`/quizzes${audience ? `?audience=${audience}` : ''}`)
    });
};

export const useQuiz = (id: string | null) => {
    return useQuery({
        queryKey: ['quiz', id],
        queryFn: () => apiClient(`/quizzes/${id}`),
        enabled: !!id
    });
};

export const useSubmitQuiz = () => {
    return useMutation({
        mutationFn: ({ id, answers }: { id: string, answers: Record<string, number> }) =>
            apiClient(`/quizzes/${id}/attempt`, {
                method: 'POST',
                body: JSON.stringify({ answers })
            })
    });
};
